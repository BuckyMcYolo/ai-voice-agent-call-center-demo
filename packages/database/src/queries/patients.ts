import { eq } from "drizzle-orm"
import db from ".."
import { patient, SelectUser } from "../schema"

export async function getPatientsBelongingToUser(userId: SelectUser["id"]) {
  if (!userId) {
    throw new Error("userId is required")
  }

  const patients = await db
    .select()
    .from(patient)
    .where(eq(patient.userId, userId))

  return patients
}
