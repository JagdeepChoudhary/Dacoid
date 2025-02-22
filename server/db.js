import mongoose from "mongoose";
const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGo_URI)
        console.log("DB connected Successfully")
    }
    catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
}
export default connectToDB