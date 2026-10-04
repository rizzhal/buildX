import path from 'path';
import type { UploadPolicy } from '../../utils/interface.js';


export const UPLOAD_ROOT_DIR = path.join(process.cwd() , './uploads')

const IMAGE_TYPE = ['image/jpeg' , 'image/png', 'image/wepb' ,'image/gif']
const VIDEO_TYPE = ['video/mp4' , 'video/webm' , 'video/quicktime']

export const ImagePolicy: UploadPolicy = {
    allowedTypes: IMAGE_TYPE,
    maxBytes: 10 * 1024 * 1024,
    subDir: 'images'
}

export const VideoPolicy: UploadPolicy = {
    allowedTypes: VIDEO_TYPE,
    maxBytes: 200 * 1024 * 1024,
    subDir: 'videos'
}