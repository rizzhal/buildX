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

export const getPosts = async (
    request: FastifyRequest , reply: FastifyReply
): Promise<void> => {

    try {

    const getPosts = await  connection.query(
        `
        SELECT u.id , u.name, u.email, p.content
        FROM userSchema.users u
        INNER JOIN posts p ON u.id = p.users_id
        `
    )
     const posts = await getPosts.rows[0];

     if(!posts){
        return reply.status(400).send({ message: "Posts not found" })
     }
    
     return reply.status(200).send({ posts })

      } catch {

        throw new InternalError("Internal server error ,  cannot get posts" , 500)
    }
     
}

export const UpdatePosts = async (
    request: FastifyRequest<{ Params: { id: string } , Body: PostsBody }> ,
    reply: FastifyReply
) : Promise<void> => {

    const contentId: number = Number(request.params.id);

    const { content } = request.body

    try {
        
    if(!content){
        return reply.status(400).send({message: "Content is required"})
    }

    const updatePosts = await connection.query(
        `
       UPDATE postSchema.posts 
       SET content = $1
       WHERE id = $2
        `,
        [content , contentId]
    )

    if(updatePosts.rowCount === 0){

        return reply.status(404).send({message: "Posts not found"})

    }

    } catch  {

        throw new InternalError("Internal server error in UpdatePosts" , 500)
        
    }

}

export const DeletePosts = async (
    request: FastifyRequest< {Params: { id: string } , Body: PostsBody }  >,
    reply: FastifyReply   
): Promise<void> => {

    const contentId = request.params.id

    const { content } = request.body

    try {
    
    if(!content) {
        return reply.status(400).send({ message: "content is required" })
    }

    const deletePost = await connection.query(
        `
        DELETE postSchema.posts
        WHERE content = $1
        AND id = $2
        `,
        [content , contentId]
    ) 

    if(deletePost.rowCount === 0) {

        return reply.status(404).send({ message: "Post not found"})
        
    }

    return reply.status(200).send({ message: "post deleted successfully"})

     } catch {

        throw new InternalError("Internal server error in delete posts " , 500)
        
    }
}