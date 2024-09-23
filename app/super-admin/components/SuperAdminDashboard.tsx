// app/super-admin/components/SuperAdminDashboard.tsx
'use client'

import { useState } from 'react'
import { Tab } from '@headlessui/react'
import UserManagement from './UserManagement'
import LeadManagement from './LeadManagement'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState(0)

  const tabItems = ['User Management', 'Lead Management']

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Super Admin Dashboard</h1>
      
      <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {tabItems.map((item) => (
            <Tab
              key={item}
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
              {item}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel>
            <UserManagement />
          </Tab.Panel>
          <Tab.Panel>
            <LeadManagement />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}