"use server"
import connectToDb from "@/database/connectToDb";
import Profile from "@/Models/Profile";
import { revalidatePath } from "next/cache";



export async function fetchUserDetails(userId) {
    await connectToDb();
    const result = await Profile.findOne({ userId });

    return JSON.parse(JSON.stringify(result));
}

export async function createCandidateUserProfile(userData, pathtoRevalidate) {

    await connectToDb();

    const formattedData = {
        ...userData,
        isPremiumUser: userData.isPremiumUser ?? false,
        memberShipType: userData.memberShipType ?? 'free',
        memberShipStartDate: userData.memberShipStartDate ?? new Date().toISOString(),
        memberShipEndDate: userData.memberShipEndDate ?? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    }


    const user = await Profile.create(formattedData);

    revalidatePath(pathtoRevalidate);
    return JSON.parse(JSON.stringify(user))


}


/* export async function createRecruiterUserprofile(userData) {
    try {

    } catch (error) {
        console.error("Error in createUserProfile:", error);
        return {
            success: false,
            message: error.message || "Internal Server Error"
        }

    }
} */