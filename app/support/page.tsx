// app/support/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Tab, Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import { getAcceptedLeads, getRealtors, assignLead, toggleRealtorStatus } from './actions'

interface Lead {
  id: string;
  leadId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  propertyAddress: string;
  city: string;
  state: string;
  zipCode: string;
  isHomeOwner: boolean;
  propertyValue: number;
  hasRealtorContract: boolean;
  status: string;
  submissionDate: string;
  assignments: LeadAssignment[];
}

interface Realtor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
}

interface LeadAssignment {
  id: string;
  realtorFirstName: string;
  realtorLastName: string;
  dateSent: string;
  leadId: string;
}

export default function SupportPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [realtors, setRealtors] = useState<Realtor[]>([])
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [selectedRealtorId, setSelectedRealtorId] = useState<string | null>("")

  useEffect(() => {
    fetchAcceptedLeads()
    fetchRealtors()
  }, [])

  const fetchAcceptedLeads = async () => {
    const fetchedLeads = await getAcceptedLeads()
    setLeads(fetchedLeads)
  }

  const fetchRealtors = async () => {
    const fetchedRealtors = await getRealtors()
    setRealtors(fetchedRealtors)
  }

  const handleAssignLead = async (leadId: string, realtorId: string) => {
    try {
      await assignLead(leadId, realtorId)
      
      // Update the leads state to reflect the new assignment
      setLeads(prevLeads => 
        prevLeads.map(lead => {
          if (lead.id === leadId) {
            const assignedRealtor = realtors.find(r => r.id === realtorId)
            if (assignedRealtor) {
              const newAssignment: LeadAssignment = {
                id: Date.now().toString(), // temporary ID
                realtorFirstName: assignedRealtor.firstName,
                realtorLastName: assignedRealtor.lastName,
                dateSent: new Date().toISOString(),
                leadId: lead.leadId
              }
              return {
                ...lead,
                assignments: [...lead.assignments, newAssignment]
              }
            }
          }
          return lead
        })
      )

      setSelectedLeadId(null)
      setSelectedRealtorId(null)
    } catch (error) {
      console.error('Error assigning lead:', error)
      // Handle error (e.g., show an error message to the user)
    }
  }

  const handleToggleRealtorStatus = async (realtorId: string, currentStatus: boolean) => {
    await toggleRealtorStatus(realtorId, !currentStatus)
    fetchRealtors() // Refresh realtors after status change
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Support Dashboard</h1>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-4">
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
            ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
          }>
            Accepted Leads
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
            ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
          }>
            Realtor Management
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <h2 className="text-2xl font-bold mb-4">Accepted Leads</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Lead ID</th>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Assignment Count</th>
                    <th className="py-2 px-4 border-b">Assign To</th>
                    <th className="py-2 px-4 border-b">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="py-2 px-4 border-b">{lead.leadId}</td>
                      <td className="py-2 px-4 border-b">{`${lead.firstName} ${lead.lastName}`}</td>
                      <td className="py-2 px-4 border-b">{lead.assignments.length}</td>
                      <td className="py-2 px-4 border-b">
                        <select
                          onChange={(e) => setSelectedRealtorId(e.target.value)}
                          className="p-2 border rounded"
                        >
                          <option value="">Select Realtor</option>
                          {realtors.filter(r => r.isActive).map((realtor) => (
                            <option key={realtor.id} value={realtor.id}>
                              {`${realtor.firstName} ${realtor.lastName}`}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => {
                            setSelectedLeadId(lead.id)
                            handleAssignLead(lead.id, selectedRealtorId)
                          }}
                          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
                        >
                          Assign
                        </button>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <Disclosure>
                          {({ open }) => (
                            <>
                              <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blue-900 bg-blue-100 rounded-lg hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                                <span>View Details</span>
                                <ChevronUpIcon
                                  className={`${
                                    open ? 'transform rotate-180' : ''
                                  } w-5 h-5 text-blue-500`}
                                />
                              </Disclosure.Button>
                              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                <h4 className="font-bold">Lead Details:</h4>
                                <p>Phone: {lead.phoneNumber}</p>
                                <p>Email: {lead.emailAddress}</p>
                                <p>Address: {`${lead.propertyAddress}, ${lead.city}, ${lead.state} ${lead.zipCode}`}</p>
                                <p>Home Owner: {lead.isHomeOwner ? 'Yes' : 'No'}</p>
                                <p>Property Value: ${lead.propertyValue.toLocaleString()}</p>
                                <p>Has Realtor Contract: {lead.hasRealtorContract ? 'Yes' : 'No'}</p>
                                <p>Submission Date: {new Date(lead.submissionDate).toLocaleString()}</p>
                                
                                <h4 className="font-bold mt-4">Assignment History:</h4>
                                {lead.assignments.map((assignment, index) => (
                                  
                                  <div key={index} className="mb-2">
                                      <p>Realtor: {`${assignment.realtorFirstName} ${assignment.realtorLastName}`}</p>
                                    <p>Date Sent: {new Date(assignment.dateSent).toLocaleString()}</p>
                                  </div>
                                ))}
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <h2 className="text-2xl font-bold mb-4">Realtor Management</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {realtors.map((realtor) => (
                    
                    <tr key={realtor.id}>
                      <td className="py-2 px-4 border-b">{`${realtor.firstName} ${realtor.lastName}`}</td>
                      <td className="py-2 px-4 border-b">{realtor.email}</td>
                      <td className="py-2 px-4 border-b">{realtor.isActive ? 'Active' : 'Inactive'}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleToggleRealtorStatus(realtor.id, realtor.isActive)}
                          className={`${
                            realtor.isActive ? 'bg-red-500' : 'bg-green-500'
                          } text-white px-4 py-2 rounded`}
                        >
                          {realtor.isActive ? 'Deactivate' : 'Activate'} Account
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}