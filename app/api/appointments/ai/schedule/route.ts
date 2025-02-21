import { appointment, patient } from "@/db/schema"
import { NextResponse } from "next/server"
import { eq, and, or, sql } from "drizzle-orm"
import db from "@/db"
import { headers } from "next/headers"
import moment from "moment-timezone" // Use moment-timezone for better timezone handling

// Schedule an appointment with the AI given a patient ID
export async function POST(req: Request) {
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

  if (apiKeyValue !== process.env.AVA_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { patientId, date, startTime, endTime, notes } = body

    // Define timezone constant
    const TIMEZONE = "America/Chicago"

    console.log("Scheduling request received:", {
      patientId,
      date,
      startTime,
      endTime,
    })

    // Validate required fields
    if (!patientId || !date || !startTime || !endTime) {
      return NextResponse.json(
        {
          error: "Missing required fields: patientId, date, startTime, endTime",
        },
        { status: 400 }
      )
    }

    // Check if patient exists
    const existingPatient = await db.query.patient.findFirst({
      where: eq(patient.id, patientId),
    })

    if (!existingPatient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    // Proper parsing of date and times from input, respecting CST timezone
    const dateStr = moment.tz(date, TIMEZONE).format("YYYY-MM-DD")

    // Parse the startTime and endTime properly - handle different input formats
    let startDateTime, endDateTime

    // Check if startTime already includes the date
    if (startTime.includes("T") || startTime.includes(" ")) {
      // Full ISO format or datetime string provided
      startDateTime = moment.tz(startTime, TIMEZONE)
    } else {
      // Only time provided, combine with date
      startDateTime = moment.tz(
        `${dateStr} ${startTime}`,
        "YYYY-MM-DD HH:mm",
        TIMEZONE
      )
    }

    // Same check for endTime
    if (endTime.includes("T") || endTime.includes(" ")) {
      endDateTime = moment.tz(endTime, TIMEZONE)
    } else {
      endDateTime = moment.tz(
        `${dateStr} ${endTime}`,
        "YYYY-MM-DD HH:mm",
        TIMEZONE
      )
    }

    // Additional validation to ensure times are parsed correctly
    if (!startDateTime.isValid() || !endDateTime.isValid()) {
      return NextResponse.json(
        { error: "Invalid time format provided. Use ISO format or HH:mm." },
        { status: 400 }
      )
    }

    console.log("Parsed appointment times:", {
      date: dateStr,
      startDateTime: startDateTime.format(),
      endDateTime: endDateTime.format(),
    })

    // Check for scheduling conflicts
    const conflictingAppointments = await db.query.appointment.findMany({
      where: and(
        eq(appointment.patientId, patientId),
        eq(appointment.date, dateStr),
        or(
          and(
            sql`${appointment.startTime} <= ${endDateTime.toDate()}`,
            sql`${appointment.endTime} > ${startDateTime.toDate()}`
          )
        )
      ),
    })

    if (conflictingAppointments.length > 0) {
      return NextResponse.json(
        { error: "Scheduling conflict detected" },
        { status: 409 }
      )
    }

    // Create the new appointment
    const newAppointment = await db
      .insert(appointment)
      .values({
        patientId,
        date: dateStr,
        startTime: startDateTime.toDate(),
        endTime: endDateTime.toDate(),
        status: "scheduled",
        notes: notes || null,
      })
      .returning()

    // Format the response with proper timezone info
    const formattedAppointment = {
      ...newAppointment[0],
      startTime: moment.tz(newAppointment[0].startTime, TIMEZONE).format(),
      endTime: moment.tz(newAppointment[0].endTime, TIMEZONE).format(),
      formattedStartTime: moment
        .tz(newAppointment[0].startTime, TIMEZONE)
        .format("h:mm A"),
      formattedEndTime: moment
        .tz(newAppointment[0].endTime, TIMEZONE)
        .format("h:mm A"),
      formattedDate: moment
        .tz(newAppointment[0].date, TIMEZONE)
        .format("MMM D, YYYY"),
      timezone: TIMEZONE,
    }

    return NextResponse.json({
      success: true,
      appointment: formattedAppointment,
    })
  } catch (error) {
    console.error("Error scheduling appointment:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
