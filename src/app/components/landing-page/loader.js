"use client";
import React from 'react';

function SkeletonLoader() {
  return (
    <div className="w-full h-full relative animate-pulse">
      {/* Skeleton for the model-viewer container */}
      <div className="w-full h-[350px] md:h-[600px] bg-gray-200 dark:bg-gray-800 rounded-lg"></div>

      {/* Skeleton for the hero section */}
      <section className="w-full absolute top-2 md:top-[0%] lg:top-[4%] pt-6 md:pt-14 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-20 px-4">
        <div className="w-full text-center">
          {/* Skeleton for the heading */}
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-[80%] mx-auto md:h-20 md:w-[70%]"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-[60%] mx-auto mt-4 md:h-12 md:w-[50%]"></div>
        </div>
        <div className="w-full text-center mt-6 md:text-start md:w-[40%]">
          {/* Skeleton for the description */}
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-[90%] mx-auto md:w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-[80%] mx-auto mt-2 md:w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-[70%] mx-auto mt-2 md:w-full"></div>

          {/* Skeleton for the buttons */}
          <div className="w-full flex items-center gap-3 justify-center mt-4 md:justify-start">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-32"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-32"></div>
          </div>
        </div>
      </section>

      {/* Skeleton for the video section */}
      <section className="w-full mt-8 px-4">
        <div className="w-full h-[300px] md:h-[400px] bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
      </section>

      {/* Skeleton for the feature cards section */}
      <section className="w-full mt-8 px-4">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="w-full p-4 rounded-2xl bg-gray-200 dark:bg-gray-800">
              <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-sm"></div>
              <div className="w-full mt-3">
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg w-[70%]"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-lg w-[90%] mt-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-lg w-[80%] mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skeleton for the stats section */}
      <section className="w-full mt-8 px-4">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-1/2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-[60%]"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-[80%] mt-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-[70%] mt-2"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-32 mt-4"></div>
          </div>
          <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((_, index) => (
              <div
                key={index}
                className="w-full p-4 rounded-xl bg-gray-200 dark:bg-gray-800"
              >
                <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg w-[50%] mx-auto mt-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-lg w-[70%] mx-auto mt-2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skeleton for the reviews section */}
      <section className="w-full mt-8 px-4">
        <div className="w-full h-[300px] bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
      </section>

      {/* Skeleton for the footer section */}
      <section className="w-full mt-8 bg-gray-200 dark:bg-gray-800 h-20"></section>
    </div>
  );
}

export default SkeletonLoader;