"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Phone, User, AlertCircle } from "lucide-react"

export default function DemoGuide() {
  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-4">Demo Guide</h1>
          <p className="text-lg text-muted-foreground dark:text-neutral-300">
            Instructions and example scenarios to help you test the AI
            receptionist
          </p>
        </div>

        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Demo Environment</AlertTitle>
          <AlertDescription>
            This is a live demo environment. Use your real information to test
            the system.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="scripts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
            <TabsTrigger value="scripts">Example Scripts</TabsTrigger>
            <TabsTrigger value="scenarios">Test Scenarios</TabsTrigger>
            <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          </TabsList>

          <TabsContent value="scripts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>
                  How to interact with the AI receptionist
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 text-blue-500">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        AI: &quot;Welcome to the medical practice. To get
                        started, could you please provide your name and date of
                        birth?&quot;
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 text-green-500">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        You: &quot;My name is [Your Name], date of birth [Your
                        DOB].&quot;
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Use your actual information for authentication
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scheduling an Appointment</CardTitle>
                <CardDescription>
                  Example dialogue for booking a new appointment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 text-green-500">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        You: &quot;I&apos;d like to schedule an
                        appointment.&quot;
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 text-blue-500">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        AI: &quot;I can help you with that. What&apos;s your
                        preferred day and time?&quot;
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 text-green-500">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        You: &quot;Next Tuesday afternoon if possible.&quot;
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Test Scenarios</CardTitle>
                <CardDescription>
                  Try these common interactions to test the AI&apos;s
                  capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg bg-neutral-50 dark:bg-neutral-900 p-4">
                    <h3 className="font-semibold mb-2">
                      Scenario 1: Schedule Management
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Call and authenticate with your information</li>
                      <li>Schedule a new appointment</li>
                      <li>Ask about available time slots</li>
                      <li>Request appointment confirmation details</li>
                    </ol>
                  </div>
                  <div className="rounded-lg bg-neutral-50 dark:bg-neutral-900 p-4">
                    <h3 className="font-semibold mb-2">
                      Scenario 2: General Inquiries
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Ask about office hours</li>
                      <li>Inquire about services offered</li>
                      <li>Request directions to the practice</li>
                      <li>Ask about insurance acceptance</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="troubleshooting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Common Issues & Solutions</CardTitle>
                <CardDescription>Help with frequent challenges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2">
                      Authentication Issues
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Speak clearly and provide your full name and date of birth
                      exactly as they appear in your patient records. It may
                      also ask for the lst 4 digits of your patients SSN.
                    </p>
                  </div>
                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2">Communication Tips</h3>
                    <p className="text-sm text-muted-foreground">
                      Speak naturally and provide complete information. The AI
                      works best with clear, conversational speech.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Connection Problems</h3>
                    <p className="text-sm text-muted-foreground">
                      If the AI seems unresponsive, it may be thinking. Wait a
                      few seconds before speaking again.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Contact our support team at support@getaxon.ai
          </p>
        </div>
      </main>
    </div>
  )
}
