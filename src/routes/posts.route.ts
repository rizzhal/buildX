import { fastify, type FastifyPluginAsync } from "fastify";
import { CreatePost, DeletePosts, getPosts, UpdatePosts } from "../controllers/posts.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";



export const postRoutes: FastifyPluginAsync = async (fastify, options ): Promise<void> => {

        fastify.post("/post" ,  {
            preHandler: authMiddleware,
            handler: CreatePost
        });

        fastify.get("/posts" , getPosts);
    
        
        fastify.put("/edit/:id" , {
            preHandler: authMiddleware,
            handler: UpdatePosts
        });

        fastify.delete("/delete/:id" , {
            preHandler: authMiddleware,
            handler: DeletePosts
        });

}