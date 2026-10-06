import type { FastifyReply, FastifyRequest } from "fastify";
import type { UploadPolicy } from "../utils/interface.js";
import { InternalError } from "../errors/upload.error.js";
import { saveUpload } from "../service/upload.service.js";
import { ImagePolicy, VideoPolicy } from "../config/db/upload.config.js";


const createUploadHandler = (policy: UploadPolicy) => 

    async(request: FastifyRequest , reply: FastifyReply): Promise<void> => {

        try {
        
        const file = await request.file({ limits: { fileSize: policy.maxBytes } })

        const save = await saveUpload(file , policy);

        return reply.code(201).send(save);

         } catch {
            throw new InternalError('Something went wrong in the upload controller' , 500)
        }
    }
    
    export const UploadImage = createUploadHandler(ImagePolicy);
    export const UploadVideo = createUploadHandler(VideoPolicy);