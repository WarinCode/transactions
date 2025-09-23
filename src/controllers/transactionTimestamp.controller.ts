import Elysia, { t } from "elysia";
import client from "../connections/client";
import camelcaseKeys from "camelcase-keys";

const TransactionTimestampController = new Elysia({
  prefix: "/transaction-timestamps",
})
  .get(
    "/",
    async ({ status }) => {
      try {
        const { rows } = await client.query(
          `SELECT * FROM Transaction_Timestamps`
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
        description: "endpoint สำหรับดึงข้อมูลเวลาธุรกรรมทั้งหมด",
        summary: "ดึงข้อมูลเวลาธุรกรรมทั้งหมด",
        tags: ["Transaction Timestamps"],
      },
    }
  )
  .get(
    "/:id",
    async ({ params: { id }, status }) => {
      try {
        const { rows } = await client.query(
          `SELECT * FROM Transaction_Timestamps WHERE Transaction_ID = ${id}`
        );

        if (rows.length === 1) {
          return camelcaseKeys(rows[0]);
        }

        throw new Error(`ไม่มีเลข id นี้อยุ่ในฐานข้อมูล ${id}!`);
      } catch (e: unknown) {
        if (e instanceof Error) {
          return status(400, e.message);
        }
      }
    },
    {
      params: t.Object({
        id: t.Number({
          description: "รหัสธุรกรรม",
          error: "รหัสธุรกรรมต้องเป็นตัวเลขเท่านั้น",
          minimum: 1,
          maximum: 1000,
        }),
      }),
      detail: {
        description:
          "endpoint สำหรับดึงข้อมูลเวลาธุรกรรมตามรหัสธุรกรรมที่ระบุไว้โดยค่า param ที่ส่งเข้ามาใน path ต้องเป็นเลขรหัสธุรกรรม",
        summary: "ดึงข้อมูลเวลาธุรกรรมด้วยรหัสธุรกรรม",
        tags: ["Transaction Timestamps"],
      }
    }
  );

export default TransactionTimestampController;
