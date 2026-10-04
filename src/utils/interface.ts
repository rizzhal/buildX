

// This is for upload images and videos

export interface UploadPolicy {
    allowedTypes: string[];
    maxBytes: number;
    subDir: string;
}



export interface SavedFile {
    fileName: string;
    size: number;
    originalName: string;
    mimeType: string;
}
