"use client"

import { useState } from "react"
import Link from "next/link"
import { MoveLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"

const GoogleIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 256 262"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#4285F4"
      d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
    />
    <path
      fill="#34A853"
      d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
    />
    <path
      fill="#FBBC05"
      d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
    />
    <path
      fill="#EB4335"
      d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
    />
  </svg>
)

export default function SignInGoogle() {
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL: "/",
      },
      {
        onResponse: () => setLoading(false),
      }
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold text-neutral-900 dark:text-white">
          Sign in to Call Center Demo
        </CardTitle>
        <CardDescription className="text-neutral-500 dark:text-neutral-400">
          When you first sign in, we&apos;ll create some sample patients and
          appointments for you to see how the app works.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Button
          variant="outline"
          className="w-full h-12 font-medium border-2 bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors dark:border-neutral-700"
          onClick={handleGoogleSignIn}
          loading={loading}
        >
          <div className="flex items-center justify-center gap-3">
            <GoogleIcon />
            <span className="text-neutral-700 dark:text-neutral-300">
              {loading ? "Signing in..." : "Sign in with Google"}
            </span>
          </div>
        </Button>

        <div className="space-y-4">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
            By signing in or signing up, you agree to our{" "}
            <Link
              target="_blank"
              href="https://www.getaxon.ai/terms-of-service"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              target="_blank"
              href="https://www.getaxon.ai/privacy-policy"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>

          <Link href="/" className="block">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
            >
              <MoveLeft size={18} />
              Go Back
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
