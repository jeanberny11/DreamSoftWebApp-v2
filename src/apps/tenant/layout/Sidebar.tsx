// Sidebar — renders menu items from the menu store (role-based, dynamic)

import { NavLink } from 'react-router-dom'
import { useMenuStore } from '@/shared/store/menu.store'
import { useUiStore } from '@/shared/store/ui.store'
import type { MenuItem } from '@/shared/types/menu.types'

export function Sidebar() {
  const items = useMenuStore((s) => s.items)
  const sidebarOpen = useUiStore((s) => s.sidebarOpen)

  return (
    <aside className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-gray-900 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-700 px-4">
        {sidebarOpen ? (
          <span className="text-lg font-bold tracking-wide">DreamSoft</span>
        ) : (
          <span className="text-lg font-bold">DS</span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-4">
        {items.map((item) => (
          <SidebarItem key={item.id} item={item} sidebarOpen={sidebarOpen} />
        ))}
      </nav>
    </aside>
  )
}

function SidebarItem({ item, sidebarOpen }: { item: MenuItem; sidebarOpen: boolean }) {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-gray-700 ${isActive ? 'bg-gray-700 font-medium text-white' : 'text-gray-300'}`
      }
    >
      {item.icon && <span className="text-base">{item.icon}</span>}
      {sidebarOpen && <span>{item.label}</span>}
    </NavLink>
  )
}
