import * as dotenv from "dotenv"
dotenv.config();
import fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import { userRoutes } from "./routes/auth.route.js";
import { PostsSchema, userSchema } from "./models/build.model.js";
import fastifyMultipart from "@fastify/multipart";
import { postRoutes } from "./routes/posts.route.js";



const app = fastify(
    {
        logger:true,
    }
)

await userSchema();
await PostsSchema();

app.register(fastifyCookie , {
    secret: "cookieSecret",
    hook: "onRequest"
}) 

app.register(userRoutes , { prefix : '/api' });
app.register(postRoutes , { prefix: '/api' })

app.register(fastifyMultipart , {
    limits: {
        fileSize: 10 * 1024 * 1024,   // 10mb,
        files: 1           // No of files
    }
})


export default app;