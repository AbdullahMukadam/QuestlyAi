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

function LandingPage() {
  const [loading, setloading] = useState(true)
  const [hoveredIndex, setHoveredIndex] = useState(0);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const ImageStyle = {
    width: "100%"
  }

  useEffect(() => {
    const timerId = setTimeout(() => {
      setloading(false)
    }, 3000);
    return () => clearInterval(timerId)
  }, [])

  if (loading) {
    return <SkeletonLoader />
  }

  const data = [
    {
      value: '100K',
      label: 'Users Active',
      icon: <LucideUser size={24} />,
      backgroundColor: 'bg-[##f8f9fa]'
    },
    {
      value: 'Upto 40%',
      label: 'Reduce Hiring Time',
      icon: <LucideLink2 size={24} />,
      backgroundColor: 'bg-[##f8f9fa]'
    },
    {
      value: '30%',
      label: 'Interview Accuracy',
      icon: <LucideBox size={24} />,
      backgroundColor: 'bg-[##f8f9fa]'
    },
    {
      value: '20%',
      label: 'Employee Rates',
      icon: <LucideTreeDeciduous size={24} />,
      backgroundColor: 'bg-[##f8f9fa]'
    },
  ];

  return (
    <div className="w-full h-full relative">
      {/* Load the model-viewer script */}
      <Script
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
        strategy="afterInteractive"
        type="module"
      />

      {/* Responsive container for the model-viewer */}
      <div className="model-viewer-container hidden md:block">
        <model-viewer
          src="/models/Baymax.glb"
          alt="A 3D model"
          camera-controls
          auto-rotate
          style={{ width: '100%', height: '100%' }}
        ></model-viewer>
      </div>

      {/* Landing page content */}
      <section className="w-full h-[30%] md:absolute md:top-0 pt-6 md:flex items-center justify-center md:pt-16 gap-20">
        <div className="w-full text-center ">
          <h1 className="text-2xl font-bold md:text-[60px] md:flex items-start flex-col gap-6">
            All-in-One AI <span className="text-center">Interviewer </span>Platform
          </h1>
        </div>
        <div className="w-full text-center mt-3 md:text-start md:w-[40%]">
          <p className="text-gray-600 text-sm font-bold">
            Our Platform Combines advanced Artificial Technologies with Intuitive features to
            streamline your talent selection process, saving your time, effort, and resources.{' '}
          </p>
          <section className="w-full flex items-center gap-3 justify-center mt-4 md:justify-start">
            <Button className="px-8 py-3 rounded-full bg-[#18B088]  text-white hover:bg-green-800 hover: font-medium transition duration-200">
              Get Started
            </Button>
            <Button className="px-8 py-3 rounded-full bg-white text-black ">
              Learn More <span>{<GoArrowUpRight />}</span>
            </Button>
          </section>

        </div>
      </section>
      <section className='w-full mt-4 relative flex justify-center md:hidden'>
        <Image
          src={"/demo_image.jfif"}
          alt='DashBoard'
          width={400}
          height={300}
          objectFit='contain'
          loading='lazy'
        />
      </section>
      <section className="w-full mt-8">
        <div className="w-full text-center flex items-center flex-col">
          <h2 className="text-2xl font-bold  md:text-[55px]">Transform Hiring Through Inovation</h2>
          <div className="w-full md:w-[60%] p-2">
            <p className="text-gray-600 text-sm font-bold mt-2 md:mt-6">
              At QuestlyAI, were passionate about redifing the hiring process for modern era. We
              Understand that Trditional methods can be time consuming and hinder the ability to
              truly Identify the best talent.
            </p>
          </div>
          <div className='w-full relative p-1'>
            <HeroVideoDialog
              className="dark:hidden block h-full"
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
              thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
              thumbnailAlt="Hero Video"
            />
            <HeroVideoDialog
              className="hidden h-full dark:block"
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
              thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
              thumbnailAlt="Hero Video"
            />
          </div>
          <div className='w-full md:mt-2 p-1 flex items-center justify-center gap-4 flex-col md:flex-row'>
            <div className='w-full p-3 rounded-2xl bg-slate-50'>
              <LockKeyhole size={37} className=' bg-[#18B088] text-white rounded-sm p-2' />
              <div className='w-full p-1 text-start mt-3'>
                <h3 className='text-xl mb-2 font-bold'>UnBiased Insights</h3>
                <p className='text-gray-500 text-sm font-bold'>Advanced Algorithms Assess skills providing you with an accurate representation of each candidate.</p>
              </div>
            </div>
            <div className='w-full p-3 rounded-2xl bg-slate-50'>
              <BookmarkCheck size={37} className=' bg-[#18B088] text-white rounded-sm p-2' />
              <div className='w-full p-1 text-start mt-3'>
                <h3 className='text-xl mb-2 font-bold'>Efficient Evaluation</h3>
                <p className='text-gray-500 text-sm font-bold'>Save Time By identifying top candidates quickly, automated analysis of technical skills, problem solving abilities and more.</p>
              </div>
            </div>
            <div className='w-full p-3 rounded-2xl bg-slate-50'>
              <Database size={37} className=' bg-[#18B088] text-white rounded-sm p-2' />
              <div className='w-full p-1 text-start mt-3'>
                <h3 className='text-xl mb-2 font-bold'>Data-Driven Decisions</h3>
                <p className='text-gray-500 text-sm font-bold'>Comprehensive view of candidate performance across interview enabling you to choose best candidates.</p>
              </div>
            </div>
          </div>
          <div className='w-full p-1 md:flex items-center justify-between'>
            <section className='w-full p-1 flex items-center gap-2 flex-col'>
              <h3 className='text-2xl font-bold  md:text-[40px]'>Why Choose QuestlyAI?</h3>
              <p className='text-gray-600 text-sm font-bold mt-2 md:mt-6'>Our Platform has helped Reduced the hiring time upto 40%, increased interview accuracy upto 30% and bought a 20% improvement in employee retention rate. </p>
              <Button className="px-8 py-3 rounded-full bg-[#18B088] text-black ">
                Learn More <span>{<GoArrowUpRight color='white' />}</span>
              </Button>
            </section>
            <section className='w-full p-4 border-gray-600 border-[1px] rounded-xl mt-1 grid grid-cols-2 grid-rows-2 gap-3'>
              {data.map((item, index) => (
                <div
                  key={index}
                  className={`w-full p-4 flex flex-col items-center justify-center rounded-xl 
                     ${hoveredIndex === index ? 'bg-[#18B088]' : 'bg-slate-100'}`}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className={`flex items-center justify-center w-16 h-16 rounded-full ${hoveredIndex === index ? 'bg-white' : item.backgroundColor}`}>
                    {item.icon}
                  </div>
                  <h4 className={`text-xl font-bold text-center ${hoveredIndex === index ? 'text-white' : 'text-gray-800'}`}>
                    {item.value}
                  </h4>
                  <span className={`text-sm text-center ${hoveredIndex === index ? 'text-white' : 'text-gray-800'}`}>{item.label}</span>
                </div>
              ))}
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}

export default React.memo(LandingPage);