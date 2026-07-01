import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { IconUser, IconMail, IconShield } from '@tabler/icons-react'

export const Settings: React.FC = () => {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Account Information */}
        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Account Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
              <IconUser className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Username</p>
                <p className="font-medium text-gray-900">{user?.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
              <IconMail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
              <IconShield className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="font-medium text-gray-900 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Preferences
          </h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-gray-700">Email notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-gray-700">
                Match alerts when similar items found
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
