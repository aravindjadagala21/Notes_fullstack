import mongoose, { Mongoose } from "mongoose";

const M_URL = process.env.MONGODB_URI as string;


if (!M_URL) {
  throw new Error("Please define the MongoDB URL in MONGODB_URI");
}

declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  } | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB(): Promise<Mongoose> {
  if (cached!.conn) return cached!.conn;
  if (!cached!.promise) {
    cached!.promise = mongoose.connect(M_URL, { bufferCommands: false });
  }
  try {
    cached!.conn = await cached!.promise;
    console.log("connected...")
  } catch (err) {
    console.log("not connected...")
    cached!.promise = null;
    throw err;
  }
  return cached!.conn!;
}

export default connectDB;
