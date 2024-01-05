const asyncHandler = (requestHandler)=>{
 return (req,res,next)=>{
    Promise.resolve(requestHandler(req,res,next)).catch
    ((err)=> 
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