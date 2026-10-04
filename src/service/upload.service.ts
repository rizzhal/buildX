
import { UploadError } from "../errors/upload.error.js";
import { UPLOAD_ROOT_DIR } from "../config/db/upload.config.js";
import fs from 'fs';
import path from "path";
import type { MultipartFile } from "@fastify/multipart";
import type { SavedFile, UploadPolicy } from "../utils/interface.js";
import { randomUUID } from "crypto";
import { pipeline } from "stream/promises";


// service function for uploading files in the browser using Multipart/form data;


export const saveUpload = async (

    file: MultipartFile | undefined,

    policy: UploadPolicy,

): Promise<SavedFile> => {

    if(!file) {
        throw new UploadError('Please upload your file' , 400)
    }

    if (!policy.allowedTypes.includes(file.mimetype)){
        file.file.resume();
        throw new UploadError(`Unsupported file format : ${file.mimetype}` , 415)
    }

    const dir = path.join(UPLOAD_ROOT_DIR , policy.subDir)
    await fs.promises.mkdir( dir , { recursive: true} )


    const ext = path.extname(file.filename).toLowerCase();
    const fileName = `${randomUUID()}${ext}`
    const fullPath = path.join(dir , fileName)


    try {

        await pipeline(file.file , fs.createWriteStream(fullPath))

    } catch (error) {
        await fs.promises.unlink(fullPath).catch(() => {})
        throw error;
    }

    if(file.file.truncated){
        await fs.promises.unlink(fullPath).catch(() => {})
        throw new UploadError('File too large' , 413)
    }

    const { size } = await fs.promises.stat(fullPath)
    console.log(size);
    return {
        originalName:file.filename,
        size,
        mimeType: file.mimetype,
        fileName

    }

}