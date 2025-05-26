import mongoose from "mongoose";
import User from "./Users.js";

const bookShema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    caption:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    rating:{
        type:String,
        required:true,
        min:1,
        max:5
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
    }
},{timestamps:true})

const Book=mongoose.model("Book",bookShema)
export default Book