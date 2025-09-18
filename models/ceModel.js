import mongoose from "mongoose";
const ceSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    email:{
        type: String,
        required:true,
    },
    age:{
        type:Number,
        min:0,
        required:true ,
    },
    qualification: {
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    gender: {
        type: String,
        required:true,
    },
}, {timestamps:true})
const ceModel = await mongoose.model("CeModel", ceSchema)
export default ceModel ;