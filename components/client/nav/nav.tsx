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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authClient } from "@/lib/auth-client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogIn, LogOut, Settings, User } from "lucide-react"
import { Laptop, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useRouter } from "next/navigation"
import React from "react"

const UserAvatar = React.memo(({ user }: { user: any }) => {
  const getInitials = React.useCallback((name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }, [])

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={user?.image ?? undefined} />
      <AvatarFallback>
        {user ? getInitials(user?.name) : <User size={18} />}
      </AvatarFallback>
    </Avatar>
  )
})

UserAvatar.displayName = "UserAvatar"

const Nav = ({ children }: { children: React.ReactNode }) => {
  const session = authClient.useSession()
  const user = session.data?.user

  const { setTheme, theme } = useTheme()

  const router = useRouter()

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

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 m-1">
              <UserAvatar user={user} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user && (
                <>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium capitalize">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-neutral-500">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem
                className="cursor-default"
                onClick={(e) => {
                  e.preventDefault()
                }}
              >
                Theme
                <ToggleGroup
                  size={"sm"}
                  type="single"
                  className="bg-background flex items-center border border-muted-background rounded-xl px-1 ml-2 h-8"
                  value={theme}
                  onValueChange={(value) => setTheme(value)}
                >
                  <ToggleGroupItem className="h-6 w-6 p-1.5" value="light">
                    <Sun className="h-5 w-5" />
                  </ToggleGroupItem>
                  <ToggleGroupItem className="h-6 w-6 p-1.5" value="dark">
                    <Moon className="h-5 w-5" />
                  </ToggleGroupItem>
                  <ToggleGroupItem className="h-6 w-6 p-1.5" value="system">
                    <Laptop className="h-5 w-5" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </DropdownMenuItem>

              {user ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() =>
                      authClient.signOut({
                        fetchOptions: {
                          onSuccess: () => {
                            router.replace("/")
                          },
                        },
                      })
                    }
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem
                    onClick={() => {
                      router.push("/sign-in")
                    }}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Log in</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Nav
