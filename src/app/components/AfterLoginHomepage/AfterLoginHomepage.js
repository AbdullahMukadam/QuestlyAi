"use client"
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
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { chatSession } from '@/utils/geminiapi'
import { addQuestions } from '@/app/store/InterviewQuestionSlice'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid';
import { AddInterviewQuestions, fetchAllInterviewDetails } from '@/app/actions/QuestionsAction'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

function AfterLoginHomepage() {
  const userData = useSelector((state) => state.userData.userData)
  const [open, setopen] = useState(false)
  const { handleSubmit, register, formState: { isSubmitting } } = useForm()
  const [Experience, setExperience] = useState("")
  const [error, seterror] = useState("")
  const { toast } = useToast()
  const dispatch = useDispatch()
  const router = useRouter()
  const [loading, setloading] = useState(false)
  const [Interviews, setInterviews] = useState(null)
  

  const submitHandler = async (data) => {
    seterror("")
    try {
      const InputPrompt = `job type :${data.Jobtype}, Description: ${data.Description}, Experience : ${Experience}, ${process.env.NEXT_PUBLIC_GEMINI_INPUT_PROMPT} `
      const result = await chatSession.sendMessage(InputPrompt)
      const filteredResponse = (result.response.text()).replace('```json', '').replace('```', '').trim()
      const Data = JSON.parse(filteredResponse)
      if (filteredResponse) {
        const uniqueId = uuidv4()
        const questionData = {
          id: uniqueId,
          userId: userData.userId,
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
      seterror(error.message)
      toast({
        title: "Error",
        description: "An error occured, please try again" || error.message,
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
      toast({
        title: "Error",
        description: "An error occured in fetching all interviews" || error.message,
        variant: "destructive"
      })
    } finally {
      setloading(false)
    }
  }

  useEffect(() => {
    fetchAllInterviews()
  }, [dispatch])

  if (userData?.role === "candidate") {
    return (
      <>
        {isSubmitting && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl flex flex-col items-center gap-4">
              <div className="flex-col gap-4 w-full flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
                  <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
                </div>
              </div>
              <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Please wait...</p>
            </div>
          </div>
        )}

        <div className='w-full p-3 font-sans'>
          <h1 className='font-bold text-[20px] text-gray-600 dark:text-white'>Create and Start with your Mockup Interview</h1>
          <Dialog className="mt-2" open={open} onOpenChange={setopen}>
            <DialogTrigger>
              <Button>Add New</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Details</DialogTitle>
                <DialogDescription>
                  Tell us More About your Job Interviewing
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(submitHandler)}>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col items-start gap-4 text-left">
                    <Label htmlFor="Jobtype">
                      Job Role / Job Position
                    </Label>
                    <Input id="Jobtype" placeholder="ex developer, writer, etc" className="col-span-3"
                      {...register("Jobtype", {
                        required: true
                      })}
                      required
                    />
                  </div>
                  <div className="flex flex-col items-start gap-4">
                    <Label htmlFor="Description" className="text-right">
                      Job Description / Tech Stack (In Short)
                    </Label>
                    <Textarea id="Description" placeholder="Ex React, Nodejs, Typescript, Aws, etc" className="col-span-3"
                      {...register("Description", {
                        required: true
                      })}
                      required
                    />
                  </div>
                  <div className="flex flex-col items-start gap-4">
                    <Label htmlFor="Description" className="text-right">
                      Experience
                    </Label>
                    <Select value={Experience} onValueChange={setExperience} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Experience Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Less than 1 year">Less than 1 year</SelectItem>
                        <SelectItem value="3 Years">3 Years</SelectItem>
                        <SelectItem value="5 years and above">5 years and above</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <Label htmlFor="questions" className="text-right">
                      Have your predefined Questions? (Optional)
                    </Label>
                    <p className='font-semibold text-sm text-gray-600'>pdf only</p>
                    <Input id="questions" type="file" className="col-span-3"
                      {...register("questions")}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>Submit</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <div className='w-full mt-9'>
            <h2 className='font-bold text-xl'>Previous Mock Interviews</h2>
            {Interviews?.length > 0 ? (
              Interviews.map((interview, index) => (
                < Card className="w-full p-2 h-fit md:w-[30%] mt-2" key={index}>
                  <CardContent className="w-full flex flex-col">
                    <div className='flex gap-3 items-center'>
                      <span className="text-sm text-gray-500">Job Type:</span>
                      <p className="text-lg font-medium capitalize">{interview.jobType}</p>
                    </div>
                    <div className='flex gap-3 items-center'>
                      <span className="text-sm text-gray-500">Job Description:</span>
                      <p className="text-lg font-medium capitalize">{interview.jobDescription}</p>
                    </div>
                    <div className='flex gap-3 items-center'>
                      <span className="text-sm text-gray-500">Job Experience:</span>
                      <p className="text-lg font-medium capitalize">{interview.jobExperience}</p>
                    </div>
                    <div className='w-full flex justify-end'>
                      <Link href={`/interview-screen/${interview.id}`}>Start</Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className='text-red-500 font-semibold mt-2'>No Interviews Found, Add Some</p>
            )}
          </div>
        </div >
      </>
    )
  } else {
    return (
      <div className='w-full p-3'>
        <h1>Go</h1>
      </div>
    )
  }
}

export default AfterLoginHomepage