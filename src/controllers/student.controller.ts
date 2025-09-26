import Elysia, { t } from "elysia";
import camelcaseKeys from "camelcase-keys";
import client from "../connections/client";
import { studentSchema, studentIdSchema } from "../types/schemas";

const StudentController = new Elysia({ prefix: "/students" })
  .get(
    "/",
    async ({ status }) => {
      try {
        const { rows } = await client.query(
          "SELECT * FROM Students ORDER BY Student_ID"
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
          "endpoint สำหรับดึงข้อมูลนิสิตทั้งหมดในฐานข้อมูล โดยจะเรียงลำดับรหัสนิสิตจากเลข id น้อยไปมาก",
        summary: "ดึงข้อมูลนิสิตทั้งหมด",
        tags: ["Students"],
      },
    }
  )
  .get(
    "/:id",
    async ({ params: { id }, status }) => {
      try {
        const { rows } = await client.query(
          `SELECT * FROM Students WHERE Student_ID = ${id}`
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
      params: studentIdSchema,
      detail: {
        description:
          "endpoint สำหรับดึงข้อมูลนิสิตตามรหัสนิสิตที่ระบุไว้โดยค่า param ที่ส่งเข้ามาใน path ต้องเป็นเลขรหัสนิสิต",
        summary: "ดึงข้อมูลนิสิตด้วยรหัสนิสิต",
        tags: ["Students"],
      },
    }
  )
  .post(
    "/create",
    async ({ body: { studentId, studentName, email, majorId }, status }) => {
      try {
        const { rowCount } = await client.query(
          `INSERT INTO Students VALUES(${studentId}, '${studentName}', '${email}', '${majorId}')`
        );

        if (rowCount === 1) {
          return status(201, { message: "เพิ่มข้อมูลนิสิตใหม่สำเร็จ" });
        }

        throw new Error("ไม่สามารถเพิ่มข้อมูลนิสิตใหม่ได้!");
      } catch (e: unknown) {
        if (e instanceof Error) {
          return status(400, e.message);
        }
      }
    },
    {
      body: studentSchema,
      detail: {
        description: "endpoint สำหรับเพิ่มข้อมูลนิสิตใหม่ลงในฐานข้อมูล",
        summary: "เพิ่มข้อมูลนิสิตใหม่",
        tags: ["Students"],
      },
    }
  )
  .put(
    "/update",
    async ({ body: { studentName, studentId, email, majorId }, status }) => {
      try {
        const { rowCount } = await client.query(
          `UPDATE Students SET Student_Name = '${studentName}', Email = '${email}', Major_ID = '${majorId}' WHERE Student_ID = ${studentId}`
        );

        if (rowCount === 1) {
          return status(200, { message: "แก้ไขข้อมูลนิสิตสำเร็จ" });
        }

        throw new Error("แก้ไขข้อมูลนิสิตไม่สำเร็จ!");
      } catch (e: unknown) {
        if (e instanceof Error) {
          return status(400, e.message);
        }
      }
    },
    {
      body: studentSchema,
      detail: {
        description: "endpoint สำหรับแก้ไขข้อมูลนิสิตในฐานข้อมูล",
        summary: "แก้ไขข้อมูลนิสิต",
        tags: ["Students"],
      },
    }
  )
  .patch(
    "/update/student-id",
    async ({ body: { oldStudentId, newStudentId }, status }) => {
      try {
        const { rowCount } = await client.query(
          `UPDATE Students SET Student_ID = ${newStudentId} WHERE Student_ID = ${oldStudentId}`
        );

        if (rowCount === 1) {
          return status(200, { message: "แก้ไขรหัสนิสิตสำเร็จ" });
        }

        throw new Error("แก้ไขข้อรหัสนิสิตไม่สำเร็จ!");
      } catch (e: unknown) {
        if (e instanceof Error) {
          return status(400, e.message);
        }
      }
    },
    {
      body: t.Object({
        oldStudentId: t.Number({
          description: "รหัสนิสิตเก่า",
          error: "รหัสนิสิตเก่าต้องเป็นตัวเลขเท่านั้น",
        }),
        newStudentId: t.Number({
          description: "รหัสนิสิตใหม่",
          error: "รหัสนิสิตใหม่ต้องเป็นตัวเลขเท่านั้น",
        }),
      }),
      detail: {
        description:
          "endpoint สำหรับแก้ไขข้อมูลรหัสนิสิตในฐานข้อมูลโดยรหัสินิสิตอันใหม่จะต้องไม่ซ้ำกับรหัสนิสิตที่มีอยู่",
        summary: "แก้ไขรหัสนิสิต",
        tags: ["Students"],
      },
    }
  )
  .patch(
    "/update/student-name",
    async ({ body: { studentName, studentId }, status }) => {
      try {
        const { rowCount } = await client.query(
          `UPDATE Students SET Student_Name = '${studentName}' WHERE Student_ID = ${studentId}`
        );

        if (rowCount === 1) {
          return status(200, { message: "แก้ไขชื่อนิสิตสำเร็จ" });
        }

        throw new Error("แก้ไขข้อชื่อนิสิตไม่สำเร็จ!");
      } catch (e: unknown) {
        if (e instanceof Error) {
          return status(400, e.message);
        }
      }
    },
    {
      body: t.Object({
        studentId: t.Number({
          description: "รหัสนิสิต",
          error: "รหัสนิสิตต้องเป็นตัวเลขเท่านั้น",
        }),
        studentName: t.String({
          description: "ชื่อนิสิต",
          error: "ความยาวของชื่อนิสิตต้องอยู่ระหว่าง 5 ถึง 20 ตัวอักษร",
          minLength: 5,
          maxLength: 20,
        }),
      }),
      detail: {
        description:
          "endpoint สำหรับแก้ไขข้อมูลชื่อนิสิตโดยต้องระบุเลขรหัสนิสิตและชื่อนิสิตที่ต้องการจะเปลี่ยน",
        summary: "แก้ไขชื่อนิสิต",
        tags: ["Students"],
      },
    }
  )
  .patch(
    "/update/email",
    async ({ body: { email, studentId }, status }) => {
      try {
        const { rowCount } = await client.query(
          `UPDATE Students SET Email = '${email}' WHERE Student_ID = ${studentId}`
        );

        if (rowCount === 1) {
          return status(200, { message: "แก้ไขอีเมลนิสิตสำเร็จ" });
        }

        throw new Error("แก้ไขอีเมลนิสิตไม่สำเร็จ!");
      } catch (e: unknown) {
        if (e instanceof Error) {
          return status(400, e.message);
        }
      }
    },
    {
      body: t.Object({
        studentId: t.Number({
          description: "รหัสนิสิต",
          error: "รหัสนิสิตต้องเป็นตัวเลขเท่านั้น",
        }),
        email: t.String({
          description: "อีเมลนิสิต",
          error: "อีเมลนิสิตต้องเป็นรูปแบบอีเมลที่ถูกต้อง",
          format: "email",
          minLength: 5,
          maxLength: 30,
        }),
      }),
      detail: {
        description:
          "endpoint สำหรับแก้ไขข้อมูลอีเมลนิสิตโดยต้องระบุเลขรหัสนิสิตและอีเมลนิสิตที่ต้องการจะเปลี่ยน",
        summary: "แก้ไขอีเมลนิสิต",
        tags: ["Students"],
      },
    }
  )
  .patch(
    "/update/major-id",
    async ({ body: { majorId, studentId }, status }) => {
      try {
        const { rowCount } = await client.query(
          `UPDATE Students SET Major_ID = '${majorId}' WHERE Student_ID = ${studentId}`
        );

        if (rowCount === 1) {
          return status(200, { message: "แก้ไขรหัสสาขานิสิตสำเร็จ" });
        }

        throw new Error("แก้ไขรหัสสาขานิสิตไม่สำเร็จ!");
      } catch (e: unknown) {
        if (e instanceof Error) {
          return status(400, e.message);
        }
      }
    },
    {
      body: t.Object({
        studentId: t.Number({
          description: "รหัสนิสิต",
          error: "รหัสนิสิตต้องเป็นตัวเลขเท่านั้น",
        }),
        majorId: t.String({
          description: "รหัสสาขานิสิต",
          error: "รหัสสาขานิสิตไม่ถูกต้อง",
          minLength: 1,
          maxLength: 3,
        }),
      }),
      detail: {
        description:
          "endpoint สำหรับแก้ไขข้อมูลรหัสสาขานิสิตโดยกำหนดเลขรหัสนิสิตและรหัสสาขานิสิตที่ต้องการจะเปลี่ยนเป็นอันใหม่",
        summary: "แก้ไขรหัสสาขานิสิต",
        tags: ["Students"],
      },
    }
  )
  .delete(
    "/delete/:id",
    async ({ params: { id }, status }) => {
      try {
        const { rowCount } = await client.query(
          `DELETE FROM Students WHERE Student_ID = ${id}`
        );

        if (rowCount === 1) {
          return status(200, { message: "ลบข้อมูลนิสิตสำเร็จ" });
        }

        throw new Error("ไม่สามารถลบข้อมูลนิสิตได้!");
      } catch (e: unknown) {
        if (e instanceof Error) {
          return status(400, e.message);
        }
      }
    },
    {
      params: studentIdSchema,
      detail: {
        description: "endpoint สำหรับลบข้อมูลนิสิตด้วยรหัสนิสิตโดยต้องระบุค่าผ่าน param ที่ส่งเข้ามาใน path ต้องเป็นเลขรหัสนิสิต",
        summary: "ลบข้อมูลนิสิตด้วยรหัสนิสิต",
        tags: ["Students"],
      }
    }
  );

export default StudentController;
