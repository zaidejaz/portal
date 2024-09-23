// app/components/ProtectedRoute.tsx
'use client'

// import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  // const { data: session, status } = useSession()
  const router = useRouter()

  // useEffect(() => {
  //   if (status === 'loading') return // Do nothing while loading
  //   if (!session) {
  //     router.push('/auth/signin')
  //   } else if (allowedRoles && !allowedRoles.includes(session.user.role)) {
  //     router.push('/unauthorized') // Redirect to an unauthorized page
  //   }
  // }, [session, status, router, allowedRoles])

  // if (status === 'loading') {
  //   return <div>Loading...</div>
  // }

  // if (!session) {
  //   return null
  // }

  // if (allowedRoles && !allowedRoles.includes(session.user.role)) {
  //   return null
  // }

  return <>{children}</>
}