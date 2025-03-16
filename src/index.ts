import { Elysia, NotFoundError, InternalServerError } from "elysia";
import { cors } from "@elysiajs/cors";
import client from "./connections/client";
import studentController from "./controllers/student.controller";
import majorController from "./controllers/major.controller";
import fileController from "./controllers/file.controller";

await client.connect();
const apiEndpoints = new Elysia({ prefix: "/api" })
  .use(studentController)
  .use(majorController)
  .use(fileController)

const app = new Elysia()
  .use(cors())
  .get("/", () => "Hello World!")
  .use(apiEndpoints)
  .onError(async ({ code }) => {
    if (code === "INTERNAL_SERVER_ERROR") {
      await client.end();
      await client.connect();
      return new InternalServerError("ไม่มีการตอบกลับจาก server!");
    }
    if (code === "NOT_FOUND") {
      return new NotFoundError("ไม่พบหน้าเพจที่เรียกหา!");
    }
  })
  .listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
