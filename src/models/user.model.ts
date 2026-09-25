
import { connection } from "../db/connect.js"


// User schema
async function userSchema(schema:string = 'userSchama'):Promise<void> {
    try {
        await connection.connect();
        await connection.query(`CREATE SCHEMA IF NOT EXISTS my-schema`)
        // Create table as user's table
        await connection.query(`
            CREATE TABLE my-schema.users(
            id BIGSERIAL PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(64) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMPZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPZ DEFAULT CURRENT_TIMESTAMP
            )
            `)
        
    } catch (error) {
        
    }



    
}