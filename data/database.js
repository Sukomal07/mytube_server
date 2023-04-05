import mongoose from "mongoose";

export const connectDb= () =>{
    mongoose.connect(process.env.MONGO,{
        dbName:"mytube"
    })
    .then(()=>{
        console.log("database connection successful")
    }).catch((err) =>{
        console.log(err);
    })
}