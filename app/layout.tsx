import type { Metadata } from "next"
import { Rubik } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/client/providers/theme-provider"
import Nav from "@/components/client/nav/nav"

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Axon AI Call Center Demo",
  description: "A demo of Axon AI's call center software",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${rubik.variable}  antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Nav>{children}</Nav>
        </ThemeProvider>
      </body>
    </html>
  )
}
