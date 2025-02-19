"use server"

import db from "@/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { patient } from "@/db/schema"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  analytics: true,
  prefix: "call-center-demo",
})

export const createPatient = async ({
  firstName,
  lastName,
  ssn,
  phoneNumber,
  address,
  dateOfBirth,
  gender,
}: {
  firstName: string
  lastName: string
  ssn: string
  phoneNumber?: string
  address?: string
  dateOfBirth: Date
  gender: "male" | "female" | "other"
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
  try {
    await db.insert(patient).values({
      firstName,
      lastName,
      dateOfBirth: dateOfBirth.toISOString(),
      ssn,
      gender,
      phoneNumber,
      address,
      userId: session.user.id,
    })

    return
  } catch (error) {
    throw new Error("Failed to create patient: " + error)
  }
}
