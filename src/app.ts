import fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import * as dotenv from "dotenv"

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



export default app;