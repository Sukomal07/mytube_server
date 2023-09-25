import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { connectDb } from './data/database.js'
import cors from 'cors'
import path from 'path'

import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import videoRoutes from './routes/videos.js'
import commentRoutes from './routes/comment.js'

const app = express()
dotenv.config()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/videos", videoRoutes)
app.use("/api/comments", commentRoutes)

app.use((err, req, res, next) => {
    const status = err.status || 500
    const message = err.message || "Something went wrong , Please check again"
    return res.status(status).json({
        success: false,
        status,
        message
    })
})

app.use(express.static(path.join(__dirname, '../client/build')))

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "../client/build/index.html"))
})

app.get("/", (req, res) => {
    res.send("<h1>WORKING</h1>")
})

//running app
app.listen(process.env.PORT, () => {
    connectDb()
    console.log(`server is working on port: ${process.env.PORT}`)
})