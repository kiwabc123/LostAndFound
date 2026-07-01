import axios, { AxiosInstance } from 'axios'
import type {
  User,
  LostItem,
  FoundItem,
  Match,
  ClaimRequest,
  AuthCredentials,
  AuthResponse,
  PaginatedResponse,
} from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Handle 401 responses
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth endpoints
  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    const { data } = await this.client.post('/auth/register', {
      username,
      email,
      password,
    })
    return data
  }

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const { data } = await this.client.post('/auth/login', credentials)
    return data
  }

  // Lost Items
  async getLostItems(page = 1, limit = 10): Promise<PaginatedResponse<LostItem>> {
    const { data } = await this.client.get('/lost-items', {
      params: { page, limit },
    })
    return data
  }

  async getLostItem(id: string): Promise<LostItem> {
    const { data } = await this.client.get(`/lost-items/${id}`)
    return data
  }

  async createLostItem(item: Omit<LostItem, 'id' | 'created_at' | 'updated_at'>): Promise<LostItem> {
    const { data } = await this.client.post('/lost-items', item)
    return data
  }

  async updateLostItem(id: string, item: Partial<LostItem>): Promise<LostItem> {
    const { data } = await this.client.put(`/lost-items/${id}`, item)
    return data
  }

  async deleteLostItem(id: string): Promise<void> {
    await this.client.delete(`/lost-items/${id}`)
  }

  // Found Items
  async getFoundItems(page = 1, limit = 10): Promise<PaginatedResponse<FoundItem>> {
    const { data } = await this.client.get('/found-items', {
      params: { page, limit },
    })
    return data
  }

  async getFoundItem(id: string): Promise<FoundItem> {
    const { data } = await this.client.get(`/found-items/${id}`)
    return data
  }

  async createFoundItem(item: Omit<FoundItem, 'id' | 'created_at' | 'updated_at'>): Promise<FoundItem> {
    const { data } = await this.client.post('/found-items', item)
    return data
  }

  // Matches
  async getMatches(page = 1, limit = 10): Promise<PaginatedResponse<Match>> {
    const { data } = await this.client.get('/matches', {
      params: { page, limit },
    })
    return data
  }

  async getMatch(id: string): Promise<Match> {
    const { data } = await this.client.get(`/matches/${id}`)
    return data
  }

  // Claims
  async getClaims(page = 1, limit = 10): Promise<PaginatedResponse<ClaimRequest>> {
    const { data } = await this.client.get('/claims', {
      params: { page, limit },
    })
    return data
  }

  async createClaim(foundItemId: string): Promise<ClaimRequest> {
    const { data } = await this.client.post('/claims', { found_item_id: foundItemId })
    return data
  }

  async approveClaim(id: string): Promise<ClaimRequest> {
    const { data } = await this.client.patch(`/claims/${id}/approve`)
    return data
  }

  async rejectClaim(id: string): Promise<ClaimRequest> {
    const { data } = await this.client.patch(`/claims/${id}/reject`)
    return data
  }
}

export const apiClient = new ApiClient()
