import { and, eq, exists } from "drizzle-orm"
import db from ".."
import { appointment, patient, SelectUser, user } from "../schema"

export async function getAppointmentsForUser({
  userId,
  date,
}: {
  userId: SelectUser["id"]
  date: Date
}) {
  if (!userId) {
    throw new Error("userId is required")
  }

  if (!date) {
    throw new Error("date is required")
  }

  if (date instanceof Date === false) {
    throw new Error("date must be a Date object")
  }

  //   const patientAppointments1 = await db
  //     .select()
  //     .from(appointment)
  //     .leftJoin(patient, eq(appointment.patientId, patient.id))
  //     .where(
  //       and(eq(patient.userId, userId), eq(appointment.date, date.toISOString()))
  //     )
  //     .leftJoin(user, eq(patient.userId, user.id))

  const patientAppointments = await db.query.appointment.findMany({
    where: and(
      eq(appointment.date, date.toISOString()),
      exists(
        db
          .select()
          .from(patient)
          .where(
            and(
              eq(patient.id, appointment.patientId),
              eq(patient.userId, userId)
            )
          )
      )
    ),
    orderBy: (appointment, { asc }) => [asc(appointment.startTime)],
    with: {
      patient: {
        with: {
          user: {
            columns: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      },
    },
  })

  return patientAppointments
}
