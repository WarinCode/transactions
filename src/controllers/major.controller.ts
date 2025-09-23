import Elysia, { t } from "elysia";
import camelcaseKeys from "camelcase-keys";
import client from "../connections/client";
import { majorSchema } from "../types/schemas";

const MajorController = new Elysia({ prefix: "/majors" })
  .get(
    "/",
    async ({ status }) => {
      try {
        const { rows } = await client.query(
          "SELECT * FROM Majors ORDER BY Major_ID"
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
          "endpoint สำหรับดึงข้อมูลสาขาทั้งหมดในฐานข้อมูล โดยจะเรียงลำดับรหัสสาขาจากเลข id น้อยไปมาก",
        summary: "ดึงข้อมูลสาขาทั้งหมด",
        tags: ["Majors"],
      },
    }
  )
  .get(
    "/:id",
    async ({ params: { id }, status }) => {
      try {
        const { rows } = await client.query(
          `SELECT * FROM Majors WHERE Major_ID = '${id}'`
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
        id: t.String({
          description: "รหัสสาขา",
          minLength: 1,
          maxLength: 3,
          error: "รหัสสาขาต้องไม่เกิน 3 ตัวอักษรเท่านั้น",
        }),
      }),
      detail: {
        description: "endpoint สำหรับดึงข้อมูลสาขาตามรหัสสาขาที่ระบุไว้",
        summary: "ดึงข้อมูลสาขาด้วยรหัสสาขา",
        tags: ["Majors"],
      },
    }
  )
  .post(
    "/create",
    async ({ body: { majorId, majorName, programName }, status }) => {
      try {
        const { rowCount } = await client.query(
          `INSERT INTO Majors VALUES('${majorId}', '${majorName}', '${programName}')`
        );

        if (rowCount === 1) {
          return status(201, { message: "เพิ่มข้อมูลสาขาสำเร็จ" });
        }

        throw new Error("ไม่สามารถเพิ่มข้อมูลสาขาได้!");
      } catch (e: unknown) {
        if (e instanceof Error) {
          return status(400, e.message);
        }
      }
    },
    {
      body: majorSchema,
      detail: {
        description: "endpoint สำหรับเพิ่มข้อมูลสาขาใหม่",
        summary: "เพิ่มข้อมูลสาขา",
        tags: ["Majors"],
      },
    }
  )
  .put(
    "/update",
    async ({ status, body: { majorId, majorName, programName } }) => {
      try {
        const { rowCount } = await client.query(
          `UPDATE Majors SET Major_Name = '${majorName}', Program_Name = '${programName}' WHERE Major_ID = '${majorId}'`
        );

        if (rowCount === 1) {
          return { message: "แก้ไขข้อมูลสาขาสำเร็จ" };
        }

        throw new Error("ไม่สามารถแก้ไขข้อมูลสาขาได้!");
      } catch (e: unknown) {
        if (e instanceof Error) {
          return status(400, e.message);
        }
      }
    },
    {
      body: majorSchema,
      detail: {
        description:
          "endpoint สำหรับการแก้ไขข้อมูลสาขาโดยแก้ไข ชื่อสาขา และ ชื่อโปรแกรมสาขา",
        summary: "แก้ไขข้อมูลสาขา",
        tags: ["Majors"],
      },
    }
  )
  .patch(
    "/update/major-id",
    async ({ status, body: { oldMajorId, newMajorId } }) => {
      try {
        const { rowCount } = await client.query(
          `UPDATE Majors SET Major_ID = '${newMajorId}' WHERE Major_ID = '${oldMajorId}'`
        );

        if (rowCount === 1) {
          return { message: "แก้ไขรหัสสาขาสำเร็จ" };
        }

        throw new Error("ไม่สามารถแก้ไขรหัสสาขาได้!");
      } catch (e: unknown) {
        if (e instanceof Error) {
          return status(400, e.message);
        }
      }
    },
    {
      body: t.Object({
        oldMajorId: t.String({
          description: "รหัสสาขาเก่า",
          minLength: 1,
          maxLength: 3,
          error: "รหัสสาขาต้องไม่เกิน 3 ตัวอักษรเท่านั้น",
        }),
        newMajorId: t.String({
          description: "รหัสสาขาใหม่",
          minLength: 1,
          maxLength: 3,
          error: "รหัสสาขาต้องไม่เกิน 3 ตัวอักษรเท่านั้น",
        }),
      }),
      detail: {
        description:
          "endpoint สำหรับแก้ไขรหัสสาขาโดยต้องระบุรหัสสาขาเก่าและรหัสสาขาใหม่ที่ต้องการเปลี่ยน",
        summary: "แก้ไขรหัสสาขา",
        tags: ["Majors"],
      },
    }
  )
  .patch(
    "/update/major-name",
    async ({ status, body: { majorId, majorName } }) => {
      try {
        const { rowCount } = await client.query(
          `UPDATE Majors SET Major_Name = '${majorName}' WHERE Major_ID = '${majorId}'`
        );

        if (rowCount === 1) {
          return { message: "แก้ไขชื่อสาขาสำเร็จ" };
        }

        throw new Error("ไม่สามารถแก้ไขชื่อสาขาได้!");
      } catch (e: unknown) {
        if (e instanceof Error) {
          return status(400, e.message);
        }
      }
    },
    {
      body: t.Object({
        majorId: t.String({
          description: "รหัสสาขา",
          minLength: 1,
          maxLength: 3,
          error: "รหัสสาขาต้องไม่เกิน 3 ตัวอักษรเท่านั้น",
        }),
        majorName: t.String({
          description: "ชื่อสาขา",
          minLength: 5,
          maxLength: 30,
          error: "ชื่อสาขาต้องไม่เกิน 30 ตัวอักษรเท่านั้น",
        }),
      }),
      detail: {
        description:
          "endpoint สำหรับแก้ไขชื่อสาขาโดยต้องระบุรหัสสาขาและชื่อสาขาที่ต้องการเปลี่ยน",
        summary: "แก้ไขชื่อสาขา",
        tags: ["Majors"],
      },
    }
  )
  .patch(
    "/update/program-name",
    async ({ status, body: { majorId, programName } }) => {
      try {
        const { rowCount } = await client.query(
          `UPDATE Majors SET Program_Name = '${programName}' WHERE Major_ID = '${majorId}'`
        );

        if (rowCount === 1) {
          return { message: "แก้ไขชื่อโปรแกรมสาขาสำเร็จ" };
        }

        throw new Error("ไม่สามารถแก้ไขชื่อโปรแกรมสาขาได้!");
      } catch (e: unknown) {
        if (e instanceof Error) {
          return status(400, e.message);
        }
      }
    },
    {
      body: t.Object({
        majorId: t.String({
          description: "รหัสสาขา",
          minLength: 1,
          maxLength: 3,
          error: "รหัสสาขาต้องไม่เกิน 3 ตัวอักษรเท่านั้น",
        }),
        programName: t.Union([t.Literal("ภาคปกติ"), t.Literal("ภาคพิเศษ")], {
          description: "ชื่อหลักสูตร",
          error: "ชื่อหลักสูตรต้องเป็น ภาคปกติ หรือ ภาคพิเศษ เท่านั้น",
        }),
      }),
      detail: {
        description:
          "endpoint สำหรับแก้ไขชื่อโปรแกรมสาขาโดยต้องระบุรหัสสาขาและชื่อโปรแกรมสาขาที่ต้องการเปลี่ยน",
        summary: "แก้ไขชื่อโปรแกรมสาขา",
        tags: ["Majors"],
      },
    }
  )
  .delete(
    "/delete/:id",
    async ({ status, params: { id } }) => {
      try {
        const { rowCount } = await client.query(
          `DELETE FROM Majors WHERE Major_ID = '${id}'`
        );

        if (rowCount === 1) {
          return { message: "ลบสาขาสำเร็จ" };
        }

        throw new Error("ไม่สามารถลบสาขาได้!");
      } catch (e: unknown) {
        if (e instanceof Error) {
          return status(400, e.message);
        }
      }
    },
    {
      params: t.Object({
        id: t.String({
          description: "รหัสสาขา",
          minLength: 1,
          maxLength: 3,
          error: "รหัสสาขาต้องไม่เกิน 3 ตัวอักษรเท่านั้น",
        }),
      }),
      detail: {
        description:
          "endpoint สำหรับลบข้อมูลสาขาด้วยรหัสสาขาโดยต้องระบุค่าผ่าน param ที่ส่งเข้ามาใน path ต้องเป็นรหัสสาขา",
        summary: "ลบข้อมูลสาขาด้วยรหัสสาขา",
        tags: ["Majors"],
      },
    }
  );

export default MajorController;
