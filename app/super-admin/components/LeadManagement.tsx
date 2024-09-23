// app/super-admin/components/LeadManagement.tsx
'use client'

import { useState, useEffect } from 'react'
import { updateLead, deleteLead, getLeads } from '../actions'
import { Lead } from '@prisma/client'

export default function LeadManagement() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const leadsPerPage = 100

  useEffect(() => {
    fetchLeads()
  }, [])

  useEffect(() => {
    filterLeads()
  }, [leads, statusFilter, dateFilter, searchTerm])

  const fetchLeads = async () => {
    try {
      const fetchedLeads = await getLeads()
      setLeads(fetchedLeads)
    } catch (error) {
      console.error('Error fetching leads:', error)
    }
  }

  const filterLeads = () => {
    let result = leads

    if (statusFilter) {
      result = result.filter(lead => lead.status === statusFilter)
    }

    if (dateFilter) {
      result = result.filter(lead => lead.submissionDate.toString().startsWith(dateFilter))
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase()
      result = result.filter(lead =>
        lead.firstName.toLowerCase().includes(lowercasedTerm) ||
        lead.lastName.toLowerCase().includes(lowercasedTerm) ||
        lead.emailAddress.toLowerCase().includes(lowercasedTerm) ||
        lead.phoneNumber.includes(searchTerm)
      )
    }

    setFilteredLeads(result)
    setCurrentPage(1)
  }

  const handleUpdateLead = async (updatedLead: Lead) => {
    try {
      await updateLead(updatedLead)
      setEditingLead(null)
      fetchLeads()
    } catch (error) {
      console.error('Error updating lead:', error)
    }
  }

  const handleDeleteLead = async (leadId: string) => {
    try {
      await deleteLead(leadId)
      fetchLeads()
    } catch (error) {
      console.error('Error deleting lead:', error)
    }
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

  // Pagination
  const indexOfLastLead = currentPage * leadsPerPage
  const indexOfFirstLead = indexOfLastLead - leadsPerPage
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead)
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Lead Management</h2>
      
      {/* Filters */}
      <div className="mb-4 flex space-x-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="no_coverage">No Coverage</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded"
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
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentLeads.map((lead) => (
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
                      </td>                <td className="py-2 px-4 border-b">{new Date(lead.submissionDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => setEditingLead(lead)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteLead(lead.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-3 py-1 border rounded ${
              currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Edit Lead Modal */}
      {editingLead && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">Edit Lead</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdateLead(editingLead);
            }}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" value={editingLead.firstName} onChange={(e) => setEditingLead({...editingLead, firstName: e.target.value})} className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" value={editingLead.lastName} onChange={(e) => setEditingLead({...editingLead, lastName: e.target.value})} className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="phoneNumber">Phone Number</label>
                <input type="text" id="phoneNumber" value={editingLead.phoneNumber} onChange={(e) => setEditingLead({...editingLead, phoneNumber: e.target.value})} className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="emailAddress">Email Address</label>
                <input type="email" id="emailAddress" value={editingLead.emailAddress} onChange={(e) => setEditingLead({...editingLead, emailAddress: e.target.value})} className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="propertyAddress">Property Address</label>
                <input type="text" id="propertyAddress" value={editingLead.propertyAddress} onChange={(e) => setEditingLead({...editingLead, propertyAddress: e.target.value})} className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="city">City</label>
                <input type="text" id="city" value={editingLead.city} onChange={(e) => setEditingLead({...editingLead, city: e.target.value})} className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="state">State</label>
                <input type="text" id="state" value={editingLead.state} onChange={(e) => setEditingLead({...editingLead, state: e.target.value})} className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="zipCode">Zip Code</label>
                <input type="text" id="zipCode" value={editingLead.zipCode} onChange={(e) => setEditingLead({...editingLead, zipCode: e.target.value})} className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="isHomeOwner">Home Owner</label>
                <select id="isHomeOwner" value={editingLead.isHomeOwner ? 'true' : 'false'} onChange={(e) => setEditingLead({...editingLead, isHomeOwner: e.target.value === 'true'})} className="w-full px-3 py-2 border rounded">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="propertyValue">Property Value</label>
                <input type="number" id="propertyValue" value={editingLead.propertyValue} onChange={(e) => setEditingLead({...editingLead, propertyValue: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="hasRealtorContract">Realtor Contract</label>
                <select id="hasRealtorContract" value={editingLead.hasRealtorContract ? 'true' : 'false'} onChange={(e) => setEditingLead({...editingLead, hasRealtorContract: e.target.value === 'true'})} className="w-full px-3 py-2 border rounded">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="status">Status</label>
                <select id="status" value={editingLead.status} onChange={(e) => setEditingLead({...editingLead, status: e.target.value})} className="w-full px-3 py-2 border rounded">
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="no_coverage">No Coverage</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => setEditingLead(null)} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}