import Elysia, { t } from "elysia";
import camelcaseKeys from "camelcase-keys";
import client from "../connections/client";
import { studentSchema, idSchema } from "../types/schemas";

const studentController = new Elysia({ prefix: "/students" })
    .get("/", async ({ error }) => {
        try {
            const { rows } = await client.query("SELECT * FROM Students ORDER BY Student_ID");
            return camelcaseKeys(rows);
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    })
    .get("/:id", async ({ params: { id }, error }) => {
        try {
            const { rows } = await client.query(`SELECT * FROM Students WHERE Student_ID = ${id}`);

            if (rows.length === 1) {
                return camelcaseKeys(rows[0]);
            }

            throw new Error(`ไม่มี id ${id} อยู่ในฐานข้อมูล!`);
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    }, {
        params: idSchema
    })
    .post("/create", async ({ set, body: { studentId, studentName, email, majorId }, error }) => {
        try {
            const { rowCount } = await client.query(`INSERT INTO Students VALUES(${studentId}, '${studentName}', '${email}', '${majorId}')`);

            if (rowCount === 1) {
                set.status = 201;
                return { message: "เพิ่มข้อมูลนิสิตใหม่สำเร็จ" };
            }

            throw new Error("ไม่สามารถเพิ่มข้อมูลนิสิตใหม่ได้!");
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    }, {
        body: studentSchema
    })
    .put("/update", async ({ body: { studentName, studentId, email, majorId }, error }) => {
        try {
            const { rowCount } = await client.query(`UPDATE Students SET Student_Name = '${studentName}', Email = '${email}', Major_ID = '${majorId}' WHERE Student_ID = ${studentId}`);

            if (rowCount === 1) {
                return { message: "แก้ไขข้อมูลนิสิตสำเร็จ" };
            }

            throw new Error("แก้ไขข้อมูลนิสิตไม่สำเร็จ!");
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    }, {
        body: studentSchema
    })
    .patch("/update/student-id", async ({ body: { oldStudentId, newStudentId }, error }) => {
        try {
            const { rowCount } = await client.query(`UPDATE Students SET Student_ID = ${newStudentId} WHERE Student_ID = ${oldStudentId}`);

            if (rowCount === 1) {
                return { message: "แก้ไขรหัสนิสิตสำเร็จ" };
            }

            throw new Error("แก้ไขข้อรหัสนิสิตไม่สำเร็จ!");
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    }, {
        body: t.Object({
            oldStudentId: t.Number(),
            newStudentId: t.Number()
        })
    })
    .patch("/update/student-name", async ({ body: { studentName, studentId }, error }) => {
        try {
            const { rowCount } = await client.query(`UPDATE Students SET Student_Name = '${studentName}' WHERE Student_ID = ${studentId}`);

            if (rowCount === 1) {
                return { message: "แก้ไขชื่อนิสิตสำเร็จ" };
            }

            throw new Error("แก้ไขข้อชื่อนิสิตไม่สำเร็จ!");
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    }, {
        body: t.Object({
            studentId: t.Number(),
            studentName: t.String()
        })
    })
    .patch("/update/email", async ({ body: { email, studentId }, error }) => {
        try {
            const { rowCount } = await client.query(`UPDATE Students SET Email = '${email}' WHERE Student_ID = ${studentId}`);

            if (rowCount === 1) {
                return { message: "แก้ไขอีเมลนิสิตสำเร็จ" };
            }

            throw new Error("แก้ไขอีเมลนิสิตไม่สำเร็จ!");
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    }, {
        body: t.Object({
            studentId: t.Number(),
            email: t.String()
        })
    })
    .patch("/update/major-id", async ({ body: { majorId, studentId }, error }) => {
        try {
            const { rowCount } = await client.query(`UPDATE Students SET Major_ID = '${majorId}' WHERE Student_ID = ${studentId}`);

            if (rowCount === 1) {
                return { message: "แก้ไขรหัสสาขานิสิตสำเร็จ" };
            }

            throw new Error("แก้ไขรหัสสาขานิสิตไม่สำเร็จ!");
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    }, {
        body: t.Object({
            studentId: t.Number(),
            majorId: t.String()
        })
    })
    .delete("/delete/:id", async ({ params: { id }, error }) => {
        try {
            const { rowCount } = await client.query(`DELETE FROM Students WHERE Student_ID = ${id}`);

            if (rowCount === 1) {
                return { message: "ลบข้อมูลนิสิตสำเร็จ" };
            }

            throw new Error("ไม่สามารถลบข้อมูลนิสิตได้!");
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    }, {
        params: idSchema
    })

export default studentController;