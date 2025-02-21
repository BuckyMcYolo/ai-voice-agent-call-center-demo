import { auth } from "@/lib/auth"
import { appointment, patient } from "@/db/schema"
import { NextResponse } from "next/server"
import { eq, and, or, ilike, sql, not, inArray } from "drizzle-orm"
import db from "@/db"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { headers } from "next/headers"
import moment from "moment"

// Get a list of available appointment slots within a certain time range
export async function GET(req: Request) {
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
    const { searchParams } = new URL(req.url)
    const startDateParam = searchParams.get("startDate")
    const endDateParam = searchParams.get("endDate")
    const patientId = searchParams.get("patientId")

    // Validate required query parameters
    if (!startDateParam || !endDateParam || !patientId) {
      return NextResponse.json(
        {
          error:
            "Missing required parameters: startDate, endDate, and patientId",
        },
        { status: 400 }
      )
    }

    // First, find the specific patient
    const specificPatient = await db.query.patient.findFirst({
      where: eq(patient.id, patientId),
      with: {
        user: true, // Include the associated user data
      },
    })

    if (!specificPatient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    // Get the user ID that the patient belongs to
    const userId = specificPatient.userId

    // Parse dates and validate
    const startDate = moment(startDateParam).startOf("day")
    const endDate = moment(endDateParam).endOf("day")

    if (!startDate.isValid() || !endDate.isValid()) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD." },
        { status: 400 }
      )
    }

    if (startDate.isAfter(endDate)) {
      return NextResponse.json(
        { error: "startDate must be before endDate" },
        { status: 400 }
      )
    }

    // Maximum range limit (e.g., 30 days)
    const maxRangeDays = 30
    if (endDate.diff(startDate, "days") > maxRangeDays) {
      return NextResponse.json(
        { error: `Date range cannot exceed ${maxRangeDays} days` },
        { status: 400 }
      )
    }

    // Get all patients under the same user to find all their appointments
    const userPatients = await db.query.patient.findMany({
      where: eq(patient.userId, userId),
    })

    const patientIds = userPatients.map((p) => p.id)
    // Get all booked appointments for patients under this user within the date range
    const bookedAppointments = await db.query.appointment.findMany({
      where: and(
        sql`${appointment.date} >= ${startDate.format("YYYY-MM-DD")}`,
        sql`${appointment.date} <= ${endDate.format("YYYY-MM-DD")}`,
        not(eq(appointment.status, "cancelled")),
        patientIds.length > 0
          ? inArray(appointment.patientId, patientIds)
          : undefined
      ),
    })

    // Business hours configuration (8AM to 5PM)
    const businessHourStart = 8
    const businessHourEnd = 17
    const appointmentDurationMinutes = 30
    const maxSlotsPerHour = 2

    // Generate all possible slots
    const availableSlots = []
    const currentDate = startDate.clone()

    while (currentDate.isSameOrBefore(endDate, "day")) {
      // Skip weekends (Saturday and Sunday)
      if (currentDate.day() !== 0 && currentDate.day() !== 6) {
        for (let hour = businessHourStart; hour < businessHourEnd; hour++) {
          // For each hour, we can have up to maxSlotsPerHour slots
          for (let slotIndex = 0; slotIndex < maxSlotsPerHour; slotIndex++) {
            const slotMinutes = slotIndex * (60 / maxSlotsPerHour)
            const slotStart = currentDate
              .clone()
              .hour(hour)
              .minute(slotMinutes)
              .second(0)
            const slotEnd = slotStart
              .clone()
              .add(appointmentDurationMinutes, "minutes")

            // Check if this slot is already booked
            const isBooked = bookedAppointments.some((appt) => {
              const apptStart = moment(appt.startTime)
              const apptEnd = moment(appt.endTime)

              return (
                apptStart.isSame(slotStart) ||
                apptEnd.isSame(slotEnd) ||
                (apptStart.isBefore(slotEnd) && apptEnd.isAfter(slotStart))
              )
            })

            // Skip slots in the past
            const isPast = slotStart.isBefore(moment())

            if (!isBooked && !isPast) {
              availableSlots.push({
                date: slotStart.format("YYYY-MM-DD"),
                startTime: slotStart.format("YYYY-MM-DDTHH:mm:ss"),
                endTime: slotEnd.format("YYYY-MM-DDTHH:mm:ss"),
                formattedTime: `${slotStart.format(
                  "h:mm A"
                )} - ${slotEnd.format("h:mm A")}`,
              })
            }
          }
        }
      }

      // Move to next day
      currentDate.add(1, "day")
    }

    return NextResponse.json({
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      availableSlots,
    })
  } catch (error) {
    console.error("Error getting available appointment slots:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
