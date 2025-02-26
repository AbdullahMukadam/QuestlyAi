"use client";
import React from 'react';
import Footer from '../components/common/Footer';


const RefundPolicy = () => {
  return (
    <div className="w-full h-full relative font-sans bg-white dark:bg-black text-gray-800 dark:text-gray-200 p-6">
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Refund Policy</h1>

        <p className="text-sm md:text-base mb-6">
          Our policy regarding refunds for Questly AI products and services.
        </p>

        <h2 className="text-xl md:text-2xl font-bold mt-6 mb-4">No Refunds Policy</h2>
        <p className="text-sm md:text-base mb-4">
          Due to the digital nature of our products and services, we do not offer refunds for Questly AI purchases. Once a purchase is made, it is considered final and non-refundable.
        </p>

        <h2 className="text-xl md:text-2xl font-bold mt-6 mb-4">Support and Assistance</h2>
        <p className="text-sm md:text-base mb-4">
          If you're experiencing any issues with our products or have questions, we're here to help. Please don't hesitate to reach out to us through one of the following channels:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Email:</strong> abdullahmukadam21@gmail.com</li>
         {/*  <li><strong>Intercom Chat:</strong> Available in the bottom right corner of our website</li> */}
        </ul>
        <p className="text-sm md:text-base mb-4">
          Our support team is committed to assisting you and ensuring you have the best possible experience with Questly AI.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default React.memo(RefundPolicy);