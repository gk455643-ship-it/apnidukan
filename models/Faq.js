const mongoose=require("mongoose")

const FaqSchema=new mongoose.Schema({
    question:{
        type:String,
        unique:true,
        required:[true,"Faq Question is Mandatory"]
    },
    answer:{
        type:String,
        required:[true,"Faq Answer is Mandatory"]
    },
    status:{
        type:Boolean,
        default:true,
    },
},{timestamps:true})

const Faq=mongoose.model("Faq",FaqSchema)
module.exports=Faq