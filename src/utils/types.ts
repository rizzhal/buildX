
export type SignupBody = {
    name: string,
    email: string,
    password: string
}

export type SigninBody = {
    email: string,
    password: string
}

export type PoolConfig = {
    user? : string,
    password? : string,
    host? : string,
    port?: number,
    database? : string
}
