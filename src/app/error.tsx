'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Erreur</h1>
        <p className="text-gray-600 mb-4">Une erreur est survenue</p>
        <button 
          onClick={reset}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Réessayer
        </button>
      </div>
    </div>
  )
}