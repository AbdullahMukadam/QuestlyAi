"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import { useSelector } from 'react-redux'
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

function AfterLoginHomepage() {
  const userData = useSelector((state) => state.userData.userData)

  if (userData?.role === "candidate") {
    return (
      <div className='w-full p-3'>
        <h1 className='font-bold text-[20px] text-gray-600 dark:text-white'>Create and Start with your Mockup Interview</h1>
        <Dialog className="mt-2">
          <DialogTrigger asChild>
            <Button>+ Add New</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Details</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value="Pedro Duarte" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input id="username" value="@peduarte" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className='w-full mt-9'>
          <h2 className='font-bold text-xl'>Previuos Mock Interviews</h2>
        </div>
      </div>
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