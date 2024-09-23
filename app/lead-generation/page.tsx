// app/lead-generation/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Tab } from '@headlessui/react'
import { createLead, getLeads } from './actions'

interface Lead {
  id: string;
  leadId: string;
  submissionDate: Date;
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
  additionalNotes: string | null;
  submissionCount: number;
  recording: string | null;
  createdAt: Date;
  updatedAt: Date;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'pending': return 'bg-yellow-200 text-yellow-800';
    case 'accepted': return 'bg-green-200 text-green-800';
    case 'rejected': return 'bg-red-200 text-red-800';
    case 'no_coverage': return 'bg-gray-200 text-gray-800';
    default: return 'bg-blue-200 text-blue-800';
  }
}

export default function LeadGeneration() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [dateFilter, setDateFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchLeads()
  }, [])

  useEffect(() => {
    filterLeads()
  }, [leads, dateFilter, statusFilter, searchTerm])

  const fetchLeads = async () => {
    const fetchedLeads = await getLeads()
    setLeads(fetchedLeads)
  }

  const filterLeads = () => {
    let filtered = leads

    if (dateFilter) {
      filtered = filtered.filter(lead =>
        new Date(lead.submissionDate).toISOString().split('T')[0] === dateFilter
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(lead =>
        lead.status.toLowerCase() === statusFilter.toLowerCase()
      )
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase()
      filtered = filtered.filter(lead =>
        lead.firstName.toLowerCase().includes(lowercasedTerm) ||
        lead.lastName.toLowerCase().includes(lowercasedTerm) ||
        lead.emailAddress.toLowerCase().includes(lowercasedTerm) ||
        lead.phoneNumber.includes(searchTerm)
      )
    }

    setFilteredLeads(filtered)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    await createLead(formData)
    fetchLeads()
    // Reset form or show success message
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Lead Generation</h1>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {['Submit Lead', 'View Leads'].map((category) => (
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
                  <label htmlFor="firstName" className="block mb-1">First Name</label>
                  <input type="text" id="firstName" name="firstName" required className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block mb-1">Last Name</label>
                  <input type="text" id="lastName" name="lastName" required className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block mb-1">Phone Number</label>
                  <input type="tel" id="phoneNumber" name="phoneNumber" required className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label htmlFor="emailAddress" className="block mb-1">Email Address</label>
                  <input type="email" id="emailAddress" name="emailAddress" required className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label htmlFor="propertyAddress" className="block mb-1">Property Address</label>
                  <input type="text" id="propertyAddress" name="propertyAddress" required className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label htmlFor="city" className="block mb-1">City</label>
                  <input type="text" id="city" name="city" required className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label htmlFor="state" className="block mb-1">State</label>
                  <input type="text" id="state" name="state" required className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label htmlFor="zipCode" className="block mb-1">Zip Code</label>
                  <input type="text" id="zipCode" name="zipCode" required className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label htmlFor="isHomeOwner" className="block mb-1">Home Owner</label>
                  <select id="isHomeOwner" name="isHomeOwner" required className="w-full px-3 py-2 border rounded">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="propertyValue" className="block mb-1">Property Value</label>
                  <input type="number" id="propertyValue" name="propertyValue" required className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label htmlFor="hasRealtorContract" className="block mb-1">Contract with Any Realtor</label>
                  <select id="hasRealtorContract" name="hasRealtorContract" required className="w-full px-3 py-2 border rounded">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Submit Lead
              </button>
            </form>
          </Tab.Panel>
          <Tab.Panel>
            <div className="mb-4 flex space-x-4">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border rounded"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="no_coverage">No Coverage</option>
              </select>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="px-3 py-2 border rounded"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Lead ID</th>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Phone</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Address</th>
                    <th className="py-2 px-4 border-b">Home Owner</th>
                    <th className="py-2 px-4 border-b">Property Value</th>
                    <th className="py-2 px-4 border-b">Realtor Contract</th>
                    <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Submission Date</th>
                    <th className="py-2 px-4 border-b">Recording</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="py-2 px-4 border-b">{lead.leadId}</td>
                      <td className="py-2 px-4 border-b">{`${lead.firstName} ${lead.lastName}`}</td>
                      <td className="py-2 px-4 border-b">{lead.phoneNumber}</td>
                      <td className="py-2 px-4 border-b">{lead.emailAddress}</td>
                      <td className="py-2 px-4 border-b">{`${lead.propertyAddress}, ${lead.city}, ${lead.state} ${lead.zipCode}`}</td>
                      <td className="py-2 px-4 border-b">{lead.isHomeOwner ? 'Yes' : 'No'}</td>
                      <td className="py-2 px-4 border-b">${lead.propertyValue.toLocaleString()}</td>
                      <td className="py-2 px-4 border-b">{lead.hasRealtorContract ? 'Yes' : 'No'}</td>
                      <td className="py-2 px-4 border-b">
                        <span className={`px-2 py-1 rounded ${getStatusColor(lead.status)}`}>
                          {toTitleCase(lead.status)}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">{new Date(lead.submissionDate).toLocaleString()}</td>
                      <td className="py-2 px-4 border-b">
                        {lead.recording ? (
                          <a href={lead.recording} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            View Recording
                          </a>
                        ) : (
                          <span className="text-gray-500">No recording</span>
                        )}
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