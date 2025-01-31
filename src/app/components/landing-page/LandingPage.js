"use client";
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { GoArrowUpRight } from 'react-icons/go';
import Script from 'next/script';
import SkeletonLoader from './loader';
import Image from 'next/image';
import HeroVideoDialog from '@/components/ui/hero-video-dialog';
import { BookmarkCheck, Database, LockKeyhole } from 'lucide-react';

function LandingPage() {
  const [loading, setloading] = useState(true)

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
          <div className='w-full mt-2 p-1 flex items-center justify-center gap-4 flex-col md:flex-row'>
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
        </div>
      </section>
    </div>
  )
}

export default React.memo(LandingPage);