import {type FastifyPluginAsync } from "fastify"
import { getCurrentUser, login, logout, signup } from "../controllers/authUser.js"


export const userRoutes: FastifyPluginAsync = async (fastify, options): Promise<void> => {
    fastify.post("/signup" , signup)
    fastify.post("/signin" , login)
    fastify.get("/me" , getCurrentUser)
    fastify.post("/logout" , logout)
}   