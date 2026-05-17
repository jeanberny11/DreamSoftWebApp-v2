import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark'

interface UiStore {
  sidebarOpen: boolean
  isGlobalLoading: boolean
  theme: Theme

  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setGlobalLoading: (loading: boolean) => void
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useUiStore = create<UiStore>()(
  persist(
    (set, get) => ({
      sidebarOpen: true,
      isGlobalLoading: false,
      theme: 'light',

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setGlobalLoading: (loading) => set({ isGlobalLoading: loading }),

      setTheme: (theme) => {
        set({ theme })
        document.documentElement.setAttribute('data-theme', theme)
        const metaThemeColor = document.querySelector('meta[name="theme-color"]')
        if (metaThemeColor) {
          metaThemeColor.setAttribute('content', theme === 'dark' ? '#111827' : '#ffffff')
        }
      },

      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light'
        get().setTheme(newTheme)
      },
    }),
    {
      name: 'dreamsoft-ui-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)

export const initializeTheme = () => {
  const theme = useUiStore.getState().theme
  document.documentElement.setAttribute('data-theme', theme)
}

export const useThemeState = () =>
  useUiStore((state) => ({
    theme: state.theme,
    setTheme: state.setTheme,
    toggleTheme: state.toggleTheme,
  }))

export default useUiStore
