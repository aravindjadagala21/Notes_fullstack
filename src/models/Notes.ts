import mongoose,{models,Document,Schema, Mongoose} from "mongoose";

export interface Inote extends Document{
    user:mongoose.Types.ObjectId,
    title:string,
    content:string

}

const NotesSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required : true,

    },
    title:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true
    }
})
export default models.INotes || mongoose.model<Inote>("INotes",NotesSchema)