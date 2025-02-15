import React from "react";
import { FiTwitter, FiFacebook, FiInstagram, FiGithub } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const iconStyles =
    "flex items-center justify-center text-gray-700 transition-all duration-200 bg-transparent border border-gray-300 rounded-full w-7 h-7 focus:bg-blue-600 hover:bg-blue-600 hover:border-blue-600 focus:border-blue-600 dark:border-gray-500 dark:hover:border-blue-500 dark:text-white"; // Light theme and dark mode styles

  const linkClasses =
    "text-base text-gray-700 transition-all duration-200 hover:text-opacity-80 focus:text-opacity-80 cursor-pointer dark:text-gray-300 dark:hover:text-white"; // Light theme and dark mode styles

  return (
    <section className="py-10 bg-gray-100 sm:pt-16 lg:pt-24 dark:bg-black"> {/* Light theme background, dark mode background */}
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4 md:gap-x-12">
          {/* Company, Help, Resources, Extra Links - Apply similar light and dark mode styles */}
          <div>
            <p className="text-base text-gray-500 dark:text-gray-400">Company</p>
            <ul className="mt-8 space-y-4">
              {/* ... (Map over links and apply linkClasses) */}
                {[
                  { href: "/about", text: "About" },
                  { href: "/features", text: "Features" },
                  { href: "/works", text: "Works" },
                  { href: "/career", text: "Career" },
                ].map((item, index) => (
                  <li key={index}>
                    <Link href={item.href}>
                      <span className={linkClasses}>{item.text}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <p className="text-base text-gray-500 dark:text-gray-400">Help</p>
            <ul className="mt-8 space-y-4">
              {[
                { href: "/support", text: "Customer Support" },
                { href: "/delivery", text: "Delivery Details" },
                { href: "/terms", text: "Terms & Conditions" },
                { href: "/privacy", text: "Privacy Policy" },
              ].map((item, index) => (
                <li key={index}>
                  <Link href={item.href}>
                    <span className={linkClasses}>{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-base text-gray-500 dark:text-gray-400">Resources</p>
            <ul className="mt-8 space-y-4">
              {[
                { href: "/ebooks", text: "Free eBooks" },
                { href: "/tutorial", text: "Development Tutorial" },
                { href: "/blog", text: "How to - Blog" },
                { href: "/youtube", text: "YouTube Playlist" },
              ].map((item, index) => (
                <li key={index}>
                  <Link href={item.href}>
                    <span className={linkClasses}>{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-base text-gray-500 dark:text-gray-400">Extra Links</p>
            <ul className="mt-8 space-y-4">
              {[
                { href: "/support", text: "Customer Support" },
                { href: "/delivery", text: "Delivery Details" },
                { href: "/terms", text: "Terms & Conditions" },
                { href: "/privacy", text: "Privacy Policy" },
              ].map((item, index) => (
                <li key={index}>
                  <Link href={item.href}>
                    <span className={linkClasses}>{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>



        </div>

        <hr className="mt-16 mb-10 border-gray-300 dark:border-gray-700" /> {/* Light and dark mode border */}

        <div className="flex flex-wrap items-center justify-between">
          <Image
            className="h-8 w-auto md:order-1"
            src="/white-logo.svg" // Consider a dark logo version
            alt="Logo"
            height={400}
            width={400}
          />

          <ul className="flex items-center space-x-3 md:order-3">
            {[
              // ... (Social media icons)
              {
                icon: <FiTwitter className="w-4 h-4 text-gray-700 dark:text-gray-400" />, // Light and dark mode icon color
                href: "https://twitter.com",
              },
              {
                icon: <FiFacebook className="w-4 h-4 text-gray-700 dark:text-gray-400" />,
                href: "https://facebook.com",
              },
              {
                icon: <FiInstagram className="w-4 h-4 text-gray-700 dark:text-gray-400" />,
                href: "https://instagram.com",
              },
              {
                icon: <FiGithub className="w-4 h-4 text-gray-700 dark:text-gray-400" />,
                href: "https://github.com/AbdullahMukadam",
              },
            ].map((item, index) => (
              <li key={index}>
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  <div className={iconStyles}>{item.icon}</div>
                </a>
              </li>
            ))}
          </ul>

          <p className="w-full mt-8 text-sm text-center text-gray-500 md:mt-0 md:w-auto md:order-2 dark:text-gray-500"> {/* Light and dark mode text */}
            © Copyright 2025, All Rights Reserved by QuestlyAI
          </p>
        </div>
      </div>
    </section>
  );
};

export default Footer;