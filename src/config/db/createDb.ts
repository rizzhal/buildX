// import { connection } from "./connect.js"

// const createDb = async (dbName:string):Promise<void> => {
//     try {
//         const connectDb = await connection.query(`CREATE DATABASE  ${dbName}`)
//         if(!connectDb){
//             throw new Error("db not created")
//         } else {
//             console.error("db not created")
//         }
//         console.log(`Database ${dbName} created successfully`)
//     } catch(error:unknown){
//         if(error instanceof Error){
//          console.error("Error creating db" , error.message)
//         } else {
//             console.error("Something went wrong in the db-connect")
//         }
//     }
// }

// await createDb("mydb")