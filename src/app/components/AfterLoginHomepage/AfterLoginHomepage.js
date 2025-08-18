'use client'

import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { chatSession } from '@/utils/geminiapi'
import { addQuestions } from '@/app/store/InterviewQuestionSlice'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { AddInterviewQuestions, deleteInterview, fetchAllInterviewDetails } from '@/app/actions/QuestionsAction'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Loader2, Plus } from 'lucide-react'
import Link from 'next/link'
import { AlertDialogDemo } from '@/hooks/AlertDialog'
import pdfToText from "react-pdftotext";

function AfterLoginHomepage() {
  const userData = useSelector((state) => state.userData.userData)
  const [open, setopen] = useState(false)
  const { handleSubmit, register, formState: { isSubmitting }, watch, reset } = useForm({
    defaultValues: {
      questionType: "generated"
    }
  })
  const [Experience, setExperience] = useState("")
  const [error, seterror] = useState("")
  const { toast } = useToast()
  const dispatch = useDispatch()
  const router = useRouter()
  const [loading, setloading] = useState(false)
  const [Interviews, setInterviews] = useState(null)
  const [deleteStatus, setdeleteStatus] = useState(false)
  const [alertDialogOpen, setalertDialogOpen] = useState(false)
  const [deleteInterviewId, setdeleteInterviewId] = useState(null)

  const questionType = watch("questionType")

  async function handleQuestionsGeneration(InputPrompt, data) {
    try {
      const result = await chatSession.sendMessage(InputPrompt)
      const filteredResponse = (result.response.text()).replace('```json', '').replace('```', '').trim()
      const Data = JSON.parse(filteredResponse)
      if (filteredResponse) {
        const uniqueId = uuidv4()
        const questionData = {
          id: uniqueId,
          userId: userData?.userId,
          jobType: data.Jobtype,
          jobDescription: data.Description,
          jobExperience: Experience,
          data: Data
        }
        const addinterviewQuestionstoDatabase = await AddInterviewQuestions(questionData)
        if (addinterviewQuestionstoDatabase) {
          toast({
            title: "Success",
            description: "You will be redirected to interview screen"
          })
          dispatch(addQuestions(addinterviewQuestionstoDatabase))
          router.push(`/interview-screen/${uniqueId}`)
        }
      }
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "An error occurred, please try again" || error.message,
        variant: "destructive"
      })
    }
  }

  // async function ImageTextExtract(file) {
  //   if (!file) {
  //     toast({
  //       title: "Error",
  //       description: "Please Provide the File",
  //       variant: "destructive"
  //     })
  //     return;
  //   }

  //   try {
  //     const ImageUrl = URL.createObjectURL(file)
  //     const worker = await createWorker('eng');
  //     const { data } = await worker.recognize(ImageUrl);
  //     await worker.terminate();

  //     if (data.text) {
  //       return {
  //         success: true,
  //         message: "Extracted the Image Text",
  //         text: data.text
  //       }
  //     }


  //   } catch (error) {
  //     console.log(error)
  //     toast({
  //       title: "Error",
  //       description: "An error occurred, please try again" || error.message,
  //       variant: "destructive"
  //     })
  //   }
  // }

  const submitHandler = async (data) => {
    seterror("")
    try {
      if (data.questionType === "custom" && data.questions?.[0]) {
        const file = data.questions[0]
        if (file.type.startsWith("image")) {
          //this is feature is in development
          // const ImageText = await ImageTextExtract(file)
          // if (ImageText) {
          //   console.log(ImageText)
          // }

        } else if (file.type === "application/pdf") {
          const text = await pdfToText(file);
          if (text) {
            // console.log(text.slice(0, 5000))
            const limitedText = text.slice(0, 5000);
            const InputPrompt = `Information: ${limitedText} ${process.env.NEXT_PUBLIC_GEMINI_INPUT_PROMPT}`
            await handleQuestionsGeneration(InputPrompt, data)
          } else {
            toast({
              title: "Error",
              description: "Unable to extract text from PDF. Please try again.",
              variant: "destructive"
            })
          }
        }
      } else if (data.questionType === "generated") {
        if (!data.Jobtype || !data.Description || !Experience) {
          toast({
            title: "Error",
            description: "Please fill in all required fields for generated questions.",
            variant: "destructive"
          })
          return
        }
        const InputPrompt = `job type :${data.Jobtype}, Description: ${data.Description}, Experience : ${Experience}, ${process.env.NEXT_PUBLIC_GEMINI_INPUT_PROMPT} `
        await handleQuestionsGeneration(InputPrompt, data)
      } else {
        toast({
          title: "Error",
          description: "Please provide the required information based on your selection.",
          variant: "destructive"
        })
      }
    } catch (error) {
      seterror(error.message)
      toast({
        title: "Error",
        description: "An error occurred, please try again" || error.message,
        variant: "destructive"
      })
    }
  }

  const fetchAllInterviews = async () => {
    try {
      setloading(true)
      const interviews = await fetchAllInterviewDetails()
      if (interviews) {
        const filteredInterviews = interviews.filter((interview) => interview.userId === userData.userId)
        setInterviews(filteredInterviews)
      }
    } catch (error) {
      /*  toast({
         title: "Error",
         description: "An error occurred in fetching all interviews" || error.message,
         variant: "destructive"
       }) */
    } finally {
      setloading(false)
    }
  }

  useEffect(() => {
    fetchAllInterviews()
  }, [dispatch])

  const handleDelete = (id) => {
    setalertDialogOpen(true)
    setdeleteInterviewId(id)
  }

  const deletetheInterview = async () => {
    try {
      setdeleteStatus(true)
      const result = await deleteInterview(deleteInterviewId, "/")
      if (result.success) {
        toast({
          title: "Success",
          description: "Interview Deleted Successfully"
        })
        fetchAllInterviews()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to Delete the Interview, Please Try Again",
        variant: "destructive"
      })
    } finally {
      setdeleteStatus(false)
    }
  }

 
  const handleDialogChange = (isOpen) => {
    setopen(isOpen)
    if (!isOpen) {
      reset()
      setExperience("")
    }
  }

  if (userData?.role !== "candidate") {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="container md:p-6 mx-auto py-6 space-y-8">
      {isSubmitting && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg font-medium text-muted-foreground">
                Generating interview questions...
              </p>
            </div>
          </div>
        </div>
      )}

      <AlertDialogDemo
        alertDialogOpen={alertDialogOpen}
        setalertDialogOpen={setalertDialogOpen}
        deletetheInterview={deletetheInterview}
        setdeleteInterviewId={setdeleteInterviewId}
        deleteStatus={deleteStatus}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Mock Interview Dashboard</h1>
        <Dialog open={open} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Interview
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Interview</DialogTitle>
              <DialogDescription>
                Choose how you want to create your mock interview questions.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-base font-semibold">How would you like to create questions?</Label>
                  <RadioGroup
                    value={questionType}
                    onValueChange={(value) => {
                      register("questionType").onChange({
                        target: { value, name: "questionType" }
                      })
                    }}
                    className="grid grid-cols-1 gap-4"
                  >
                    <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="generated" id="generated" />
                      <Label htmlFor="generated" className="flex-1 cursor-pointer">
                        <div className="font-medium">Generated Questions</div>
                        <div className="text-sm text-muted-foreground">
                          AI will create questions based on job role and requirements
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="custom" id="custom" />
                      <Label htmlFor="custom" className="flex-1 cursor-pointer">
                        <div className="font-medium">Custom Questions</div>
                        <div className="text-sm text-muted-foreground">
                          Upload your own questions via PDF
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                  <input type="hidden" {...register("questionType")} />
                </div>

              
                {questionType === "generated" && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="Jobtype">Job Role / Position *</Label>
                      <Input
                        id="Jobtype"
                        placeholder="e.g., Frontend Developer, Technical Writer"
                        {...register("Jobtype", {
                          required: questionType === "generated" ? "Job role is required" : false
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="Description">Job Description / Tech Stack *</Label>
                      <Textarea
                        id="Description"
                        placeholder="e.g., React, Node.js, TypeScript, AWS"
                        {...register("Description", {
                          required: questionType === "generated" ? "Job description is required" : false
                        })}
                        maxLength="200"
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Experience Level *</Label>
                      <Select value={Experience} onValueChange={setExperience}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Less than 1 year">Less than 1 year</SelectItem>
                          <SelectItem value="1-2 years">1-2 years</SelectItem>
                          <SelectItem value="3-5 years">3-5 years</SelectItem>
                          <SelectItem value="5+ years">5+ years</SelectItem>
                          <SelectItem value="10+ years">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                
                {questionType === "custom" && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="questions">Upload Questions File *</Label>
                      <Input
                        id="questions"
                        type="file"
                        accept=".pdf"
                        {...register("questions", {
                          required: questionType === "custom" ? "Please upload a file with questions" : false
                        })}
                      />
                      <p className="text-sm text-muted-foreground">
                        Supported formats: PDF. Maximum file size: 20MB
                      </p>
                    </div>

                    
                    <div className="space-y-2">
                      <Label htmlFor="CustomJobtype">Job Role (Optional)</Label>
                      <Input
                        id="CustomJobtype"
                        placeholder="e.g., Frontend Developer (for categorization)"
                        {...register("Jobtype")}
                      />
                      <p className="text-xs text-muted-foreground">
                        Help us categorize your interview for better organization
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="CustomDescription">Brief Description (Optional)</Label>
                      <Input
                        id="CustomDescription"
                        placeholder="e.g., React Interview Questions"
                        {...register("Description")}
                        maxLength="100"
                      />
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {questionType === "custom" ? "Processing File..." : "Generating Questions..."}
                    </>
                  ) : (
                    'Create Interview'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Previous Interviews</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : Interviews?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Interviews.map((interview, index) => (
              <Card key={index} className="transition-shadow hover:shadow-lg">
                <CardHeader className="border-b bg-muted/50 p-4">
                  <h3 className="font-semibold capitalize">{interview.jobType || "Custom Questions"}</h3>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-sm font-medium capitalize">{interview.jobDescription || "Not Provided"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Experience Required</p>
                    <p className="text-sm font-medium capitalize">{interview.jobExperience || "Not Provided"}</p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleDelete(interview.id)}
                  >
                    Delete Interview
                  </Button>
                  <Link href={`/interview-screen/${interview.id}`} className="w-full">
                    <Button variant="secondary" className="w-full">
                      Start Interview
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center w-fit">
            <p className="text-muted-foreground">No interviews found. Create your first mock interview!</p>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AfterLoginHomepage