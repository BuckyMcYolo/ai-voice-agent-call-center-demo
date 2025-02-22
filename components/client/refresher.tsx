"use client"

import React, { useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Refresher = () => {
  const [timer, setTimer] = React.useState(5)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (timer === 0) {
      window.location.reload()
    }
  }, [timer])

  return (
    <div className="px-4">
      <main>
        <Card className="w-full border-0">
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
            <CardDescription>Manage your patient appointments</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-8">
            <div className="flex flex-col items-center gap-4">
              <CardTitle className="text-center">
                Please wait while we generate your appointments.
              </CardTitle>
              <CardDescription className="text-center">
                This page will refresh in {timer} seconds.
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default Refresher
