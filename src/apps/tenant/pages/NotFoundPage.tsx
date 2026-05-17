// NotFoundPage — 404 shown for unmatched routes

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="max-w-md text-center">
        <p className="text-6xl font-bold text-gray-200">404</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Page Not Found</h1>
        <p className="mt-2 text-gray-500">The page you're looking for doesn't exist or has been moved.</p>
      </div>
    </div>
  )
}
