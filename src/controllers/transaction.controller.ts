import Elysia, { t } from "elysia";
import camelcaseKeys from "camelcase-keys";
import client from "../connections/client";
import { idSchema, transactionSchema } from "../types/schemas";

const TransactionController = new Elysia({ prefix: "/transactions" })
    .get("/", async ({ error }) => {
        try {
            const sql: string = `SELECT Students.Student_ID, Student_Name, Income, Expenses, Expense_Type FROM Students
            INNER JOIN Student_Transactions ON Student_Transactions.Student_ID = Students.Student_ID
            INNER JOIN Transactions ON Transactions.Transaction_ID = Student_Transactions.Transaction_ID
            ORDER BY Transactions.Transaction_ID`;
            const { rows } = await client.query(sql);
            return camelcaseKeys(rows);
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    })
    .get("/:id", async ({ params: { id }, error }) => {
        try {
            const sql: string = `SELECT Students.Student_ID, Student_Name, Income, Expenses, Expense_Type FROM Students
            INNER JOIN Student_Transactions ON Student_Transactions.Student_ID = Students.Student_ID
            INNER JOIN Transactions ON Transactions.Transaction_ID = Student_Transactions.Transaction_ID
            WHERE Transactions.Transaction_ID = ${id}`;
            const { rows } = await client.query(sql);

            if (rows.length === 1) {
                return camelcaseKeys(rows[0])
            }

            throw new Error(`ไม่มี id ${id} อยู่ในฐานข้อมูล!`);
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    }, { params: idSchema })
    .get("/student-id/:id", async ({ params: { id }, error }) => {
        try {
            const sql: string = `SELECT Students.Student_ID, Student_Name, Income, Expenses, Expense_Type FROM Students
            INNER JOIN Student_Transactions ON Student_Transactions.Student_ID = Students.Student_ID
            INNER JOIN Transactions ON Transactions.Transaction_ID = Student_Transactions.Transaction_ID
            WHERE Students.Student_ID = ${id}
            ORDER BY Transactions.Transaction_ID`;
            const { rows } = await client.query(sql);

            if (rows.length === 0) {
                throw new Error(`ไม่มี id ${id} อยู่ในฐานข้อมูล!`);
            }

            return camelcaseKeys(rows);
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    }, { params: idSchema })
    .get("/expense/type/:type", async ({ params: { type }, error }) => {
        const decodedString: string = decodeURI(type);

        try {
            const sql: string = `SELECT Students.Student_ID, Student_Name, Income, Expenses, Expense_Type FROM Students
            INNER JOIN Student_Transactions ON Student_Transactions.Student_ID = Students.Student_ID
            INNER JOIN Transactions ON Transactions.Transaction_ID = Student_Transactions.Transaction_ID
            WHERE Transactions.Expense_Type = '${decodedString}'
            ORDER BY Transactions.Transaction_ID`;
            const { rows } = await client.query(sql);

            if (rows.length === 0) {
                throw new Error(`ไม่มีชนิดค่าใช้จ่าย ${type} นี้อยู่ในฐานข้อมูล!`);
            }

            return camelcaseKeys(rows);
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    })
    .group("/total", (app) =>
        app.get("/income", async ({ error }) => {
            try {
                const sql: string = `SELECT SUM(Income) AS Total_Income, COUNT(Students.Major_ID) AS Total_Transactions FROM Students
            INNER JOIN Student_Transactions ON Student_Transactions.Student_ID = Students.Student_ID
            INNER JOIN Transactions ON Transactions.Transaction_ID = Student_Transactions.Transaction_ID
            WHERE Students.Major_ID = 'S06'
            GROUP BY Students.Major_ID`;
                const { rows } = await client.query(sql);

                if (rows.length === 0) {
                    throw new Error(`ไม่สามารถหาผลรวมของรายรับได้!`);
                }

                return camelcaseKeys(rows[0]);
            } catch (e: unknown) {
                if (e instanceof Error) {
                    return error(400, e.message);
                }
            }
        })
            .get("/expenses", async ({ error }) => {
                try {
                    const sql: string = `SELECT SUM(Expenses) AS Total_Expenses, COUNT(Students.Major_ID) AS Total_Transactions FROM Students
                INNER JOIN Student_Transactions ON Student_Transactions.Student_ID = Students.Student_ID
                INNER JOIN Transactions ON Transactions.Transaction_ID = Student_Transactions.Transaction_ID
                WHERE Students.Major_ID = 'S06'
                GROUP BY Students.Major_ID`;
                    const { rows } = await client.query(sql);

                    if (rows.length === 0) {
                        throw new Error(`ไม่สามารถหาผลรวมของรายจ่ายได้!`);
                    }

                    return camelcaseKeys(rows[0]);
                } catch (e: unknown) {
                    if (e instanceof Error) {
                        return error(400, e.message);
                    }
                }
            })
            .get("/expenses/:id", async ({ error, params: { id } }) => {
                try {
                    const sql: string = `SELECT Student_Name, Students.Student_ID, 
                SUM(Expenses) AS Total_Expenses, COUNT(Students.Student_ID) AS Total_Transactions FROM Students
                INNER JOIN Student_Transactions ON Student_Transactions.Student_ID = Students.Student_ID
                INNER JOIN Transactions ON Transactions.Transaction_ID = Student_Transactions.Transaction_ID
                WHERE Students.Student_ID = ${id}
                GROUP BY Students.Student_ID, Students.Student_Name`;
                    const { rows } = await client.query(sql);

                    if (rows.length === 0) {
                        throw new Error(`ไม่มี id ${id} อยู่ในฐานข้อมูล!`);
                    }

                    return camelcaseKeys(rows[0]);
                } catch (e: unknown) {
                    if (e instanceof Error) {
                        return error(400, e.message);
                    }
                }
            }, { params: idSchema })
            .get("/expenses/all", async ({ error }) => {
                try {
                    const sql: string = `SELECT Student_Name, Students.Student_ID, 
                SUM(Expenses) AS Total_Expenses, COUNT(Students.Student_ID) AS Total_Transactions FROM Students
                INNER JOIN Student_Transactions ON Student_Transactions.Student_ID = Students.Student_ID
                INNER JOIN Transactions ON Transactions.Transaction_ID = Student_Transactions.Transaction_ID
                GROUP BY Students.Student_ID, Students.Student_Name
                ORDER BY Total_Expenses
                `;
                    const { rows } = await client.query(sql);

                    if (rows.length === 0) {
                        throw new Error(`ไม่สามารถหาค่าผลรวมของค่าใช้จ่ายได้!`);
                    }

                    return camelcaseKeys(rows);
                } catch (e: unknown) {
                    if (e instanceof Error) {
                        return error(400, e.message);
                    }
                }
            })
            .get("/expenses/type", async ({ error }) => {
                try {
                    const sql: string = `SELECT SUM(Expenses) AS Total_Expenses, COUNT(Expense_Type) AS Total_Expense_Types, Expense_Type FROM Students
                INNER JOIN Student_Transactions ON Student_Transactions.Student_ID = Students.Student_ID
                INNER JOIN Transactions ON Transactions.Transaction_ID = Student_Transactions.Transaction_ID
                GROUP BY Expense_Type`;
                    const { rows } = await client.query(sql);

                    if (rows.length === 0) {
                        throw new Error("ไม่สามารถหาชนิดของค่าใช้จ่ายรวมได้!");
                    }

                    return camelcaseKeys(rows);
                } catch (e: unknown) {
                    if (e instanceof Error) {
                        return error(400, e.message);
                    }
                }
            })
            .get("/student-id/:id/expenses/type/:type", async ({ params: { id, type }, error }) => {
                const decoded: string = decodeURI(type);

                try {
                    const sql: string = `SELECT Students.Student_ID, Student_Name, Expense_Type,
                    SUM(Expenses) AS Total_Expenses, COUNT(Students.Student_ID) AS Total_Transactions FROM Students
                    INNER JOIN Student_Transactions ON Student_Transactions.Student_ID = Students.Student_ID
                    INNER JOIN Transactions ON Transactions.Transaction_ID = Student_Transactions.Transaction_ID
                    WHERE Students.Student_ID = ${id} AND Expense_Type = '${decoded}'
                    GROUP BY Expense_Type, Students.Student_ID`;
                    const { rows } = await client.query(sql);

                    if (rows.length === 0) {
                        throw new Error("ไม่สามารถหาผลรวมของค่าใช้จ่ายรวมได้!");
                    }

                    return camelcaseKeys(rows[0]);
                } catch (e: unknown) {
                    if (e instanceof Error) {
                        return error(400, e.message);
                    }
                }
            }, {
                params: t.Object({ id: t.Number(), type: t.String() })
            })
    )
    .post("/create", async ({ set, body: { transactionId, studentId, income, expenses, expenseType, timestamp, date, time }, error }) => {
        try {
            const sql: string = `
            INSERT INTO Student_Transactions VAlUES(${transactionId}, ${studentId})
            INSERT INTO Transactions VAlUES(${transactionId}, ${income}, ${expenses}, '${expenseType}')
            INSERT INTO Transaction_Timestamps VALUES(${transactionId}, '${timestamp}', '${date}', '${time}')
            `;
            const { rowCount } = await client.query(sql);

            if (rowCount === 3) {
                set.status = 201;
                return { message: "เพิ่มธุระกรรมสำเร็จ" };
            }

            throw new Error("ไม่สามารถเพิ่มธุระกรรมได้!");
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    }, { body: transactionSchema })
    .delete("/delete/:id", async ({ params: { id }, error }) => {
        try {
            const sql: string = `
            DELETE FROM Student_Transactions WHERE Transaction_ID = ${id}
            DELETE FROM Transactions WHERE Transaction_ID = ${id}
            DELETE FROM Transaction_Timestamps WHERE Transaction_ID = ${id}
            `;
            const { rowCount } = await client.query(sql);

            if (rowCount === 3) {
                return { message: "ลบธุรกกรมสำเร็จ" };
            }

            throw new Error("ไม่สามารถลบธุระกรรมได้!");
        } catch (e: unknown) {
            if (e instanceof Error) {
                return error(400, e.message);
            }
        }
    }, { params: idSchema })

export default TransactionController;