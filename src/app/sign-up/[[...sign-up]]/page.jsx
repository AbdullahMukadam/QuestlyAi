"use client"
import { FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const Page = () => {
   return (
       <section className="min-h-screen bg-white dark:bg-black">
           <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
               {/* Left Panel - Hero Section */}
               <div className="relative hidden lg:flex items-center px-4 lg:px-8">
                   <div className="absolute inset-0">
                       <Image
                           className="object-cover w-full h-full"
                           src="/woman-laptop-2.avif"
                           alt="Professional at work"
                           layout="fill"
                           priority
                           quality={100}
                       />
                       {/* Gradient Overlay */}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40"></div>
                   </div>
                   
                   {/* Content */}
                   <div className="relative z-10 w-full max-w-xl">
                       <h3 className="text-4xl font-bold text-white leading-tight">
                           Join 35k+ web professionals & 
                           <br />
                           practice your sessions
                       </h3>
                       
                       {/* Features Grid */}
                       <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6">
                           {[
                               "Free to try",
                               "AI Support",
                               "Save Interview Locally",
                               "Invite other Members",
                           ].map((feature, index) => (
                               <div key={index} className="flex items-center space-x-3">
                                   <div className="flex-shrink-0">
                                       <FaCheckCircle className="w-5 h-5 text-emerald-400" />
                                   </div>
                                   <span className="text-base font-medium text-white">
                                       {feature}
                                   </span>
                               </div>
                           ))}
                       </div>
                   </div>
               </div>

               {/* Right Panel - Sign Up Form */}
               <div className="flex items-center justify-center px-4 py-8 lg:px-8 bg-white dark:bg-black">
                   <div className="w-full max-w-md">
                       {/* Mobile Hero Text */}
                       <div className="lg:hidden mb-8 text-center">
                           <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                               Create an Account
                           </h3>
                           <p className="mt-2 text-gray-600 dark:text-gray-400">
                               Join our community of professionals
                           </p>
                       </div>
                       
                       {/* Clerk Sign Up Component */}
                       <SignUp 
                           appearance={{
                               baseTheme: dark,
                               elements: {
                                   formButtonPrimary: 
                                       "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700",
                                   card: "shadow-none",
                                   footer: "hidden",
                               }
                           }}
                       />
                   </div>
               </div>
           </div>
       </section>
   );
};

export default Page;