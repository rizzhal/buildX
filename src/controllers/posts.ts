import type { FastifyReply, FastifyRequest } from "fastify"
import type { PostsBody } from "../utils/types.js"
import { connection } from "../config/db/connect.js";
import { InternalError } from "../errors/upload.error.js";



export const CreatePost = async ( 
    request: FastifyRequest<{Body: PostsBody}>, 
    reply: FastifyReply )
    : Promise<void> => {
    
    const { content } = request.body

    if(!content) {

        return reply.status(400).send({ message: "content is required" }) 

    }

    try {
        
    const result = await connection.query(
        `
        INSERT INTO postSchema.posts 
            (content)
        VALUES 
             ($1)
        RETURNING id , user_id , content, created_at      
        `,
            [content]
        
    )
    
    return reply.status(201).send({ 
        message: "content created successfully",
        result: result.rows[0] 
     })

     } catch {
        throw new InternalError('Something went wrong while uploading' , 500)
    }

}
