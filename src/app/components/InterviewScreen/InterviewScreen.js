'use client'

import React, { useEffect, useState } from 'react'
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
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Loader2,
  MicIcon,
  StopCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { chatSession } from '@/utils/geminiapi'
import copy from 'copy-to-clipboard'
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFullTranscriptSpeechToText } from './SpeechRecording'

const SimpleTypingAnimation = ({ children, className, duration = 50 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < children.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + children[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, children, duration]);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [children]);

  return <div className={className}>{displayedText}</div>;
};

function InterviewScreen({ id }) {
  const [interviewDetails, setinterviewDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [webcamEnable, setwebcamEnable] = useState(false)
  const dataFetched = React.useRef(false)
  const [startInterview, setstartInterview] = useState(false)
  const router = useRouter()
  const [questions, setquestions] = useState(null)
  const [index, setindex] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [userAnswers, setuserAnswers] = useState([])
  const [loadingForFeedback, setloadingForFeedback] = useState(false)
  const [userAnsFeedback, setuserAnsFeedback] = useState("")
  const [typedAnswer, setTypedAnswer] = useState('')

  const {
    isRecording,
    fullTranscript,
    currentTranscript,
    error,
    isSupported,
    startRecording: startSpeechRecording,
    stopRecording: stopSpeechRecording,
    clearTranscript
  } = useFullTranscriptSpeechToText();

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
    if (questions && questions.length > 0) {
      handleSpeechSynthesis(questions[0])
    }
  }

  const handleSpeechSynthesis = (question) => {
    speechSynthesis.cancel()
    setIsSpeaking(true)

    const utterance = new SpeechSynthesisUtterance(question)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    speechSynthesis.speak(utterance)
  }

  const handleNavigation = (newIndex) => {
    if (isRecording) {
      stopSpeechRecording();
      if (fullTranscript.trim().length >= 10) {
        saveUserAnswer(fullTranscript.trim());
      }
    }

    setindex(newIndex);
    setuserAnsFeedback('');
    setTypedAnswer('');
    clearTranscript();

    const existingAnswer = userAnswers.find(
      ans => ans.question === questions[newIndex]
    );
    if (existingAnswer) {
      setTypedAnswer(existingAnswer.answer);
    }

    handleSpeechSynthesis(questions[newIndex]);
  };

  const handleRecord = async () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Voice Recording is not supported in your Browser. Please Switch to Chrome Browsers",
        variant: "destructive"
      });
      return;
    }

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      });
      return;
    }

    if (isRecording) {
      stopSpeechRecording();

      setTimeout(() => {
        if (fullTranscript.trim().length >= 10) {
          saveUserAnswer(fullTranscript.trim());
          toast({
            title: "Success",
            description: "Your Answer Saved Successfully"
          });
        } else if (fullTranscript.trim().length > 0) {
          toast({
            title: "Short Answer",
            description: "Your answer seems short. Please provide more details.",
            variant: "destructive"
          });
        }
      }, 500);

    } else {
      clearTranscript();
      await startSpeechRecording();

      if (!error) {
        // toast({
        //   title: "Recording Started",
        //   description: "Speak clearly into your microphone",
          
        // });
        console.log("recordind started")
      }
    }
  };

  const saveUserAnswer = (answer) => {
    if (!answer || !answer.trim()) return;

    const cleanAnswer = answer.trim();
    const existingAnswerIndex = userAnswers.findIndex(
      ans => ans.question === questions[index]
    );

    setuserAnswers(prev => {
      if (existingAnswerIndex !== -1) {
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = {
          question: questions[index],
          answer: cleanAnswer
        };
        return newAnswers;
      } else {
        return [...prev, {
          question: questions[index],
          answer: cleanAnswer
        }];
      }
    });
  };

  useEffect(() => {
    return () => {
      speechSynthesis.cancel()
    }
  }, [])

  const handleCopyFeedback = () => {
    copy(userAnsFeedback)
    toast({
      title: "Success",
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
          const newAnswers = [...prev];
          newAnswers[existingAnswerIndex] = {
            question: questions[index],
            answer: typedAnswer
          };
          return newAnswers;
        } else {
          return [...prev, {
            question: questions[index],
            answer: typedAnswer
          }];
        }
      });

      setTypedAnswer('');
      setuserAnsFeedback('');

      toast({
        title: "Success",
        description: "Your Answer Saved Successfully"
      });
    }
  };

  const handleResetInterview = () => {
    if (isRecording) {
      stopSpeechRecording();
    }

    clearTranscript();

    setindex(0)
    setuserAnswers([])
    setuserAnsFeedback("")
    setTypedAnswer("")
    setstartInterview(false)
    setwebcamEnable(false)
    setIsSpeaking(false)

    speechSynthesis.cancel()

    toast({
      title: "Interview Reset",
      description: "The interview has been reset. Click Start when you're ready.",
    })
  }

  function formatFeedback(feedbackString) {
    const lines = feedbackString.split('\n');
    const formattedLines = [];

    for (const line of lines) {
      if (line.trim().startsWith('**')) {
        if (formattedLines.length > 0) {
          formattedLines.push('\n');
        }
      }
      formattedLines.push(line);
    }

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
        Please format the response in clear sections. And ignore the grammar mistakes`;

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
    <div className="min-h-screen p-1 md:p-6">
      {!startInterview ? (
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
            <Card>
              <CardHeader>
                <CardTitle>Position Details</CardTitle>
                <CardDescription>Review your interview settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium capitalize">{interviewDetails?.jobType || "Not Provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium capitalize">{interviewDetails?.jobDescription || "Not Provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <p className="font-medium capitalize">{interviewDetails?.jobExperience || "Not Provided"}</p>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
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
              </div>

              <div className="lg:col-span-2">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Progress value={((index + 1) / questions?.length) * 100} />
                    <p className="text-sm text-center text-muted-foreground">
                      Question {index + 1} of {questions?.length}
                    </p>
                  </div>

                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div className="min-h-[100px] p-6 rounded-xl bg-muted/30 border shadow-sm">
                          <SimpleTypingAnimation className="text-lg" duration={70}>
                            {questions[index]}
                          </SimpleTypingAnimation>
                        </div>

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
                            <div className="space-y-4">
                              <div className="flex justify-center items-center gap-4">
                                {!isRecording ? (
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-12 w-12 hover:bg-green-50"
                                    onClick={handleRecord}
                                    disabled={isSpeaking || !isSupported}
                                  >
                                    <MicIcon className="h-6 w-6" />
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-12 w-12 bg-red-100 hover:bg-red-200"
                                    onClick={handleRecord}
                                  >
                                    <StopCircle className="h-6 w-6 text-red-500" />
                                  </Button>
                                )}

                                {fullTranscript && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={clearTranscript}
                                    className="ml-2"
                                  >
                                    Clear
                                  </Button>
                                )}
                              </div>

                              {error && (
                                <Alert variant="destructive">
                                  <AlertDescription>{error}</AlertDescription>
                                </Alert>
                              )}

                              {isRecording && (
                                <div className="text-center">
                                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full text-sm">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="text-red-700 font-medium">Recording... Speak clearly</span>
                                  </div>
                                </div>
                              )}

                              {currentTranscript && isRecording && (
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                  <div className="text-xs text-blue-600 font-medium mb-1">Currently speaking:</div>
                                  <div className="text-blue-800 italic text-sm">{currentTranscript}</div>
                                </div>
                              )}

                              {fullTranscript && (
                                <div className="p-4 bg-muted/30 border-[0.8px] border-gray-600 rounded-lg">
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="text-sm text-white font-medium">Your Answer:</div>
                                    <div className="text-xs text-green-500">
                                      {fullTranscript.split(' ').filter(word => word.trim()).length} words
                                    </div>
                                  </div>
                                  <textarea
                                    className="w-full p-3 rounded text-white resize-none"
                                    value={fullTranscript}
                                    readOnly
                                    rows={Math.min(8, Math.max(3, fullTranscript.split('\n').length))}
                                  />
                                </div>
                              )}

                              {!isRecording && !fullTranscript && (
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                  <p className="text-gray-600 text-sm">
                                    Click the microphone to start recording your answer.
                                    Speak clearly and take your time.
                                  </p>
                                </div>
                              )}
                            </div>
                          </TabsContent>
                        </Tabs>

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
                            <p className="whitespace-pre-wrap">{userAnsFeedback}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

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
          </div>
        </div>
      )}
    </div>
  )
}

export default InterviewScreen