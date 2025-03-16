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