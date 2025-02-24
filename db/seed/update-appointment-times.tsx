import db from ".."
import * as schema from "@/db/schema"
import moment from "moment-timezone"
import { eq } from "drizzle-orm"

// Helper: Get a random integer between min and max (inclusive)
function getRandomIntInclusive(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Custom function to update appointment times for a user's patients
export async function updateAppointmentsForUser(userId: string) {
  // Define the timezone as Central Time (handles CST/CDT as needed)
  const TIMEZONE = "America/Chicago"

  // Get all patients for the given user
  const patients = await db
    .select()
    .from(schema.patient)
    .where(eq(schema.patient.userId, userId))

  for (const patient of patients) {
    // Get appointments for this patient
    const appointments = await db
      .select()
      .from(schema.appointment)
      .where(eq(schema.appointment.patientId, patient.id))

    for (const appointment of appointments) {
      // Choose a random allowed duration: 15, 30, or 60 minutes
      const durations = [15, 30, 60]
      const duration = durations[Math.floor(Math.random() * durations.length)]

      // Parse the appointment's seeded date in Central Time
      const appointmentDate = moment.tz(appointment.date, TIMEZONE)

      // Define the allowed time window: 8:00 AM to 5:00 PM
      // Earliest start: 8:00 AM CST on the appointment's date
      const earliestStart = appointmentDate
        .clone()
        .hour(8)
        .minute(0)
        .second(0)
        .millisecond(0)

      // Latest start: 5:00 PM CST minus the chosen duration
      const latestStart = appointmentDate
        .clone()
        .hour(17)
        .minute(0)
        .second(0)
        .millisecond(0)
        .subtract(duration, "minutes")

      // Generate a list of possible start times on half-hour increments
      const possibleStartTimes: moment.Moment[] = []
      const currentTime = earliestStart.clone()

      // If currentTime is not on a half-hour mark, adjust it.
      if (currentTime.minute() % 30 !== 0) {
        currentTime.minute(currentTime.minute() < 30 ? 30 : 0)
        if (currentTime.minute() === 0) currentTime.add(1, "hour")
      }

      // Build the list: iterate in 30-minute steps until latestStart
      while (currentTime.isSameOrBefore(latestStart)) {
        // Check that the appointment will end by 5:00 PM (or exactly at 5:00 PM)
        const potentialEndTime = currentTime.clone().add(duration, "minutes")
        if (
          potentialEndTime.hour() < 17 ||
          (potentialEndTime.hour() === 17 && potentialEndTime.minute() === 0)
        ) {
          possibleStartTimes.push(currentTime.clone())
        }
        currentTime.add(30, "minutes")
      }

      // Pick a random start time from the available options
      const chosenStartTime =
        possibleStartTimes.length > 0
          ? possibleStartTimes[
              Math.floor(Math.random() * possibleStartTimes.length)
            ]
          : null

      // Only update if a valid time slot was found
      if (chosenStartTime) {
        const newStartTime = chosenStartTime
        const newEndTime = newStartTime.clone().add(duration, "minutes")

        console.log("Updating appointment:", {
          date: appointmentDate.format("YYYY-MM-DD"),
          start: newStartTime.format("HH:mm"),
          end: newEndTime.format("HH:mm"),
          timezone: TIMEZONE,
        })

        // Store the new times (they will be converted to UTC in the database)
        await db
          .update(schema.appointment)
          .set({
            startTime: newStartTime.toDate(),
            endTime: newEndTime.toDate(),
          })
          .where(eq(schema.appointment.id, appointment.id))
      } else {
        console.warn(
          `Could not find valid time slot for appointment ${appointment.id}`
        )
      }
    }
  }

  // Update the user's hasUpdatedAppointments flag
  await db
    .update(schema.user)
    .set({
      hasUpdatedAppointments: true,
    })
    .where(eq(schema.user.id, userId))
}
