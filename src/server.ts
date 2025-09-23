import { Elysia, NotFoundError, InternalServerError } from "elysia";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { staticPlugin } from "@elysiajs/static";
import { Logestic } from "logestic";
import client from "./connections/client";
import StudentController from "./controllers/student.controller";
import MajorController from "./controllers/major.controller";
import StudentTransactionController from "./controllers/studentTransaction.controller";
import TransactionController from "./controllers/transaction.controller";
import TransactionTimestampController from "./controllers/transactionTimestamp.controller";
import FileController from "./controllers/file.controller";
import corsConfig from "./configurations/cors";

const { BACKEND_PORT }: NodeJS.ProcessEnv = Bun.env;
const RestApiControllers = new Elysia({ prefix: "/api" })
  .use(StudentController)
  .use(MajorController)
  .use(StudentTransactionController)
  .use(TransactionController)
  .use(TransactionTimestampController)
  .use(FileController)

const app = new Elysia()
  .onStart(async () => await client.connect())
  .use(cors(corsConfig))
  .use(staticPlugin())
  .use(openapi({ path: "/docs" }))
  .use(Logestic.preset("common"))
  .get("/", () => "Hello World!")
  .use(RestApiControllers)
  .onError(({ code }) => {
    if (code === "INTERNAL_SERVER_ERROR") {
      return new InternalServerError("ไม่มีการตอบกลับจาก server!");
    }
    if (code === "NOT_FOUND") {
      return new NotFoundError("ไม่พบหน้าเพจที่เรียกหา!");
    }
  })
  .onStop(async () => await client.end())
  .listen(parseInt(BACKEND_PORT ?? "4000"));

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);