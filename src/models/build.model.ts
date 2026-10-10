
import { connection } from "../config/db/connect.js"

// User schema
export async function userSchema():Promise<void> {
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

export async function PostsSchema(): Promise<void> {
    try {
        await connection.query(`
            CREATE SCHEMA IF NOT EXISTS postschema
            `)
        await connection.query(
            `
            CREATE TABLE IF NOT EXISTS postschema.posts(
            id          BIGSERIAL PRIMARY KEY,
            user_id     BIGSERIAL NOT NULL,
            content     VARCHAR(280),
            created_at  TIMESTAMPTZ DEFAULT NOW(),

                CONSTRAINT fk_posts_user
                    FOREIGN KEY (user_id)
                    REFERENCES userSchema.users(id)
                    ON DELETE CASCADE
            )
           `
        )
        await connection.query(`

            CREATE TABLE IF NOT EXISTS postschema.post_media(
            id              BIGSERIAL PRIMARY KEY,
            post_id         BIGSERIAL NOT NULL REFERENCES postschema.posts(id) ON DELETE CASCADE,
            media_type      VARCHAR(10) NOT NULL,
            thumbnail_url   VARCHAR(500),
            width           INT,
            height          INT,
            sort_order      INT DEFAULT 0,
            created_at      TIMESTAMPTZ DEFAULT NOW()
            )

            `)

            await connection.query(
                `
                CREATE INDEX IF NOT EXISTS idx_post_media_post_id  ON postschema.post_media(post_id)

                `
            )

        console.log("posts table created sucessfully")
    } catch (error: unknown) {
        if(error instanceof Error){
            console.error(error.message)
            throw new Error("Error creating schema" , error)
        } else {
            console.error('Unexpected error in posts schema' , error)
        }
    }
}


