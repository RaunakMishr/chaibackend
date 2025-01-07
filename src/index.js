//require('dotenv').config({path: './env'})
import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose";
import app from "./app.js"
 //database connection code
import constants from "./constants.js";
const { DB_NAME } = constants;
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})
//start server here
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000),()=>{
        console.log(`Server is running at port: ${process.env.PORT}`

    )};
})
.catch((err)=>{
    console.log("MongoDb connection failed !!!",err);
    
})



// import express from "express";
// const app = express()
// //effi
// ;(async () => {
//     try{
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//        app.on("error", (error)=>{
//         console.log("error", error);
//         throw error
        
//        })
//        app.listen(process.env.PORT,()=>{
//         console.log(`App is listening on port ${process.env.PORT}`)
//        })
//     }
//     catch(error){
//         console.log("Error", error);
        
//     }
// })() //effi