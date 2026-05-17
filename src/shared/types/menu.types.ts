// Menu / permissions types returned by GET /api/v1/auth/menu

export interface MenuItem {
  id: string
  label: string
  path: string
  icon?: string
  children?: MenuItem[]
}

export interface MenuState {
  items: MenuItem[]
}
