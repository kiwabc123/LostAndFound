import React, { useState } from 'react'
import { useClaims } from '@/hooks/useApi'
import { LoadingSpinner, EmptyState } from '@/components/common'
import { IconFileText } from '@tabler/icons-react'
import { ClaimRequest } from '@/types'

export const Claims: React.FC = () => {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useClaims(page, 10)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Claims</h1>
        <p className="mt-2 text-gray-600">
          Manage item ownership claims
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner message="Loading claims..." />
        </div>
      ) : data?.items && data.items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4">
            {data.items.map((claim: ClaimRequest) => (
              <div key={claim.id} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconFileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Claim #{claim.id.substring(0, 8)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Filed on{' '}
                        {new Date(claim.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        claim.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : claim.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {claim.status.charAt(0).toUpperCase() +
                        claim.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
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
              Page {page} of {Math.ceil((data?.total || 0) / 10)}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!data || page >= Math.ceil(data.total / 10)}
              className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <EmptyState title="No claims yet" />
      )}
    </div>
  )
}
