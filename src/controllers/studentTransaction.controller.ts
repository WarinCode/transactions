import Elysia from "elysia";
import camelcaseKeys from "camelcase-keys";
import client from "../connections/client";
import { idSchema, studentTransactionSchema } from "../types/schemas";

const StudentTransactionController = new Elysia({ prefix: "/student-transaction" })
    .get("/", async ({ error }) => {
        try {
            const { rows } = await client.query("SELECT * FROM Student_Transactions ORDER BY Transaction_ID");
            return camelcaseKeys(rows);
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    })
    .get("/:id", async ({ error, params: { id } }) => {
        try {
            const { rows } = await client.query(`SELECT * FROM Student_Transactions WHERE Transaction_ID = ${id}`);

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
    .post("/create", async ({ set, body: { transactionId, studentId }, error }) => {
        try {
            const { rowCount } = await client.query(`INSERT INTO Student_Transactions VALUES(${transactionId}, ${studentId})`);

            if (rowCount === 1) {
                set.status = 201;
                return { message: "เพิ่มธรุกรรมของนิสิตสำเร็จ" };
            }

            throw new Error("ไม่สามารถเพิ่มธุระกรรมได้!");
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    }, {
        body: studentTransactionSchema
    })
    .delete("/delete/:id", async ({ params: { id }, error }) => {
        try {
            const { rowCount } = await client.query(`DELETE FROM Student_Transactions WHERE Transaction_ID = ${id}`);

            if (rowCount === 1) {
                return { message: "ลบข้อมูลธรุกรรมสำเร็จ" };
            }

            throw new Error("ไม่สามารถลบข้อมูลธรุกรรมได้!");
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    }, {
        params: idSchema
    })

export default StudentTransactionController;