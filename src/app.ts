import fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import * as dotenv from "dotenv"
import { userRoutes } from "./routes/authRoute.js";

dotenv.config();

const app = fastify(
    {
        logger:true,
    }
)

app.register(fastifyCookie , {
    secret: "cookieSecret",
    hook: "onRequest"
}) 

app.register(userRoutes , { prefix : '/api' })



export default app;