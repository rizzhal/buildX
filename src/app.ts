import fastify from "fastify";

const app = fastify(
    {
        logger:true
    }
)
import * as dotenv from "dotenv"

dotenv.config();

export default app;