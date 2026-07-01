import React from 'react'
import { IconLogout, IconMenu2 } from '@tabler/icons-react'
import { useAuth } from '@/hooks/useAuth'

interface HeaderProps {
  onMenuClick: () => void
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth()

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg hover:bg-gray-100 lg:hidden"
        >
          <IconMenu2 className="h-6 w-6" />
        </button>

        <div className="hidden flex-1 lg:block"></div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.username}</span>
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            <IconLogout className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
