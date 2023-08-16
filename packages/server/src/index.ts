import { Elysia } from "elysia";
import { getPackage } from "./npm/registry";

const app = new Elysia().get("/", async() => ((await getPackage("elysia")).versions)).listen(8000, (server) => {
  console.info("[server.index]: ready on port", server.port);
});

export type ServerApp = typeof app;
