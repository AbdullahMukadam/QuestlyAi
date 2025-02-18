"use client"
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { fetchInterviewDetails } from '@/app/actions/QuestionsAction'
import Webcam from 'react-webcam'
import { WebcamIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

function InterviewScreen({ id }) {
  const [questions, setQuestions] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [webcamEnable, setwebcamEnable] = useState(false)
  const dataFetched = React.useRef(false)

  useEffect(() => {
    if (!dataFetched.current && id) {
      const fetchData = async () => {
        try {
          const fetchDetails = await fetchInterviewDetails(id)
          if (fetchDetails) {
            setQuestions(fetchDetails)
          }
        } catch (error) {
          console.error("Error fetching interview details:", error)
        } finally {
          setIsLoading(false)
          dataFetched.current = true
        }
      }
      fetchData()
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-lg">Loading...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="mb-8 text-3xl font-bold text-center">Let's get started</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Job Details Card */}
        <Card className="h-fit shadow-md">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500">Job Type</span>
                <p className="text-lg font-medium capitalize">{questions[0].jobType}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Job Description</span>
                <p className="text-lg font-medium capitalize">{questions[0].jobDescription}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Experience Required</span>
                <p className="text-lg font-medium capitalize">{questions[0].jobExperience}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Webcam Section */}
        <div className="flex flex-col gap-4">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            {webcamEnable ? (
              <Webcam
                className="w-full h-full object-cover"
                onUserMedia={() => setwebcamEnable(true)}
                onUserMediaError={()=> setwebcamEnable(false)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <WebcamIcon size={45} />
                <p className="mt-2 text-sm">Camera is disabled</p>
              </div>
            )}
          </div>
          <Button
            className="w-full"
            onClick={() => setwebcamEnable(!webcamEnable)}
          >
            {webcamEnable ? 'Disable' : 'Enable'} Webcam
          </Button>
        </div>
      </div>
    </div>
  )
}

export default InterviewScreen