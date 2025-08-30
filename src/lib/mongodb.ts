
import mongoose from "mongoose";


const M_URL = "mongodb://127.0.0.1:27017/notes-app"
console.log(M_URL)

if(!M_URL) {
    throw new Error("please define mongodb url")
}

let cached = (global as any).mongoose

if(!cached){
    cached = (global as any).mongoose = {conn:null,promise:null}
}

async function connectDB() {
    if(cached.conn) return cached.conn
    if(!cached.promise){
        cached.promise = mongoose.connect(M_URL).then( m => m) 
    }
    cached.conn = await cached.promise;
    return cached.conn
}
export default connectDB

