import express from 'express'
import { addComment, deleteComment, editComment, getComments } from '../controllers/comment.js'
import {verifyToken} from '../verifyToken.js'

const router = express.Router()

router.post("/",verifyToken, addComment)
router.delete("/:id",verifyToken, deleteComment)
router.get("/:videoId", getComments)
router.put("/:id", verifyToken, editComment)


export default router