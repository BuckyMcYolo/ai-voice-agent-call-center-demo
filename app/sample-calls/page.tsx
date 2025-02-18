"use client"

import React, { useState } from "react"
import {
  Bot,
  User,
  Play,
  Pause,
  Calendar,
  Clock,
  Pill,
  FileText,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function SampleCalls() {
  const [playingCall, setPlayingCall] = useState<number | null>(null)

  const sampleCalls = [
    {
      id: 1,
      title: "Scheduling a New Appointment",
      duration: "2:45",
      category: "Scheduling",
      description: "A patient books a follow-up appointment for next week",
      transcript: [
        {
          speaker: "ai",
          text: "Thank you for calling. Could you please provide your name and date of birth?",
        },
        {
          speaker: "user",
          text: "Hi, this is Sarah Johnson, born March 15, 1985.",
        },
        {
          speaker: "ai",
          text: "Thank you, Sarah. I've found your record. How can I help you today?",
        },
        {
          speaker: "user",
          text: "I need to schedule a follow-up appointment with Dr. Smith.",
        },
        {
          speaker: "ai",
          text: "I can help you with that. Dr. Smith has availability next Tuesday at 2:00 PM or Wednesday at 10:00 AM. Would either of those work for you?",
        },
        {
          speaker: "user",
          text: "Tuesday at 2:00 PM would be perfect.",
        },
        {
          speaker: "ai",
          text: "Great, I've scheduled your appointment with Dr. Smith for Tuesday at 2:00 PM. You should see this reflected in your patient portal. Would you like me to send you a confirmation email as well?",
        },
      ],
    },
    {
      id: 2,
      title: "Canceling an Appointment",
      duration: "1:55",
      category: "Scheduling",
      description: "A patient needs to cancel their upcoming appointment",
      transcript: [
        {
          speaker: "ai",
          text: "Thank you for calling. Could you please provide your name and date of birth?",
        },
        {
          speaker: "user",
          text: "This is Michael Chen, July 22, 1990.",
        },
        {
          speaker: "ai",
          text: "Hello Michael, I've pulled up your information. How can I assist you today?",
        },
        {
          speaker: "user",
          text: "I need to cancel my appointment for tomorrow morning.",
        },
        {
          speaker: "ai",
          text: "I see you have an appointment scheduled for tomorrow at 9:00 AM. I can help you cancel that. Would you like to reschedule for another time?",
        },
        {
          speaker: "user",
          text: "No thank you, I'll call back later to reschedule.",
        },
        {
          speaker: "ai",
          text: "I've cancelled your appointment for tomorrow. You'll receive a confirmation email shortly. Is there anything else I can help you with?",
        },
      ],
    },
    {
      id: 3,
      title: "Medication Information",
      duration: "3:15",
      category: "Medical",
      description:
        "A patient inquires about their current medications and side effects",
      transcript: [
        {
          speaker: "ai",
          text: "Thank you for calling. Could you please provide your name and date of birth?",
        },
        {
          speaker: "user",
          text: "Sarah Johnson, March 15, 1985.",
        },
        {
          speaker: "ai",
          text: "Hello Sarah, I've found your record. How can I help you today?",
        },
        {
          speaker: "user",
          text: "I'd like to know about my current medications and their side effects.",
        },
        {
          speaker: "ai",
          text: "I see you're currently prescribed Lisinopril 10mg and Metformin 500mg. Which medication would you like to know more about?",
        },
        {
          speaker: "user",
          text: "Can you tell me about the Lisinopril side effects?",
        },
        {
          speaker: "ai",
          text: "Common side effects of Lisinopril may include dizziness, headache, and dry cough. Would you like me to have a nurse contact you to discuss any specific concerns?",
        },
      ],
    },
  ]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Scheduling":
        return <Calendar className="w-4 h-4" />
      case "Medical":
        return <Pill className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-4">Sample Calls</h1>
          <p className="text-lg text-muted-foreground dark:text-neutral-300">
            Listen to example interactions with our AI receptionist to
            understand its capabilities
          </p>
        </div>

        <div className="space-y-8">
          {sampleCalls.map((call) => (
            <Card key={call.id} className="w-full">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <CardTitle className="text-xl mb-2">{call.title}</CardTitle>
                    <CardDescription>{call.description}</CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {getCategoryIcon(call.category)}
                    {call.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <Clock className="w-4 h-4" />
                  {call.duration}
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-4"
                    onClick={() =>
                      setPlayingCall(playingCall === call.id ? null : call.id)
                    }
                  >
                    {playingCall === call.id ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" /> Play
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {call.transcript.map((line, index) => (
                    <div
                      key={index}
                      className={`flex gap-4 ${
                        playingCall === call.id ? "animate-fadeIn" : ""
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 ${
                          line.speaker === "ai"
                            ? "text-blue-500"
                            : "text-green-500"
                        }`}
                      >
                        {line.speaker === "ai" ? (
                          <Bot className="w-5 h-5" />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm">{line.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            These are just examples. The AI can handle many more scenarios and
            variations.
          </p>
        </div>
      </main>
    </div>
  )
}
