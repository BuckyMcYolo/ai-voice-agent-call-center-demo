"use server"

import { NewPatientDialog } from "@/apps/web/components/client/patients/new-patient-dialog"
import PatientsSkeleton from "@/apps/web/components/server/patients/loading-skeleton"
import PatientsList from "@/apps/web/components/server/patients/patients-list"
import { Button } from "@/apps/web/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/apps/web/components/ui/card"
import { auth } from "@/lib/auth"
import { PlusIcon } from "lucide-react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"

export default async function page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <div className="px-4">
      <main>
        <Card className="w-full border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Patients</CardTitle>
                <CardDescription>Manage your patient records</CardDescription>
              </div>
              <NewPatientDialog />
            </div>
          </CardHeader>
          <Suspense fallback={<PatientsSkeleton />}>
            <PatientsList session={session} />
          </Suspense>
        </Card>
      </main>
    </div>
  )
}
