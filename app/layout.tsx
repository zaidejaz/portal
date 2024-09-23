// app/layout.tsx
import { Inter } from 'next/font/google'
import './globals.css'
import { getServerSession } from "next-auth/next"
import SessionProvider from "@/components/SessionProvider"
import Navbar from "@/components/Navbar"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Lead Management System',
  description: 'Efficient lead tracking and management across departments',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}