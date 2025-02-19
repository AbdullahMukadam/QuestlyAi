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
import { useRouter } from 'next/navigation'
import { TypingAnimation } from '@/components/magicui/typing-animation'

function InterviewScreen({ id }) {
  const [interviewDetails, setinterviewDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [webcamEnable, setwebcamEnable] = useState(false)
  const dataFetched = React.useRef(false)
  const [startInterview, setstartInterview] = useState(false)
  const router = useRouter()
  const [questions, setquestions] = useState(null)
  const [index, setindex] = useState(0)
  const [startedSpeech, setstartedSpeech] = useState(false)

  //console.log(questions.length)
  useEffect(() => {

    if (!dataFetched.current && id) {
      const fetchData = async () => {
        try {
          const fetchDetails = await fetchInterviewDetails(id)
          if (fetchDetails) {
            setinterviewDetails(fetchDetails[0])
            const filteredQuestions = fetchDetails[0].data.map((ques) => ques.question)
            setquestions(filteredQuestions)
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

  const handleInterviewStart = () => {
    setstartInterview(true)
    /*  if (webcamEnable) {
       setstartInterview(true)
     } else {
       setstartInterview(false)
     } */
  }

  const handleSpeechSynthesis = () => {
    setstartedSpeech(true)
    const message = questions[index]
    let utterance = new SpeechSynthesisUtterance(message)
    speechSynthesis.speak(utterance)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-lg">Loading...</span>
      </div>
    )
  }

  if (startInterview) {
    return (
      <div className='w-full p-4'>
        <div className='w-full'>
          <Card>
            <CardContent>
              <div className='w-full flex items-center justify-between mt-2'>
                <Button variant="outline" disabled={index === 0} onClick={() => setindex(index - 1)}>Prev</Button>
                <Button variant="outline" disabled={questions.length - 1 === index} onClick={() => setindex(index + 1)}>Next</Button>
              </div>
              <div className='w-full bg-zinc-900 flex items-center gap-3 flex-col'>
                <h1 className='font-semibold'>Question:</h1>
                <Button onClick={handleSpeechSynthesis}>Start</Button>
                {/*Todo: To add Voice Visualizer */}
                {startedSpeech && <TypingAnimation className={"text-sm text-center"}>{questions[index]}</TypingAnimation>}
              </div>
            </CardContent>
          </Card>
        </div>
        <div>

        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="mb-8 text-3xl font-bold text-center">Let's get started</h1>
      <div className='flex items-center justify-center mb-2'>
        <Button onClick={() => router.push("/")}>Back To HomePage</Button>
      </div>
      {!webcamEnable && <h3 className='font-semibold text-red-600 text-center mb-3'>Please Enable Webcam to get started.<br /> Dont worry we wont record your video</h3>}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Job Details Card */}
        <Card className="h-fit shadow-md">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500">Job Type</span>
                <p className="text-lg font-medium capitalize">{interviewDetails.jobType}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Job Description</span>
                <p className="text-lg font-medium capitalize">{interviewDetails.jobDescription}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Experience Required</span>
                <p className="text-lg font-medium capitalize">{interviewDetails.jobExperience}</p>
              </div>
            </div>
            <Button className="mt-2" onClick={handleInterviewStart}>Start Interview</Button>
          </CardContent>
        </Card>



        {/* Webcam Section */}
        <div className="flex flex-col gap-4">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            {webcamEnable ? (
              <Webcam
                className="w-full h-full object-cover"
                onUserMedia={() => setwebcamEnable(true)}
                onUserMediaError={() => setwebcamEnable(false)}
                mirrored={true}
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