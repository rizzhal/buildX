import { connection } from "../config/db/connect.js";

export async function PostsSchema(): Promise<void> {
    try {
        await connection.query(`
            CREATE SCHEMA IF NOT EXISTS postschema
            `)
        await connection.query(
            `
            CREATE TABLE IF NOT EXISTS postschema.posts(
            id          BIGSERIAL PRIMARY KEY,
            user_id     BIGINT NOT NULL,
            content     VARCHAR(280),
            created_at  TIMESTAMPTZ DEFAULT NOW(),

                CONSTRAINT fk_posts_user
                    FOREIGN KEY (user_id)
                    REFERENCES users (id)
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
                CREATE INDEX idx_post_media_post_id ON post_media(post_id)
                `
            )

        console.log("posts table created sucessfully")
    } catch (error: unknown) {
        if(error instanceof Error){
            throw new Error("Error creating schema" , error)
        } else {
            console.error('Unexpected error in posts schema' , error)
        }
    }
}

await PostsSchema();