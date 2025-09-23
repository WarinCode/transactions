import { t } from "elysia";

export const studentSchema = t.Object({
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

export const idSchema = t.Object({
  id: t.Numeric({
    description: "รหัสนิสิต",
    error: "รหัสนิสิตต้องเป็นตัวเลขเท่านั้น",
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
  transactionId: t.Number(),
  studentId: t.Number(),
  income: t.Number(),
  expenses: t.Number(),
  expenseType: t.String(),
  timestamp: t.String(),
  date: t.String(),
  time: t.String(),
});
