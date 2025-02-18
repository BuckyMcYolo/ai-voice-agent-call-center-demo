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
          <h1 className="text-3xl font-bold mb-4">Demo Guide & Examples</h1>
          <p className="text-lg text-muted-foreground dark:text-neutral-300">
            Detailed instructions and example scenarios to help you test the AI
            receptionist
          </p>
        </div>

        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Demo Environment</AlertTitle>
          <AlertDescription>
            All patient data is fictional and automatically generated. Feel free
            to experiment!
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="scripts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
            <TabsTrigger value="scripts">Example Scripts</TabsTrigger>
            <TabsTrigger value="profiles">Sample Profiles</TabsTrigger>
            <TabsTrigger value="scenarios">Test Scenarios</TabsTrigger>
            <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          </TabsList>

          <TabsContent value="scripts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Authentication Example</CardTitle>
                <CardDescription>
                  How to identify yourself to the AI
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
                        You: &quot;My name is Sarah Johnson, date of birth March
                        15, 1985.&quot;
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Note: Use any of the sample patient profiles provided in
                        your dashboard
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
                        You: &quot;I&apos;d like to schedule a follow-up
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

          <TabsContent value="profiles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sample Patient Profiles</CardTitle>
                <CardDescription>
                  Pre-generated test patients you can use
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2">Sarah Johnson</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <span className="font-medium">DOB:</span> March 15, 1985
                      </li>
                      <li>
                        <span className="font-medium">Next Appointment:</span>{" "}
                        Check dashboard
                      </li>
                      <li>
                        <span className="font-medium">Medications:</span>{" "}
                        Lisinopril 10mg, Metformin 500mg
                      </li>
                    </ul>
                  </div>
                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2">Michael Chen</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <span className="font-medium">DOB:</span> July 22, 1990
                      </li>
                      <li>
                        <span className="font-medium">Next Appointment:</span>{" "}
                        Check dashboard
                      </li>
                      <li>
                        <span className="font-medium">Medications:</span>{" "}
                        Atorvastatin 20mg
                      </li>
                    </ul>
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
                      Scenario 1: Cancel and Rebook
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Call and authenticate as Sarah Johnson</li>
                      <li>Cancel her upcoming appointment</li>
                      <li>Schedule a new appointment for a different time</li>
                      <li>Watch the dashboard update in real-time</li>
                    </ol>
                  </div>
                  <div className="rounded-lg bg-neutral-50 dark:bg-neutral-900 p-4">
                    <h3 className="font-semibold mb-2">
                      Scenario 2: Medication Review
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Call and authenticate as Michael Chen</li>
                      <li>Ask about current medications</li>
                      <li>
                        Request information about last prescription refill
                      </li>
                      <li>Ask about potential side effects</li>
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
                <CardDescription>
                  Help with frequent demo challenges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2">
                      Authentication Failed
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Make sure to use the exact name and date of birth from the
                      patient profiles. The AI is sensitive to precise matching.
                    </p>
                  </div>
                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2">
                      Dashboard Not Updating
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Try refreshing your browser. Changes should appear within
                      30 seconds.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">AI Not Understanding</h3>
                    <p className="text-sm text-muted-foreground">
                      Speak clearly and provide information in a natural,
                      conversational way. The AI works best with complete
                      sentences.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Need more help? Contact our support team at support@getaxon.ai
          </p>
        </div>
      </main>
    </div>
  )
}
