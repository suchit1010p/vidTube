import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const dbName = process.env.DB_NAME || DB_NAME;
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URL, {
            dbName: dbName
        });
        console.log(`\n MongoDB is connected !! DB host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("mongoDB connection error: ", error);
        process.exit(1);
    }
};

export default connectDB;