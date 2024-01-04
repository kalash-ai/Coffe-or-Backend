// require('dotenv').config({path : './env'})


// manually added by me
// const app = require('express')
// ++++++++++++++++++++++++++++++++++++++++++++++++

import dotenv from "dotenv"

import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})



// Connectin the DB
connectDB()
.then(()=>{

      
    app.listen(process.env.PORT || 8000, ()=>{
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
*/
