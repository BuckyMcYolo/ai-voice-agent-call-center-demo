import { auth } from "@/lib/auth"
import { appointment, patient } from "@/db/schema"
import { NextResponse } from "next/server"
import { eq, and, or, ilike } from "drizzle-orm"
import db from "@/db"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { headers } from "next/headers"

// Cancel an appointment with the AI given an appointment ID
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
    const { appointmentId, patientId, cancellationReason } = body

    // Validate required fields
    if (!appointmentId || !patientId) {
      return NextResponse.json(
        { error: "Missing required fields: appointmentId and patientId" },
        { status: 400 }
      )
    }

    // Check if appointment exists and include the patient info
    const existingAppointment = await db.query.appointment.findFirst({
      where: eq(appointment.id, appointmentId),
      with: {
        patient: true,
      },
    })

    if (!existingAppointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      )
    }

    // Check if appointment is already cancelled
    if (existingAppointment.status === "cancelled") {
      return NextResponse.json(
        { error: "Appointment is already cancelled" },
        { status: 409 }
      )
    }

    // Check if appointment is already completed
    if (existingAppointment.status === "completed") {
      return NextResponse.json(
        { error: "Cannot cancel a completed appointment" },
        { status: 409 }
      )
    }

    // Verify that the appointment belongs to the patient making the request
    if (existingAppointment.patient.id !== patientId) {
      return NextResponse.json(
        {
          error:
            "Unauthorized: This appointment does not belong to the given patient",
        },
        { status: 403 }
      )
    }

    // Update appointment status to cancelled
    const updatedAppointment = await db
      .update(appointment)
      .set({
        status: "cancelled",
        notes: cancellationReason
          ? `${
              existingAppointment.notes
                ? existingAppointment.notes + "\n\n"
                : ""
            }Cancellation reason: ${cancellationReason}`
          : existingAppointment.notes,
      })
      .where(eq(appointment.id, appointmentId))
      .returning()

    return NextResponse.json({
      success: true,
      appointment: updatedAppointment[0],
    })
  } catch (error) {
    console.error("Error cancelling appointment:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
