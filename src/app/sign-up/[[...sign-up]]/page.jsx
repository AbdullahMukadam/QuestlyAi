"use client"
import {
    FaCheckCircle,
    FaUser,
    FaEnvelope,
    FaLock,
    FaGoogle,
    FaGithub
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

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
    const [userData, setuserData] = useState({
        username: "",
        emailAddress: "",
        password: ""
    })
    const [loading, setloading] = useState(false)
    const { isLoaded, setActive, signUp } = useSignUp()
    const [verifying, setverifying] = useState(false)

    const handleChange = (e) => {
        setuserData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!isLoaded) return
        try {
            setloading(true)
            await signUp.create({
                username: userData.username,
                emailAddress: userData.emailAddress,
                password: userData.password
            })

            await signUp.prepareEmailAddressVerification({
                strategy: "email_code"
            })

            setverifying(true)

        } catch (error) {
            console.log("Error in Sign Up", error)
        }
    }

    if (verifying) {
        return (
            <div className="bg-white">
                <h1>Email Verification</h1>
            </div>
        )
    }
    return (
        <section className="bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative flex items-end px-4 pb-10 pt-60 sm:pb-16 md:justify-center lg:pb-24 bg-gray-50 sm:px-6 lg:px-8">
                    <div className="absolute inset-0">
                        <Image
                            className="object-cover"
                            src="/womenlaptop.jpg"
                            alt="Girl working on laptop"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    <div className="relative">
                        <div className="w-full max-w-xl xl:w-full xl:mx-auto xl:pr-24 xl:max-w-xl">
                            <h3 className="text-4xl font-bold text-white">
                                Join 35k+ web professionals & <br className="hidden xl:block" />
                                practise youe sessions
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
                            Sign up to QuestlyAi
                        </h2>
                        <p className="mt-2 text-base text-gray-600">
                            Already have an account?{" "}
                            <Link href="#" className={commonStyles.link}>
                                Login
                            </Link>
                        </p>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                            <div>
                                <label className="text-base font-medium text-gray-900">
                                    First & Last name
                                </label>
                                <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                                    <div className={commonStyles.inputIcon}>
                                        <FaUser className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        className={commonStyles.input}
                                        id="username"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

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
                                        placeholder="Enter email to get started"
                                        className={commonStyles.input}
                                        id="emailAddress"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-base font-medium text-gray-900">
                                    Password
                                </label>
                                <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                                    <div className={commonStyles.inputIcon}>
                                        <FaLock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        className={commonStyles.input}
                                        id="password"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <button type="submit" className={commonStyles.button} disabled={loading}>
                                    {loading ? 'Submitting..' : "SignUp"}
                                </button>
                            </div>
                        </form>

                        <div className="mt-3 space-y-3">
                            <button type="button" className={commonStyles.socialButton}>
                                <div className="absolute inset-y-0 left-0 p-4">
                                    <FaGoogle className="w-6 h-6 text-rose-500" />
                                </div>
                                Sign up with Google
                            </button>

                            <button type="button" className={commonStyles.socialButton}>
                                <div className="absolute inset-y-0 left-0 p-4">
                                    <FaGithub className="w-6 h-6 " />
                                </div>
                                Sign up with Github
                            </button>
                        </div>

                        <p className="mt-5 text-sm text-gray-600">
                            This site is protected by reCAPTCHA and the Google{" "}
                            <Link href="#" className={commonStyles.link}>
                                Privacy Policy
                            </Link>{" "}
                            &{" "}
                            <Link href="#" className={commonStyles.link}>
                                Terms of Service
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Page;
