"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Squash as Hamburger } from 'hamburger-react'
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/app/store/AuthSlice";
import { useClerk } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
    const [menu, setMenu] = useState(false);
    const authStatus = useSelector((state) => state.auth.authStatus)
    const sessionId = useSelector((state) => state.auth.sessionId)
    const dispatch = useDispatch()
    const router = useRouter()
    const pathname = usePathname()
    const { signOut } = useClerk()
   const {toast} = useToast()


    const navItems = [
        {
            item: "Home",
            link: "/",
            show: true
        },
        {
            item: "SignIn",
            link: "/sign-in",
            show: !authStatus
        },
        {
            item: "Pricing",
            link: "/Pricing",
            show: !authStatus
        },
    ]

    const handleLogout = async () => {
        try {
            await signOut({
                sessionId: sessionId
            })
            dispatch(logout())
            router.push("/")
        } catch (error) {
            console.error("Logout error:", error)
            toast({
                title: "Logout Error",
                description: "Failed to logout. Please try again.",
                variant: "destructive"
            })
        }
    }
    return (
        <header className="bg-white/80 backdrop-blur-lg border-b shadow-sm sticky top-0 w-full z-50 md:px-4">
            <div className="w-full flex items-center justify-between py-2 px-4">
                {/* Logo */}
                <div className=" w-[30%] md:w-[20%] h-full p-2">
                    <Link href={"/"} className="w-full h-[73px]">
                        <div className="w-full flex items-center">
                            <Image
                                src={"/logo-cropped.svg"}
                                alt="Logo"
                                height={80}
                                width={80}
                            />
                        </div>
                    </Link>
                </div>

                {/* Desktop Links */}
                <div className="w-[300px] hidden md:flex items-center justify-center gap-6 p-2 border-2 border-gray-300 rounded-full">
                    {navItems.map((navItem, index) => (
                        navItem.show && (
                            <button
                                key={index}
                                variant="ghost"
                                className={`${pathname.toString() === navItem.link ? "bg-[#18B088]" : ""} px-4 py-2 rounded-full hover:bg-[#18b087a6]`}
                            >
                                <Link href={navItem.link} className="flex items-center ">

                                    <span className="font-bold text-gray-600 text-[14px]">{navItem.item}</span>
                                </Link>
                            </button>
                        )
                    ))}
                </div>

                <nav className="hidden md:flex items-center gap-8 text-black">
                    {authStatus ? <Button onClick={handleLogout} className="px-8 py-3 rounded-full bg-red-500  text-white hover:bg-red-700 hover: font-medium transition duration-200">
                        Logout
                    </Button> : <Button className="px-8 py-3 rounded-full bg-[#18B088]  text-white hover:bg-green-800 hover: font-medium transition duration-200">
                        Get Started
                    </Button>}

                </nav>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <Hamburger toggled={menu} toggle={setMenu} />
                </div>

            </div>

            {/* Mobile Menu */}
            {menu && (
                <div className="dropdown-animation w-full absolute top-auto md:hidden px-4 bg-gray-100 p-4 rounded-b-lg overflow-hidden">
                    <nav className="flex flex-col gap-3 text-black">
                        {navItems.map((navItem, index) => (
                            navItem.show && (
                                <Button
                                    key={index}
                                    variant="ghost"
                                    className={`${menu ? 'justify-start w-full' : 'h-9'} gap-2`}
                                >
                                    <Link href={navItem.link} className="flex items-center gap-2">
                                        <span>{navItem.item}</span>
                                    </Link>
                                </Button>
                            )
                        ))}
                        <Button className="px-6 py-3 mt-4 bg-[#18B088] rounded-full text-white hover:bg-green-800 hover:text-black transition duration-200">
                            Get Started
                        </Button>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;
