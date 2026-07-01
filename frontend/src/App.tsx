import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { AuthProvider } from '@/context/AuthContext'
import { ProtectedRoute, Layout } from '@/components'
import {
  Dashboard,
  LostItems,
  FoundItems,
  Matches,
  Claims,
  Settings,
  Login,
} from '@/pages'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/lost-items" element={<LostItems />} />
                <Route path="/found-items" element={<FoundItems />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/claims" element={<Claims />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Redirect root to dashboard or login */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App
