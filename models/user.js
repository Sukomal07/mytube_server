import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
        select:false
    },
    img:{
        type:String
    },
    subscribers:{
        type:Number,
        default:0
    },
    subscribedUser:{
        type:[String]
    },
    fromGoogle:{
        type:Boolean,
        default:false
    }
},{timestamps:true}
)
export default mongoose.model("User",UserSchema)