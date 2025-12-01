export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold">You are offline</h1>
        <p className="text-muted-foreground">Please check your internet connection. Some features may be unavailable.</p>
      </div>
    </div>
  )
}

