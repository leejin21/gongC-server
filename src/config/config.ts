import * as dotenv from "dotenv";
dotenv.config();
const env = process.env;

export const config = {
    development: {
        username: env.MYSQL_USERNAME || "root",
        password: env.MYSQL_PASSWORD,
        database: env.MYSQL_DATABASE || "gongcdb",
        host: env.MYSQL_HOST || "localhost",
        dialect: "mysql",
        port: env.MYSQL_PORT || "3306",
    },
};
