import { Pool } from "pg";


 export const connection  = new Pool({
    user: process.env.PGUSER as string | undefined,
    password: process.env.PGPASSWORD as string || undefined,
    host:   process.env.PGHOST as string | undefined,
    port:   parseInt(process.env.PGPORT || '5432' , 10 ),
    database: process.env.PGDATABASE as string | undefined
})

if(!process.env.PGPASSWORD){
    throw new Error("PGPASSWORD is missing")
}
