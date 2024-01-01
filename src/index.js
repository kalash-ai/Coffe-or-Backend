// require('dotenv').config({path : './env'})
import dotenv from "dotenv"
// import mongoose from "mongoose";
// import { DB_Name } from "./constant";
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})

connectDB()


// Basic Approach

/*import express from "express"
const app = express()
// IFEE Function
//  (; is for cleaning function)
;( async ()=>{
    try{
await mongoose.connect(`${process.env.MONGODB_URL}/${DB_Name}`)
app.on("error" , ()=>{
    console.log("Error" , (error)=>{
        throw error
    })
app.listen(process.env.PORT , ()=>{
    console.log(`App is listening on Port ${process.env.PORT}`)
})
})
    }catch(error){
        console.log(`Some Error Ocurred`)
        
    }
})()
*/