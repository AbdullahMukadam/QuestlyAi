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
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


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
  const [answerMode, setAnswerMode] = useState('type')
  const [typedAnswer, setTypedAnswer] = useState('')
  const [accumulatedTranscript, setAccumulatedTranscript] = useState('');

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
    // Add speech synthesis for the first question
    if (questions && questions.length > 0) {
      handleSpeechSynthesis(questions[0])
    }
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
    setindex(newIndex);
    // Clear states when navigating
    setuserAnsFeedback('');
    setsingleAns('');
    setTypedAnswer('');
    setAccumulatedTranscript(''); // Clear accumulated transcript
    // Stop any ongoing recording
    if (isRecording) {
      stopSpeechToText();
    }
    // Get the existing answer for this question if any
    const existingAnswer = userAnswers.find(
      ans => ans.question === questions[newIndex]
    );
    if (existingAnswer) {
      setTypedAnswer(existingAnswer.answer);
    }
    handleSpeechSynthesis(questions[newIndex]);
  }

  const handleRecord = () => {
    if (error) {
      toast({
        title: "Not Supported",
        description: "Voice Recording is not supported in your Browser, Please Switch to Chrome Browsers",
        variant: "destructive"
      });
      return;
    }

    if (isRecording) {
      stopSpeechToText();
      // Save the accumulated answer when stopping recording
      if (accumulatedTranscript.trim().length >= 10) {
        saveUserAnswer(accumulatedTranscript);
        toast({
          title: "Success",
          description: "Your Answer Saved Successfully"
        });
      }
      // Clear the accumulated transcript
      setAccumulatedTranscript('');
      setsingleAns('');
    } else {
      // Clear previous transcripts when starting new recording
      setAccumulatedTranscript('');
      setsingleAns('');
      startSpeechToText();
    }
  };

  useEffect(() => {
    if (results.length > 0 && isRecording) {
      // Get the latest transcript
      const latestTranscript = results[results.length - 1].transcript;
      // Accumulate transcripts while recording
      setAccumulatedTranscript(prev => {
        // If it's a new recording session, don't include previous content
        if (prev.length === 0) {
          return latestTranscript;
        }
        // Append new content if it's different
        if (!prev.includes(latestTranscript)) {
          return `${prev} ${latestTranscript}`;
        }
        return prev;
      });
      setsingleAns(accumulatedTranscript);
    }
  }, [results, isRecording]);

  const saveUserAnswer = (answer = singleAns) => {
    if (!answer.trim()) return;

    const existingAnswerIndex = userAnswers.findIndex(
      ans => ans.question === questions[index]
    );

    setuserAnswers(prev => {
      if (existingAnswerIndex !== -1) {
        // Update existing answer
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = {
          question: questions[index],
          answer: answer
        };
        return newAnswers;
      } else {
        // Add new answer
        return [...prev, {
          question: questions[index],
          answer: answer
        }];
      }
    });
  };

  // Cleanup speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      speechSynthesis.cancel()
    }
  }, [])

  // This function gives overall feedback for all answers
  const handleSubmitToGemini = async () => {
    setloadingForFeedback(true)
    const FeedbackPrompt = `Data: ${JSON.stringify(userAnswers)}
    Depending upon the questions and user answers, please give us a feedback as a area of improvement in just 3 to 5 lines.`;

    const result = await chatSession.sendMessage(FeedbackPrompt)
    const filteredResponse = result.response.text()
    setuserAnsFeedback(filteredResponse)
    setloadingForFeedback(false)
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

  const handleTypedAnswerSubmit = () => {
    if (typedAnswer.trim()) {
      const existingAnswerIndex = userAnswers.findIndex(
        ans => ans.question === questions[index]
      );

      setuserAnswers(prev => {
        if (existingAnswerIndex !== -1) {
          // Update existing answer
          const newAnswers = [...prev];
          newAnswers[existingAnswerIndex] = {
            question: questions[index],
            answer: typedAnswer
          };
          return newAnswers;
        } else {
          // Add new answer
          return [...prev, {
            question: questions[index],
            answer: typedAnswer
          }];
        }
      });

      // Clear the typed answer and feedback after submission
      setTypedAnswer('');
      setuserAnsFeedback('');

      toast({
        title: "Success",
        description: "Your Answer Saved Successfully"
      });
    }
  };

  const handleResetInterview = () => {
    // Reset all the states to initial values
    setindex(0)
    setuserAnswers([])
    setuserAnsFeedback("")
    setsingleAns("")
    setTypedAnswer("")
    setstartInterview(false) // This will show the initial screen
    setwebcamEnable(false)
    setstartedSpeech(false)
    setIsSpeaking(false)

    // Cancel any ongoing speech
    speechSynthesis.cancel()

    // Stop recording if active
    if (isRecording) {
      stopSpeechToText()
    }

    toast({
      title: "Interview Reset",
      description: "The interview has been reset. Click Start when you're ready.",
    })
  }

  function formatFeedback(feedbackString) {
    // Split the string into lines
    const lines = feedbackString.split('\n');

    // Initialize an array to store the formatted lines
    const formattedLines = [];

    // Iterate through the lines
    for (const line of lines) {
      // Check if the line starts with "**" (indicating a new section)
      if (line.trim().startsWith('**')) {
        // Add a newline character before the line (except for the first section)
        if (formattedLines.length > 0) {
          formattedLines.push('\n');
        }
      }
      // Add the line to the formatted lines array
      formattedLines.push(line);
    }

    // Join the formatted lines back into a single string
    return formattedLines.join('\n');
  }

  const handleOverallFeedback = async () => {
    if (userAnswers.length === questions.length) {
      setloadingForFeedback(true);
      try {
        const overallFeedbackPrompt = `I have conducted an interview with ${questions.length} questions. Here are the questions and answers:
        ${userAnswers.map((qa, i) => `
        Question ${i + 1}: ${qa.question}
        Answer: ${qa.answer}
        `).join('\n')}
        
        Please provide comprehensive feedback on:
        1. Overall performance
        2. Key strengths
        3. Areas for improvement
        4. Communication skills
        Please format the response in clear sections. And ignore the grammer mistakes`;

        const result = await chatSession.sendMessage(overallFeedbackPrompt);
        const feedback = result.response.text();
        const formattedFeedback = formatFeedback(feedback);
        setuserAnsFeedback(formattedFeedback)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to generate feedback. Please try again.",
          variant: "destructive"
        });
      } finally {
        setloadingForFeedback(false);
      }
    }
  };

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

  return (
    <div className="min-h-screen p-6">
      {isLoading ? (
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-medium text-muted-foreground">Loading interview...</p>
          </div>
        </div>
      ) : !startInterview ? (
        <div className="container mx-auto max-w-4xl p-3 md:p-6 space-y-6">
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
                  <p className="font-medium capitalize">{interviewDetails?.jobType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium capitalize">{interviewDetails?.jobDescription}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <p className="font-medium capitalize">{interviewDetails?.jobExperience}</p>
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
      ) : (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/95 p-6">
          <div className="container mx-auto max-w-5xl space-y-8">
            {/* Loading State */}
            {isLoading && (
              <div className="flex min-h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-lg font-medium text-muted-foreground">Loading interview...</p>
                </div>
              </div>
            )}

            {/* Main Interview Content */}
            {startInterview && !isLoading && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Webcam and Controls */}
                <div className="lg:col-span-1 space-y-4">
                  {/* Webcam Card */}
                  <Card className="h-full">
                    <CardContent className="p-4">
                      {webcamEnable ? (
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                          <Webcam
                            mirrored
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video flex items-center justify-center bg-muted rounded-lg">
                          <Button onClick={() => setwebcamEnable(true)} variant="outline">
                            <Camera className="h-4 w-4 mr-2" />
                            Enable Camera
                          </Button>
                        </div>
                      )}
                    </CardContent>
                    <CardContent className="p-4 space-y-4">
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          onClick={handleResetInterview}
                        >
                          Reset Interview
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleSpeechSynthesis(questions[index])}
                          disabled={isSpeaking}
                        >
                          Replay Question
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Interview Controls */}



                </div>

                {/* Right Column - Questions and Answers */}
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <Progress value={((index + 1) / questions?.length) * 100} />
                      <p className="text-sm text-center text-muted-foreground">
                        Question {index + 1} of {questions?.length}
                      </p>
                    </div>

                    {/* Question Card */}
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-6">
                          {/* Question Display */}
                          <div className="min-h-[100px] p-6 rounded-xl bg-muted/30 border shadow-sm">
                            <TypingAnimation className="text-lg" duration={70}>
                              {questions[index]}
                            </TypingAnimation>
                          </div>

                          {/* Answer Input Section */}
                          <Tabs defaultValue="type" className="space-y-4">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="type">Type Answer</TabsTrigger>
                              <TabsTrigger value="speech">Voice Answer</TabsTrigger>
                            </TabsList>

                            <TabsContent value="type" className="space-y-4">
                              <Textarea
                                placeholder="Type your answer here..."
                                value={typedAnswer}
                                onChange={(e) => setTypedAnswer(e.target.value)}
                                className="min-h-[150px]"
                              />
                              <Button
                                onClick={handleTypedAnswerSubmit}
                                disabled={!typedAnswer.trim() || loadingForFeedback}
                                className="w-full"
                              >
                                {loadingForFeedback ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Processing...
                                  </div>
                                ) : (
                                  "Submit Answer"
                                )}
                              </Button>
                            </TabsContent>

                            <TabsContent value="speech" className="space-y-4">
                              <div className="flex justify-center gap-4">
                                {!isRecording ? (
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-12 w-12"
                                    onClick={handleRecord}
                                    disabled={isSpeaking}
                                  >
                                    <MicIcon className="h-6 w-6" />
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-12 w-12 bg-red-100"
                                    onClick={handleRecord}
                                  >
                                    <StopCircle className="h-6 w-6 text-red-500" />
                                  </Button>
                                )}
                              </div>

                              {startedSpeech && (
                                <div className="space-y-2">
                                  <p className="text-sm text-muted-foreground text-center">
                                    {isRecording ? "Recording..." : "Click microphone to start recording"}
                                  </p>
                                  {results.length > 0 && (
                                    <p className="p-4 rounded-lg bg-muted">
                                      {results[results.length - 1].transcript}
                                    </p>
                                  )}
                                </div>
                              )}
                            </TabsContent>
                          </Tabs>

                          {/* Feedback Section */}
                          <Button
                            onClick={handleOverallFeedback}
                            className="w-full mt-4"
                            disabled={userAnswers.length !== questions?.length || loadingForFeedback}
                          >
                            {loadingForFeedback ? (
                              <div className="flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Generating Overall Feedback...
                              </div>
                            ) : userAnswers.length !== questions?.length ? (
                              `Answer all ${questions?.length} questions for feedback`
                            ) : (
                              "Get Overall Feedback"
                            )}
                          </Button>

                          {userAnsFeedback && (
                            <div className="mt-4 p-4 bg-muted rounded-lg">
                              <div className="flex justify-between items-start">
                                <h4 className="font-semibold mb-2">Overall Feedback:</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleCopyFeedback}
                                >
                                  Copy
                                </Button>
                              </div>
                              <p>{userAnsFeedback}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => handleNavigation(index - 1)}
                        disabled={index === 0}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                      <Button
                        onClick={() => handleNavigation(index + 1)}
                        disabled={index === questions?.length - 1}
                      >
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default InterviewScreen