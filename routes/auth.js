import express from 'express'
import { signin, signup } from '../controllers/auth.js'

const router = express.Router()
//create a user
router.post("/signup" , signup)
//sign in
router.post("/signin" , signin)
//google Auth
router.post("/google")


export default router