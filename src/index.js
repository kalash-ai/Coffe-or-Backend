import express from 'express'
import dotenv from "dotenv"
// import { Express } from "express";
import connectDB from "./db/index.js";

import {app} from './app.js'
dotenv.config({
    path: './env'
})



// Connectin the DB
connectDB()
.then(()=>{

      
    app.listen(process.env.PORT || 3000, ()=>{
        console.log(`SERVER IS RUNNING AT PORT ${process.env.PORT}`)
    })
   
})
.catch((err)=>{
    console.log("MONGO DB CONNECTION FAILED " ,err)
})





















































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


// At top
*/
// require('dotenv').config({path : './env'})


// manually added by me
// const app = require('express')
// ++++++++++++++++++++++++++++++++++++++++++++++++
