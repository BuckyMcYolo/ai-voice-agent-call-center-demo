"use server"

import { NewAppointmentDialog } from "@/components/client/appointments/new-appointment-dialog"
import Refresher from "@/components/client/refresher"
import AppointmentsSkeleton from "@/components/server/appointments/appointment-skeleton"
import AppointmentsList from "@/components/server/appointments/appointments-list"
import { DatePicker } from "@/components/server/appointments/date-picker-with-searchparams"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { PlusIcon } from "lucide-react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { z } from "zod"
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in")
  }

  if (session.user.hasUpdatedAppointments === false) {
    return <Refresher />
  }

  const { date } = z
    .object({
      date: z.string().transform((date) => new Date(date)),
    })
    .parse({
      date: params.date || new Date().toISOString(),
    })

  return (
    <div className="px-4">
      <main>
        <Card className="w-full border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>
                  Manage your patient appointments
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <DatePicker date={date} />
                <NewAppointmentDialog />
              </div>
            </div>
          </CardHeader>
          <Suspense
            key={date.toISOString()}
            fallback={<AppointmentsSkeleton />}
          >
            <AppointmentsList session={session} date={date} />
          </Suspense>
        </Card>
      </main>
    </div>
  )
}
