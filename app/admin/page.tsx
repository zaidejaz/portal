// app/admin/page.tsx
import { PrismaClient } from '@prisma/client'
import { updateUserStatus, updateLeadStatus } from './actions'
import ProtectedRoute from '@/components/ProtectedRoute'

const prisma = new PrismaClient()

export default async function AdminDashboard() {
  const leads = await prisma.lead.findMany({
    orderBy: { submissionDate: 'desc' },
    include: { assignments: true },
  })

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      <h2 className="text-xl font-bold mb-2">Leads</h2>
      <table className="min-w-full bg-white mb-8">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Lead ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Submission Count</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td className="py-2 px-4 border-b">{lead.leadId}</td>
              <td className="py-2 px-4 border-b">{`${lead.firstName} ${lead.lastName}`}</td>
              <td className="py-2 px-4 border-b">{lead.status}</td>
              <td className="py-2 px-4 border-b">{lead.assignments.length}</td>
              <td className="py-2 px-4 border-b">
                <form action={updateLeadStatus}>
                  <input type="hidden" name="leadId" value={lead.id} />
                  <select name="status" className="mr-2 p-1 border rounded">
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="no_coverage">No Coverage</option>
                  </select>
                  <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded">
                    Update
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-bold mb-2">Users</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">{`${user.firstName} ${user.lastName}`}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.role}</td>
              <td className="py-2 px-4 border-b">{user.isActive ? 'Active' : 'Inactive'}</td>
              <td className="py-2 px-4 border-b">
                <form action={updateUserStatus}>
                  <input type="hidden" name="userId" value={user.id} />
                  <input type="hidden" name="isActive" value={user.isActive ? 'false' : 'true'} />
                  <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded">
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </ProtectedRoute>
  )
}
