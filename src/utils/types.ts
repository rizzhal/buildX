
export type SignupBody = {
    name: string,
    email: string,
    password: string
}

export type SigninBody = {
    email: string,
    password: string
}

export type PostsBody = {
    content: string,
    media_type: string,
    thumbnail_url?: string
}

// export type PoolConfig = {
//     user? : string | undefined,
//     password? : string | undefined,
//     host? : string | undefined,
//     port?: number | undefined,
//     database? : string | undefined
// }

export type FileType = {
    allowedTypes: string[],
    maxBytes: number,
    subDir: string
}