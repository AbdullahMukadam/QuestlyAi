"use server"
import connectToDb from "@/database/connectToDb";
import Profile from "@/Models/Profile";

export async function fetchUserDetails(userId) {
    try {
        await connectToDb()

        if (!userId) {
            throw new Error("UserId is required")
        }

        const fetchedUserDetails = await Profile.findOne({ userId })

        if (!fetchedUserDetails) {
            throw new Error("User Not Found")
        }

        return {
            success: true,
            userDetails: fetchedUserDetails,
            message: "Fetched user Details Successfully"
        }

    } catch (error) {
        console.error("Error in fetchUserDetails:", error);
        return {
            success: false,
            message: error.message || "Internal Server Error"
        }
    }
}

export async function createUserProfile(userData) {
    try {
        await connectToDb()

        const User = await Profile.create(userData)
        if (!User) {
            throw new Error("Unable to create the user")
        }

        return {
            success: true,
            user: User,
            message: "User Successfully Created"
        }

    } catch (error) {
        console.error("Error in createUserProfile:", error);
        return {
            success: false,
            message: error.message || "Internal Server Error"
        }
    }
} 