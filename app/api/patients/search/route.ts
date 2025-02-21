// app/api/patients/search/route.ts
import { auth } from "@/lib/auth"
import { patient } from "@/db/schema"
import { NextResponse } from "next/server"
import { eq, and, or, ilike } from "drizzle-orm"
import db from "@/db"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { headers } from "next/headers"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "30 s"),
  analytics: true,
  prefix: "call-center-demo",
})

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = await ratelimit.limit(session.user.id)

    if (!response.success) {
      return new NextResponse("Too many requests. Please try again later.", {
        status: 429,
      })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q")

    console.log("Searching patients for query:", query)

    if (!query) {
      return NextResponse.json([])
    }

    const patients = await db
      .select()
      .from(patient)
      .where(
        and(
          eq(patient.userId, session.user.id),
          or(
            ilike(patient.firstName, `%${query}%`),
            ilike(patient.lastName, `%${query}%`),
            ilike(patient.ssn, `%${query}%`)
          )
        )
      )
      .limit(10)

    return NextResponse.json(patients)
  } catch (error) {
    console.error("Error searching patients:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
