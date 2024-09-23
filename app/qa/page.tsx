// app/qa/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { getLeads, updateLeadStatus, updateLeadRecording } from './actions'

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

export default function QADashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [newStatus, setNewStatus] = useState('')
  const [newRecording, setNewRecording] = useState('')

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    const fetchedLeads = await getLeads()
    setLeads(fetchedLeads)
  }

  const openModal = (lead: Lead) => {
    setSelectedLead(lead)
    setNewStatus(lead.status)
    setNewRecording(lead.recording || '')
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setSelectedLead(null)
    setNewStatus('')
    setNewRecording('')
  }

  const handleUpdate = async () => {
    if (selectedLead) {
      await updateLeadStatus({ leadId: selectedLead.id, status: newStatus })
      await updateLeadRecording({ leadId: selectedLead.id, recording: newRecording })
      fetchLeads()
      closeModal()
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">QA Dashboard</h1>
      
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
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
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
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => openModal(lead)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Update Lead
                  </Dialog.Title>
                  <div className="mt-2">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="no_coverage">No Coverage</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Recording URL</label>
                      <input
                        type="text"
                        value={newRecording}
                        onChange={(e) => setNewRecording(e.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 mr-2"
                      onClick={handleUpdate}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}