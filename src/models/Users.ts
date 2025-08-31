import mongoose,{Schema,Document,models} from "mongoose";
export interface Iuser extends Document{
    email:string,
    password?:string,
    googleId?:string
    username:string,
    dob:Date
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
        username:{type:String},
        dob:{type:Date}
    }
    ,
    {timestamps:true}
)
export default models.User || mongoose.model<Iuser>("User",UserSchema)