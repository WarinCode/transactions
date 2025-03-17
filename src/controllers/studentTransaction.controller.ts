import Elysia from "elysia";
import camelcaseKeys from "camelcase-keys";
import client from "../connections/client";
import { idSchema } from "../types/schemas";

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

export default StudentTransactionController;