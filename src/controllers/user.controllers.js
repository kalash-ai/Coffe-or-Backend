import { asyncHandler } from "../utils/asyncHandler.js";
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import jwt from 'jsonwebtoken'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId)=>{
    try{
        const user = await User.findById(userId)
   const accessToken = user.generateAccessToken()
   const refreshToken = user.generateRefreshToken()
   user.refreshToken = refreshToken
   await user.save({validateBeforeSave:false})
        return {accessToken , refreshToken}

}catch(err){
        throw new ApiError(500, 'Something went wrong while generating Refresh and Access Token')
    }
}

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

// export {
//     registerUser
    
// } 


// req,body = get data
// Username or email
// find the user
// password check
// acess and refresh token
// send cookie
 const loginUser = asyncHandler(async (req,res)=>{
      const {email, username , password} = req.body
      console.log(`Entered Email is ${email}`)
       if(!username && !email){
        throw new ApiError(400, 'Username or password is required')
       }
            const user = await User.findOne({
            $or: [{username} , {email}]
        })
        if(!user){
            throw new ApiError(400,'User does not exist')
        }
        const isPasswordValid=await user.isPasswordCorrect(password)
        if(!isPasswordValid){
            throw new ApiError(401, 'Invalid User crediantials')
        }
         const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id)
        
      
    const loggedInUser = await User.findById(user._id)
      .select("-password -refreshToken")
    
      const options ={
        httpOnly: true,
        secure: true
      }
      return res.status(200).cookie("accessToken" , accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(200, 
            {
                user: loggedInUser,accessToken, refreshToken
            },
            "User Logged In Successfully"
            )
      )
    })

    const logoutUser = asyncHandler(async(req,res)=>{
        
      await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset:{
                    refreshToken : 1
                }
              
            },{
                new : true
            }
        )
        const options ={
            httpOnly: true,
            secure: true
          }
          return res.
          status(200)
          .clearCookie("accessToken", options)
          .clearCookie('refreshToken', options)
          .json(new ApiResponse (200, {}, "User Logged Out Successfully"))


    })

    const refreshAccessToken = asyncHandler(async(req,res)=>{
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if(incomingRefreshToken){
        throw new ApiError(401, "Unauthorized Request")
    }
    
try {
       const decodedToken =  jwt.verify(
            incomingRefreshToken, 
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?.id)
       if(!user){
        throw new ApiError(401, "Invalid Refresh Token")
       }
       if(incomingRefreshToken !== user?.refreshToken){
        throw new ApiError(401, 'Refresh Token is expired or used')
       }
       const options = {
        httpOnly :true,
        secure : true
       }
       
       const {accessToken, newrefreshToken} = await generateAccessAndRefreshToken(user._id)
       
       return res.status(200)
       .cookie("acessToken" ,accessToken, options)
       .cookie("refreshToken" , newrefreshToken, options)
       .json(
        new ApiResponse(200,
            {accessToken, refreshToken: newrefreshToken},
            "Acess Token Refreshed Successfully"
        ))
        
} catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token")
}
})
    


    export {
        registerUser,
        loginUser,
        logoutUser,
        refreshAccessToken
    }
// basic usecase or normal use case
// if(fullName === ""){
//     throw new ApiError(400, "Full Name is required") 
// }