import { seed } from "drizzle-seed"
import db from ".."
import * as schema from "@/db/schema"
import moment from "moment"
import { updateAppointmentsForUser } from "./update-appointment-times"

export async function seedUserData({
  user,
}: {
  user: {
    id: string
    email: string
    emailVerified: boolean
    name: string
    createdAt: Date
    updatedAt: Date
    image?: string | null | undefined
  }
}) {
  await seed(
    db,
    {
      patient: schema.patient,
      appointment: schema.appointment,
    },
    { seed: new Date().getTime() }
  ).refine((f) => ({
    patient: {
      count: 25,
      columns: {
        id: f.uuid(),
        createdAt: f.date({
          minDate: "2023-01-01",
          maxDate: moment().format("YYYY-MM-DD"),
        }),
        userId: f.default({
          defaultValue: user.id,
        }),
        firstName: f.valuesFromArray({
          values: [
            "John",
            "Jane",
            "Alice",
            "Bob",
            "Charlie",
            "David",
            "Eve",
            "Frank",
            "Grace",
            "Hank",
            "Ivy",
            "Jack",
            "Katie",
            "Liam",
            "Mia",
            "Noah",
            "Olivia",
            "Peter",
            "Quinn",
            "Ryan",
            "Sophia",
            "Tom",
            "Uma",
            "Violet",
            "Will",
            "Ava",
            "Ben",
            "Cara",
            "Dylan",
            "Emma",
            "Finn",
            "Gwen",
            "Holly",
            "Ian",
            "Jade",
          ],
        }),
        lastName: f.valuesFromArray({
          values: [
            "Smith",
            "Johnson",
            "Williams",
            "Jones",
            "Brown",
            "Davis",
            "Miller",
            "Wilson",
            "Moore",
            "Taylor",
            "Anderson",
            "Thomas",
            "Jackson",
            "White",
            "Martin",
            "Thompson",
            "Garcia",
            "Martinez",
            "Robinson",
            "Clark",
            "Rodriguez",
            "Lewis",
            "Lee",
            "Walker",
            "Hall",
            "Allen",
            "Young",
            "Hernandez",
            "King",
            "Wright",
            "Lopez",
            "Hill",
            "Scott",
            "Green",
            "Adams",
            "Baker",
            "Carter",
            "Edwards",
            "Foster",
            "Garcia",
            "Harris",
          ],
        }),

        dateOfBirth: f.date({ minDate: "1930-01-01", maxDate: "2005-12-31" }),
        ssn: f.valuesFromArray({
          values: Array(10)
            .fill(0)
            .map(
              () =>
                `${Math.floor(Math.random() * 1000)
                  .toString()
                  .padStart(3, "0")}-${Math.floor(Math.random() * 100)
                  .toString()
                  .padStart(2, "0")}-${Math.floor(Math.random() * 10000)
                  .toString()
                  .padStart(4, "0")}`
            ),
        }),
        gender: f.valuesFromArray({
          values: ["male", "female", "other"],
        }),
        phoneNumber: f.phoneNumber({ template: "+1 (###) ###-####" }),
        address: f.streetAddress(),
      },
      with: {
        appointment: [
          { weight: 0.5, count: [1] }, // 50% chance of 1 appointment
          { weight: 0.4, count: [2] }, // 40% chance of 2 appointments
          { weight: 0.1, count: [3] }, // 10% chance of 3 appointments
        ],
      },
    },

    appointment: {
      columns: {
        id: f.uuid(),
        createdAt: f.date({
          minDate: "2023-01-01",
          maxDate: moment().format("YYYY-MM-DD"),
        }),
        status: f.valuesFromArray({
          values: ["scheduled"],
        }),
        date: f.date({
          minDate: moment().format("YYYY-MM-DD"),
          maxDate: moment().add(7, "days").format("YYYY-MM-DD"),
        }),
        startTime: f.date({
          minDate: moment().format("YYYY-MM-DD"),
          maxDate: moment().add(7, "days").format("YYYY-MM-DD"),
        }),
        endTime: f.date({
          minDate: moment().format("YYYY-MM-DD"),
          maxDate: moment().add(7, "days").format("YYYY-MM-DD"),
        }),
        notes: f.valuesFromArray({
          values: appointmentNotes,
        }),
      },
    },
  }))
  // Once seeding is complete, update appointments for this user.
  await updateAppointmentsForUser(user.id)
}

