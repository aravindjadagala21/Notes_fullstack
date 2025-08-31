import mongoose,{Schema,Document,models} from "mongoose";
export interface Iuser extends Document{
    email:string,
    password?:string,
    googleId?:string
}

const UserSchema = new Schema<Iuser>(
    {
        email:{
            type:String,
            required:true,
            unique:true
        },
        password: { type: String },
        googleId: { type: String },
    }
    ,
    {timestamps:true}
)
export default models.Note || mongoose.model<Iuser>("User",UserSchema)