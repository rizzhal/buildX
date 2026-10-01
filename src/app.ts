import * as dotenv from "dotenv"
dotenv.config();
import fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import { userRoutes } from "./routes/authRoute.js";
import { userSchema } from "./models/user.model.js";


const app = fastify(
    {
        logger:true,
    }
)

await userSchema();

app.register(fastifyCookie , {
    secret: "cookieSecret",
    hook: "onRequest"
}) 

app.register(userRoutes , { prefix : '/api' })



export default app;