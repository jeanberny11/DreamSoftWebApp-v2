// ForbiddenPage — 403 shown when user lacks permission for the requested route

export function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="max-w-md text-center">
        <p className="text-6xl font-bold text-gray-200">403</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Access Denied</h1>
        <p className="mt-2 text-gray-500">You don't have permission to view this page.</p>
      </div>
    </div>
  )
}
