// app/api/patients/search/route.ts
import { auth } from "@/lib/auth"
import { patient, appointment } from "@/db/schema"
import { NextResponse } from "next/server"
import { eq, and, or, ilike, sql, not, asc } from "drizzle-orm"
import db from "@/db"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { headers } from "next/headers"
import moment from "moment-timezone" // Use moment-timezone for better timezone handling

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

    // Define timezone constant
    const TIMEZONE = "America/Chicago"

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

    // Handle both full name and partial name searches properly
    const fullName = patientName.split(" ").filter(Boolean)
    const firstName = fullName[0] || ""
    const lastName = fullName.length > 1 ? fullName[fullName.length - 1] : ""

    // Format date of birth in YYYY-MM-DD format for database query
    const formattedDob = moment.tz(dob, TIMEZONE).format("YYYY-MM-DD")

    console.log(
      "Searching patients for query:",
      patientName,
      formattedDob,
      last4SSN
    )

    const result = await db.query.patient.findFirst({
      where: and(
        or(
          ilike(patient.firstName, `%${patientName}%`),
          ilike(patient.lastName, `%${patientName}%`),
          and(
            fullName.length > 1
              ? and(
                  ilike(patient.firstName, `%${firstName}%`),
                  ilike(patient.lastName, `%${lastName}%`)
                )
              : undefined
          )
        ),
        or(
          eq(patient.dateOfBirth, formattedDob),
          last4SSN ? sql`${patient.ssn} LIKE ${"%" + last4SSN}` : undefined
        )
      ),
      with: {
        appointments: {
          // Only include non-cancelled appointments
          // where: not(eq(appointment.status, "cancelled")),
          orderBy: [asc(appointment.date), asc(appointment.startTime)],
        },
        medicalHistory: true,
        allergies: true,
        medications: true,
      },
    })

    if (!result) {
      console.log("No patient found matching criteria")
      return NextResponse.json([])
    }

    // Normalize appointment times to CST and format consistently
    const normalizedData = {
      ...result,
      appointments: result.appointments.map((appt) => {
        // Create moment objects in the CST timezone
        const startTime = moment.tz(appt.startTime, TIMEZONE)
        const endTime = moment.tz(appt.endTime, TIMEZONE)
        const appointmentDate = moment.tz(appt.date, TIMEZONE)

        // Format data for display
        return {
          ...appt,
          startTime: startTime.format("HH:mm"),
          endTime: endTime.format("HH:mm"),
          date: appointmentDate.format("YYYY-MM-DD"),
          formattedDate: appointmentDate.format("MMM D, YYYY"),
          formattedTime: `${startTime.format("h:mm A")} - ${endTime.format(
            "h:mm A"
          )}`,
          timezone: TIMEZONE,
          notes: null, // Hide internal notes for privacy
        }
      }),
      // Include masked SSN for verification (only show last 4 digits)
      maskedSSN: result.ssn ? `xxx-xx-${result.ssn.slice(-4)}` : null,
      // Format DOB for display
      formattedDOB: moment
        .tz(result.dateOfBirth, TIMEZONE)
        .format("MMM D, YYYY"),
    }

    return NextResponse.json(normalizedData)
  } catch (error) {
    console.error("Error searching patients:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
