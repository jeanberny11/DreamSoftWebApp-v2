// BreadCrumb — generates breadcrumbs from the current URL path segments

import { Link, useLocation } from 'react-router-dom'

export function BreadCrumb() {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500" aria-label="Breadcrumb">
      {segments.map((segment, index) => {
        const path = '/' + segments.slice(0, index + 1).join('/')
        const isLast = index === segments.length - 1
        const label = segment.charAt(0).toUpperCase() + segment.slice(1)

        return (
          <span key={path} className="flex items-center gap-1">
            {index > 0 && <span className="text-gray-300">/</span>}
            {isLast ? (
              <span className="font-medium text-gray-800">{label}</span>
            ) : (
              <Link to={path} className="hover:text-blue-600 transition-colors">{label}</Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
