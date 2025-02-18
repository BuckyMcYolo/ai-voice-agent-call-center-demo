import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import { config } from "dotenv"

config({ path: ".env" }) // or .env.local

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be a Neon postgres connection string")
}

const sql = neon(process.env.DATABASE_URL)
const db = drizzle({ client: sql, logger: true })

export default db
