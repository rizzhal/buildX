export class UploadError extends Error {
    constructor(message: string , public readonly statusCode: number){
        super(message)
        this.name = 'UploadError'
    }
}

export class InternalError extends Error {
    constructor(message: string , public readonly statusCode: number){
        super(message)
        this.name = 'Internal server error'
    }
}