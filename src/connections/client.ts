import { Client, types } from "pg";

const { USER, PASSWORD, HOST, PORT, DATABASE } = Bun.env;

const client: Client = new Client({
    user: USER,
    password: PASSWORD,
    host: HOST,
    port: parseInt(<string>PORT),
    database: DATABASE,
});

export default client;

types.setTypeParser(types.builtins.INT8, (val: string): number => parseInt(val));
types.setTypeParser(types.builtins.INT4, (val: string): number => parseInt(val));
types.setTypeParser(types.builtins.NUMERIC, (val: string): number => parseFloat(val));