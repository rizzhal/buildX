import { Pool } from "pg";

export const connection = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host:   process.env.PGHOST,
    port:   parseInt(process.env.PGPORT || '5432'),
    database: process.env.PGDATABASE 
})

