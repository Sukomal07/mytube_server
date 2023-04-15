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
    },
    history: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }]
},{timestamps:true}
)
export default mongoose.model("User",UserSchema)