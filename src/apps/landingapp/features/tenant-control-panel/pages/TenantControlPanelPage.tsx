// TenantControlPanelPage — Shell layout: sidebar + topbar + outlet for sub-routes

import { Outlet } from 'react-router-dom'
import { TcpSidebar } from '../components/TcpSidebar'
import { TcpTopBar } from '../components/TcpTopBar'
import '../styles/tenant-control-panel.css'

export function TenantControlPanelPage() {
  return (
    <div className="tcp-shell">
      <TcpSidebar />
      <div className="tcp-body">
        <TcpTopBar />
        <main className="tcp-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
