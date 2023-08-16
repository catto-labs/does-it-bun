import { Elysia } from "elysia";


const app = new Elysia().get("/", () => "Hello Elysia").listen(8000, (server) => {
  console.info("[server.index]: ready on port", server.port);
});

export type ServerApp = typeof app;
