"use server"

import db from "@/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { appointment, patient } from "@/db/schema"
import { eq } from "drizzle-orm"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  analytics: true,
  prefix: "call-center-demo",
})

export const createAppointment = async ({
  patientId,
  date,
  startTime,
  endTime,
  notes,
}: {
  patientId: string
  date: string
  startTime: EpochTimeStamp
  endTime: EpochTimeStamp
  notes?: string
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) {
    throw new Error("Unauthorized")
  }

  //rate limiter
  const response = await ratelimit.limit(session.user.id)

  if (!response.success) {
    throw new Error("Too many requests. Please try again later.")
  }

  // Verify the patient belongs to the user
  const patientRecord = await db
    .select()
    .from(patient)
    .where(eq(patient.id, patientId))
    .limit(1)

  if (!patientRecord[0] || patientRecord[0].userId !== session.user.id) {
    throw new Error("Unauthorized")
  }

  try {
    await db.insert(appointment).values({
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      date: date,
      status: "scheduled",
      notes: notes,
      patientId: patientId,
    })
  } catch (error) {
    throw new Error("Failed to create appointment: " + error)
  }
}
