import mongoose from "mongoose";

const connectToDb = async () => {
    try {

        if (mongoose.connections[0].readyState) {
            return;
        }

        const connection = await mongoose.connect(process.env.MONGODB_URI);
        if (connection) {
            console.log("Connected to Database");
        }
        return connection;
    } catch (error) {
        console.error("An error occurred in connecting to DB:", error);
        throw error;
    }
}

export default connectToDb;