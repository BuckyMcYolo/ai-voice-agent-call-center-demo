import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { organization, admin } from "better-auth/plugins"
import db from "../db"
import { seedUserData } from "@/db/seed/seed-user-data"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  user: {
    additionalFields: {
      hasUpdatedAppointments: {
        type: "boolean",
        default: false,
        required: true,
        input: false,
        returned: true,
        defaultValue: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          seedUserData({ user })
        },
      },
    },
  },

  // plugins: [organization(), admin()],
})
