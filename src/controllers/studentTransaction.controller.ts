import Elysia, { t } from "elysia";
import camelcaseKeys from "camelcase-keys";
import client from "../connections/client";
import { idSchema } from "../types/schemas";

const StudentTransactionController = new Elysia({
  prefix: "/student-transaction",
})
  .get(
    "/",
    async ({ status }) => {
      try {
        const { rows } = await client.query(
          "SELECT * FROM Student_Transactions ORDER BY Transaction_ID"
        );
        return camelcaseKeys(rows);
      } catch (e: unknown) {
        if (e instanceof Error) {
          return status(400, e.message);
        }
      }
    },
    {
      detail: {
        description:
          "endpoint สำหรับดึงข้อมูลธุระกรรมนิสิตทั้งหมดโดยจะเรียงลำดับเลขรหัสธุระกรรมจากน้อยไปมาก",
        summary: "ดึงข้อมูลธุระกรรมนิสิตทั้งหมด",
        tags: ["Student Transactions"],
      },
    }
  )
  .get(
    "/:id",
    async ({ status, params: { id } }) => {
      try {
        const { rows } = await client.query(
          `SELECT * FROM Student_Transactions WHERE Transaction_ID = ${id}`
        );

        if (rows.length === 1) {
          return camelcaseKeys(rows[0]);
        }

        throw new Error(`ไม่มี id ${id} อยู่ในฐานข้อมูล!`);
      } catch (e: unknown) {
        if (e instanceof Error) {
          return status(400, e.message);
        }
      }
    },
    {
      params: t.Object({
        id: t.Number({
          description: "รหัสธุระกรรม",
          error: "รหัสธุระกรรมต้องเป็นตัวเลขเท่านั้น",
          minimum: 1,
          maximum: 1000,
        }),
      }),
      detail: {
        description:
          "endpoint สำหรับดึงข้อมูลธุระกรรมนิสิตด้วยรหัสธุระกรรมที่ระบุเข้ามา",
        summary: "ดึงข้อมูลธุระกรรมนิสิตด้วยรหัสธุระกรรม",
        tags: ["Student Transactions"],
      },
    }
  );

export default StudentTransactionController;
