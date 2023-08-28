import { Elysia, t } from "elysia";
import { cors } from '@elysiajs/cors'

import { downloadTarballAsReadable } from "@/tarball/download";
import extractTarball from "@/tarball/extract";
import { scanFile } from "@/scan";
import NPM from "@/npm";

import database, { packageCompatibility } from "@/database";
import { and, eq } from "drizzle-orm";


const app = new Elysia()
  .use(cors())
  .get("/is_package_compatible", async ({ query }) => {
    const npm = new NPM(query.registry);
    const pkg = await npm.package(query.name);
    const version = query.version ?? pkg.tags["latest"];

    // Check if the compatibility data is already cached
    const cachedCompatibility = await database.select().from(packageCompatibility)
        .where(and(eq(packageCompatibility.name, query.name), eq(packageCompatibility.version, version)));

    if (cachedCompatibility[0]) {
        return {
            success: true,
            compatible: Boolean(cachedCompatibility[0].compatible)
        };
    }

    // If not cached, perform the compatibility check
    if (Boolean(query.only_use_cache)) return {
      success: true,
      compatible: null
    };

    const pkg_data = pkg.getVersion(version);
    const tarball = await downloadTarballAsReadable(pkg_data.tarball);
    const files = await extractTarball(tarball);

    const checked_files: Array<ReturnType<typeof scanFile>> = [];
    for (const file of files) {
      checked_files.push(scanFile(file));
    }

    let compatible = true;
    for (const file of checked_files) {
      if (file.ignored) continue;
      
      if (file.issues.length > 0) {
        compatible = false;
        break;
      }
    }

    // Cache the compatibility result
    await database.insert(packageCompatibility).values({
        name: query.name,
        version: version,
        compatible: compatible ? 1 : 0
    });

    return {
        success: true,
        compatible: compatible
    };
  }, {
    error({ code, error, set }) {
      console.log(error);
      if (code === "VALIDATION") {
        set.status = error.status;
        return {
          success: false,
          message: error.message
        }
      }

      set.status = 500;
      return {
        success: false,
        message: "Unknown error happened server side.",
        debug: error
      }
    },
    query: t.Object({
      name: t.String({
        error: "Needs name query parameter",
      }),
      only_use_cache: t.Optional(t.String()),
      version: t.Optional(t.String()),
      registry: t.Optional(t.String())
    })
  })
  .get("/scan", async ({ query }) => {
    const npm = new NPM(query.registry);
    
    const pkg = await npm.package(query.name);
    const version = query.version ?? pkg.tags["latest"];

    const pkg_data = pkg.getVersion(version);
    const tarball = await downloadTarballAsReadable(pkg_data.tarball);
    const files = await extractTarball(tarball);

    const checked_files: Array<ReturnType<typeof scanFile>> = [];
    for (const file of files) {
      checked_files.push(scanFile(file));
    }

    let compatible = true;
    for (const file of checked_files) {
      if (file.ignored) continue;
      
      if (file.issues.length > 0) {
        compatible = false;
        break;
      }
    }

    await database.insert(packageCompatibility).values({
      name: query.name,
      version: version,
      compatible: compatible ? 1 : 0
    });

    return {
      success: true,
      data: checked_files,
      compatible: compatible
    }
  }, {
    error({ code, error, set }) {
      if (code === "VALIDATION") {
        set.status = error.status;
        return {
          success: false,
          message: error.message
        }
      }

      set.status = 500;
      return {
        success: false,
        message: "Unknown error happened server side.",
        debug: error
      }
    },
    query: t.Object({
      name: t.String({
        error: "Needs name query parameter",
      }),
      version: t.Optional(t.String()),
      registry: t.Optional(t.String())
    })
  })
  .get("/search", async ({ query }) => {
    const npm = new NPM(query.registry);

    const data = await npm.search(query.name, parseInt(query.page));
    if (!data || data.objects.length === 0) {
      return {
        success: false,
        error: "No search results found or search failed"
      }
    }

    return {
      success: true,
      data: data
    }
  }, {
    error({ code, error, set }) {
      if (code === "VALIDATION") {
        set.status = error.status;
        return {
          success: false,
          message: error.message
        }
      }

      set.status = 500;
      return {
        success: false,
        message: "Unknown error happened server side.",
        debug: error
      }
    },
    query: t.Object({
      name: t.String({
        error: "Search requires a package name to search for"
      }),
      registry: t.Optional(t.String()),
      page: t.String()
    })
  })
  .listen(8000, (server) => {
    console.info(`[server.index]: ready on port ${server.hostname}:${server.port}`);
  });

export type ServerApp = typeof app;
