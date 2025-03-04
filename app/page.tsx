import SignInGoogle from "@/components/client/auth/sign-in-google"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { auth } from "@/lib/auth"
import { Globe, Phone, Plus, Sparkles } from "lucide-react"
import { headers } from "next/headers"
import Image from "next/image"
import Link from "next/link"

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-[calc(100vh-4rem)] p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="invert dark:invert-0"
          src="/logo.svg"
          alt="Axon AI logo"
          width={180}
          height={38}
          priority
        />

        <div className="max-w-2xl text-center sm:text-left">
          <h1 className="text-2xl font-bold mb-4">AI Call Center Demo</h1>
          <p className="text-lg mb-6">
            Experience the future of healthcare scheduling with our AI
            assistant. Try our demo to schedule or cancel appointments with our
            intelligent virtual receptionist.
          </p>
        </div>

        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">Create a demo account to get started</li>
          <li className="mb-2">
            Call our AI assistant at{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              (662) 584-4415
            </code>
          </li>
          <li>Try scheduling or canceling an appointment as a test patient</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href={!session ? "/sign-in" : "/appointments"}
            rel="noopener noreferrer"
          >
            {!session ? (
              <>
                <Plus className="h-4 w-4" />
                Create Demo Account
              </>
            ) : (
              "Go to Appointments"
            )}
          </Link>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="/demo-guide"
            rel="noopener noreferrer"
          >
            View Demo Guide
          </a>
        </div>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/features"
          rel="noopener noreferrer"
        >
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          Features
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/sample-calls"
          rel="noopener noreferrer"
        >
          <Phone className="h-4 w-4 text-muted-foreground" />
          Sample Calls
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://getaxon.ai"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Globe className="h-4 w-4 text-muted-foreground" />
          Back to Axon AI site
        </a>
      </footer>
    </div>
  )
}
