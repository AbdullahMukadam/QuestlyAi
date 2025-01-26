"use client";
import React from 'react';

function SkeletonLoader() {
    return (
        <div className="w-full h-full relative animate-pulse">
            {/* Skeleton for the model-viewer container */}
            <div className="hidden md:block w-full h-[500px] bg-gray-200 rounded-lg"></div>

            {/* Skeleton for the landing page content */}
            <section className="w-full h-[30%] md:absolute md:top-0 pt-6 md:flex items-center justify-center md:pt-16 gap-20">
                <div className="w-full text-center">
                    {/* Skeleton for the heading */}
                    <div className="h-12 bg-gray-200 rounded-lg w-[60%] mx-auto md:h-20 md:w-[80%]"></div>
                    <div className="h-8 bg-gray-200 rounded-lg w-[40%] mx-auto mt-4 md:h-12 md:w-[60%]"></div>
                </div>
                <div className="w-full text-center mt-3 md:text-start md:w-[40%]">
                    {/* Skeleton for the description */}
                    <div className="h-4 bg-gray-200 rounded-lg w-[90%] mx-auto md:w-full"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-[80%] mx-auto mt-2 md:w-full"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-[70%] mx-auto mt-2 md:w-full"></div>

                    {/* Skeleton for the buttons */}
                    <div className="w-full flex items-center gap-3 justify-center mt-4 md:justify-start">
                        <div className="h-10 bg-gray-200 rounded-full w-32"></div>
                        <div className="h-10 bg-gray-200 rounded-full w-32"></div>
                    </div>
                </div>
            </section>

            {/* Skeleton for the additional content section */}
            <section className="w-full mt-8">
                <div className="w-full text-center flex items-center flex-col">
                    {/* Skeleton for the heading */}
                    <div className="h-12 bg-gray-200 rounded-lg w-[70%] md:h-20 md:w-[50%]"></div>
                    {/* Skeleton for the description */}
                    <div className="w-[60%] mt-4">
                        <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
                        <div className="h-4 bg-gray-200 rounded-lg w-[90%] mt-2"></div>
                        <div className="h-4 bg-gray-200 rounded-lg w-[80%] mt-2"></div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default SkeletonLoader;