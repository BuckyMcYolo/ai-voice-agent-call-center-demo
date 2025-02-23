"use client"

import * as React from "react"
import {
  ArrowRight,
  Calendar,
  CircleHelp,
  Home,
  Phone,
  Send,
  Settings2,
  User,
} from "lucide-react"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { FaGithub } from "react-icons/fa"
import { BsTwitterX } from "react-icons/bs"
import { FaMeta } from "react-icons/fa6"
import { FaLinkedin } from "react-icons/fa"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

const formSchema = z.object({
  practiceName: z
    .string()
    .min(2, "Practice name must be at least 2 characters"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  practiceSize: z.enum(["1-5", "6-15", "16-50", "50+"]),
  callVolume: z.enum(["100-500", "501-2000", "2000+", "3000+"]),
  timeline: z.enum(["1-2 weeks", "1-3", "3-6", "6+"]),
  message: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

const AppSideBar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const pathname = usePathname()
  const [accessDialogOpen, setAccessDialogOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      practiceName: "",
      role: "",
      message: "",
    },
  })

  const user = authClient.useSession()

  async function onSubmit(data: FormValues) {
    if (!user.data?.user) {
      toast.error("You must be signed in to submit a request")
      return
    }

    setIsSubmitting(true)
    try {
      // Replace with your actual API endpoint
      const response = await fetch(
        "https://api.digitalhealthcaresolutions.io/api:5iYyLrKQ:v2/call-center-demo-submit-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            practiceName: data.practiceName,
            role: data.role,
            practiceSize: data.practiceSize,
            callVolume: data.callVolume,
            timeline: data.timeline,
            message: data.message,
            name: user.data.user.name,
            email: user.data.user.email,
          }),
        }
      )

      if (!response.ok) {
        throw new Error(data.message)
      }

      setAccessDialogOpen(false)
      form.reset()
      toast.success("Your request has been submitted. We'll be in touch soon!")
      // You might want to show a success toast here
    } catch (error) {
      console.error("Submission error:", error)
      toast.error(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  // This is sample data.
  const data = {
    navMain: [
      {
        title: "Home",
        url: "/",
        icon: Home,
        isActive: pathname === "/",
      },
      {
        title: "Patients",
        url: "/patients",
        icon: User,
        isActive: pathname === "/patients",
      },
      {
        title: "Appointments",
        url: "/appointments",
        icon: Calendar,
        isActive: pathname === "/appointments",
      },
    ],
    navSecondary: [
      {
        title: "Features",
        url: "/features",
        icon: Settings2,
        isActive: pathname === "/features",
      },
      {
        title: "Sample Calls",
        url: "/sample-calls",
        icon: Phone,
        isActive: pathname === "/sample-calls",
      },
      {
        title: "Demo Guide",
        url: "/demo-guide",
        icon: CircleHelp,
        isActive: pathname === "/demo-guide",
        badge: <Badge variant="secondary">Learn More</Badge>,
      },
      //   {
      //     title: "Settings",
      //     url: "#",
      //     icon: Settings,
      //     isActive: pathname === "/settings",
      //   },
    ],
  }
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-between gap-2 p-1">
          <Image
            className="invert dark:invert-0"
            src="/logo.svg"
            alt="Axon AI logo"
            width={140}
            height={38}
            priority
          />{" "}
          <Badge variant="secondary">Demo</Badge>
        </div>
      </SidebarHeader>
      <SidebarContent className="pt-2">
        <NavMain items={data.navMain} />

        <NavSecondary items={data.navSecondary} className="mt-auto" />
        <div className="w-full p-2">
          <Button
            className="w-full group/access"
            endIcon={
              <ArrowRight
                size={20}
                className="group-hover/access:translate-x-1 transition-transform"
              />
            }
            onClick={() => setAccessDialogOpen(true)}
          >
            Get Access
          </Button>
        </div>
        <Separator />
        <div className="flex justify-center gap-2 pb-1">
          <Link href="https://www.linkedin.com/company/axon-ai-page">
            <Button size={"icon"} variant={"ghost"}>
              <FaLinkedin size={20} />
            </Button>
          </Link>
          <Link href="https://x.com/AxonAILabs">
            <Button size={"icon"} variant={"ghost"}>
              <BsTwitterX size={20} />
            </Button>
          </Link>
          <Link href="/">
            <Button size={"icon"} variant={"ghost"}>
              <FaMeta size={20} />
            </Button>
          </Link>
          <Link href="https://github.com/BuckyMcYolo/ai-voice-agent-call-center-demo">
            <Button size={"icon"} variant={"ghost"}>
              <FaGithub size={20} />
            </Button>
          </Link>
        </div>
      </SidebarContent>
      <SidebarRail />
      <Dialog
        open={accessDialogOpen}
        onOpenChange={(open) => setAccessDialogOpen(open)}
      >
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Thanks for your interest</DialogTitle>
            <DialogDescription>
              Tell us about your practice to help us understand your needs
              better.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="practiceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Practice Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your practice name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Role</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your role at the practice"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="practiceSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Practice Size</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select practice size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-5">1-5 providers</SelectItem>
                        <SelectItem value="6-15">6-15 providers</SelectItem>
                        <SelectItem value="16-50">16-50 providers</SelectItem>
                        <SelectItem value="50+">50+ providers</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="callVolume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Call Volume</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select monthly calls" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="100-500">100-500</SelectItem>
                        <SelectItem value="501-2000">501-1,000</SelectItem>
                        <SelectItem value="2000+">2,000-3,000</SelectItem>
                        <SelectItem value="3000+">3,000+</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Implementation Timeline</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                        <SelectItem value="1-3">1-3 months</SelectItem>
                        <SelectItem value="3-6">3-6 months</SelectItem>
                        <SelectItem value="6+">6+ months</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Information (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us more about your specific needs or questions"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full"
                  loading={isSubmitting}
                  endIcon={<Send size={14} />}
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Sidebar>
  )
}

export default AppSideBar
