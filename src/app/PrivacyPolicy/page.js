"use client";
import React from 'react';
import Footer from '../components/common/Footer';


const PrivacyPolicy = () => {
  return (
    <div className="w-full h-full relative font-sans bg-white dark:bg-black text-gray-800 dark:text-gray-200 p-6">
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Privacy Policy</h1>

        <p className="text-sm md:text-base mb-6">
          At Questly AI, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our services.
        </p>

        <h2 className="text-xl md:text-2xl font-bold mt-6 mb-4">1. Information We Collect</h2>
        <p className="text-sm md:text-base mb-4">
          We may collect personal information such as your name, email address, and interview performance data when you use our services. We also collect usage data, including IP addresses and browser information.
        </p>

        <h2 className="text-xl md:text-2xl font-bold mt-6 mb-4">2. How We Use Your Information</h2>
        <p className="text-sm md:text-base mb-4">
          Your information is used to provide and improve our services, personalize your experience, and communicate with you. We do not sell or share your data with third parties for marketing purposes.
        </p>

        <h2 className="text-xl md:text-2xl font-bold mt-6 mb-4">3. Data Security</h2>
        <p className="text-sm md:text-base mb-4">
          We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure.
        </p>

        <h2 className="text-xl md:text-2xl font-bold mt-6 mb-4">4. Cookies and Tracking</h2>
        <p className="text-sm md:text-base mb-4">
          We use cookies and similar technologies to enhance your experience and analyze usage patterns. You can disable cookies in your browser settings, but this may affect your ability to use certain features.
        </p>

        <h2 className="text-xl md:text-2xl font-bold mt-6 mb-4">5. Third-Party Services</h2>
        <p className="text-sm md:text-base mb-4">
          We may use third-party services (e.g., analytics tools) that collect data on our behalf. These services have their own privacy policies, and we are not responsible for their practices.
        </p>

        <h2 className="text-xl md:text-2xl font-bold mt-6 mb-4">6. Your Rights</h2>
        <p className="text-sm md:text-base mb-4">
          You have the right to access, update, or delete your personal information. To exercise these rights, please contact us at <a href="mailto:abdullahmukadam21@gmail.com" className="text-emerald-500">abdullahmukadam21@gmail.com</a>.
        </p>

        <h2 className="text-xl md:text-2xl font-bold mt-6 mb-4">7. Changes to This Policy</h2>
        <p className="text-sm md:text-base mb-4">
          We may update this Privacy Policy from time to time. Any changes will be posted on this page, and your continued use of our services constitutes acceptance of the updated policy.
        </p>

        <p className="text-sm md:text-base mt-8">
          If you have any questions about this Privacy Policy, please contact us at <a href="mailto:abdullahmukadam21@gmail.com" className="text-emerald-500">abdullahmukadam21@gmail.com</a>.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default React.memo(PrivacyPolicy);