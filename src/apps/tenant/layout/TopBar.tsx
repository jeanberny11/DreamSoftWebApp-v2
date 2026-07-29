// TopBar — header with sidebar toggle, theme toggle, and user avatar

import { useUiStore } from '@/shared/store/ui.store'

export function TopBar() {
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)
  const toggleTheme = useUiStore((s) => s.toggleTheme)
  const theme = useUiStore((s) => s.theme)

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        className="rounded p-1.5 text-gray-500 hover:bg-gray-100"
      >
        ☰
      </button>

      <span className="text-sm font-semibold text-gray-700">Dashboard</span>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="rounded p-1.5 text-gray-500 hover:bg-gray-100"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
          U
        </div>
      </div>
    </header>
  )
}
