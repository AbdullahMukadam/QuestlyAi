import React from "react";
import { FiTwitter, FiFacebook, FiInstagram, FiGithub, FiMail } from "react-icons/fi";

const Footer = () => {
  const iconStyles =
    "flex items-center justify-center text-gray-700 transition-all duration-300 bg-transparent border border-gray-300 rounded-full w-10 h-10 hover:bg-blue-600 hover:border-blue-600 hover:text-white focus:bg-blue-600 focus:border-blue-600 focus:text-white transform hover:scale-110 dark:border-gray-500 dark:hover:border-blue-500 dark:text-white dark:hover:bg-blue-600";

  const linkClasses =
    "text-sm font-medium text-gray-700 transition-all duration-200 hover:text-blue-600 focus:text-blue-600 cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-200 hover:after:w-full dark:text-gray-300 dark:hover:text-blue-400 dark:after:bg-blue-400";

  const sectionTitleClasses = "text-lg font-semibold text-gray-800 mb-6 dark:text-white";

  return (
    <section className="relative py-16 font-sans bg-gradient-to-b from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-950">
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:bg-blue-900"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:bg-purple-900"></div>
      </div>

      <div className="relative px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-2">
              <img className="w-20 h-20" src="/white-logo.svg" alt="Logo" />
              
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-md">
              Building the future of AI-powered solutions. Join us on our journey as we create innovative tools that transform how you work and learn.
            </p>
            <div className="flex items-center mt-6 space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">#buildinginpublic</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className={sectionTitleClasses}>Quick Links</h4>
            <ul className="space-y-4">
              {[
                { href: "/about", text: "About Us" },
                { href: "/features", text: "Features" },
                { href: "/pricing", text: "Pricing" },
                { href: "/blog", text: "Blog" },
              ].map((item, index) => (
                <li key={index}>
                  <a href={item.href} className={linkClasses}>
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className={sectionTitleClasses}>Support & Legal</h4>
            <ul className="space-y-4">
              {[
                { href: "mailto:abdullahmukadam21@gmail.com", text: "Customer Support", icon: <FiMail className="w-4 h-4" /> },
                { href: "/TermsandCondition", text: "Terms & Conditions" },
                { href: "/PrivacyPolicy", text: "Privacy Policy" },
                { href: "/RefundPolicy", text: "Refund Policy" },
              ].map((item, index) => (
                <li key={index}>
                  <a href={item.href} className={`${linkClasses} flex items-center space-x-2`}>
                    {item.icon && <span className="text-blue-600 dark:text-blue-400">{item.icon}</span>}
                    <span>{item.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="relative mb-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-gray-100 dark:bg-zinc-950 px-6">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          
          {/* Social Media */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">Follow us:</span>
            {[
              {
                icon: <FiTwitter className="w-5 h-5" />,
                href: "https://x.com/abd_mukadam",
                label: "Twitter"
              },
              {
                icon: <FiInstagram className="w-5 h-5" />,
                href: "https://instagram.com/",
                label: "Instagram"
              },
              {
                icon: <FiGithub className="w-5 h-5" />,
                href: "https://github.com/AbdullahMukadam",
                label: "GitHub"
              },
            ].map((item, index) => (
              <a
                key={index}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className={iconStyles}
              >
                {item.icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              © 2025 QuestlyAI. All rights reserved.
            </p>
            <p className="text-sm">
              <span className="text-blue-600 font-medium">#buildinginpublic</span>
              <span className="text-gray-500 dark:text-gray-400"> by </span>
              <a 
                href="https://x.com/abd_mukadam" 
                className="font-medium text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                @AbdullahMukadam
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;