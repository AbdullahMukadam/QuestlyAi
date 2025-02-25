"use client";
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { GoArrowUpRight } from 'react-icons/go';
import Script from 'next/script';
import SkeletonLoader from './loader';
import Image from 'next/image';
import HeroVideoDialog from '@/components/ui/hero-video-dialog';
import { BookmarkCheck, CircleUserRound, Database, LockKeyhole } from 'lucide-react';
import { LucideUser, LucideLink2, LucideBox, LucideTreeDeciduous } from 'lucide-react';
import { Marquee } from '@/components/magicui/marquee';
import Footer from '../common/Footer';
import { RetroGrid } from '@/components/magicui/retro-grid';
import { InteractiveGridPattern } from '@/components/magicui/interactive-grid-pattern';
import { SparklesText } from '@/components/magicui/sparkles-text';

const ReviewCard = ({ img, name, username, body }) => (
  <figure className="relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4 bg-white dark:bg-gray-800">
    <div className="flex items-center gap-2">
      <img className="rounded-full" width="32" height="32" alt="" src={img || "/placeholder.svg"} />
      <div>
        <figcaption className="text-sm font-medium">{name}</figcaption>
        <p className="text-xs text-gray-500 dark:text-gray-400">{username}</p>
      </div>
    </div>
    <blockquote className="mt-2 text-sm">{body}</blockquote>
  </figure>
)

