"use client"
import {
    FaCheckCircle,
    FaUser,
    FaEnvelope,
    FaLock,
    FaGoogle,
    FaGithub
} from "react-icons/fa";
import Image from "next/image";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

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

                <div className="flex items-center justify-center px-4 py-10 dark:bg-black bg-white sm:px-6 lg:px-8 sm:py-16 lg:py-24">
                   <SignUp 
                   appearance={{
                    baseTheme: dark
                   }}
                   />
                </div>
            </div>
        </section>
    );
};

export default Page;
