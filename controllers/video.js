import Video from '../models/video.js'
import User from '../models/user.js'
import {createError} from '../error.js'

export const addVideo = async (req , res ,next) =>{
    const newVideo = new Video({ userId: req.user.id, ...req.body})

    try {
        const savedVideo = await newVideo.save()
        res.status(200).json(savedVideo)
    } catch (error) {
        next(error)
    }
}
export const updateVideo = async (req , res ,next) =>{
    try {
        const video = await Video.findById(req.param.id)
        if(!video) return next(createError(404, "Video not found"))
        if(req.user.id === video.userId){
            const updatedVideo = await Video.findByIdAndUpdate(
                req.param.id,
                {
                    $set:req.body
                },{
                    new:true
                })
                res.status(200).json(updatedVideo)
        }else{
            return next(createError(403, "You can update only your video"))
        }
    } catch (error) {
        next(error)
    }
}
export const deleteVideo = async (req , res ,next) =>{
    try {
        const video = await Video.findById(req.param.id)
        if(!video) return next(createError(404, "Video not found"))
        if(req.user.id === video.userId){
            await Video.findByIdAndDelete(
                req.param.id,
            )
            res.status(200).json("The Video has been deleted")
        }else{
            return next(createError(403, "You can delete only your video"))
        }
    } catch (error) {
        next(error)
    }
}
export const getVideo = async (req , res ,next) =>{
    try {
        const video = await Video.findById(req.params.id)
        res.status(200).json(video)
    } catch (error) {
        next(error)
    }
}

export const addView = async (req, res , next) =>{
    try {
        await Video.findByIdAndUpdate(
            req.params.id,{
                $inc:{videoViews:1}
            }
        )
        res.status(200).json("The view has been updated")
    } catch (error) {
        next(error)
    }
}
export const random = async (req, res , next) =>{
    try {
        const videos = await Video.aggregate([{$sample:{size: 40}}])
        res.status(200).json(videos)
    } catch (error) {
        next(error)
    }
}
export const trend = async (req, res , next) =>{
    try {
        const videos = await Video.find().sort({videoViews:-1})
        res.status(200).json(videos)
    } catch (error) {
        next(error)
    }
}
export const sub = async (req, res , next) =>{
    try {
        const user = await User.findById(req.user.id)
        const subscribedChannels = user.subscribedUser

        const list = await Promise.all(
            subscribedChannels.map((channelid) =>{
                return Video.find({userId:channelid})
            })
        )
        res.status(200).json(list.flat().sort((a,b) => b.createdAt - a.createdAt))
    } catch (error) {
        next(error)
    } 
}

export const getByTag = async (req, res, next) => {
    const search = req.query.search;
    try {
    const videos = await Video.find({ tags: { $regex: new RegExp(search, "i") } }).limit(20);
    res.status(200).json(videos);
    } catch (error) {
    next(error);
    }
};

export const search = async (req, res , next) =>{
    const query = req.query.q
    try {
        const videos = await Video.find({ title:{ $regex:query, $options:"i"},}).limit(40)
        res.status(200).json(videos)
    } catch (error) {
        next(error) 
    }
}
