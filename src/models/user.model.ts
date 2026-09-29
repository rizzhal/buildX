
import { connection } from "../config/db/connect.js"


// User schema
async function userSchema():Promise<void> {
    try {
       
        await connection.query(`CREATE SCHEMA IF NOT EXISTS userSchema`)
        // Create table as user's table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS userSchema.users(
            id BIGSERIAL PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(64) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            )
            `)   
            console.log('User schema created successfully')
    } catch (error: unknown) {
        if(error instanceof Error){
            console.error("Error creating schema" , error)
        } else {
            console.error("Unexpected error" , error)
        }
    }
}

userSchema()