"use client"

import * as React from "react"
import {
  Calendar,
  CircleHelp,
  Home,
  Phone,
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

const AppSideBar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const pathname = usePathname()

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
        <Separator />
        <div className="flex justify-center gap-2 pb-1">
          <Button size={"icon"} variant={"ghost"}>
            <FaLinkedin size={20} />
          </Button>
          <Button size={"icon"} variant={"ghost"}>
            <BsTwitterX size={20} />
          </Button>
          <Button size={"icon"} variant={"ghost"}>
            <FaMeta size={20} />
          </Button>
          <Button size={"icon"} variant={"ghost"}>
            <FaGithub size={20} />
          </Button>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSideBar
