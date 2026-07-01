// User types
export interface User {
  id: string
  username: string
  email: string
  role: 'user' | 'staff' | 'admin'
  created_at: string
}

// Lost Item types
export interface LostItem {
  id: string
  user_id: string
  item_name: string
  description: string
  location: string
  date_lost: string
  image_url?: string
  image_embedding?: number[]
  text_embedding?: number[]
  status: 'reported' | 'found' | 'closed'
  created_at: string
  updated_at: string
}

// Found Item types
export interface FoundItem {
  id: string
  staff_id: string
  item_name: string
  description: string
  location: string
  date_found: string
  image_url?: string
  status: 'unclaimed' | 'claimed' | 'returned'
  created_at: string
  updated_at: string
}

// Match types
export interface Match {
  id: string
  lost_item_id: string
  found_item_id: string
  image_score: number
  text_score: number
  combined_score: number
  created_at: string
}

// Claim types
export interface ClaimRequest {
  id: string
  user_id: string
  found_item_id: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

// Auth types
export interface AuthCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  access_token: string
  refresh_token?: string
  user: User
}
