import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { connection } from "../db/connect.js";

declare module "fastify" {
    interface FastifyRequest {
        user: {
            id: string;
            email: string;
        };
    }
}

const COOKIE_NAME = "token"

export const authMiddleware = async (request: FastifyRequest , reply: FastifyReply) => {

    const token = request.cookies[COOKIE_NAME]

        if(!token){
            return reply.status(401).send({ message: "Not a valid token" })
        }

        
        let decoded: jwt.JwtPayload & {userId : string , email: string}

        try {
            decoded = jwt.verify(token , process.env.JWT_SECRET!) as jwt.JwtPayload &
            {
                userId: string,
                email: string
            }
        } catch {
            return reply.status(401).send({message: "Not a valid access token"})
        }

        try {
            const  existingUser = connection.query(
                `
                SELECT id, email FROM userSchema.users
                WHERE id = $1
                `,
                [decoded.userId]
            )

            if((await existingUser).rows.length === 0){
                return reply.status(401).send({ message: "User not exists"})
            }
            
            request.user = { id: (await existingUser).rows[0].id, email: (await existingUser).rows[0].email }

        } catch (error:unknown) {
            if(error instanceof Error){
                reply.status(500).send({message: "Internal server error"})
            }
        }
}