import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { apiClient } from '@/services/api'

// Lost Items hooks
export const useLostItems = (page = 1, limit = 10, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['lost-items', page, limit],
    queryFn: () => apiClient.getLostItems(page, limit),
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}

export const useLostItem = (id: string, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['lost-items', id],
    queryFn: () => apiClient.getLostItem(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}

export const useCreateLostItem = (options?: UseMutationOptions<any, any, any>) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (item) => apiClient.createLostItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lost-items'] })
    },
    ...options,
  })
}

// Found Items hooks
export const useFoundItems = (page = 1, limit = 10, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['found-items', page, limit],
    queryFn: () => apiClient.getFoundItems(page, limit),
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}

export const useFoundItem = (id: string, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['found-items', id],
    queryFn: () => apiClient.getFoundItem(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}

// Matches hooks
export const useMatches = (page = 1, limit = 10, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['matches', page, limit],
    queryFn: () => apiClient.getMatches(page, limit),
    staleTime: 2 * 60 * 1000,
    ...options,
  })
}

// Claims hooks
export const useClaims = (page = 1, limit = 10, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['claims', page, limit],
    queryFn: () => apiClient.getClaims(page, limit),
    staleTime: 2 * 60 * 1000,
    ...options,
  })
}

export const useCreateClaim = (options?: UseMutationOptions<any, any, any>) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (foundItemId) => apiClient.createClaim(foundItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] })
      queryClient.invalidateQueries({ queryKey: ['matches'] })
    },
    ...options,
  })
}
