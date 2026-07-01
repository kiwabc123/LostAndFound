import React, { useState } from 'react'
import { useFoundItems } from '@/hooks/useApi'
import { LoadingSpinner, EmptyState, ItemCard } from '@/components/common'
import { useNavigate } from 'react-router-dom'
import { FoundItem } from '@/types'

export const FoundItems: React.FC = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const { data, isLoading } = useFoundItems(page, 12)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Found Items</h1>
          <p className="mt-2 text-gray-600">
            Browse items that have been found
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner message="Loading items..." />
        </div>
      ) : data?.items && data.items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((item: FoundItem) => (
              <ItemCard
                key={item.id}
                item={item}
                onViewDetails={(id) => navigate(`/found-items/${id}`)}
                action={{
                  label: 'Claim Item',
                  onClick: (id) => navigate(`/claims/new?found_item=${id}`),
                }}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {page} of {Math.ceil((data?.total || 0) / 12)}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!data || page >= Math.ceil(data.total / 12)}
              className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <EmptyState title="No found items yet" />
      )}
    </div>
  )
}
