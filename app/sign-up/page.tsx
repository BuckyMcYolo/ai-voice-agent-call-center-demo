import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import React from "react"
import SignInGoogle from "@/components/client/auth/sign-in-google"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Phone } from "lucide-react"

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    redirect("/")
  }

  return (
    <Dialog open={true}>
      <DialogContent hideCloseIcon>
        <DialogTitle className="flex items-center gap-2">
          <Phone className="text-brand h-4 w-4" />
          Sign in to Call Demo
        </DialogTitle>
        <SignInGoogle />
      </DialogContent>
    </Dialog>
  )
}

export default Page
