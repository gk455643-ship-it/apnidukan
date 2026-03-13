const mongoose=require("mongoose")

const NewsletterSchema=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:[true,"Email Address is Mandatory"]
    },
    status:{
        type:Boolean,
        default:true,
    },
},{timestamps:true})

const Newsletter=mongoose.model("Newsletter",NewsletterSchema)
module.exports=Newsletter