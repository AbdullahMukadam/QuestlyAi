'use client'

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription
} from "@/components/ui/card"
import { fetchInterviewDetails } from '@/app/actions/QuestionsAction'
import Webcam from 'react-webcam'
import { ArrowLeft, ArrowRight, Camera, Loader2, MicIcon, Volume2, StopCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { TypingAnimation } from '@/components/magicui/typing-animation'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import useSpeechToText from 'react-hook-speech-to-text'
import { useToast } from '@/hooks/use-toast'

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
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [userAnswers, setuserAnswers] = useState([])
  const [singleAns, setsingleAns] = useState("")
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });
  const { toast } = useToast()

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
  }

  const handleSpeechSynthesis = (question) => {
    // Cancel any ongoing speech
    speechSynthesis.cancel()

    setstartedSpeech(true)
    setIsSpeaking(true)

    const utterance = new SpeechSynthesisUtterance(question)

    utterance.onend = () => {
      setIsSpeaking(false)
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
    }

    speechSynthesis.speak(utterance)
  }

  const stopSpeech = () => {
    speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  // Handle navigation with automatic speech
  const handleNavigation = (newIndex) => {
    setindex(newIndex)
    handleSpeechSynthesis(questions[newIndex])
  }

  const handleRecord = () => {
    if (error) {
      toast({
        title: "Not Supported",
        description: "Voice Recording is not supported in your Browser, Please Switch to Chrome Browsers",
        variant: "destructive"
      });
      return; // Add early return to prevent further execution
    }

    if (isRecording) {
      stopSpeechToText();
      //console.log(userAnswers)
    } else {
      setsingleAns("")
      startSpeechToText();
    }
  };

  useEffect(() => {
    //console.log(results)
    results.map((result) => setsingleAns(result.transcript))
  }, [results]);

  useEffect(() => {
    if (!isRecording && singleAns.length >= 10) {
      saveUserAnswer()
      //console.log(userAnswers)
      toast({
        title:"Success",
        description:"Your Answer Saved Successfully"
      })
    } 
  }, [singleAns])

  const saveUserAnswer = () => {
    const obj = {
      question: questions[index],
      answer: singleAns
    }

    //console.log(obj)
    setuserAnswers(prevAnswers => [...prevAnswers, obj])
    setsingleAns("")
  }

  // Cleanup speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      speechSynthesis.cancel()
    }
  }, [])

  const handleSubmitToGemini = ()=>{
    console.log(userAnswers)
  }

  const handleStartInterviewAgain = ()=>{
     setstartInterview(false)
     setuserAnswers([])
     setsingleAns("")
     setindex(0)
  }


  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg font-medium text-muted-foreground">Loading interview...</p>
        </div>
      </div>
    )
  }

  if (startInterview) {
    const progress = ((index + 1) / questions.length) * 100


    return (
      <div className="container mx-auto max-w-4xl py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Question {index + 1} of {questions.length}</span>
              <Progress value={progress} className="w-1/3" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Webcam Feed */}
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                {webcamEnable ? (
                  <>
                    <Webcam
                      className="w-full h-full object-cover relative"
                      mirrored={true}
                    />
                  </>

                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <Camera className="h-12 w-12 mb-2" />
                    <p>Camera is disabled</p>
                  </div>
                )}
              </div>

              {/* Question Display */}
              <div className="space-y-4">
                <div className="min-h-[200px] p-4 rounded-lg bg-muted/50 relative">
                  {startedSpeech ? (
                    <>
                      <TypingAnimation className="text-lg">
                        {questions[index]}
                      </TypingAnimation>
                      {isSpeaking && (
                        <div className="absolute bottom-4 right-4 flex items-center gap-2">
                          <Volume2 className="h-5 w-5 text-primary animate-pulse" />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={stopSpeech}
                            className="h-8 px-2"
                          >
                            <StopCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <Button
                        onClick={() => handleSpeechSynthesis(questions[index])}
                        className="gap-2"
                      >
                        <MicIcon className="h-4 w-4" />
                        Start Question
                      </Button>
                    </div>
                  )}
                </div>

                {/* Question Controls */}
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    disabled={index === 0}
                    onClick={() => handleNavigation(index - 1)}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  {/* Replay Button */}
                  {startedSpeech && (
                    <Button
                      variant="secondary"
                      onClick={() => handleSpeechSynthesis(questions[index])}
                      disabled={isSpeaking}
                      className="gap-2"
                    >
                      <Volume2 className="h-4 w-4" />
                      Replay
                    </Button>
                  )}

                  {questions.length - 1 === index ? <Button onClick={handleSubmitToGemini} variant="destructive" disabled={userAnswers.length < questions.length}>Submit Answers</Button> : <Button
                    variant="outline"
                    disabled={questions.length - 1 === index}
                    onClick={() => handleNavigation(index + 1)}
                    className="gap-2"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className='flex items-center justify-between'>
          <Button onClick={handleStartInterviewAgain} variant="outline">Start Again</Button>
          <Button onClick={handleRecord}>
            {isRecording ?
              <p className='w-full text-red-500 flex gap-1'> <MicIcon /> Stop Recording</p>
              : 'Record Answer'}
          </Button>
        </div>

      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Interview Preparation</h1>
        <p className="text-muted-foreground">Get ready for your mock interview session</p>
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      {!webcamEnable && (
        <Alert>
          <AlertDescription className="text-center">
            Please enable your camera to begin the interview session.
            Your video will not be recorded.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Job Details */}
        <Card>
          <CardHeader>
            <CardTitle>Position Details</CardTitle>
            <CardDescription>Review your interview settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium capitalize">{interviewDetails.jobType}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="font-medium capitalize">{interviewDetails.jobDescription}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Experience</p>
              <p className="font-medium capitalize">{interviewDetails.jobExperience}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleInterviewStart}
              disabled={!webcamEnable}
            >
              Start Interview
            </Button>
          </CardFooter>
        </Card>

        {/* Webcam Setup */}
        <Card>
          <CardHeader>
            <CardTitle>Camera Setup</CardTitle>
            <CardDescription>Configure your video settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              {webcamEnable ? (
                <Webcam
                  className="w-full h-full object-cover"
                  onUserMedia={() => setwebcamEnable(true)}
                  onUserMediaError={() => setwebcamEnable(false)}
                  mirrored={true}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <Camera className="h-12 w-12 mb-2" />
                  <p>Camera is disabled</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => setwebcamEnable(!webcamEnable)}
            >
              <Camera className="h-4 w-4" />
              {webcamEnable ? 'Disable' : 'Enable'} Camera
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default InterviewScreen