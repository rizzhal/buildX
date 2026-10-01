
export type SignupBody = {
    name: string,
    email: string,
    password: string
}

export type SigninBody = {
    email: string,
    password: string
}

// export type PoolConfig = {
//     user? : string | undefined,
//     password? : string | undefined,
//     host? : string | undefined,
//     port?: number | undefined,
//     database? : string | undefined
// }
