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

    //strip the Bearer prefix
    if (apiKey?.startsWith("Bearer ")) {
      apiKeyValue = apiKey.slice(7)
    }

    if (!apiKey) {
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

    if (!patientName || !dob) {
      return NextResponse.json([])
    }

    // Format the date of birth correctly
    const formattedDob = moment(dob).format("YYYY-MM-DD")

    // Query to get patients with their appointments
    const result = await db.query.patient.findFirst({
      where: and(
        or(
          ilike(patient.firstName, `%${patientName}%`),
          ilike(patient.lastName, `%${patientName}%`)
        ),
        or(
          eq(patient.dateOfBirth, formattedDob),
          // Use the LIKE operator with proper pattern for the last 4 digits of SSN
          last4SSN ? sql`${patient.ssn} LIKE ${"%" + last4SSN}` : undefined
        )
      ),
      // Include related appointments
      with: {
        appointments: true,
      },
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error searching patients:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
