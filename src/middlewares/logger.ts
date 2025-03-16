import { Context } from "elysia";

const logger = (c: Context) => {
    console.log(`${c.request.method}: ${c.set.status} ${c.path}`);
}

export default logger;