// app/super-admin/components/UserManagement.tsx
'use client'

import { useState, useEffect } from 'react'
import { updateUserRole, updateUserStatus, addUser, deleteUser, getUsers } from '../actions'

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
}

interface NewUser {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  password: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [newUser, setNewUser] = useState<NewUser>({
    email: '', firstName: '', lastName: '', role: '', password: ''
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getUsers()
      setUsers(fetchedUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await addUser(newUser)
      if (result.success) {
        setNewUser({ email: '', firstName: '', lastName: '', role: '', password: '' })
        fetchUsers()
      } else {
        console.error('Failed to add user:', result.error)
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error('Error adding user:', error)
      // You might want to show an error message to the user here
    }
  }

  const handleUpdateUserRole = async (userId: string, role: string) => {
    try {
      const result = await updateUserRole({ userId, role })
      if (result.success) {
        fetchUsers()
      } else {
        console.error('Failed to update user role:', result.error)
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error('Error updating user role:', error)
      // You might want to show an error message to the user here
    }
  }

  const handleUpdateUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const result = await updateUserStatus({ userId, isActive: !isActive })
      if (result.success) {
        fetchUsers()
      } else {
        console.error('Failed to update user status:', result.error)
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error('Error updating user status:', error)
      // You might want to show an error message to the user here
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const result = await deleteUser({ userId })
      if (result.success) {
        fetchUsers()
      } else {
        console.error('Failed to delete user:', result.error)
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      // You might want to show an error message to the user here
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      
      {/* Add User Form */}
      <form onSubmit={handleAddUser} className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Add New User</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="First Name"
            value={newUser.firstName}
            onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={newUser.lastName}
            onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
            required
            className="p-2 border rounded"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({...newUser, role: e.target.value})}
            required
            className="p-2 border rounded"
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="realtor">Realtor</option>
            <option value="support">Support</option>
            <option value="qa">QA</option>
          </select>
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
            required
            className="p-2 border rounded"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add User
        </button>
      </form>

      {/* User List */}
      <div className="overflow-x-auto">
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
            {users.map((user: any) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b">{`${user.firstName} ${user.lastName}`}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">
                  <select
                    defaultValue={user.role}
                    onChange={(e) => updateUserRole({ userId: user.id, role: e.target.value })}
                    className="p-1 border rounded"
                  >
                    <option value="admin">Admin</option>
                    <option value="realtor">Realtor</option>
                    <option value="support">Support</option>
                    <option value="qa">QA</option>
                  </select>
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => updateUserStatus({ userId: user.id, isActive: !user.isActive })}
                    className={`px-2 py-1 rounded ${user.isActive ? 'bg-green-500' : 'bg-red-500'} text-white`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => deleteUser({ userId: user.id })}
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
    </div>
  )
}