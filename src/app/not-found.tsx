export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-gray-600 mb-4">Page non trouvée</p>
        <a href="/" className="text-blue-500 hover:underline">
          Retour à l'accueil
        </a>
      </div>
    </div>
  )
}