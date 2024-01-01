import mongoose from "mongoose";
import { DB_Name } from "../constant.js";
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_Name}`)
        console.log(`\n MongoDB Connected !! DB HOST : ${connectionInstance.connection.host}`)
        console.log("Printing task")
        console.log(connectionInstance.connection.host)

    } catch (err) {
        console.log("MONGO DB CONNECTION FAILED => " + err)
        process.exit(1)
    }
}
export default connectDB