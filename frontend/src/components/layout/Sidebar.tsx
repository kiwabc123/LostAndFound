import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  IconDashboard,
  IconAlertCircle,
  IconCheck,
  IconSparkles,
  IconFileText,
  IconSettings,
} from '@tabler/icons-react'
import { useAuth } from '@/hooks/useAuth'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
  roles?: Array<'user' | 'staff' | 'admin'>
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <IconDashboard className="h-5 w-5" />,
  },
  {
    label: 'Lost Items',
    path: '/lost-items',
    icon: <IconAlertCircle className="h-5 w-5" />,
  },
  {
    label: 'Found Items',
    path: '/found-items',
    icon: <IconCheck className="h-5 w-5" />,
  },
  {
    label: 'Matches',
    path: '/matches',
    icon: <IconSparkles className="h-5 w-5" />,
  },
  {
    label: 'Claims',
    path: '/claims',
    icon: <IconFileText className="h-5 w-5" />,
    roles: ['staff', 'admin'],
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: <IconSettings className="h-5 w-5" />,
  },
]

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation()
  const { user } = useAuth()

  const visibleItems = navItems.filter((item) => {
    if (!item.roles) return true
    return item.roles.includes(user?.role || 'user')
  })

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900">Lost & Found</h1>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 px-3 py-4">
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
