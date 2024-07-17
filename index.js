import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config({
    path:"./.env"
})

import cookieParser from "cookie-parser";


import userRouter from "./routes/user.routes.js"

import {connectDb} from "./db/db.js"


const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin:"*",
    credentials:true
}))
app.use("/api",userRouter)
connectDb()




app.get("/",(req,res)=>{
    res.send("Hello World");
})

app.listen(9000,()=>{
    console.log("listening on port 9000");
})



