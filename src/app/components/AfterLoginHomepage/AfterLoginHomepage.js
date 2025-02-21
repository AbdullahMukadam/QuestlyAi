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
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { chatSession } from '@/utils/geminiapi'
import { addQuestions } from '@/app/store/InterviewQuestionSlice'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { AddInterviewQuestions, fetchAllInterviewDetails } from '@/app/actions/QuestionsAction'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Loader2, Plus } from 'lucide-react'
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
      toast({
        title: "Error",
        description: "An error occurred in fetching all interviews" || error.message,
        variant: "destructive"
      })
    } finally {
      setloading(false)
    }
  }

  useEffect(() => {
    fetchAllInterviews()
  }, [dispatch])

  if (userData?.role !== "candidate") {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <h1 className="text-2xl font-semibold text-muted-foreground">Access Restricted</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
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

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Mock Interview Dashboard</h1>
        <Dialog open={open} onOpenChange={setopen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Interview
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Interview</DialogTitle>
              <DialogDescription>
                Set up your mock interview by providing job details below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="Jobtype">Job Role / Position</Label>
                  <Input
                    id="Jobtype"
                    placeholder="e.g., Frontend Developer, Technical Writer"
                    {...register("Jobtype", { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="Description">Job Description / Tech Stack (In Short)</Label>
                  <Textarea
                    id="Description"
                    placeholder="e.g., React, Node.js, TypeScript, AWS"
                    {...register("Description", { required: true })}
                    maxLength="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Experience Level</Label>
                  <Select value={Experience} onValueChange={setExperience} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Less than 1 year">Less than 1 year</SelectItem>
                      <SelectItem value="3 Years">3 Years</SelectItem>
                      <SelectItem value="5 years and above">5 years and above</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="questions">Custom Questions (Optional)</Label>
                  <Input
                    id="questions"
                    type="file"
                    accept=".pdf"
                    {...register("questions")}
                  />
                  <p className="text-sm text-muted-foreground">PDF format only</p>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
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
                  <h3 className="font-semibold capitalize">{interview.jobType}</h3>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-sm font-medium capitalize">{interview.jobDescription}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Experience Required</p>
                    <p className="text-sm font-medium capitalize">{interview.jobExperience}</p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
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
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No interviews found. Create your first mock interview!</p>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AfterLoginHomepage