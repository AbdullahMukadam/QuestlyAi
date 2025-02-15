"use client"
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState } from 'react'

function Onboard() {
    const [roleValue, setroleValue] = useState("candidate")
    console.log(roleValue)

    return (
        <section className='md:w-[50%] w-[90%] p-2 md:p-4 border-[2px] border-solid flex items-center gap-4 flex-col rounded-lg'>
            <div className='w-full flex items-center justify-between'>
                <h2 className='text-gray-500'>Fill Details</h2>
                <Button>LogOut</Button>
            </div>

            <form className='w-full'>
                <h1 className='text-2xl font-bold md:text-3xl lg:text-4xl'>Lets Set up your Details</h1>
                <Select className="mt-2" value={roleValue} onValueChange={setroleValue}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>role</SelectLabel>
                            <SelectItem value="candidate" >candidate</SelectItem>
                            <SelectItem value="recruiter" >recruiters</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                {roleValue === "candidate" ? (
                    <Label>Enter your Details</Label>
                ) : (
                    <Label>Enter your Emial</Label>
                )}
            </form>


        </section>
    )
}

export default Onboard