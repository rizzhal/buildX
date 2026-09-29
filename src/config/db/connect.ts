import { Pool } from "pg";



 const connection  = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host:   process.env.PGHOST,
    port:   parseInt(process.env.PGPORT || '5432' , 10),
    database: process.env.PGDATABASE 
})

const createDb = async (dbName:string):Promise<void> => {
    try {
        const connectDb = await connection.query(`CREATE DATABASE  ${dbName}`)
        if(!connectDb){
            throw new Error("db not created")
        } else {
            console.error("db not created")
        }
        console.log(`Database ${dbName} created successfully`)
    } catch(error:unknown){
        if(error instanceof Error){
         console.error("Error creatign db" , error.message)
        } else {
            console.error("Something went wrong in the db-connect")
        }
    } finally {
        await connection.end()
    }
}

createDb("mydb")