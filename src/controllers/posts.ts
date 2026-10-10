import type { FastifyReply, FastifyRequest } from "fastify"
import type { PostsBody } from "../utils/types.js"
import { connection } from "../config/db/connect.js";
import { InternalError } from "../errors/upload.error.js";



export const CreatePost = async ( 
    request: FastifyRequest<{Body: PostsBody}>, 
    reply: FastifyReply )
    : Promise<void> => {
    
    const { content } = request.body
    
    const id = request.user.id

    if(!content) {

        return reply.status(400).send({ message: "content is required" }) 

    }

    try {
        
    const result = await connection.query(
        `
        INSERT INTO postSchema.posts 
            (user_id , content)
        VALUES 
             ($1 , $2)
        RETURNING id , user_id , content, created_at      
        `,
            [id, content]
        
    )
    
    return reply.status(201).send({ 
        message: "content created successfully",
        result: result.rows[0] 
     })

     } catch(error: unknown) {
        if(error instanceof Error){
            console.error(error.message)
        }
        throw new InternalError('Something went wrong in posting' , 500)
        
    }

}

export const getPosts = async (
    request: FastifyRequest , reply: FastifyReply
): Promise<void> => {

    try {

    const getPosts = await connection.query(
        `
        SELECT u.id , u.name, u.email, p.content, p.id
        FROM userSchema.users u
        INNER JOIN postschema.posts p ON u.id = p.user_id
        `
    )
     const posts = await getPosts.rows[0];

     if(!posts){
        return reply.status(400).send({ message: "Posts not found" })
     }
    
     return reply.status(200).send({ posts })

      } catch (error: any) {

        if(error instanceof Error) {
            console.error("Error in get-posts controller" , error.message);
        }

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
       UPDATE postschema.posts 
       SET content = $1
       WHERE posts.id = $2
        `,
        [content , contentId]
    )


    if(updatePosts.rowCount === 0){

        return reply.status(404).send({message: "Posts not found"})

    }

    return reply.status(200).send({
        message: "post updated successfully",
        
    })

    } catch (error: any)  {
        
        if(error instanceof Error){

            console.error(error.message)

        }

        throw new InternalError("Internal server error in UpdatePosts" , 500)
        
    }

}

export const DeletePosts = async (
    request: FastifyRequest< {Params: { id: string } , Body: PostsBody }  >,
    reply: FastifyReply   
): Promise<void> => {

    const contentId: number = Number(request.params.id)

    if(!Number.isInteger(contentId) || contentId <= 0){
        return reply.status(404).send({message: "content id not found"})
    }

    const author = request.user.id;

    try {
    

    const deletePost = await connection.query(
        `
        DELETE FROM postschema.posts
        WHERE posts.user_id = $1 
        AND posts.id = $2
        RETURNING id
        `,
        [author , contentId]
    ) 

    if(deletePost.rowCount === 0) {

        return reply.status(404).send({ message: "Post not found"})
        
    }

    return reply.status(200).send({ message: "post deleted successfully"})

     } catch (error: unknown) {
        if(error instanceof Error) console.error("Error deleting post" , error.message )
        throw new InternalError("Internal server error in delete posts " , 500)
        
    }
}

