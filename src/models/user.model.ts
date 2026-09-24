
import { connection } from "../db/connect.js"



async function userSchema(schema:string = 'userSchama'):Promise<void> {
    await connection.connect();
    
}