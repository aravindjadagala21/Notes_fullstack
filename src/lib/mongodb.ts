import mongoose, { Mongoose } from "mongoose";

const M_URL = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/notes-app";

if (!M_URL) {
  throw new Error("Please define the MongoDB URL in MONGODB_URI");
}

declare global {
  // eslint-disable-next-line no-var
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
  } catch (err) {
    cached!.promise = null;
    throw err;
  }
  return cached!.conn!;
}

export default connectDB;
