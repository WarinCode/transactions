import { Client, types } from "pg";

const { USER, PASSWORD, HOST, DATABASE_PORT, DATABASE } = Bun.env;

const client: Client = new Client({
    user: USER,
    password: PASSWORD,
    host: HOST,
    port: parseInt(<string>DATABASE_PORT),
    database: DATABASE,
    ssl: true,
    connectionTimeoutMillis: 5000
});

export default client;

types.setTypeParser(types.builtins.INT8, (val: string): number => parseInt(val));
types.setTypeParser(types.builtins.INT4, (val: string): number => parseInt(val));
types.setTypeParser(types.builtins.NUMERIC, (val: string): number => parseFloat(val));