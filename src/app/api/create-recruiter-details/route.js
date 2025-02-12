import connectToDb from "@/database/connectToDb";
import Profile from "@/Models/Profile";
import { NextResponse } from "next/server";


export default async function POST(req) {
    try {

        await connectToDb()

        const userData = await req.body

        const User = await Profile.create(userData)
        if (!User) {
            return NextResponse.json({
                success: false,
                message: "Unable to create the user"
            })
        }

        return NextResponse.json({
            user: User,
            success: true,
            message: "User Successfully Created"
        })


    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}