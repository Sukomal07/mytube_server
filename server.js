import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import {connectDb} from './data/database.js'
import cors from 'cors'

import authRoutes from './routes/auth.js'
import userRoutes from'./routes/users.js'
import videoRoutes from './routes/videos.js'
import commentRoutes from './routes/comment.js'

const app = express()
dotenv.config()


//middlewars
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://mytube-sukomal07.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(cookieParser())
app.use(express.json())
app.use("*",
    cors({
        origin:[process.env.FRONTTEND_URL],
        methods:["GET","POST","PUT","DELETE"],
        credentials:true,
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["Content-Disposition"],
    })
)

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/videos", videoRoutes)
app.use("/api/comments", commentRoutes)

app.use((err, req, res , next) =>{
    const status = err.status || 500
    const message = err.message || "Something went wrong , Please check again"
    return res.status(status).json({
        success:false,
        status,
        message
    })
})

app.get("/", (req, res) =>{
    res.send("<h1>WORKING</h1>")
})

//running app
app.listen(process.env.PORT , ()=>{
    connectDb()
    console.log(`server is working on port: ${process.env.PORT}`)
})