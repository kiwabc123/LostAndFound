import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { apiClient } from '@/services/api'

// Returns true only after the auth state has been restored from localStorage
const useIsAuthenticated = () => !!localStorage.getItem('access_token')

// Lost Items hooks
export const useLostItems = (page = 1, limit = 10, options?: UseQueryOptions<any>) => {
  const isAuthenticated = useIsAuthenticated()
  return useQuery({
    queryKey: ['lost-items', page, limit],
    queryFn: () => apiClient.getLostItems(page, limit),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}

export const useLostItem = (id: string, options?: UseQueryOptions<any>) => {
  const isAuthenticated = useIsAuthenticated()
  return useQuery({
    queryKey: ['lost-items', id],
    queryFn: () => apiClient.getLostItem(id),
    enabled: isAuthenticated && !!id,
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
  const isAuthenticated = useIsAuthenticated()
  return useQuery({
    queryKey: ['found-items', page, limit],
    queryFn: () => apiClient.getFoundItems(page, limit),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}

export const useFoundItem = (id: string, options?: UseQueryOptions<any>) => {
  const isAuthenticated = useIsAuthenticated()
  return useQuery({
    queryKey: ['found-items', id],
    queryFn: () => apiClient.getFoundItem(id),
    enabled: isAuthenticated && !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}

export const useCreateFoundItem = (options?: UseMutationOptions<any, any, any>) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (item) => apiClient.createFoundItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['found-items'] })
    },
    ...options,
  })
}

// Matches hooks
export const useMatches = (page = 1, limit = 10, options?: UseQueryOptions<any>) => {
  const isAuthenticated = useIsAuthenticated()
  return useQuery({
    queryKey: ['matches', page, limit],
    queryFn: () => apiClient.getMatches(page, limit),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
    ...options,
  })
}

// Claims hooks
export const useClaims = (page = 1, limit = 10, options?: UseQueryOptions<any>) => {
  const isAuthenticated = useIsAuthenticated()
  return useQuery({
    queryKey: ['claims', page, limit],
    queryFn: () => apiClient.getClaims(page, limit),
    enabled: isAuthenticated,
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
