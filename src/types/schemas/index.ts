import { t } from "elysia";

export const studentSchema = t.Object({
  studentId: t.Numeric({
    description: "รหัสนิสิต",
    error: "รหัสนิสิตต้องเป็นตัวเลขเท่านั้น",
    examples: [6630250001, 6630250002, 6630250003],
  }),
  studentName: t.String({
    description: "ชื่อนิสิต",
    error: "ความยาวของชื่อนิสิตต้องอยู่ระหว่าง 5 ถึง 20 ตัวอักษร",
    minLength: 5,
    maxLength: 20,
  }),
  email: t.String({
    description: "อีเมลนิสิต",
    error: "รูปแบบอีเมลไม่ถูกต้อง",
    format: "email",
  }),
  majorId: t.String({
    description: "รหัสสาขาวิชา",
    error: "รหัสสาขาวิชาต้องไม่เกิน 3 ตัวอักษร",
    minLength: 1,
    maxLength: 3,
  }),
});

export const studentIdSchema = t.Object({
  id: t.Numeric({
    description: "รหัสนิสิต",
    error: "รหัสนิสิตต้องเป็นตัวเลขเท่านั้น",
    examples: [6630250435, 6630250591, 6630250231, 6630250281],
  }),
});

export const transactionIdSchema = t.Object({
  id: t.Number({
    description: "รหัสธุระกรรม",
    examples: [1, 5, 20],
    error: "กรุณากรอกเป็นตัวเลขเท่านั้น",
    minimum: 1,
    maximum: 1000,
  }),
});

export const majorSchema = t.Object({
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
  programName: t.Union([t.Literal("ภาคปกติ"), t.Literal("ภาคพิเศษ")], {
    description: "ชื่อหลักสูตร",
    error: "ชื่อหลักสูตรต้องเป็น ภาคปกติ หรือ ภาคพิเศษ เท่านั้น",
  }),
});

export const transactionSchema = t.Object({
  transactionId: t.Number({
    description: "รหัสธุรกรรม",
    examples: [1, 2, 3],
    error: "เลขจะต้องมีค่าระหว่าง 1-1000 เท่านั้น",
    minimum: 1,
    maximum: 1000,
  }),
  studentId: t.Number({
    description: "รหัสนิสิต",
    examples: [6630250435, 6630250591, 6630250231, 6630250281],
    error: "รหัสนิสิตต้องเป็นตัวเลขเท่านั้น",
  }),
  income: t.Number({
    description: "รายได้",
    error: "รายได้ต้องเป็นตัวเลขเท่านั้น",
    examples: [50, 100, 1000, 243.56],
    minimum: 0,
    maximum: 1000000,
  }),
  expenses: t.Number({
    description: "รายจ่าย",
    error: "รายจ่ายต้องเป็นตัวเลขเท่านั้น",
    examples: [30, 70, 200, 150.75],
    minimum: 0,
    maximum: 1000000,
  }),
  expenseType: t.Union(
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
  timestamp: t.String({
    description: "วันและเวลาที่ทำธุรกรรม",
    error: "รูปแบบวันและเวลาไม่ถูกต้อง",
    format: "date-time",
    examples: [
      "2025-01-13 20:00:00",
      "2023-10-01 10:00:00",
      "2023-12-31 23:59:59",
    ],
  }),
  date: t.String({
    description: "วันที่ทำธุรกรรม",
    error: "รูปแบบวันที่ไม่ถูกต้อง",
    format: "date",
    examples: ["2023-10-01", "2023-10-02", "2023-10-03"],
  }),
  time: t.String({
    description: "เวลาที่ทำธุรกรรม",
    error: "รูปแบบเวลาไม่ถูกต้อง",
    format: "time",
    examples: ["10:00:00", "15:30:00", "08:45:00"],
  }),
});
