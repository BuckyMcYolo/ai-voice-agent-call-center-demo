import { appointment, patient } from "@/db/schema"
import { NextResponse } from "next/server"
import { eq, and, or, ilike, sql } from "drizzle-orm"
import db from "@/db"
import { headers } from "next/headers"
import moment from "moment"
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

    // Format date and times
    const appointmentDate = moment(date).format("YYYY-MM-DD")
    const appointmentStartTime = moment(startTime).toDate()
    const appointmentEndTime = moment(endTime).toDate()

    // Check for scheduling conflicts
    const conflictingAppointments = await db.query.appointment.findMany({
      where: and(
        eq(appointment.patientId, patientId),
        eq(appointment.date, appointmentDate),
        or(
          and(
            sql`${appointment.startTime} <= ${appointmentEndTime}`,
            sql`${appointment.endTime} > ${appointmentStartTime}`
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
        date: appointmentDate,
        startTime: appointmentStartTime,
        endTime: appointmentEndTime,
        status: "scheduled",
        notes: notes || null,
      })
      .returning()

    return NextResponse.json({
      success: true,
      appointment: newAppointment[0],
    })
  } catch (error) {
    console.error("Error scheduling appointment:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
