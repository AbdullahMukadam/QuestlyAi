
import { Button } from '@/components/ui/button'
import { SplineScene } from '@/components/ui/splite';
import React from 'react'
import { GoArrowUpRight } from "react-icons/go";

function LandingPage() {
  return (
    <div className='w-full h-full relative'>
      <SplineScene
        className="hidden md:block w-full h-[100vh]"
        scene={"https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"}
      />
      <section className='w-full h-[30%] md:absolute md:top-0 pt-6 md:flex items-center justify-center md:pt-16 gap-20'>
        <div className='w-full text-center '>
          <h1 className='text-2xl font-bold md:text-[60px] md:flex items-start flex-col gap-6'>All-in-One AI <span className='text-center'>Interviewer </span>Platform</h1>
        </div>
        <div className='w-full text-center mt-3 md:text-start md:w-[40%]'>
          <p className='text-gray-600 text-sm font-bold'>Our Platform Combines advanced Artificial Technologies with Intuitive features to streamline your talent selection process, saving your time, effort, and resources. </p>
          <section className='w-full flex items-center gap-3 justify-center mt-4 md:justify-start'>
            <Button className="px-8 py-3 rounded-full bg-[#18B088]  text-white hover:bg-green-800 hover: font-medium transition duration-200">Get Started</Button>
            <Button className="px-8 py-3 rounded-full bg-white text-black ">Learn More <span><GoArrowUpRight /></span></Button>
          </section>
        </div>
      </section>
      <section className='w-full mt-8'>
        {/*Todo To add a Image here */}
        <div className='w-full text-center flex items-center flex-col'>
          <h2 className='text-2xl font-bold  md:text-[55px]'>Transform Hiring Through Inovation</h2>
          <div className='w-[60%]'>
          <p className='text-gray-600 text-sm font-bold mt-2 md:mt-6'>At QuestlyAI, were passionate about redifing the hiring process for modern era. We Understand that Trditional methods can be time consuming and hinder the ability to truly Identify the best talent.</p>
          </div>
          
        </div>
      </section>
    </div>
  )
}

export default LandingPage