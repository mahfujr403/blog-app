import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blog_app';

const Database = {}
Database.connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected successfully at", MONGO_URI);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

export { Database };