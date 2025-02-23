// Define medical profiles that group related conditions, medications, and allergies
const medicalProfiles = [
  {
    profileName: "Cardiovascular",
    conditions: [
      { condition: "Hypertension", notes: "Well controlled with medication" },
      {
        condition: "Atrial Fibrillation",
        notes: "Rate controlled, on anticoagulation",
      },
    ],
    medications: [
      { name: "Lisinopril", dosage: "10mg", frequency: "daily" },
      { name: "Metoprolol", dosage: "25mg", frequency: "twice daily" },
      { name: "Amlodipine", dosage: "5mg", frequency: "daily" },
    ],
    allergies: [{ allergen: "Aspirin", reaction: "Respiratory difficulties" }],
  },
  {
    profileName: "Endocrine",
    conditions: [
      { condition: "Type 2 Diabetes", notes: "Diet controlled, A1C stable" },
      { condition: "Hypothyroidism", notes: "Stable on current dose" },
    ],
    medications: [
      { name: "Metformin", dosage: "500mg", frequency: "twice daily" },
      { name: "Levothyroxine", dosage: "50mcg", frequency: "daily" },
    ],
    allergies: [{ allergen: "Contrast Dye", reaction: "Itching and flushing" }],
  },
  {
    profileName: "Respiratory",
    conditions: [
      { condition: "Asthma", notes: "Mild intermittent, requires inhaler" },
      { condition: "Sleep Apnea", notes: "Using CPAP nightly" },
    ],
    medications: [
      { name: "Albuterol", dosage: "90mcg", frequency: "as needed" },
      { name: "Fluticasone", dosage: "110mcg", frequency: "twice daily" },
    ],
    allergies: [
      { allergen: "Penicillin", reaction: "Hives and difficulty breathing" },
      { allergen: "Sulfa Drugs", reaction: "Skin rash" },
    ],
  },
  {
    profileName: "Musculoskeletal",
    conditions: [
      { condition: "Osteoarthritis", notes: "Affecting knees bilaterally" },
      { condition: "Osteoporosis", notes: "T-score -2.6, on bisphosphonate" },
    ],
    medications: [
      { name: "Ibuprofen", dosage: "400mg", frequency: "as needed" },
      { name: "Alendronate", dosage: "70mg", frequency: "weekly" },
    ],
    allergies: [{ allergen: "Codeine", reaction: "Nausea and dizziness" }],
  },
  {
    profileName: "Mental Health",
    conditions: [
      { condition: "Depression", notes: "Managed with medication and therapy" },
      { condition: "Anxiety", notes: "Mild, managed with PRN medication" },
    ],
    medications: [
      { name: "Sertraline", dosage: "50mg", frequency: "daily" },
      { name: "Escitalopram", dosage: "10mg", frequency: "daily" },
    ],
    allergies: [],
  },
  {
    profileName: "Gastrointestinal",
    conditions: [
      { condition: "GERD", notes: "Controlled with daily PPI" },
      { condition: "IBS", notes: "Managed with diet and medication" },
    ],
    medications: [
      { name: "Omeprazole", dosage: "20mg", frequency: "daily" },
      { name: "Pantoprazole", dosage: "40mg", frequency: "daily" },
    ],
    allergies: [
      { allergen: "Dairy", reaction: "Digestive issues" },
      { allergen: "Soy", reaction: "Gastrointestinal distress" },
    ],
  },
]

// Generate arrays of valid combinations
function generateValidCombinations(numCombinations = 100) {
  const combinations = []

  for (let i = 0; i < numCombinations; i++) {
    // Randomly select 1-3 profiles
    const numProfiles = Math.floor(Math.random() * 3) + 1
    const shuffled = [...medicalProfiles].sort(() => 0.5 - Math.random())
    const selectedProfiles = shuffled.slice(0, numProfiles)

    // Merge the selected profiles
    const conditions = selectedProfiles.flatMap((p) => p.conditions)
    const medications = selectedProfiles.flatMap((p) => p.medications)
    const allergies = selectedProfiles.flatMap((p) => p.allergies)

    combinations.push({
      conditions,
      medications,
      allergies,
    })
  }

  return combinations
}

// Generate arrays for seed data
const combinations = generateValidCombinations(100)

const validMedicationSets = {
  names: Array.from(
    new Set(combinations.flatMap((c) => c.medications.map((m) => m.name)))
  ),
  dosages: Array.from(
    new Set(combinations.flatMap((c) => c.medications.map((m) => m.dosage)))
  ),
  frequencies: Array.from(
    new Set(combinations.flatMap((c) => c.medications.map((m) => m.frequency)))
  ),
}

const validAllergySets = {
  allergens: Array.from(
    new Set(combinations.flatMap((c) => c.allergies.map((a) => a.allergen)))
  ),
  reactions: Array.from(
    new Set(combinations.flatMap((c) => c.allergies.map((a) => a.reaction)))
  ),
}

const validConditionSets = {
  conditions: Array.from(
    new Set(combinations.flatMap((c) => c.conditions.map((c) => c.condition)))
  ),
  notes: Array.from(
    new Set(combinations.flatMap((c) => c.conditions.map((c) => c.notes)))
  ),
}

export { validMedicationSets, validAllergySets, validConditionSets }
