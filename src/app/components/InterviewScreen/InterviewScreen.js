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
import { chatSession } from '@/utils/geminiapi'
import copy from 'copy-to-clipboard'


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
  const [loadingForFeedback, setloadingForFeedback] = useState(false)
  const [userAnsFeedback, setuserAnsFeedback] = useState("")
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
      console.log(userAnswers)
      toast({
        title: "Success",
        description: "Your Answer Saved Successfully"
      })
    }
  }, [singleAns])

  const saveUserAnswer = () => {

    const existingAnswerIndex = userAnswers.findIndex(
      ans => ans.question === questions[index]
    );

    setuserAnswers(prev => {
      if (existingAnswerIndex !== -1) {
        // Update existing answer
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = {
          question: questions[index],
          answer: singleAns
        };
        return newAnswers;
      } else {
        // Add new answer
        return [...prev, {
          question: questions[index],
          answer: singleAns
        }];
      }
    });
    setsingleAns("")
  }

  // Cleanup speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      speechSynthesis.cancel()
    }
  }, [])

  const handleSubmitToGemini = async () => {
    setloadingForFeedback(true)
    const FeedbackPrompt = `Data: ${JSON.stringify(userAnswers)}
Depending upon the questions and user answers, please give us a feedback as a area of improvement in just 3 to 5 lines.`;

    const result = await chatSession.sendMessage(FeedbackPrompt)
    const filteredResponse = result.response.text()
    console.log(filteredResponse)
    setuserAnsFeedback(filteredResponse)
    setloadingForFeedback(false)
    //console.log(userAnswers)
  }

  const handleStartInterviewAgain = () => {
    setstartInterview(false)
    setuserAnswers([])
    setsingleAns("")
    setindex(0)
    setuserAnsFeedback("")
  }

  const handleCopyFeedback = () => {
    copy(userAnsFeedback)
    toast({
      title: "Sucess",
      description: "Feedback Copied to Clipboard"
    })

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
      <div className="min-h-screen bg-gradient-to-b from-background to-background/95 p-6">
        <div className="container mx-auto max-w-5xl space-y-8">
          {/* Feedback Modal */}
          {userAnsFeedback && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-card w-full max-w-lg rounded-xl border shadow-lg">
                <div className="p-6 space-y-4">
                  <h2 className="text-2xl font-semibold text-center">Interview Feedback</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {userAnsFeedback}
                  </p>
                  <div className="flex items-center justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={handleCopyFeedback}>
                      Copy Feedback
                    </Button>
                    <Button variant="destructive" onClick={handleStartInterviewAgain}>
                      End Interview
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Interview Card */}
          <Card className="border-2">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-xl">
                  Question {index + 1} of {questions.length}
                </CardTitle>
                <Progress value={progress} className="w-1/3 h-2" />
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Webcam Section */}
                <div className="space-y-4">
                  <div className="aspect-video bg-muted rounded-xl overflow-hidden shadow-inner">
                    {webcamEnable ? (
                      <Webcam
                        className="w-full h-full object-cover"
                        mirrored={true}
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                        <Camera className="h-12 w-12 mb-3 opacity-50" />
                        <p className="text-sm">Camera is disabled</p>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleRecord}
                    className="w-full"
                    variant={isRecording ? "destructive" : "default"}
                  >
                    <MicIcon className="mr-2 h-4 w-4" />
                    {isRecording ? 'Stop Recording' : 'Record Answer'}
                  </Button>
                </div>

                {/* Question Section */}
                <div className="space-y-6">
                  <div className="min-h-[200px] p-6 rounded-xl bg-muted/30 border shadow-sm relative">
                    {startedSpeech ? (
                      <div className="space-y-4">
                        <TypingAnimation className="text-lg" duration={70}>
                          {questions[index]}
                        </TypingAnimation>
                        {isSpeaking && (
                          <div className="absolute bottom-4 right-4 flex items-center gap-2">
                            <Volume2 className="h-5 w-5 text-primary animate-pulse" />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={stopSpeech}
                              className="h-8"
                            >
                              <StopCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <Button
                          onClick={() => handleSpeechSynthesis(questions[index])}
                          variant="secondary"
                          className="gap-2"
                        >
                          <Volume2 className="h-4 w-4" />
                          Start Question
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Navigation Controls */}
                  <div className="flex items-center justify-between gap-4 pt-2">
                    <Button
                      variant="outline"
                      disabled={index === 0}
                      onClick={() => handleNavigation(index - 1)}
                      className="gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    {startedSpeech && (
                      <Button
                        variant="secondary"
                        onClick={() => handleSpeechSynthesis(questions[index])}
                        disabled={isSpeaking}
                        size="sm"
                      >
                        <Volume2 className="h-4 w-4 mr-2" />
                        Replay
                      </Button>
                    )}

                    {questions.length - 1 === index ? (
                      <Button
                        onClick={handleSubmitToGemini}
                        variant="default"
                        disabled={userAnswers.length < questions.length}
                        className="gap-2"
                      >
                        {loadingForFeedback ? "Processing..." : "Submit Answers"}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => handleNavigation(index + 1)}
                        className="gap-2"
                      >
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={handleStartInterviewAgain}
              variant="outline"
              className="hover:bg-destructive/10"
            >
              Reset Interview
            </Button>
          </div>
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