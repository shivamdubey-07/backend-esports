import mongoose from "mongoose";


export const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log("connected to db");
    }
    catch(err){
       res.status(500).json(err);
    }
}
