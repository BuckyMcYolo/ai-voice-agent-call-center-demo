// app/api/patients/search/route.ts
import { auth } from "@/lib/auth"
import { patient, appointment } from "@/db/schema"
import { NextResponse } from "next/server"
import { eq, and, or, ilike, sql } from "drizzle-orm"
import db from "@/db"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { headers } from "next/headers"
import moment from "moment"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "30 s"),
  analytics: true,
  prefix: "call-center-demo",
})

export async function GET(req: Request) {
  try {
    const headers_ = await headers()

    const apiKey = headers_.get("Authorization")
    let apiKeyValue: string | null = null

    if (apiKey?.startsWith("Bearer ")) {
      apiKeyValue = apiKey.slice(7)
    }

    if (!apiKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (apiKeyValue !== process.env.AVA_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // const response = await ratelimit.limit(session.user.id)

    // if (!response.success) {
    //   return new NextResponse("Too many requests. Please try again later.", {
    //     status: 429,
    //   })
    // }

    const { searchParams } = new URL(req.url)
    const patientName = searchParams.get("patient")
    const dob = searchParams.get("dob")
    const last4SSN = searchParams.get("last4SSN")

    const fullName = patientName?.split(" ") || []
    const firstName = fullName[0]
    const lastName = fullName[1]

    if (!patientName || !dob) {
      return NextResponse.json([])
    }

    const formattedDob = moment(dob).format("YYYY-MM-DD")

    const result = await db.query.patient.findFirst({
      where: and(
        or(
          ilike(patient.firstName, `%${patientName}%`),
          ilike(patient.lastName, `%${patientName}%`),
          and(eq(patient.firstName, firstName), eq(patient.lastName, lastName))
        ),
        or(
          eq(patient.dateOfBirth, formattedDob),
          last4SSN ? sql`${patient.ssn} LIKE ${"%" + last4SSN}` : undefined
        )
      ),
      with: {
        appointments: true,
      },
    })

    console.log("Searching patients for query:", patientName, dob, last4SSN)

    if (!result) {
      return NextResponse.json([])
    }

    const normalizedData = {
      ...result,
      appointments: result.appointments.map((appointment) => ({
        ...appointment,
        startTime: moment(appointment.startTime)
          .utcOffset("America/Chicago")
          .format("HH:mm"),
        endTime: moment(appointment.endTime)
          .utcOffset("America/Chicago")
          .format("HH:mm"),
        date: moment(appointment.date).format("YYYY-MM-DD"),
      })),
    }

    return NextResponse.json(normalizedData)
  } catch (error) {
    console.error("Error searching patients:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
