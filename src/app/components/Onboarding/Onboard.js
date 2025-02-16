"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { useClerk, useUser } from "@clerk/clerk-react"
import { useToast } from "@/hooks/use-toast"
import { useDispatch } from "react-redux"
import { logout } from "@/app/store/AuthSlice"
import { addData, removeData } from "@/app/store/UserDataSlice"
import { useRouter } from "next/navigation"
import { createCandidateUserProfile } from "@/app/actions/userActions"

export default function Onboard() {
    const { user } = useUser()
    const [role, setRole] = useState("candidate")
    const [useremail, setuseremail] = useState("")
    const { toast } = useToast()
    const { signOut } = useClerk()
    const dispatch = useDispatch()
    const router = useRouter()
    const {
        handleSubmit: candidateHandleSubmit,
        register: candidateRegister,
        setValue: setCandidateValue,
        formState: { isSubmitting }
    } = useForm({
        defaultValues: {
            email: "",
            username: "",
            skills: ""
        }
    })

    const {
        handleSubmit: recruiterHandleSubmit,
        register: recruiterRegister,
        setValue: setRecruiterValue
    } = useForm({
        defaultValues: {
            email: "",
            username: "",
            companyName: "",
            companyRole: ""
        }
    })

    useEffect(() => {
        if (user?.emailAddresses?.[0]?.emailAddress) {
            const emailAddress = user.emailAddresses[0].emailAddress;
            setuseremail(emailAddress);

            // Update both forms with the email
            setCandidateValue("email", emailAddress);
            setRecruiterValue("email", emailAddress);

            // Set username if available
            if (user.username) {
                setCandidateValue("username", user.username);
                setRecruiterValue("username", user.username);
            }
        }
    }, [user, setCandidateValue, setRecruiterValue]);

    const onSubmitCandidate = async (data) => {
        //console.log("Candidate data:", data);
        try {
            const userData = {
                userId: user?.id,
                role: "candidate",
                email: data.email,
                candidateDetails: {
                    username: data.username,
                    Skills: data.skills
                }
            }

            const userDetails = await createCandidateUserProfile(userData, "/")
            if (userDetails.success) {
                dispatch(addData(userDetails.userDetails))
            }


        } catch (error) {
            toast({
                title: "Error",
                description: "An error Occured" || error.message
            })
        }
    }

    const onSubmitRecruiter = (data) => {
        console.log("Recruiter data:", data);
        // Handle recruiter form submission
    }

    const handleLogout = async () => {
        try {
            await signOut()
            dispatch(logout())
            dispatch(removeData())

            toast({
                title: "Success",
                description: "Succesfully SignOut"
            })
            router.push("/")
        } catch (error) {
            toast({
                title: "Error",
                description: "An error Occured"
            })
        }
    }

    return (
        <div className="container mx-auto py-10">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl font-bold">Set Up Your Profile</CardTitle>
                        <Button variant="outline" onClick={handleLogout}>Log Out</Button>
                    </div>
                    <CardDescription>Please fill in your details to complete your profile.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 mb-4">
                        <Label htmlFor="role">Select your role</Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="candidate">Candidate</SelectItem>
                                    <SelectItem value="recruiter">Recruiter</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {role === "candidate" ? (
                        <form onSubmit={candidateHandleSubmit(onSubmitCandidate)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...candidateRegister("email", { required: true })}
                                    disabled
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    {...candidateRegister("username", { required: true })}
                                    disabled
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="skills">Skills</Label>
                                <Textarea
                                    id="skills"
                                    placeholder="Enter your skills (comma-separated)"
                                    {...candidateRegister("skills", { required: true })}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Submitting.." : "Complete Profile"}</Button>
                        </form>
                    ) : (
                        <form onSubmit={recruiterHandleSubmit(onSubmitRecruiter)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...recruiterRegister("email", { required: true })}
                                    disabled
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    {...recruiterRegister("username", { required: true })}
                                    disabled
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input
                                    id="companyName"
                                    placeholder="Enter your company name"
                                    {...recruiterRegister("companyName", { required: true })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="companyRole">Company Role</Label>
                                <Input
                                    id="companyRole"
                                    placeholder="Enter your role in the company"
                                    {...recruiterRegister("companyRole", { required: true })}
                                />
                            </div>
                            <Button type="submit" className="w-full">Complete Profile</Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}