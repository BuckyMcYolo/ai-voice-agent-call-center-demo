"use client"

import AppSideBar from "./app-side-bar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const Nav = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSideBar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">Home</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          {/* <div className="ml-auto px-3">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    label={
                      resolvedTheme === "light" ? "Dark Mode" : "Light Mode"
                    }
                    labelIcon={
                      resolvedTheme === "dark" ? (
                        <Sun size={14} />
                      ) : (
                        <Moon size={14} />
                      )
                    }
                    onClick={() => {
                      setTheme(resolvedTheme === "light" ? "dark" : "light")
                    }}
                  />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
          </div> */}
        </header>

        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Nav
