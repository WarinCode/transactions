import { Elysia, NotFoundError, InternalServerError } from "elysia";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import client from "./connections/client";
import StudentController from "./controllers/student.controller";
import MajorController from "./controllers/major.controller";
import StudentTransactionController from "./controllers/studentTransaction.controller";
import TransactionController from "./controllers/transaction.controller";
import TransactionTimestampController from "./controllers/transactionTimestamp.controller";
import FileController from "./controllers/file.controller";
import logger from "./middlewares/logger";

const apiEndpoints = new Elysia({ prefix: "/api" })
  .use(StudentController)
  .use(MajorController)
  .use(StudentTransactionController)
  .use(TransactionController)
  .use(TransactionTimestampController)
  .use(FileController)

const app = new Elysia()
  .onStart(async () => await client.connect())
  .onBeforeHandle(logger)
  .use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "PATCH", "DELETE"] }))
  .use(staticPlugin())
  .get("/", () => "Hello World!")
  .use(apiEndpoints)
  .onError(({ code }) => {
    if (code === "INTERNAL_SERVER_ERROR") {
      return new InternalServerError("ไม่มีการตอบกลับจาก server!");
    }
    if (code === "NOT_FOUND") {
      return new NotFoundError("ไม่พบหน้าเพจที่เรียกหา!");
    }
  })
  .onStop(async () => await client.end())
  .listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);