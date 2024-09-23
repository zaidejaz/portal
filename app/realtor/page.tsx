// app/realtor/page.tsx
import { PrismaClient } from '@prisma/client'
import { updateLeadStatus } from './actions'

const prisma = new PrismaClient()

// In a real application, you would get the realtor's ID from the authenticated user session
const MOCK_REALTOR_ID = 'mock-realtor-id'

export default async function RealtorDashboard() {
  const assignedLeads = await prisma.leadAssignment.findMany({
    where: { userId: MOCK_REALTOR_ID },
    include: { lead: true },
    orderBy: { sentDate: 'desc' },
  })

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Realtor Dashboard</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Lead ID</th>
            <th className="py-2 px-4 border-b">Prospect Name</th>
            <th className="py-2 px-4 border-b">Property Address</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignedLeads.map((assignment) => (
            <tr key={assignment.id}>
              <td className="py-2 px-4 border-b">{assignment.lead.leadId}</td>
              <td className="py-2 px-4 border-b">{`${assignment.lead.firstName} ${assignment.lead.lastName}`}</td>
              <td className="py-2 px-4 border-b">{assignment.lead.propertyAddress}</td>
              <td className="py-2 px-4 border-b">{assignment.status}</td>
              <td className="py-2 px-4 border-b">
                <form action={updateLeadStatus}>
                  <input type="hidden" name="assignmentId" value={assignment.id} />
                  <select name="status" className="mr-2 p-1 border rounded">
                    <option value="contacted">Contacted</option>
                    <option value="not_interested">Not Interested</option>
                    <option value="follow_up">Follow Up</option>
                  </select>
                  <input
                    type="text"
                    name="comments"
                    placeholder="Add comments"
                    className="mr-2 p-1 border rounded"
                  />
                  <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded">
                    Update
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}