import Elysia from "elysia";
import client from "../connections/client";
import camelcaseKeys from "camelcase-keys";
import { idSchema } from "../types/schemas";

const TransactionTimestampController = new Elysia({ prefix: "/transaction-timestamps" })
    .get("/", async ({ error }) => {
        try {
            const { rows } = await client.query(`SELECT * FROM Transaction_Timestamps`);
            return camelcaseKeys(rows);
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    })
    .get("/:id", async ({ params: { id }, error }) => {
        try {
            const { rows } = await client.query(`SELECT * FROM Transaction_Timestamps WHERE Transaction_ID = ${id}`);

            if (rows.length === 1) {
                return camelcaseKeys(rows[0]);
            }

            throw new Error(`ไม่มีเลข id นี้อยุ่ในฐานข้อมูล ${id}!`);
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    }, { params: idSchema })

export default TransactionTimestampController;