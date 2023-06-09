import express from 'express'
import { deleteUser, disLike, getUser, like, subscribe, unSubscribe, update } from '../controllers/user.js'
import { verifyToken } from '../verifyToken.js'

const router = express.Router()

//update a user
router.put("/:id", verifyToken, update)

//delete a user
router.delete("/:id" , verifyToken, deleteUser)

//get a user
router.get("/find/:id",getUser)

//subscribe user
router.put("/sub/:id",verifyToken, subscribe)

//unsubscribe user
router.put("/unsub/:id",verifyToken, unSubscribe)

//like a video
router.put("/like/:videoId",verifyToken, like)

//dislike a video

router.put("/dislike/:videoId",verifyToken, disLike)



export default router