"use client";
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { GoArrowUpRight } from 'react-icons/go';
import Script from 'next/script';
import SkeletonLoader from './loader';
import Image from 'next/image';
import HeroVideoDialog from '@/components/ui/hero-video-dialog';
import { BookmarkCheck, Bot, BotMessageSquare, Circle, CircleUserRound, Database, LockKeyhole, MessageCircle } from 'lucide-react';
import { LucideUser, LucideLink2, LucideBox, LucideTreeDeciduous } from 'lucide-react';
import { Marquee } from '@/components/magicui/marquee';
import Footer from '../common/Footer';
import { RetroGrid } from '@/components/magicui/retro-grid';
import { InteractiveGridPattern } from '@/components/magicui/interactive-grid-pattern';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { Spotlight } from '@/components/ui/spotlight';
import { useRouter } from 'next/navigation';
import InteractiveHero from '@/components/hero-section-nexus';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';
import Link from 'next/link';
import { GoogleGeminiEffect } from '@/components/ui/google-gemini-effect';
import { useScroll, useTransform } from "motion/react";

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
  const router = useRouter()
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

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

  const people1 = [
    {
      id: 1,
      name: "John Doe",
      designation: "Software Engineer",
      image:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
    },
    {
      id: 2,
      name: "Robert Johnson",
      designation: "Product Manager",
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
  ];

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


      {/* 3D Model Viewer */}


      {/* Hero Section */}
      <InteractiveHero />

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
      <section className="w-full mt-0 pt-6 px-4 dark:bg-zinc-950">
        {/* <div className="w-full text-center">
          <h2 className="text-2xl font-bold md:text-4xl lg:text-5xl">Transform Your Interview Skills with AI</h2>
          <p className="text-gray-600 text-sm md:text-base font-bold mt-2 md:mt-4 max-w-2xl mx-auto">
            Questly AI is designed to help you excel in interviews by providing realistic mock interviews, personalized feedback, and actionable insights. Whether you're preparing for technical, behavioral, or situational interviews, Questly AI has you covered.
          </p>
        </div> */}

        {/* Video Section */}
        {/* <div className="w-full mt-6">
          <HeroVideoDialog
            className="dark:hidden block w-full h-auto"
            animationStyle="from-center"
            videoSrc="https://go.screenpal.com/player/cTeVoVn1DaO?width=100%&height=100%&ff=1&title=0&embed=1"
            thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
            thumbnailAlt="Hero Video"
          />
          <HeroVideoDialog
            className="hidden dark:block w-full h-auto"
            animationStyle="from-center"
            videoSrc="https://go.screenpal.com/player/cTeVoVn1DaO?width=100%&height=100%&ff=1&title=0&embed=1"
            thumbnailSrc="/new-dark-screenshot.PNG"
            thumbnailAlt="Hero Video"
          />
        </div> */}

        {/* Cards Section */}
        <div className='w-full p-4 md:p-8 z-50 text-white'>
          <div className='w-full flex flex-col md:flex-row md:items-center justify-between'>
            <div className='w-full md:w-[70%] mb-6 md:mb-0'>
              <h1 className='text-3xl md:text-6xl text-white'>Designed for Designers. <br /> Powered by <span className='text-[#0CF2A0]'>AI</span>.</h1>
              <p className='text-white text-sm md:text-base mt-3 font-thin'>Unlock the full potential of your creativity with our AI-powered design assistant. <br className='hidden md:block' /> Explore new dimensions of design</p>
            </div>
            <div className='w-full md:w-[50%] flex justify-center'>
              <img className='w-16 h-20 md:w-28 md:h-28' src="/Vector (2).png" alt="vector" />
            </div>
          </div>
          <div className='w-full p-2 mt-6 md:mt-8'>
            <div className='w-full flex flex-col md:flex-row items-center gap-4 md:gap-6 justify-between'>
              <div className='w-full md:w-[40%] p-4 bg-[#272829] bg-custom-gradient rounded-2xl'>
                <div className='w-full flex gap-2 justify-between'>
                  <p className='text-[#D9D9D9] text-sm md:text-base flex-1'>Skip the blank canvas and spark creativity instantly. Our AI generates high-quality, on-brand design concepts within seconds</p>
                  <Image width={12} height={12} className='w-12 h-12 md:w-15 md:h-15 flex-shrink-0 cursor-pointer' src="/Background.svg" alt="arrow" />
                </div>
                <h2 className='text-2xl md:text-4xl text-white mt-4 md:mt-6'>Instant Ideation</h2>
              </div>
              <div className='w-full md:w-[60%] p-4 bg-[#272829] rounded-2xl'>
                <div className='w-full flex gap-2 justify-between'>
                  <p className='text-[#D9D9D9] text-sm md:text-base flex-1'>No two creators are the same, and neither are their styles. Our AI learns from your inputs, understands your aesthetic preferences, and fine-tunes every design</p>
                  <Image width={12} height={12} className='w-12 h-12 md:w-15 md:h-15 flex-shrink-0 cursor-pointer' src="/Background.svg" alt="arrow" />
                </div>
                <h2 className='text-2xl md:text-4xl text-white mt-4 md:mt-6'>Smart Adaptability</h2>
              </div>
            </div>
            <div className='w-full flex flex-col md:flex-row items-center gap-4 md:gap-6 justify-between mt-3'>
              <div className='w-full md:w-[60%] p-4 bg-[#272829] rounded-2xl'>
                <div className='w-full flex gap-2 justify-between'>
                  <p className='text-[#D9D9D9] text-sm md:text-base flex-1'>Design once, export anywhere. Whether you need high-res graphics for print, responsive visuals for the web, mobile-optimized assets,</p>
                  <Image width={12} height={12} className='w-12 h-12 md:w-15 md:h-15 flex-shrink-0 cursor-pointer' src="/Background.svg" alt="arrow" />
                </div>
                <h2 className='text-2xl md:text-4xl text-white mt-4 md:mt-6'>Multi-Format Export</h2>
              </div>
              <div className='w-full md:w-[40%] p-4 bg-[#272829] bg-custom-gradient rounded-2xl'>
                <div className='w-full flex gap-2 justify-between'>
                  <p className='text-[#D9D9D9] text-sm md:text-base flex-1'>Say goodbye to repetitive tweaks and endless back-and-forths. With intuitive prompt-based editing</p>
                  <Image width={12} height={12} className='w-12 h-12 md:w-15 md:h-15 flex-shrink-0 cursor-pointer' src="/Background.svg" alt="arrow" />
                </div>
                <h2 className='text-2xl md:text-4xl text-white mt-4 md:mt-6'>Seamless Revisions</h2>
              </div>
            </div>
          </div>
        </div>
        <div className='w-full p-2 relative'>
          <div className='w-full h-full relative z-10'>
            <div className='w-full flex items-center justify-center mt-7'>
              <div className='w-full md:w-[50%] p-2 flex gap-2 md:gap-4 items-start'>
                <span className='text-[#D9D9D9] flex-shrink-0 text-sm md:text-base'>2025</span>
                <p className='text-white font-bold text-sm md:text-xl'>Whether you re designing for personal projects, creative teams, or large-scale campaigns, our AI-powered platform is built to bring your ideas to life—quickly, beautifully, and intelligently. And the results? The numbers speak for themselves:</p>
              </div>
            </div>
            <div className='w-full p-2 flex flex-col items-center justify-center'>
              <div className='w-[95%] min-h-[240px] p-2 md:p-4 mt-10 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-white'>
                <section className='flex flex-col'>
                  <h3 className='text-4xl md:text-6xl font-bold'>2014</h3>
                  <h6 className='text-lg md:text-xl'>Year of establishment</h6>
                  <span className='text-gray-700 text-sm md:text-base'>More than 10 years in the field</span>
                  <div className='w-full flex items-center mt-2'>
                    <AnimatedTooltip items={people1} />
                    <svg className='-translate-y-2 md:-translate-y-4 w-32 md:w-auto' width="195" height="93" viewBox="0 0 195 93" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="0.855469" y1="65.5112" x2="194.833" y2="65.5113" stroke="#D6DBDC" strokeWidth="0.932584" />
                      <line x1="171.982" y1="0.696533" x2="171.982" y2="92.0898" stroke="#D6DBDC" strokeWidth="0.932584" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M157.996 63.1321L171.051 65.9194L165.332 65.9194L157.996 64.2997L157.996 63.1321ZM157.996 68.5943L165.332 67.012L171.052 67.012L157.996 69.7554L157.996 68.5943Z" fill="#D6DBDC" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M185.043 63.1321L171.988 65.9194L177.707 65.9194L185.043 64.2997L185.043 63.1321ZM185.043 68.5943L177.707 67.012L171.987 67.012L185.043 69.7554L185.043 68.5943Z" fill="#D6DBDC" />
                    </svg>
                  </div>
                </section>
                <section className='flex flex-col md:translate-y-14'>
                  <h3 className='text-4xl md:text-6xl font-bold'>302</h3>
                  <h6 className='text-lg md:text-xl'>Projects are launched</h6>
                  <span className='text-gray-700 text-sm md:text-base'>A lot of projects are done</span>
                  <div className='w-full flex items-center mt-2'>
                    <AnimatedTooltip items={people1} />
                    <svg className='translate-y-2 md:translate-y-4 w-40 md:w-auto' width="240" height="94" viewBox="0 0 240 94" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="0.234375" y1="28.646" x2="239.909" y2="28.646" stroke="#D6DBDC" strokeWidth="0.932584" />
                      <line x1="217.061" y1="93.4607" x2="217.061" y2="0.202263" stroke="#D6DBDC" strokeWidth="0.932584" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M204.008 31.9575L217.062 29.1702L211.344 29.1702L204.008 30.7899L204.008 31.9575ZM204.008 26.4953L211.343 28.0776L217.064 28.0776L204.008 25.3342L204.008 26.4953Z" fill="#D6DBDC" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M231.055 31.9575L218 29.1702L223.719 29.1702L231.055 30.7899L231.055 31.9575ZM231.055 26.4953L223.719 28.0776L217.999 28.0776L231.055 25.3342L231.055 26.4953Z" fill="#D6DBDC" />
                    </svg>
                  </div>
                </section>
                <section className='flex flex-col'>
                  <h3 className='text-4xl md:text-6xl font-bold'>189</h3>
                  <h6 className='text-lg md:text-xl'>Clients are satisfied</h6>
                  <span className='text-gray-700 text-sm md:text-base'>These people love us</span>
                  <div className='w-full flex items-center mt-2'>
                    <AnimatedTooltip items={people1} />
                    <svg className='-translate-y-2 md:-translate-y-4 w-32 md:w-auto' width="195" height="93" viewBox="0 0 195 93" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="0.855469" y1="65.5112" x2="194.833" y2="65.5113" stroke="#D6DBDC" strokeWidth="0.932584" />
                      <line x1="171.982" y1="0.696533" x2="171.982" y2="92.0898" stroke="#D6DBDC" strokeWidth="0.932584" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M157.996 63.1321L171.051 65.9194L165.332 65.9194L157.996 64.2997L157.996 63.1321ZM157.996 68.5943L165.332 67.012L171.052 67.012L157.996 69.7554L157.996 68.5943Z" fill="#D6DBDC" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M185.043 63.1321L171.988 65.9194L177.707 65.9194L185.043 64.2997L185.043 63.1321ZM185.043 68.5943L177.707 67.012L171.987 67.012L185.043 69.7554L185.043 68.5943Z" fill="#D6DBDC" />
                    </svg>
                  </div>
                </section>
                <section className='flex flex-col md:translate-y-14'>
                  <h3 className='text-4xl md:text-6xl font-bold'>12</h3>
                  <h6 className='text-lg md:text-xl'>Projects in work</h6>
                  <span className='text-gray-700 text-sm md:text-base'>What we do right now</span>
                  <div className='w-full flex items-center mt-2'>
                    <AnimatedTooltip items={people1} />
                    <svg className='translate-y-2 md:translate-y-4 w-40 md:w-auto' width="240" height="94" viewBox="0 0 240 94" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="0.234375" y1="28.646" x2="239.909" y2="28.646" stroke="#D6DBDC" strokeWidth="0.932584" />
                      <line x1="217.061" y1="93.4607" x2="217.061" y2="0.202263" stroke="#D6DBDC" strokeWidth="0.932584" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M204.008 31.9575L217.062 29.1702L211.344 29.1702L204.008 30.7899L204.008 31.9575ZM204.008 26.4953L211.343 28.0776L217.064 28.0776L204.008 25.3342L204.008 26.4953Z" fill="#D6DBDC" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M231.055 31.9575L218 29.1702L223.719 29.1702L231.055 30.7899L231.055 31.9575ZM231.055 26.4953L223.719 28.0776L217.999 28.0776L231.055 25.3342L231.055 26.4953Z" fill="#D6DBDC" />
                    </svg>
                  </div>
                </section>
              </div>
              <div className='w-full p-1 mt-12 md:mt-24 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8'>
                <Link

                  href="/sign-in"
                  className="flex w-full md:w-[160px] items-center justify-center gap-x-2 rounded-md bg-green-600 px-6 py-2 text-base font-semibold text-black shadow-sm transition hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                >
                  Get Started
                  <span aria-hidden="true">→</span>
                </Link>
                <div className='flex gap-3 items-center'>
                  <p className='text-gray-400 text-sm md:text-base'>Slots are avalible</p>
                  <Circle className='text-green-500 bg-green-500 h-3 w-3 rounded-full' />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}

      </section>

      {/* Features Image Section */}
      <section className="w-full py-16 px-4">
        <div className="relative max-w-7xl mx-auto h-[500px] pt-4 flex flex-col items-center justify-center gap-6 overflow-hidden rounded-xl border bg-background shadow-lg">
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

      <section className="w-full rounded-t-2xl mt-0 dark:bg-zinc-950" ref={ref}>
        {/* <div className="max-w-7xl mx-auto px-4 py-16 md:h-[450px] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="w-full text-center md:text-left">
            <h3 className="text-2xl md:text-4xl font-bold leading-tight mb-4 text-emerald-500 dark:text-white">
              Ready to Ace Your Interviews?
            </h3>
            <p className="text-gray-600 text-base md:text-lg mb-6 hidden md:block dark:text-gray-400">
              Join thousands of candidates who have transformed their interview skills with Questly AI.
            </p>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Button onClick={() => router.push("/sign-up")} className="px-6 py-2.5 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                Get Started <GoArrowUpRight className="inline ml-2 text-white dark:text-white" />
              </Button>
              <Button onClick={() => router.push("/TermsandCondition")} className="hidden md:flex px-6 py-2.5 rounded-full bg-transparent border border-emerald-500 text-emerald-500 hover:bg-emerald-100 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">
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
        </div> */}
        <GoogleGeminiEffect
        title={"Want Custom Features"}
          pathLengths={[
            pathLengthFirst,
            pathLengthSecond,
            pathLengthThird,
            pathLengthFourth,
            pathLengthFifth,
          ]}
         
        />
      </section>
      {/* <Footer /> */}
    </div>
  );
}

export default React.memo(LandingPage);