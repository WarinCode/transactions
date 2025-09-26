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
  .use(FileController);

const app = new Elysia()
  .onStart(() => client.connect())
  .use(cors(corsConfig))
  .use(staticPlugin())
  .use(
    openapi({
      documentation: {
        info: {
          title: "Elysia Documentation",
          version: "1.0",
          description:
            "เว็บเอกสารสำหรับการอธิบายการใช้งาน APIs ของโปรเจค transactions โปรเจคนี้ได้ใช้ข้อมูลที่เก็บมาจากวิชา Fundamentals of Database Systems (01418221) นำมาพัฒนาต่อเป็น Web Service โดยใช้ Elysia เป็น Backend Framework ในการพัฒนา",
          contact: {
            name: "Warin Saipanya",
            email: "warin.sai@ku.th",
          },
        }
      },
      path: "/docs",
      exclude: { paths: ["/public/*"], staticFile: true },
    })
  )
  .use(Logestic.preset("common"))
  .get("/", () => "Hello World!", {
    detail: {
      description:
        "endpoint เริ่มต้นของเว็บไซต์จะแสดงข้อความ Hello World ออกมา",
      summary: "หน้าแรกของเว็บไซต์",
      tags: ["Home"],
    },
  })
  .use(RestApiControllers)
  .onError(({ code }) => {
    if (code === "INTERNAL_SERVER_ERROR") {
      return new InternalServerError("ไม่มีการตอบกลับจาก server!");
    }
    if (code === "NOT_FOUND") {
      return new NotFoundError("ไม่พบหน้าเพจที่เรียกหา!");
    }
  })
  .onStop(() => client.end())
  .listen(parseInt(BACKEND_PORT ?? "4000"));

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
