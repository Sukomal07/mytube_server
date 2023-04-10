import express from 'express'
import { googleAuth, signin, signout, signup } from '../controllers/auth.js'

const router = express.Router()
//create a user
router.post("/signup" , signup)
//sign in
router.post("/signin" , signin)
//google Auth
router.post("/google", googleAuth)

// signout
router.post("/signout" , signout)


export default router