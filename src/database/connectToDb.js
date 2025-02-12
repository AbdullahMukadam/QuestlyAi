import mongoose from "mongoose";

const connectToDb = async () => {
    try {
        const status = await mongoose.connect(process.env.MONGODB_URI)
        if (status) {
            console.log("Connected to Database")
        }
    } catch (error) {
        console.error("An error occured in connecting to Db")
    }
}

export default connectToDb;