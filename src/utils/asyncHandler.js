const asyncHandler = (requestHandler)=>{
(req,res,next)=>{
    Promise.resolve(requestHandler).catch((err)=>
        next(err)
    )
}
}
export {asyncHandler}


// Using async And Await
// const asyncHandler =(fn)=> async (req, res, next)=>{
//     try{
//     await fn(req,res,next)
//     }catch(error){
//         res.status(err.code || 403).json({success : false, 
//         message : err.message})
//     }
// }