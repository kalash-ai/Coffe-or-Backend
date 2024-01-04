// Made 2 models User And Video Model

import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        // to search the data
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true

    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, //Cloudinary url
        required: true,
    },
    coverImage: {
        type: String, //Cloudinary url

    },
    watchistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, 'Password is Required'],
    },
    refreshToken: {
        type: String,

    },


}, {
    timestamps: true
})



// dont use Arro Function
userSchema.pre("save", async function(err, req, res, next){
if(!this.isModified("password")) return next()

    this.password = bcrypt.hash(this.password, 10)
next()
})
userSchema.methods.isPasswordCorrect = async function (password){
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken =function(){
   return jwt.sign(
        {
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName :this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn :process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}
userSchema.methods.generateRefreshToken =function(){

    return jwt.sign(
        {
        _id:this._id,
        
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn :process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}
export const User = mongoose.model