"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Squash as Hamburger } from 'hamburger-react'
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/app/store/AuthSlice";
import { useToast } from "@/hooks/use-toast";
import { useClerk } from "@clerk/clerk-react";
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { removeData } from "@/app/store/UserDataSlice";
import { removeQuestions } from "@/app/store/InterviewQuestionSlice";

const Navbar = () => {
    const [menu, setMenu] = useState(false);
    const Status = useSelector((state) => state.auth.authStatus)
    const [authStatus, setauthStatus] = useState(false)
    const dispatch = useDispatch()
    const router = useRouter()
    const pathname = usePathname()
    const { toast } = useToast()
    const { signOut } = useClerk()
    const { setTheme, theme } = useTheme()

    useEffect(() => {
        const status = localStorage.getItem("authStatus")
        //console.log(status)
        if (status === "true") {
            setauthStatus(true)
        } else {
            setauthStatus(false)
        }
    }, [authStatus, dispatch, Status])

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
            show: authStatus
        },
        {
            item: "Dashboard",
            link: "/dashboard",
            show: authStatus
        },
    ]

    const handleLogout = async () => {
        try {
            await signOut()
            dispatch(logout())
            dispatch(removeData())
            dispatch(removeQuestions())
            localStorage.removeItem("authStatus")
            setauthStatus(false)
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
        <header className="sticky top-0 w-full bg-white/80 dark:bg-black/60 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center">
                            <Image
                                src={theme === "dark" ? "/white-logo.svg" : "/logo-cropped.svg"}
                                alt="Logo"
                                height={50}
                                width={50}
                                className="h-8 w-auto"
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <nav className="flex items-center space-x-6">
                            {navItems.map((navItem, index) => (
                                navItem.show && (
                                    <Link
                                        key={index}
                                        href={navItem.link}
                                        className={`text-sm font-medium transition-colors ${pathname === navItem.link
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
                                            }`}
                                    >
                                        {navItem.item}
                                    </Link>
                                )
                            ))}
                        </nav>

                        <div className="flex items-center space-x-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9">
                                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
                                        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-32">
                                    <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>


                            {authStatus ? (
                                <Button
                                    onClick={handleLogout}
                                    variant="destructive"
                                    className="h-9"
                                >
                                    Logout
                                </Button>
                            ) : (
                                <Button
                                    className="h-9 bg-green-600 hover:bg-green-700"
                                >
                                    Get Started
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
                                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32">
                                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Hamburger toggled={menu} toggle={setMenu} size={20} />
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {menu && (
                <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
                    <div className="space-y-1 px-4 pb-3 pt-2">
                        {navItems.map((navItem, index) => (
                            navItem.show && (
                                <Link
                                    key={index}
                                    href={navItem.link}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === navItem.link
                                        ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        }`}
                                    onClick={() => setMenu(false)}
                                >
                                    {navItem.item}
                                </Link>
                            )
                        ))}
                        {!authStatus && (
                            <Button
                                className="w-full mt-4 bg-green-600 hover:bg-green-700"
                            >
                                Get Started
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;