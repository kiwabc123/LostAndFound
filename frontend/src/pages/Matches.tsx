import React, { useState } from 'react'
import { useMatches } from '@/hooks/useApi'
import { LoadingSpinner, EmptyState } from '@/components/common'
import { IconSparkles } from '@tabler/icons-react'
import { Match } from '@/types'

export const Matches: React.FC = () => {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useMatches(page, 12)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Match Center</h1>
        <p className="mt-2 text-gray-600">
          AI-powered matching between lost and found items
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner message="Finding matches..." />
        </div>
      ) : data?.items && data.items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4">
            {data.items.map((match: Match) => (
              <div
                key={match.id}
                className="card flex items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <IconSparkles className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-semibold text-gray-900">
                      Match Found
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Lost Item {match.lost_item_id} may match Found Item{' '}
                    {match.found_item_id}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(match.combined_score * 100)}%
                  </div>
                  <p className="text-xs text-gray-500">Match Score</p>
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
        <EmptyState title="No matches found yet" />
      )}
    </div>
  )
}
