import SignInGoogle from "@/components/client/auth/sign-in-google"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { auth } from "@/lib/auth"
import { Phone } from "lucide-react"
import { headers } from "next/headers"

export default async function page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
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
  return (
    <div className="flex flex-1 items-center justify-center">Signed in</div>
  )
}
