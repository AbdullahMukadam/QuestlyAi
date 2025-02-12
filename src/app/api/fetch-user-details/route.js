import Profile from "@/Models/Profile";
import { NextResponse } from "next/server";


export async function GET(req) {
    try {
        const userId = await req.body;

        const fetchedUserDetails = await Profile.findOne({ userId })

        if(!fetchedUserDetails){
            return NextResponse.json({
                success : false,
                message : "User Not Found"
            })
        }

        return NextResponse.json({
            userDetails : fetchedUserDetails,
            success : true,
            message : "Fetched user Details Successfully"
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}