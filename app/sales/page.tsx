// app/sales/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { Tab } from '@headlessui/react'
import { submitRealtorInfo, getRealtors } from './actions'

interface Realtor {
  id: string;
  agentCode: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  brokerage: string;
  state: string;
  isActive: boolean;
  // Add other fields as necessary
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function SalesPage() {
  const [realtors, setRealtors] = useState<Realtor[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    fetchRealtors()
  }, [])

  const fetchRealtors = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedRealtors = await getRealtors()
      if (Array.isArray(fetchedRealtors)) {
        setRealtors(fetchedRealtors)
      } else {
        throw new Error('Fetched data is not an array')
      }
    } catch (err) {
      console.error('Error fetching realtors:', err)
      setError('Failed to fetch realtors. Please try again later.')
      setRealtors(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    try {
      await submitRealtorInfo(formData)
      setSuccess('Realtor added successfully!')
      if (formRef.current) {
        formRef.current.reset()
      }
      fetchRealtors() // Refresh the list after submission
    } catch (err) {
      console.error('Error submitting realtor info:', err)
      setError('Failed to submit realtor information. Please try again.')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Sales Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success:</strong>
          <span className="block sm:inline"> {success}</span>
        </div>
      )}
      
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {['Add Realtor', 'View Realtors'].map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="agentCode" className="block mb-1">Agent Code</label>
                  <input type="text" id="agentCode" name="agentCode" required className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label htmlFor="firstName" className="block mb-1">First Name</label>
                  <input type="text" id="firstName" name="firstName" required className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block mb-1">Last Name</label>
                  <input type="text" id="lastName" name="lastName" required className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label htmlFor="phone" className="block mb-1">Phone</label>
                  <input type="tel" id="phone" name="phone" required className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-1">Email</label>
                  <input type="email" id="email" name="email" required className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label htmlFor="brokerage" className="block mb-1">Brokerage</label>
                  <input type="text" id="brokerage" name="brokerage" required className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label htmlFor="state" className="block mb-1">State</label>
                  <input type="text" id="state" name="state" required className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label htmlFor="centralZipCode" className="block mb-1">Central Zip Code</label>
                  <input type="text" id="centralZipCode" name="centralZipCode" required className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label htmlFor="radius" className="block mb-1">Radius (Miles)</label>
                  <input type="number" id="radius" name="radius" required className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label htmlFor="signUpCategory" className="block mb-1">Sign-Up Category</label>
                  <select id="signUpCategory" name="signUpCategory" required className="w-full px-3 py-2 border rounded">
                    <option value="individual">Individual</option>
                    <option value="team">Team</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="teamMembers" className="block mb-1">Total Team Members (if applicable)</label>
                  <input type="number" id="teamMembers" name="teamMembers" className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-1">Password</label>
                  <input type="password" id="password" name="password" required className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block mb-1">Confirm Password</label>
                  <input type="password" id="confirmPassword" name="confirmPassword" required className="w-full px-3 py-2 border rounded" />
                </div>
              </div>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Submit Realtor Information
              </button>
            </form>
          </Tab.Panel>
          <Tab.Panel>
            {loading ? (
              <p>Loading realtors...</p>
            ) : realtors && realtors.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Agent Code</th>
                      <th className="py-2 px-4 border-b">Name</th>
                      <th className="py-2 px-4 border-b">Email</th>
                      <th className="py-2 px-4 border-b">Phone</th>
                      <th className="py-2 px-4 border-b">Brokerage</th>
                      <th className="py-2 px-4 border-b">State</th>
                      <th className="py-2 px-4 border-b">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {realtors.map((realtor) => (
                      <tr key={realtor.id}>
                        <td className="py-2 px-4 border-b">{realtor.agentCode}</td>
                        <td className="py-2 px-4 border-b">{`${realtor.firstName} ${realtor.lastName}`}</td>
                        <td className="py-2 px-4 border-b">{realtor.emailAddress}</td>
                        <td className="py-2 px-4 border-b">{realtor.phoneNumber}</td>
                        <td className="py-2 px-4 border-b">{realtor.brokerage}</td>
                        <td className="py-2 px-4 border-b">{realtor.state}</td>
                        <td className="py-2 px-4 border-b">
                          <span className={`px-2 py-1 rounded ${realtor.isActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                            {realtor.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No realtors found.</p>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}