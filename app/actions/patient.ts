"use server"

import db from "@/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export const createAppointment = async ({
  patientId,
  date,
  startTime,
  endTime,
  notes,
}: {
  patientId: string
  date: string
  startTime: string
  endTime: string
  notes: string
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) {
    throw new Error("Unauthorized")
  }

  const appointment = await db.query.appointment.create({
    data: {
      patientId,
      date,
      startTime,
      endTime,
      notes,
    },
  })

  return appointment
}
