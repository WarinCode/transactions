import Elysia, { t } from "elysia";
import camelcaseKeys from "camelcase-keys";
import client from "../connections/client";
import { majorSchema } from "../types/schemas";

const MajorController = new Elysia({ prefix: "/majors" })
    .get("/", async ({ error }) => {
        try {
            const { rows } = await client.query("SELECT * FROM Majors ORDER BY Major_ID");
            return camelcaseKeys(rows);
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    })
    .get("/:id", async ({ params: { id }, error }) => {
        try {
            const { rows } = await client.query(`SELECT * FROM Majors WHERE Major_ID = '${id}'`);

            if (rows.length === 1) {
                return camelcaseKeys(rows[0]);
            }

            throw new Error(`ไม่มี id ${id} อยู่ในฐานข้อมูล!`);
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    })
    .post("/create", async ({ body: { majorId, majorName, programName }, error, set }) => {
        try {
            const { rowCount } = await client.query(`INSERT INTO Majors VALUES('${majorId}', '${majorName}', '${programName}')`);

            if (rowCount === 1) {
                set.status = 201;
                return { message: "เพิ่มข้อมูลสาขาสำเร็จ" };
            }

            throw new Error("ไม่สามารถเพิ่มข้อมูลสาขาได้!");
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    }, { body: majorSchema })
    .put("/update", async ({ error, body: { majorId, majorName, programName } }) => {
        try {
            const { rowCount } = await client.query(`UPDATE Majors SET Major_Name = '${majorName}', Program_Name = '${programName}' WHERE Major_ID = '${majorId}'`);

            if (rowCount === 1) {
                return { message: "แก้ไขข้อมูลสาขาสำเร็จ" };
            }

            throw new Error("ไม่สามารถแก้ไขข้อมูลสาขาได้!");
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    }, { body: majorSchema })
    .patch("/update/major-id", async ({ error, body: { oldMajorId, newMajorId } }) => {
        try {
            const { rowCount } = await client.query(`UPDATE Majors SET Major_ID = '${newMajorId}' WHERE Major_ID = '${oldMajorId}'`);

            if (rowCount === 1) {
                return { message: "แก้ไขรหัสสาขาสำเร็จ" };
            }

            throw new Error("ไม่สามารถแก้ไขรหัสสาขาได้!");
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    }, {
        body: t.Object({
            oldMajorId: t.String(),
            newMajorId: t.String()
        })
    })
    .patch("/update/major-name", async ({ error, body: { majorId, majorName } }) => {
        try {
            const { rowCount } = await client.query(`UPDATE Majors SET Major_Name = '${majorName}' WHERE Major_ID = '${majorId}'`);

            if (rowCount === 1) {
                return { message: "แก้ไขชื่อสาขาสำเร็จ" };
            }

            throw new Error("ไม่สามารถแก้ไขชื่อสาขาได้!");
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    }, {
        body: t.Object({
            majorId: t.String(),
            majorName: t.String()
        })
    })
    .patch("/update/program-name", async ({ error, body: { majorId, programName } }) => {
        try {
            const { rowCount } = await client.query(`UPDATE Majors SET Program_Name = '${programName}' WHERE Major_ID = '${majorId}'`);

            if (rowCount === 1) {
                return { message: "แก้ไขชื่อโปรแกรมสาขาสำเร็จ" };
            }

            throw new Error("ไม่สามารถแก้ไขชื่อโปรแกรมสาขาได้!");
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    }, {
        body: t.Object({
            majorId: t.String(),
            programName: t.String()
        })
    })
    .delete("/delete/:id", async ({ error, params: { id } }) => {
        try {
            const { rowCount } = await client.query(`DELETE FROM Majors WHERE Major_ID = '${id}'`);

            if (rowCount === 1) {
                return { message: "ลบสาขาสำเร็จ" };
            }

            throw new Error("ไม่สามารถลบสาขาได้!");
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    })


export default MajorController;