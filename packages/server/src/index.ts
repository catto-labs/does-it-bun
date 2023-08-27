import { Elysia, t } from "elysia";
import { cors } from '@elysiajs/cors'

import { downloadTarballAsReadable } from "@/tarball/download";
import extractTarball from "@/tarball/extract";
import { scanFile } from "@/scan";
import NPM from "@/npm";

import database, { packages } from "@/database";

const app = new Elysia()
  .use(cors())
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

    return {
      success: true,
      data: checked_files
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

    const data = await npm.search(query.name);
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
    error(err) {
      // error handling
    },
    query: t.Object({
      name: t.String({
        error: "Search requires a package name to search for"
      }),
      registry: t.Optional(t.String())
    })
  })
  .listen(8000, (server) => {
    console.info(`[server.index]: ready on port ${server.hostname}:${server.port}`);
  });

export type ServerApp = typeof app;
