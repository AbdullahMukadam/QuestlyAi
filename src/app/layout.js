import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import SkeletonLoader from "./components/landing-page/loader";
import { ThemeProvider } from "./components/theme-provider";
import Script from "next/script";
import CommonLayout from "./common-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "QuestlyAi",
  description: "Ai Powered Mock Interviewer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <div className="min-h-screen flex flex-col items-center bg-slate-50 dark:bg-black">
            <main className="w-full max-w-7xl mx-auto">
              <Suspense fallback={<SkeletonLoader />}>
                <CommonLayout>{children}</CommonLayout>
              </Suspense>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
