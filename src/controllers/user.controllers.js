import { asyncHandler } from "../utils/asyncHandler.js";
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req,res)=>{
//get user Details from front end 
// Validation 
// check if user already Exist 
// check for images, check for avatar => bit confusin
// upload them to cloudinary, avatar => no idead I WILL LEARN LEARN AND STUDY ABOUT IT
// create passworduser object => create entry in db
// remove  and refresh token from response
// check for user creation 
// return response :)
 const {fullName, email, password, username} = req.body
 console.log(req.body)
console.log("Email : " , email)


if([fullName, email , username , password].some((field) => field?.trim ()== "")
){
    throw new ApiError (400 , "All fields Are Required")
}
const existedUser = await User.findOne({
    $or: [{fullName} , {email}]
})

if(existedUser){
    throw new ApiError(409, "User With Following Username or email already Exist")
}

console.log(req.files)
const avatarLocalPath = req.files?.avatar[0]?.path;
// const coverImageLocalPath = req.files?.coverImage[0]?.path

let coverImageLocalPath;
if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
    coverImageLocalPath= req.files.coverImage[0].path
}



if(!avatarLocalPath){
    throw new ApiError (400 , "Avatar Image is Required")
}

const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath)
if(!avatar){
    throw new ApiError (400 , "Avatar Image is Required")
}
const user = await User.create({
    fullName,
    avatar : avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username :username.toLowerCase()
})

// checkUser
const userFind = await User.findById(user._id).select(
    "-password -refreshToken"
    )
    if(!userFind){
        throw new ApiError(500, "Something went wrong while Registering The User")
}
return res.status(201).json(
    new ApiResponse(200, userFind, "User Registred Successfully")
)

} )

export {
    registerUser
    
} 
// basic usecase or normal use case
// if(fullName === ""){
//     throw new ApiError(400, "Full Name is required") 
// }