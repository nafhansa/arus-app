"use client"

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error)
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-md text-center space-y-4">
            <h1 className="text-2xl font-bold">Unexpected error</h1>
            <p className="text-sm text-muted-foreground">{error.message}</p>
            <button onClick={() => reset()} className="px-4 py-2 rounded-lg bg-secondary text-white">Try again</button>
          </div>
        </div>
      </body>
    </html>
  )
}

