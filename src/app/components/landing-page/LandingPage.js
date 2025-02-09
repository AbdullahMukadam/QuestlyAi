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

  if (loading) {
    return <SkeletonLoader />;
  }

  const reviews = [
    {
      name: "Jack",
      username: "@jack",
      body: "I've never seen anything like this before. It's amazing. I love it.",
      img: "https://avatar.vercel.sh/jack",
    },
    {
      name: "Jill",
      username: "@jill",
      body: "I don't know what to say. I'm speechless. This is amazing.",
      img: "https://avatar.vercel.sh/jill",
    },
    {
      name: "Alex",
      username: "@Alex",
      body: "I don't know what to say. I'm speechless. This is amazing.",
      img: "https://avatar.vercel.sh/jill",
    },
    // ... add more reviews as needed
  ]

  const data = [
    {
      value: '100K',
      label: 'Users Active',
      icon: <LucideUser size={24} />,
      backgroundColor: 'bg-gray-50',
    },
    {
      value: 'Upto 40%',
      label: 'Reduce Hiring Time',
      icon: <LucideLink2 size={24} />,
      backgroundColor: 'bg-gray-50',
    },
    {
      value: '30%',
      label: 'Interview Accuracy',
      icon: <LucideBox size={24} />,
      backgroundColor: 'bg-gray-50',
    },
    {
      value: '20%',
      label: 'Employee Rates',
      icon: <LucideTreeDeciduous size={24} />,
      backgroundColor: 'bg-gray-50',
    },
  ];

  return (
    <div className="w-full h-full relative">
      <Script
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
        strategy="afterInteractive"
        type="module"
      />

      {/* 3D Model Viewer */}
      <div className="model-viewer-container hidden md:block">
        <model-viewer
          src="/models/Baymax.glb"
          alt="A 3D model"
          camera-controls
          auto-rotate
          className="w-full h-full"
        ></model-viewer>
      </div>

      {/* Hero Section */}
      <section className="w-full md:absolute md:top-[0%] lg:top-[5%] pt-6 md:pt-14 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-20 px-4">
        <div className="w-full text-center md:text-left">
          <h1 className="text-2xl font-bold md:text-5xl lg:text-6xl">
            All-in-One AI <span className="block md:inline">Interviewer Platform</span>
          </h1>
        </div>
        <div className="w-full text-center md:text-left md:w-[40%]">
          <p className="text-gray-600 text-sm md:text-base font-bold">
            Our Platform Combines advanced Artificial Technologies with Intuitive features to
            streamline your talent selection process, saving your time, effort, and resources.
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
      <section className="w-full mt-6 md:hidden px-4">
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
          <h2 className="text-2xl font-bold md:text-4xl lg:text-5xl">Transform Hiring Through Innovation</h2>
          <p className="text-gray-600 text-sm md:text-base font-bold mt-2 md:mt-4 max-w-2xl mx-auto">
            At QuestlyAI, we're passionate about redefining the hiring process for the modern era. We
            understand that traditional methods can be time-consuming and hinder the ability to
            truly identify the best talent.
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
              title: "Unbiased Insights",
              description: "Advanced Algorithms Assess skills providing you with an accurate representation of each candidate.",
            },
            {
              icon: <BookmarkCheck size={37} className="bg-emerald-500 text-white rounded-sm p-2" />,
              title: "Efficient Evaluation",
              description: "Save Time By identifying top candidates quickly, automated analysis of technical skills, problem solving abilities and more.",
            },
            {
              icon: <Database size={37} className="bg-emerald-500 text-white rounded-sm p-2" />,
              title: "Data-Driven Decisions",
              description: "Comprehensive view of candidate performance across interview enabling you to choose best candidates.",
            },
          ].map((item, index) => (
            <div key={index} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200">
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
            <h3 className="text-2xl font-bold md:text-4xl">Why Choose QuestlyAI?</h3>
            <p className="text-gray-600 text-sm md:text-base font-bold mt-2 md:mt-4">
              Our Platform has helped reduce the hiring time up to 40%, increased interview accuracy up to 30% and brought a 20% improvement in employee retention rate.
            </p>
            <Button className="mt-4 px-6 py-2 md:px-8 md:py-3 rounded-full bg-emerald-500 text-white hover:bg-emerald-700">
              Learn More <GoArrowUpRight className="inline ml-2 text-white" />
            </Button>
          </section>

          <section className="w-full md:w-1/2 grid grid-cols-2 gap-4">
            {data.map((item, index) => (
              <div
                key={index}
                className={`w-full p-4 flex flex-col items-center justify-center transition-colors duration-200 rounded-xl 
                  ${hoveredIndex === index ? 'bg-emerald-500' : 'bg-gray-100'}`}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <div className={`flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full ${hoveredIndex === index ? 'bg-white' : item.backgroundColor}`}>
                  {item.icon}
                </div>
                <h4 className={`text-lg md:text-xl font-bold text-center mt-2 ${hoveredIndex === index ? 'text-white' : 'text-gray-800'}`}>
                  {item.value}
                </h4>
                <span className={`text-sm text-center ${hoveredIndex === index ? 'text-white' : 'text-gray-800'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </section>
        </div>
      </section>

      {/* Features Image Section */}
      <section className="w-full py-16 px-4">
        <div className="max-w-7xl mx-auto md:flex items-center justify-between gap-8">
          <div className="w-full flex flex-col items-center gap-6 text-center mb-8 md:mb-0">
            <h3 className="text-2xl md:text-4xl font-bold leading-tight">
              Powerful Features for Enhanced Experience
            </h3>
            <Image
              width={600}
              height={400}
              src="/Features-img.svg"
              alt="Features"
              className="w-full h-auto max-w-2xl"
              loading="lazy"
            />
          </div>
          <div className="hidden md:flex w-full flex-col gap-6">
            <p className="text-gray-600 text-base lg:text-lg text-center font-medium">
              Our features are meticulously crafted to empower you with tools you need to make informed decisions, foster a fair evaluation environment, and ultimately build exceptional teams.
            </p>
            <div className="space-y-6">
              <div className="bg-slate-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-2xl md:text-3xl font-bold mb-3">Behavioral Analysis</h3>
                <p className="text-gray-600 text-base font-medium mb-4">
                  Leverage NLP and video analysis to gain insights into candidates, communication skills, body language and cultural fit, helping you make holistic hiring decisions.
                </p>
                <Button className="px-6 py-2.5 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">
                  Learn More <GoArrowUpRight className="inline ml-2" />
                </Button>
              </div>
              <div className="bg-slate-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-2xl md:text-3xl font-bold mb-3">Real Time Feedback</h3>
                <p className="text-gray-600 text-base font-medium mb-4">
                  Get AI generated feedbacks during live interviews, assisting interviewers in asking follow-up questions and addressing potential concerns.
                </p>
                <Button className="px-6 py-2.5 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">
                  Learn More <GoArrowUpRight className="inline ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-16 px-4">
        <div className="relative max-w-7xl mx-auto h-[500px] flex flex-col items-center justify-center gap-6 overflow-hidden rounded-xl border bg-background shadow-lg">
          <h3 className="text-2xl md:text-4xl font-bold text-center leading-tight">
            More than 1000 Users <br /> Testimony this Product
          </h3>
          <p className="text-gray-600 text-base md:text-lg font-medium text-center max-w-2xl">
            Let our users tell you how their opinion about using QuestlyAI as their partner.
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

      <section className="w-full bg-emerald-600 rounded-t-2xl mt-4">
        <div className="max-w-7xl mx-auto px-4 py-16 md:h-[450px] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="w-full text-center md:text-left">
            <h3 className="text-2xl md:text-4xl text-white font-bold leading-tight mb-4">
              Ready to Revolutionize <br /> your Hiring?
            </h3>
            <p className="text-white/90 text-base md:text-lg mb-6 hidden md:block">
              Let our users tell you how their opinion about using QuestlyAI as their partner.
            </p>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Button className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-gray-100 transition-colors">
                Get Started <GoArrowUpRight className="inline ml-2" />
              </Button>
              <Button className="hidden md:flex px-6 py-2.5 rounded-full bg-transparent border border-white text-white hover:bg-white/10 transition-colors">
                Learn More <GoArrowUpRight className="inline ml-2" />
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