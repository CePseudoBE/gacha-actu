/**
 * Hook pour la gestion du formulaire de login - Responsabilité unique
 */

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface LoginFormData {
  email: string
  password: string
}

interface UseLoginFormResult {
  formData: LoginFormData
  showPassword: boolean
  isLoading: boolean
  error: string
  handleSubmit: (e: React.FormEvent) => Promise<void>
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  togglePasswordVisibility: () => void
}

export function useLoginForm(): UseLoginFormResult {
  const router = useRouter()
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        callbackUrl: '/admin',
        redirect: false
      })

      if (result?.error) {
        setError("Email ou mot de passe incorrect")
      } else if (result?.ok) {
        // Redirection directe - l'AuthGuard s'occupera de vérifier les permissions
        router.push('/admin')
      }
    } catch {
      setError("Erreur lors de la connexion")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  return {
    formData,
    showPassword,
    isLoading,
    error,
    handleSubmit,
    handleChange,
    togglePasswordVisibility
  }
}