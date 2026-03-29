import mongoose from "mongoose";

declare global {
  // Prevent multiple connections in Next.js hot-reload
  // eslint-disable-next-line no-var
  var _mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

if (!global._mongooseCache) {
  global._mongooseCache = { conn: null, promise: null };
}

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set. See .env.local.example.");
  }

  if (global._mongooseCache.conn) {
    return global._mongooseCache.conn;
  }

  if (!global._mongooseCache.promise) {
    global._mongooseCache.promise = mongoose.connect(uri, {
      bufferCommands: false,
    });
  }

  global._mongooseCache.conn = await global._mongooseCache.promise;
  return global._mongooseCache.conn;
}
