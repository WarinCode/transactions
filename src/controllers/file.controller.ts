import Elysia, { file } from "elysia";

const FileController = new Elysia({ prefix: "/file" })
    .get("/data.csv", () => file("public/data.csv"), { detail: { hide: true }});

export default FileController;