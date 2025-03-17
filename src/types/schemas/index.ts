import { t } from "elysia";

export const studentSchema = t.Object({
    studentId: t.Number(),
    studentName: t.String(),
    email: t.String(),
    majorId: t.String()
});

export const idSchema = t.Object({
    id: t.Numeric()
});

export const majorSchema = t.Object({
    majorId: t.String(),
    majorName: t.String(),
    programName: t.String()
});

export const transactionSchema = t.Object({
    transactionId: t.Number(),
    studentId: t.Number(),
    income: t.Number(),
    expenses: t.Number(),
    expenseType: t.String(),
    timestamp: t.String(),
    date: t.String(),
    time: t.String()
});