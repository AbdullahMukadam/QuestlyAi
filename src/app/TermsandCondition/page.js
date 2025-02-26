"use client";
import React from 'react';
import Footer from '../components/common/Footer';


const TermsAndConditions = () => {
  return (
    <div className="w-full h-full relative font-sans bg-white dark:bg-black text-gray-800 dark:text-gray-200 p-6">
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Terms and Conditions</h1>

        <p className="text-sm md:text-base mb-6">
          Welcome to Questly AI! These terms and conditions outline the rules and regulations for the use of our website and services.
        </p>

        <h2 className="text-xl md:text-2xl font-bold mt-6 mb-4">1. Acceptance of Terms</h2>
        <p className="text-sm md:text-base mb-4">
          By accessing or using Questly AI, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.
        </p>

        <h2 className="text-xl md:text-2xl font-bold mt-6 mb-4">2. Services</h2>
        <p className="text-sm md:text-base mb-4">
          Questly AI provides AI-powered mock interview services, including personalized feedback and insights. These services are subject to change or discontinuation at any time without notice.
        </p>

        <h2 className="text-xl md:text-2xl font-bold mt-6 mb-4">3. User Responsibilities</h2>
        <p className="text-sm md:text-base mb-4">
          You agree to use Questly AI only for lawful purposes and in a way that does not infringe the rights of others or restrict their use of the platform.
        </p>

        <h2 className="text-xl md:text-2xl font-bold mt-6 mb-4">4. Intellectual Property</h2>
        <p className="text-sm md:text-base mb-4">
          All content, trademarks, and data on this website are the property of Questly AI or its licensors and are protected by intellectual property laws.
        </p>

        <h2 className="text-xl md:text-2xl font-bold mt-6 mb-4">5. Limitation of Liability</h2>
        <p className="text-sm md:text-base mb-4">
          Questly AI is not liable for any indirect, incidental, or consequential damages arising from the use of our services.
        </p>

        <h2 className="text-xl md:text-2xl font-bold mt-6 mb-4">6. Changes to Terms</h2>
        <p className="text-sm md:text-base mb-4">
          We reserve the right to modify these terms at any time. Your continued use of the platform constitutes acceptance of the updated terms.
        </p>

        {/* <h2 className="text-xl md:text-2xl font-bold mt-6 mb-4">7. Governing Law</h2>
        <p className="text-sm md:text-base mb-4">
          These terms are governed by the laws of India, and any disputes will be resolved in the courts of [Your Jurisdiction].
        </p>
 */}
        <p className="text-sm md:text-base mt-8">
          If you have any questions about these terms, please contact us at <a href="mailto:abdullahmukadam21@gmail.com" className="text-emerald-500">abdullahmukadam21@gmail.com</a>.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default React.memo(TermsAndConditions);