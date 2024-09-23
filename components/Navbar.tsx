// app/components/Navbar.tsx
'use client'

import Link from 'next/link'
// import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  // const { data: session } = useSession()

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          Lead Management System
        </Link>
        <div>
          {/* {session ? (
            <>
              <span className="text-white mr-4">Welcome, {session.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-blue-100"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link href="/auth/signin" className="text-white hover:underline">
              Sign in
            </Link>
          )} */}
        </div>
      </div>
    </nav>
  )
}