function LandingPage() {
  const [loading, setloading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(0);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      setloading(false);
    }, 3000);
    return () => clearTimeout(timerId);
  }, []);

  const reviews = [
    {
      name: "Jack",
      username: "@jack",
      body: "Questly AI helped me ace my interviews! The mock interviews were so realistic and the feedback was incredibly detailed.",
      img: "https://avatar.vercel.sh/jack",
    },
    {
      name: "Jill",
      username: "@jill",
      body: "I was nervous about my interviews, but Questly AI gave me the confidence I needed. The AI feedback was spot on!",
      img: "https://avatar.vercel.sh/jill",
    },
    {
      name: "Alex",
      username: "@Alex",
      body: "The AI-powered mock interviews were a game-changer for me. I landed my dream job thanks to Questly AI!",
      img: "https://avatar.vercel.sh/jill",
    },
    // ... add more reviews as needed
  ]

  const data = [
    {
      value: '100K',
      label: 'Candidates Trained',
      icon: <LucideUser size={24} />,
      backgroundColor: 'bg-gray-50 dark:bg-black',
    },
    {
      value: 'Upto 40%',
      label: 'Improvement in Confidence',
      icon: <LucideLink2 size={24} />,
      backgroundColor: 'bg-gray-50 dark:bg-black',
    },
    {
      value: '30%',
      label: 'Interview Success Rate',
      icon: <LucideBox size={24} />,
      backgroundColor: 'bg-gray-50 dark:bg-black',
    },
    {
      value: '20%',
      label: 'Faster Job Placement',
      icon: <LucideTreeDeciduous size={24} />,
      backgroundColor: 'bg-gray-50 dark:bg-black',
    },
  ];

  return (
    <div className="w-full h-full relative font-sans">
      <Script
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
        strategy="afterInteractive"
        type="module"
      />

      {/* 3D Model Viewer */}
      <div className="model-viewer-container relative w-full h-[350px] md:h-[600px]">
        <RetroGrid className="absolute inset-0 w-full h-full" width={50} angle={20} opacity={0.5} />
        <div className="pointer-events-none absolute top-[8%] left-0 w-[50%] h-1/4 " />
        <div className="pointer-events-none absolute top-[8%] right-0 w-[50%] h-1/4 " />
      </div>

      {/* Hero Section */}
      <section className="w-full absolute top-2 md:top-[0%] lg:top-[4%] pt-6 md:pt-14 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-20 px-4">
        <div className="w-full text-center md:text-left">
          <h1 className="text-2xl font-bold md:text-5xl lg:text-6xl">
            AI-Powered Mock Interviewer <span className="block md:inline"><SparklesText text={"for your Success"} sparklesCount={6} /></span>
          </h1>
        </div>
        <div className="w-full text-center md:text-left md:w-[40%]">
          <p className="text-gray-600 text-sm md:text-base font-bold">
            Questly AI is your personal AI-powered mock interviewer, designed to help you prepare for real-world interviews. With advanced AI technology, we provide realistic mock interviews, detailed feedback, and actionable insights to boost your confidence and performance.
          </p>
          <section className="w-full flex items-center gap-3 justify-center mt-4 md:justify-start">
            <Button className="px-6 py-2 md:px-8 md:py-3 rounded-full bg-emerald-500 text-white hover:bg-emerald-700 font-medium transition-colors duration-200">
              Get Started
            </Button>
            <Button className="px-6 py-2 md:px-8 md:py-3 rounded-full bg-white text-black hover:bg-gray-100">
              Learn More <GoArrowUpRight className="inline ml-2" />
            </Button>
          </section>
        </div>
      </section>

      {/* Demo Image for Mobile */}
      <section className="w-full mt-6 hidden px-4">
        <Image
          src="/demo_image.jfif"
          alt="DashBoard"
          width={600}
          height={400}
          className="w-full h-auto object-contain"
          loading="lazy"
        />
      </section>

      {/* Features Section */}
      <section className="w-full mt-8 px-4">
        <div className="w-full text-center">
          <h2 className="text-2xl font-bold md:text-4xl lg:text-5xl">Transform Your Interview Skills with AI</h2>
          <p className="text-gray-600 text-sm md:text-base font-bold mt-2 md:mt-4 max-w-2xl mx-auto">
            Questly AI is designed to help you excel in interviews by providing realistic mock interviews, personalized feedback, and actionable insights. Whether you're preparing for technical, behavioral, or situational interviews, Questly AI has you covered.
          </p>
        </div>

        {/* Video Section */}
        <div className="w-full mt-6">
          <HeroVideoDialog
            className="dark:hidden block w-full h-auto"
            animationStyle="from-center"
            videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
            thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
            thumbnailAlt="Hero Video"
          />
          <HeroVideoDialog
            className="hidden dark:block w-full h-auto"
            animationStyle="from-center"
            videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
            thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
            thumbnailAlt="Hero Video"
          />
        </div>

        {/* Cards Section */}
        <div className="w-full mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: <LockKeyhole size={37} className="bg-emerald-500 text-white rounded-sm p-2" />,
              title: "Realistic Mock Interviews",
              description: "Experience interviews that feel just like the real thing, with AI-powered simulations tailored to your target role.",
            },
            {
              icon: <BookmarkCheck size={37} className="bg-emerald-500 text-white rounded-sm p-2" />,
              title: "Personalized Feedback",
              description: "Get detailed feedback on your performance, including areas for improvement and actionable tips to succeed.",
            },
            {
              icon: <Database size={37} className="bg-emerald-500 text-white rounded-sm p-2" />,
              title: "AI-Driven Insights",
              description: "Leverage AI to analyze your strengths and weaknesses, helping you focus on what matters most.",
            },
          ].map((item, index) => (
            <div key={index} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-black border border-gray-200">
              {item.icon}
              <div className="w-full mt-3">
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-gray-500 text-sm font-bold mt-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="w-full mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <section className="w-full md:w-1/2 text-center md:text-left">
            <h3 className="text-2xl font-bold md:text-4xl">Why Choose Questly AI?</h3>
            <p className="text-gray-600 text-sm md:text-base font-bold mt-2 md:mt-4">
              Questly AI has helped over 100,000 candidates improve their interview skills, with a 40% boost in confidence, a 30% increase in interview success rates, and 20% faster job placements.
            </p>
            <Button className="mt-4 px-6 py-2 md:px-8 md:py-3 rounded-full bg-emerald-500 text-white hover:bg-emerald-700">
              Learn More <GoArrowUpRight className="inline ml-2 text-white" />
            </Button>
          </section>

          <section className="w-full md:w-1/2 grid grid-cols-2 gap-4 dark:text-white">
            {data.map((item, index) => (
              <div
                key={index}
                className={`w-full p-4 flex flex-col items-center dark:bg-black dark:border-[1px] justify-center transition-colors duration-200 rounded-xl 
                  ${hoveredIndex === index ? 'bg-emerald-500' : 'bg-gray-100'}`}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <div className={`flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full ${hoveredIndex === index ? 'bg-white' : item.backgroundColor}`}>
                  {item.icon}
                </div>
                <h4 className={`text-lg md:text-xl font-bold text-center mt-2 ${hoveredIndex === index ? 'text-white' : 'text-gray-800 dark:text-white'}`}>
                  {item.value}
                </h4>
                <span className={`text-sm text-center ${hoveredIndex === index ? 'text-white' : 'text-gray-800 dark:text-gray-500'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </section>
        </div>
      </section>

      {/* Features Image Section */}
      <section className="w-full py-16 px-4">
        <div className="relative max-w-7xl mx-auto h-[500px] flex flex-col items-center justify-center gap-6 overflow-hidden rounded-xl border bg-background shadow-lg">
          <h3 className="text-2xl md:text-4xl font-bold text-center leading-tight">
            Trusted by Over 100,000 Candidates
          </h3>
          <p className="text-gray-600 text-base md:text-lg font-medium text-center max-w-2xl">
            Hear from our users about how Questly AI helped them land their dream jobs.
          </p>
          <Marquee pauseOnHover className="[--duration:20s]">
            {reviews.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:20s]">
            {reviews.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white dark:from-background" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white dark:from-background" />
        </div>
      </section>

      <section className="w-full bg-white rounded-t-2xl mt-4 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 py-16 md:h-[450px] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="w-full text-center md:text-left">
            <h3 className="text-2xl md:text-4xl font-bold leading-tight mb-4 text-emerald-500 dark:text-white">
              Ready to Ace Your Interviews?
            </h3>
            <p className="text-gray-600 text-base md:text-lg mb-6 hidden md:block dark:text-gray-400">
              Join thousands of candidates who have transformed their interview skills with Questly AI.
            </p>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Button className="px-6 py-2.5 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                Get Started <GoArrowUpRight className="inline ml-2 text-white dark:text-white" />
              </Button>
              <Button className="hidden md:flex px-6 py-2.5 rounded-full bg-transparent border border-emerald-500 text-emerald-500 hover:bg-emerald-100 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">
                Learn More <GoArrowUpRight className="inline ml-2 text-emerald-500 dark:text-white" />
              </Button>
            </div>
          </div>
          <div className="w-full overflow-hidden rounded-2xl">
            <Image
              width={400}
              height={200}
              src="/woman.jpg"
              alt="Woman"
              className="w-full h-full object-cover rounded-2xl transition-transform duration-300 ease-in-out hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default React.memo(LandingPage);