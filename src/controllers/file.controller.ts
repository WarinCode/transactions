import Elysia, { file } from "elysia";

const fileController = new Elysia({ prefix: "/file" })
    .get("/data.csv", () => file("public/data.csv"));

export default fileController;