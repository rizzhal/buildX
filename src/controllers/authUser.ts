
import type { FastifyRequest , FastifyReply } from "fastify";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import type { SignupBody, SigninBody } from "../utils/types.js";
import type { Secret , SignOptions } from "jsonwebtoken";
import { connection } from "../config/db/connect.js";




export const signup = async (request: FastifyRequest<{Body: SignupBody}>, reply: FastifyReply ):Promise<void> => {
    
    try {

    const {name , email, password} = request.body 

    if(!name || !email || !password) {

        return reply.status(400).send({message: "Invalid inputs"})
    }

    const existingUser = await connection.query(
        `SELECT id 
         FROM userSchema.users
         WHERE email = $1
         `,
         [email]
    )

    if(existingUser.rows.length > 0){
        return reply.status(409).send({ message: 'User already exists' })
    }

    const passHash:string = await bcrypt.hash(password , 10)

    const result = await connection.query(
        ` 
        INSERT INTO userSchema.users
             (name, email, password_hash)
        VALUES
             ($1, $2, $3)
        RETURNING id, name, email, is_active, created_at, updated_at
        `,
             [name , email, passHash]
    );

    return reply.status(201).send({
        message: 'User created successfully',
        user: result.rows[0]
    })
    } catch (error:unknown) {
        if(error instanceof Error){
            reply.status(500).send({message: 'Internal server error'})
        } else {
            console.error("Something went wrong" , error)
        }
    }
}

export const login = async(request: FastifyRequest<{Body: SigninBody}>, reply: FastifyReply):Promise<void> => {
    
    try {
        
    const {email , password} = request.body

    if(!email || !password){
        return reply.status(500).send({message: 'Something went wrong'})
    }

    const existingUser = await connection.query(
        `
         SELECT id 
         FROM userSchema.users
         WHERE email = $1 AND
         `,
         [email]
    )
    if(existingUser.rows.length > 0){
        return reply.status(409).send({message: `User already exists`})
    }

    const isMatch = await bcrypt.compare(password , existingUser.rows[0].password)
    
    if(!isMatch){
        throw new Error("Something went wrong")
    }
    
    const payload = { 
        userId: existingUser.rows[0].id
     }
    
    const SECRET: Secret = process.env.JWT_SECRET || 'default-secret'
    const EXPIRY: SignOptions['expiresIn'] = process.env.JWT_EXPIRY as SignOptions['expiresIn'] || '1h' 

    const token = jwt.sign(payload , SECRET , 
        { expiresIn: EXPIRY }
     )

     console.log(token)

     if(!token){
        throw new Error("something went wrong in logging in")
     }

     reply.setCookie('token' , token ,{
        path: '/',
        sameSite:"lax",
        httpOnly:true,
        secure: "auto",
        maxAge:86400
     })

     return reply.status(201).send({message: "User logged in successfully"})

      } catch (error : unknown) {

        if(error instanceof Error){

            reply.status(500).send({ message: " Error logging in " })
        }
    }

}

export const logout = async (request:FastifyRequest , reply: FastifyReply) => {
    try {
        reply.clearCookie('token', {
            path:"/",
            sameSite:"lax",
            httpOnly:true,
            secure:"auto",
            maxAge:86400
        })
        return reply.status(201).send({message: "User logged out successfully"})
    } catch (error: unknown) {
        if(error instanceof Error){
            reply.status(500).send({message: "Error logging out" })
        } else {
            console.error("Internal server error" , error)
        }
    }
}

export const getCurrentUser = async (request:FastifyRequest , reply: FastifyReply) => {
    try {
        const currentUser = await connection.query(
            `
            SELECT id , name , email, is_active, created_at, updated_at 
            FROM userSchema.users
            where id = $1
            `,

        )
        const userId = currentUser.rows[0]
        
        if(!userId){
            return reply.status(404).send({ message: "User not found" })
        }

        return reply.status(200).send({message: "success" ,
            userId
        })

    } catch (error : unknown) {
        if(error instanceof Error)
        {
            reply.status(500).send({ message: "Error getting user" })
        } else {
            console.error("Internal server error" , error)
        }
    }
}