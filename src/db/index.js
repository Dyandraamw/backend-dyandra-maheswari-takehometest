import pg from 'pg'
import { config } from "dotenv";

config();

const database = new pg.Pool({
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
})

export default database