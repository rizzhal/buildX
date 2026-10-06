import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { UploadImage, UploadVideo } from "../controllers/upload.controller.js";


export const uploadRoute: FastifyPluginAsync = async (
    fastify,
    options
):Promise<void> => {
    fastify.post("/upload-image" , {
        preHandler: authMiddleware,
        handler: UploadImage
    })
    fastify.post("/upload-video" , {
        preHandler: authMiddleware,
        handler: UploadVideo
    })
}