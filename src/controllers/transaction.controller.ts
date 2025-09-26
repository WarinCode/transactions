import Elysia, { t } from "elysia";
import camelcaseKeys from "camelcase-keys";
import client from "../connections/client";
import {
  studentIdSchema,
  transactionSchema,
  transactionIdSchema,
} from "../types/schemas";

const TransactionController = new Elysia({ prefix: "/transactions" })
  .get(
    "/",
    async ({ status }) => {
      try {
        const sql: string = `SELECT Students.Student_ID, Student_Name, Income, Expenses, Expense_Type FROM Students
            INNER JOIN Student_Transactions ON Student_Transactions.Student_ID = Students.Student_ID
            INNER JOIN Transactions ON Transactions.Transaction_ID = Student_Transactions.Transaction_ID
            ORDER BY Transactions.Transaction_ID`;
        const { rows } = await client.query(sql);
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
          "ดึงข้อมูลรายการ transaction ทั้งหมดโดยแสดงข้อมูล ชื่อนิสิต, รหัสนิสิต, รายรับ, รายจ่าย และ ชนิดของค่าใช้จ่าย",
        summary: "ดึงข้อมูลรายการ transactions ทั้งหมด",
        tags: ["Transactions"],
      },
    }
  )
  .get(
    "/:id",
    async ({ params: { id }, status }) => {
      try {
        const sql: string = `SELECT Students.Student_ID, Student_Name, Income, Expenses, Expense_Type FROM Students
            INNER JOIN Student_Transactions ON Student_Transactions.Student_ID = Students.Student_ID
            INNER JOIN Transactions ON Transactions.Transaction_ID = Student_Transactions.Transaction_ID
            WHERE Transactions.Transaction_ID = ${id}`;
        const { rows } = await client.query(sql);

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
      params: transactionIdSchema,
      detail: {
        description:
          "ดึงข้อมูลรายการ transaction ด้วยรหัสธุรกรรมโดยส่งรหัสธุรกรรมเป็น parameter",
        summary: "ดึงข้อมูลรายการ transaction ด้วยรหัสธุรกรรม",
        tags: ["Transactions"],
      },
    }
  )
  .get(
    "/student-id/:id",
    async ({ params: { id }, status }) => {
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
          return status(400, e.message);
        }
      }
    },
    {
      params: studentIdSchema,
      detail: {
        description:
          "ดึงข้อมูลรายการ transaction ของนิสิตด้วยรหัสนิสิตโดยส่งรหัสนิสิตเป็น parameter",
        summary: "ดึงข้อมูลรายการ transaction ด้วยรหัสนิสิต",
        tags: ["Transactions"],
      },
    }
  )
  .get(
    "/expense/type/:type",
    async ({ params: { type }, status }) => {
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
          return status(400, e.message);
        }
      }
    },
    {
      params: t.Object({
        type: t.Union(
          [
            t.Literal("ค่าใช้จ่ายพื้นฐาน"),
            t.Literal("ไม่มีค่าใช้จ่าย"),
            t.Literal("ค่าใช้จ่ายเพื่อความบันเทิง"),
            t.Literal("ค่าใช้จ่ายส่วนตัว"),
          ],
          {
            description: "ชนิดของค่าใช้จ่าย",
            error:
              "ชนิดของค่าใช้จ่ายต้องเป็น ค่าใช้จ่ายพื้นฐาน, ไม่มีค่าใช้จ่าย, ค่าใช้จ่ายเพื่อความบันเทิง และ ค่าใช้จ่ายส่วนตัว เท่านั้น",
            examples: [
              "ค่าใช้จ่ายพื้นฐาน",
              "ไม่มีค่าใช้จ่าย",
              "ค่าใช้จ่ายเพื่อความบันเทิง",
              "ค่าใช้จ่ายส่วนตัว",
            ],
          }
        ),
      }),
      detail: {
        description:
          "ดึงข้อมูลรายการ transactions ด้วยชนิดของค่าใช้จ่าย โดยส่งชนิดของค่าใช้จ่ายเป็น parameter",
        summary: "ดึงข้อมูลรายการ transactions ด้วยชนิดของค่าใช้จ่าย",
        tags: ["Transactions"],
      },
    }
  )
  .group("/total", (app) =>
    app
      .get(
        "/income",
        async ({ status }) => {
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
              return status(400, e.message);
            }
          }
        },
        {
          detail: {
            description:
              "ดึงข้อมูลรายการ transactions ทั้งหมดของรายรับเช่น ข้อมูลรายรับทั้งหมด และ จำนวนรายรับทั้งหมด",
            summary: "ดึงข้อมูลรายรับรวมทั้งหมด",
            tags: ["Transactions"],
          },
        }
      )
      .get(
        "/expenses",
        async ({ status }) => {
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
              return status(400, e.message);
            }
          }
        },
        {
          detail: {
            description:
              "ดึงข้อมูลรายการ transactions ทั้งหมดของรายจ่ายเช่น ข้อมูลรายจ่ายทั้งหมด และ จำนวนรายจ่ายทั้งหมด",
            summary: "ดึงข้อมูลรายจ่ายรวมทั้งหมด",
            tags: ["Transactions"],
          },
        }
      )
      .get(
        "/expenses/:id",
        async ({ status, params: { id } }) => {
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
              return status(400, e.message);
            }
          }
        },
        {
          params: studentIdSchema,
          detail: {
            description:
              "ดึงข้อมูลรายการ transactions รายจ่ายทั้งหมดด้วยรหัสิสิตแต่ล่ะคนมีข้อมูลเช่น ข้อมูลรายจ่ายทั้งหมด และ จำนวนรายจ่ายทั้งหมด",
            summary: "ดึงข้อมูลร่ายจ่ายรวมทั้งหมดด้วยรหัสนิสิต",
            tags: ["Transactions"],
          },
        }
      )
      .get(
        "/expenses/all",
        async ({ status }) => {
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
              return status(400, e.message);
            }
          }
        },
        {
          detail: {
            description:
              "ดึงข้อมูลรายการ transactions รายจ่ายทั้งหมดของนิสิตทุกคนมีข้อมูลเช่น ข้อมูลรายจ่ายทั้งหมด และ จำนวนรายจ่ายทั้งหมด",
            summary: "ดึงข้อมูลรายจ่ายรวมทั้งหมดของนิสิตทุกคน",
            tags: ["Transactions"],
          },
        }
      )
      .get(
        "/expenses/type",
        async ({ status }) => {
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
              return status(400, e.message);
            }
          }
        },
        {
          detail: {
            description:
              "ดึงข้อมูลรายการ transactions รายจ่ายทั้งหมดของนิสิตแต่ละคนตามประเภทค่าใช้จ่าย",
            summary: "ดึงข้อมูลรายจ่ายรวมทั้งหมดของแต่ละประเภท",
            tags: ["Transactions"],
          },
        }
      )
      .get(
        "/student-id/:id/expenses/type/:type",
        async ({ params: { id, type }, status }) => {
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
              return status(400, e.message);
            }
          }
        },
        {
          params: t.Object({
            id: t.Numeric({
              description: "รหัสนิสิต",
              error: "รหัสนิสิตต้องเป็นตัวเลขเท่านั้น",
              examples: [6630250435, 6630250591, 6630250231, 6630250281],
            }),
            type: t.Union(
              [
                t.Literal("ค่าใช้จ่ายพื้นฐาน"),
                t.Literal("ไม่มีค่าใช้จ่าย"),
                t.Literal("ค่าใช้จ่ายเพื่อความบันเทิง"),
                t.Literal("ค่าใช้จ่ายส่วนตัว"),
              ],
              {
                description: "ชนิดของค่าใช้จ่าย",
                error:
                  "ชนิดของค่าใช้จ่ายต้องเป็น ค่าใช้จ่ายพื้นฐาน, ไม่มีค่าใช้จ่าย, ค่าใช้จ่ายเพื่อความบันเทิง และ ค่าใช้จ่ายส่วนตัว เท่านั้น",
                examples: [
                  "ค่าใช้จ่ายพื้นฐาน",
                  "ไม่มีค่าใช้จ่าย",
                  "ค่าใช้จ่ายเพื่อความบันเทิง",
                  "ค่าใช้จ่ายส่วนตัว",
                ],
              }
            ),
          }),
          detail: {
            description:
              "ดึงข้อมูลรายจ่ายทั้งหมดของแต่ล่ะประเภทด้วยรหัสนิสิตโดยมีการส่งค่า parameter เป็น รหัสนิสิต และ ชนิดของค่าใช้จ่าย",
            summary: "ดึงข้อมูลรายจ่ายทั้งหมดของแต่ล่ะประเภทด้วยรหัสนิสิต",
            tags: ["Transactions"],
          },
        }
      )
  )
  .post(
    "/create",
    async ({
      set,
      body: {
        transactionId,
        studentId,
        income,
        expenses,
        expenseType,
        timestamp,
        date,
        time,
      },
      status,
    }) => {
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
          return status(400, e.message);
        }
      }
    },
    {
      body: transactionSchema,
      detail: {
        description:
          "เพิ่มรายการ transaction ใหม่ 1 รายการโดยส่งข้อมูลเข้ามาใน body โดยมีข้อมูลที่ส่งมาได้แก่ รหัสธุรกรรม, รหัสนิสิต, รายรับ, รายจ่าย, ชนิดของค่าใช้จ่าย, วันและเวลาที่ทำธุรกรรม, วันที่ทำธุรกรรม และ เวลาที่ทำธุรกรรม",
        summary: "เพิ่มรายการ transaction",
        tags: ["Transactions"],
      },
    }
  )
  .delete(
    "/delete/:id",
    async ({ params: { id }, status }) => {
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
          return status(400, e.message);
        }
      }
    },
    {
      params: transactionIdSchema,
      detail: {
        description:
          "ลบรายการ transaction 1 รายการโดยส่งค่า parameter เป็นรหัสธุรกรรม",
        summary: "ลบรายการ transaction",
        tags: ["Transactions"],
      },
    }
  );

export default TransactionController;
