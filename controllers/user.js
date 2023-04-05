import { createError } from "../error.js"
import User from '../models/user.js'
import Video from '../models/video.js'
export const update = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            const updateUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            },{
                new:true
            });
            res.status(200).json(updateUser);
        } catch (error) {
            next(error);
        }
    } else {
        return next(createError(403, "You are not allowed to do this"));
    }
};

export const deleteUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("User has been deleted");
        } catch (error) {
            next(error);
        }
    } else {
        return next(createError(403, "You are not allowed to do this"));
    }
}
export const getUser = async(req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}
export const subscribe = async(req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id,{
            $push: {subscribedUser:req.params.id}
        })
        await User.findByIdAndUpdate(req.params.id,{
            $inc:{subscribers:1 }
        })
        res.status(200).json("Subscription success")
    } catch (error) {
        next(error)
    }
}
export const unSubscribe = async(req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id,{
            $pull: {subscribedUser:req.params.id}
        })
        await User.findByIdAndUpdate(req.params.id,{
            $inc:{subscribers: -1 }
        })
        res.status(200).json("Un Subscription success")
    } catch (error) {
        next(error)
    }
}
export const like = async(req, res, next) => {
    const id = req.user.id
    const videoId = req.params.videoId
    try {
        await Video.findByIdAndUpdate(videoId,{
            $addToSet:{likes:id},
            $pull:{dislikes:id}
        })
        res.status(200).json("The video has been liked")
    } catch (error) {
        next(error)
    }
}
export const disLike = async(req, res, next) => {
    const id = req.user.id
    const videoId = req.params.videoId
    try {
        await Video.findByIdAndUpdate(videoId,{
            $addToSet:{dislikes:id},
            $pull:{likes:id}
        })
        res.status(200).json("The video has been dislike")
    } catch (error) {
        next(error)
    }
}