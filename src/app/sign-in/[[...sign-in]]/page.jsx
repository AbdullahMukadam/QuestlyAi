"use client"
import {
    FaCheckCircle,
    FaEnvelope,
    FaLock,
    FaGoogle,
    FaGithub,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "@/app/store/AuthSlice";

const commonStyles = {
    inputIcon:
        "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none",
    input:
        "block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600",
    button:
        "inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 border border-transparent rounded-md bg-gradient-to-r from-fuchsia-600 to-blue-600 focus:outline-none hover:opacity-80 focus:opacity-80",
    socialButton:
        "relative inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-gray-700 transition-all duration-200 bg-white border-2 border-gray-200 rounded-md hover:bg-gray-100 focus:bg-gray-100 hover:text-black focus:text-black focus:outline-none",
    link: "font-medium text-blue-600 transition-all duration-200 hover:text-blue-700 focus:text-blue-700 hover:underline",
};

const Page = () => {

    const { toast } = useToast()
    const [loading, setloading] = useState(false)
    const { setActive, isLoaded, signIn } = useSignIn()
    const [UserData, setUserData] = useState({
        emailAddress: "",
        password: ""
    })
    const router = useRouter()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        setUserData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!isLoaded) return;
        try {
            setloading(true)

            const signInAttempt = await signIn.create({
                identifier: UserData.emailAddress,
                password: UserData.password,
            })

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })

                const userData = {
                    userId: signInAttempt.userId || "",
                    emailAddress: UserData.emailAddress,
                    username: signInAttempt.username || "",
                    sessionId: signInAttempt.createdSessionId
                }

                toast({
                    title: "Welcome back!",
                    description: "Sign in successful",
                })

                dispatch(login(userData))
                console.log(userData)
                router.push('/')
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2))
                toast({
                    title: "Error",
                    description: "Sign in failed. Please try again.",
                    variant: "destructive"
                })
            }

        } catch (error) {
            console.error("Sign in error:", error)
            toast({
                title: "Error in Sign In!",
                description: error.message || "An error occurred, please try again",
                variant: "destructive"
            })
        } finally {
            setloading(false)
        }
    }
    return (
        <section className="bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative flex items-end px-4 pb-10 pt-60 sm:pb-16 md:justify-center lg:pb-24 bg-gray-50 sm:px-6 lg:px-8">
                    <div className="absolute inset-0">
                        <Image
                            className="object-cover object-top w-full h-full"
                            src="/womenlaptop.jpg"
                            alt="Women Working"
                            layout="fill"
                            objectFit="cover"
                            objectPosition="top"
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    <div className="relative">
                        <div className="w-full max-w-xl xl:w-full xl:mx-auto xl:pr-24 xl:max-w-xl">
                            <h3 className="text-4xl font-bold text-white">
                                Join 35k+ web professionals & <br className="hidden xl:block" />
                                practise your sessions
                            </h3>
                            <ul className="grid grid-cols-1 mt-10 sm:grid-cols-2 gap-x-8 gap-y-4">
                                {[
                                    "Free to try",
                                    "Ai Support",
                                    "Save Interview Locally",
                                    "Invited other Members",
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center space-x-3">
                                        <div className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full">
                                            <FaCheckCircle className="w-3.5 h-3.5 text-white" />
                                        </div>
                                        <span className="text-lg font-medium text-white">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center px-4 py-10 bg-white sm:px-6 lg:px-8 sm:py-16 lg:py-24">
                    <div className="xl:w-full xl:max-w-sm 2xl:max-w-md xl:mx-auto">
                        <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">
                            Sign in to QuestlyAi
                        </h2>
                        <p className="mt-2 text-base text-gray-600">
                            Don't have an account?{" "}
                            <Link href="/sign-up" className={commonStyles.link}>
                                Create a free account
                            </Link>
                        </p>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                            <div>
                                <label className="text-base font-medium text-gray-900">
                                    Email address
                                </label>
                                <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                                    <div className={commonStyles.inputIcon}>
                                        <FaEnvelope className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        id="emailAddress"
                                        placeholder="Enter email to get started"
                                        className={commonStyles.input}
                                        value={UserData.emailAddress}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="text-base font-medium text-gray-900">
                                        Password
                                    </label>
                                    <Link href="#" className={commonStyles.link}>
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                                    <div className={commonStyles.inputIcon}>
                                        <FaLock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password"
                                        id="password"
                                        placeholder="Enter your password"
                                        className={commonStyles.input}
                                        value={UserData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <button type="submit" className={commonStyles.button} disabled={loading}>
                                    {loading ? "Logginng in.." : "Log In"}
                                </button>
                            </div>
                        </form>

                        <div className="mt-3 space-y-3">
                            <button type="button" className={commonStyles.socialButton}>
                                <div className="absolute inset-y-0 left-0 p-4">
                                    <FaGoogle className="w-6 h-6 text-rose-500" />
                                </div>
                                Sign in with Google
                            </button>

                            <button type="button" className={commonStyles.socialButton}>
                                <div className="absolute inset-y-0 left-0 p-4">
                                    <FaGithub className="w-6 h-6 " />
                                </div>
                                Sign in with Github
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Page;
