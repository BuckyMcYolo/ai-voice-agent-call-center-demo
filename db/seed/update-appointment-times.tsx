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

      // Parse the appointment's seeded date in CST
      const appointmentDate = moment.tz(appointment.date, TIMEZONE)

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

      // Ensure the first time is on a half-hour (0 or 30 minutes)
      if (currentTime.minute() % 30 !== 0) {
        currentTime.minute(currentTime.minute() < 30 ? 30 : 0)
        if (currentTime.minute() === 0) currentTime.add(1, "hour")
      }

      // Build the list: iterate in 30-minute steps until latestStart
      while (currentTime.isSameOrBefore(latestStart)) {
        // Verify the end time would still be before 5 PM
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

      // Only update if we found a valid time slot
      if (chosenStartTime) {
        const newStartTime = chosenStartTime
        const newEndTime = newStartTime.clone().add(duration, "minutes")

        // Log the times for verification
        console.log("Updating appointment:", {
          date: appointmentDate.format("YYYY-MM-DD"),
          start: newStartTime.format("HH:mm"),
          end: newEndTime.format("HH:mm"),
          timezone: TIMEZONE,
        })

        // Store times in the database (they'll be converted to UTC)
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
}
