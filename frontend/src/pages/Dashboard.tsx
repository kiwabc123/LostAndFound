import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useLostItems, useFoundItems, useMatches } from '@/hooks/useApi'
import { LoadingSpinner, EmptyState } from '@/components/common'
import { IconTrendingUp, IconAlertCircle, IconCheck, IconSparkles } from '@tabler/icons-react'
import { LostItem, FoundItem } from '@/types'

export const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const { data: lostData, isLoading: lostLoading } = useLostItems(1, 5)
  const { data: foundData, isLoading: foundLoading } = useFoundItems(1, 5)
  const { data: matchesData, isLoading: matchesLoading } = useMatches(1, 5)

  const stats = [
    {
      label: 'Lost Items',
      value: lostData?.total || 0,
      icon: <IconAlertCircle className="h-6 w-6" />,
      color: 'text-orange-600',
    },
    {
      label: 'Found Items',
      value: foundData?.total || 0,
      icon: <IconCheck className="h-6 w-6" />,
      color: 'text-green-600',
    },
    {
      label: 'Matches',
      value: matchesData?.total || 0,
      icon: <IconSparkles className="h-6 w-6" />,
      color: 'text-blue-600',
    },
  ]

  const isLoading = lostLoading || foundLoading || matchesLoading

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.username}!
        </h1>
        <p className="mt-2 text-gray-600">
          Help reunite lost items with their owners
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} rounded-lg bg-gray-50 p-3`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Lost Items */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Lost Items
            </h2>
            <a href="/lost-items" className="text-sm text-blue-600 hover:text-blue-700">
              View all
            </a>
          </div>
          {isLoading ? (
            <LoadingSpinner />
          ) : lostData?.items && lostData.items.length > 0 ? (
            <div className="space-y-3">
              {lostData.items.map((item: LostItem) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.item_name}</p>
                    <p className="text-sm text-gray-600">{item.location}</p>
                  </div>
                  <span className="text-xs font-semibold text-orange-600">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No lost items yet" />
          )}
        </div>

        {/* Recent Found Items */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Found Items
            </h2>
            <a href="/found-items" className="text-sm text-blue-600 hover:text-blue-700">
              View all
            </a>
          </div>
          {isLoading ? (
            <LoadingSpinner />
          ) : foundData?.items && foundData.items.length > 0 ? (
            <div className="space-y-3">
              {foundData.items.map((item: FoundItem) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.item_name}</p>
                    <p className="text-sm text-gray-600">{item.location}</p>
                  </div>
                  <span className="text-xs font-semibold text-green-600">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No found items yet" />
          )}
        </div>
      </div>
    </div>
  )
}
