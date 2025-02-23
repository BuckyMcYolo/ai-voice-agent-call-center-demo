import db from ".."
import * as schema from "@/db/schema"
import { eq } from "drizzle-orm"
import moment from "moment-timezone"

// Define medical condition groups and their associated medications and allergies
const medicalProfiles = {
  cardiovascular: {
    conditions: ["Hypertension", "Atrial Fibrillation"],
    medications: [
      { name: "Lisinopril", dosage: "10mg", frequency: "daily" },
      { name: "Metoprolol", dosage: "25mg", frequency: "twice daily" },
      { name: "Amlodipine", dosage: "5mg", frequency: "daily" },
    ],
    allergies: [
      {
        allergen: "Aspirin",
        reaction: "Respiratory difficulties",
        severity: "severe",
      },
    ],
  },
  endocrine: {
    conditions: ["Type 2 Diabetes", "Hypothyroidism"],
    medications: [
      { name: "Metformin", dosage: "500mg", frequency: "twice daily" },
      { name: "Levothyroxine", dosage: "50mcg", frequency: "daily" },
    ],
    allergies: [
      {
        allergen: "Contrast Dye",
        reaction: "Itching and flushing",
        severity: "moderate" as "mild" | "moderate" | "severe",
      },
    ],
  },
  mentalHealth: {
    conditions: ["Depression", "Anxiety"],
    medications: [
      { name: "Sertraline", dosage: "50mg", frequency: "daily" },
      { name: "Escitalopram", dosage: "10mg", frequency: "daily" },
    ],
    allergies: [],
  },
  gastrointestinal: {
    conditions: ["GERD"],
    medications: [
      { name: "Omeprazole", dosage: "20mg", frequency: "daily" },
      { name: "Pantoprazole", dosage: "40mg", frequency: "daily" },
    ],
    allergies: [
      {
        allergen: "Ibuprofen",
        reaction: "Stomach upset and rash",
        severity: "moderate",
      },
    ],
  },
}

// Helper function to get random items from an array
function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Helper function to get a random number of profiles based on weights
function getRandomProfileCount(): number {
  const weights = [
    { count: 1, weight: 0.5 }, // 50% chance of 1 profile
    { count: 2, weight: 0.3 }, // 30% chance of 2 profiles
    { count: 3, weight: 0.2 }, // 20% chance of 3 profiles
  ]

  const random = Math.random()
  let cumulativeWeight = 0

  for (const option of weights) {
    cumulativeWeight += option.weight
    if (random <= cumulativeWeight) {
      return option.count
    }
  }

  return 1 // Default to 1 if something goes wrong
}

export async function updateMedicalHistoriesForUser(userId: string) {
  // Get all patients for the given user
  const patients = await db
    .select()
    .from(schema.patient)
    .where(eq(schema.patient.userId, userId))

  for (const patient of patients) {
    // Delete existing medical records for this patient
    await db
      .delete(schema.medication)
      .where(eq(schema.medication.patientId, patient.id))
    await db
      .delete(schema.patientAllergy)
      .where(eq(schema.patientAllergy.patientId, patient.id))
    await db
      .delete(schema.medicalHistory)
      .where(eq(schema.medicalHistory.patientId, patient.id))

    // Select random number of condition profiles for this patient
    const profileCount = getRandomProfileCount()
    const selectedProfiles = getRandomItems(
      Object.values(medicalProfiles),
      profileCount
    )

    // Track what we'll insert for this patient
    const conditionsToAdd = []
    const medicationsToAdd = []
    const allergiesToAdd = []

    // Build coherent medical history from selected profiles
    for (const profile of selectedProfiles) {
      // Add 1-2 conditions from this profile
      const numConditions = Math.random() < 0.7 ? 1 : 2
      const selectedConditions = getRandomItems(
        profile.conditions,
        numConditions
      )

      for (const condition of selectedConditions) {
        conditionsToAdd.push({
          id: crypto.randomUUID(),
          patientId: patient.id,
          condition: condition,
          status: "chronic" as const,
          diagnosedDate: moment()
            .subtract(Math.floor(Math.random() * 5) + 1, "years")
            .toISOString(),
          notes: `Managed with medications and regular follow-up`,
        })
      }

      // Add 1-2 medications that treat these conditions
      const numMeds = Math.random() < 0.7 ? 1 : 2
      const selectedMeds = getRandomItems(profile.medications, numMeds)

      for (const med of selectedMeds) {
        medicationsToAdd.push({
          id: crypto.randomUUID(),
          patientId: patient.id,
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          prescribedDate: moment()
            .subtract(Math.floor(Math.random() * 2) + 1, "years")
            .toISOString(),
          active: true,
          prescribingDoctor: `Dr. ${
            ["Smith", "Johnson", "Williams", "Davis", "Miller"][
              Math.floor(Math.random() * 5)
            ]
          }`,
        })
      }

      // Add allergies if any exist for this profile
      if (profile.allergies.length > 0) {
        const selectedAllergy = getRandomItems(profile.allergies, 1)[0]
        allergiesToAdd.push({
          id: crypto.randomUUID(),
          patientId: patient.id,
          allergen: selectedAllergy.allergen,
          severity: selectedAllergy.severity as "mild" | "moderate" | "severe",
          reaction: selectedAllergy.reaction,
          diagnosedDate: moment()
            .subtract(Math.floor(Math.random() * 10) + 1, "years")
            .toISOString(),
        })
      }
    }

    // Insert all new records
    if (conditionsToAdd.length > 0) {
      await db.insert(schema.medicalHistory).values(conditionsToAdd)
    }
    if (medicationsToAdd.length > 0) {
      await db.insert(schema.medication).values(medicationsToAdd)
    }
    if (allergiesToAdd.length > 0) {
      await db.insert(schema.patientAllergy).values(allergiesToAdd)
    }

    console.log(`Updated medical history for patient ${patient.id}:`, {
      conditions: conditionsToAdd.length,
      medications: medicationsToAdd.length,
      allergies: allergiesToAdd.length,
    })
  }
}
