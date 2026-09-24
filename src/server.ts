
import app from "./app.js";

interface EnvConfig {
    PORT: string,
    DB_HOST: string
}

const env = process.env as unknown as EnvConfig

const port = parseInt(env.PORT , 10) || 3000

if(!port){
    throw new Error('Error Port required')
}

app.listen( {port}, () => {
    console.log(`server running on port ${port}`)
})