// Define 50 possible note strings.
const appointmentNotes = [
  "Referred from Dr. Smith for chest pain and SOB, normal EKG, $110.25 owed (Aetna).",
  "$25 ded owed, ref for migraines.",
  "$0 owed, referred for skin lesions from Lisa Williams, NP.",
  "Referred for routine checkup, no outstanding balance.",
  "Urgent referral from Dr. Adams, follow up required, $50 owed.",
  "Referred by Dr. Baker for annual physical, $0 balance.",
  "$30 ded owed, referral for back pain and sciatica.",
  "Patient referred from Dr. Carter for respiratory issues, $75 owed.",
  "$0 owed, referral for knee pain evaluation.",
  "Referred from Dr. Davis for sinusitis evaluation, $40 owed (Blue Cross).",
  "Referral from Dr. Evans for blood pressure management, no balance.",
  "Referred from Dr. Foster for diabetes checkup, $20 ded owed.",
  "$15 owed, referral for dizziness and vertigo assessment.",
  "Referred by Dr. Garcia for migraine management, $0 owed.",
  "Referral from Dr. Harris for fatigue, $60 owed (United).",
  "$0 owed, referred for dermatologic exam from NP Taylor.",
  "Referred from Dr. Johnson for follow-up on abnormal labs, $35 ded owed.",
  "$45 ded owed, referral for anxiety evaluation.",
  "Referred by Dr. King for weight management, no outstanding balance.",
  "Referral from Dr. Lee for thyroid issues, $0 balance.",
  "$55 ded owed, referred for cardiac stress test.",
  "Referred for orthopedic evaluation from Dr. Martin, $0 owed.",
  "$10 owed, referral for ear infection from Dr. Nelson.",
  "Referred from Dr. Owens for allergy testing, $20 ded owed (Cigna).",
  "Referral from Dr. Parker for back pain, $0 owed.",
  "$30 ded owed, referral for lab work and physical exam.",
  "Referred from Dr. Quinn for pre-surgical evaluation, $0 balance.",
  "Referral from Dr. Roberts for follow-up on asthma, $25 ded owed.",
  "$40 ded owed, referred for sleep study evaluation.",
  "Referred by Dr. Scott for sports injury assessment, $0 owed.",
  "$0 owed, referral for nutritional counseling from NP Davis.",
  "Referred from Dr. Thompson for hypertension management, $15 owed.",
  "Referral from Dr. Underwood for thyroid testing, $0 balance.",
  "$35 ded owed, referred for gastrointestinal evaluation.",
  "Referred from Dr. Vincent for ankle pain, no balance.",
  "$20 ded owed, referral for urinary issues evaluation.",
  "Referral from Dr. White for skin rash assessment, $0 owed.",
  "Referred from Dr. Xiong for follow-up on cholesterol, $50 ded owed.",
  "$0 owed, referral for mental health evaluation from NP Brown.",
  "Referred from Dr. Young for weight loss program, $30 ded owed.",
  "Referral from Dr. Zimmerman for comprehensive exam, $0 balance.",
  "$25 ded owed, referred for migraine evaluation.",
  "Referred from Dr. Allen for lab follow-up, no balance.",
  "$0 owed, referral for wellness check from NP Green.",
  "Referred from Dr. Brown for allergy assessment, $10 ded owed.",
  "$45 ded owed, referral for cardiac evaluation from Dr. Clark.",
  "Referred from Dr. Davis for orthopedic assessment, $0 balance.",
  "Referral from Dr. Edwards for respiratory exam, $30 ded owed.",
  "$0 owed, referred for endocrine evaluation from NP Miller.",
  "Referred from Dr. Foster for routine checkup, $20 ded owed (Aetna).",
]
