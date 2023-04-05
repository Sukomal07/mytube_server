import Comment from '../models/comment.js'
import Video from '../models/video.js'
import { createError } from '../error.js'
export const addComment = async (req , res, next) =>{
    const {videoId, desc} = req.body

    if(!videoId){
        return next(createError(400, "Please Provide a Valid video id"))
    }
    const newComment = new Comment({userId:req.user.id, desc, videoId})
    try {
        const saveComment = await newComment.save()
        res.status(200).send(saveComment)
    } catch (error) {
        next(error)
    }
}
export const deleteComment = async (req , res, next) =>{
    try {
        const comment = await Comment.findById(req.params.id)
        if(!comment){
            return next(createError(404, "Comment not found"))
        }
        if(req.user.id != comment.userId){
            return next(createError(403, "You can delete only your Comment"))
        }
        await Comment.findByIdAndDelete(req.params.id)
        res.status(200).json("Successfully deleted")
        
    } catch (error) {
        next(error)
    }
}
export const getComments = async(req , res, next) =>{
    try {
        const comments = await Comment.find({videoId:req.params.videoId})
        res.status(200).json(comments)
    } catch (error) {
        next(error)
    }
}