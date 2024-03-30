
import mongoose from "mongoose";

import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.AtlasURL;

export const connectDB = async ()=>{
    try {
        const connection = await mongoose.connect(connectionString);
        console.log(`Successfully connected with MongoDB!`);
        return connection;

    } catch (error) {
        console.log(`Error while connecting with atlas mongodb : ${error}`);
    }
}