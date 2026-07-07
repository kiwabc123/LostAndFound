import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateFoundItem } from '@/hooks/useApi'

const nowUTC7 = () => {
  const utc7 = new Date(Date.now() + 7 * 60 * 60 * 1000)
  return utc7.toISOString().slice(0, 16)
}

const toISO = (localValue: string) => new Date(localValue + ':00+07:00').toISOString()

export const RecordFoundItem: React.FC = () => {
  const navigate = useNavigate()
  const { mutate: createItem, isPending } = useCreateFoundItem()

  const [form, setForm] = useState({
    item_name: '',
    description: '',
    location: '',
    date_found: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.item_name.trim()) e.item_name = 'Item name is required'
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.location.trim()) e.location = 'Location is required'
    if (!form.date_found) e.date_found = 'Date found is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    createItem(
      {
        item_name: form.item_name,
        description: form.description,
        location: form.location,
        date_found: toISO(form.date_found),
      },
      {
        onSuccess: () => navigate('/found-items'),
        onError: () => setErrors({ submit: 'Failed to record item. Please try again.' }),
      }
    )
  }

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Record Found Item</h1>
        <p className="mt-2 text-gray-600">
          Record the details of an item that was found.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.item_name}
              onChange={(e) => handleChange('item_name', e.target.value)}
              placeholder="e.g. Blue backpack"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.item_name && <p className="mt-1 text-sm text-red-600">{errors.item_name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the item in detail (color, brand, contents, condition, etc.)"
              rows={4}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Where was it found? <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g. Building A, Room 201"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date Found <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={form.date_found}
              onChange={(e) => handleChange('date_found', e.target.value)}
              max={nowUTC7()}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.date_found && <p className="mt-1 text-sm text-red-600">{errors.date_found}</p>}
          </div>

          {errors.submit && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {errors.submit}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/found-items')}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {isPending ? 'Saving…' : 'Record Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
