"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
    setSuccess("")
  }

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError("Username is required")
      return false
    }

    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters long")
      return false
    }

    if (!formData.email.trim()) {
      setError("Email is required")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return false
    }

    if (!formData.password.trim()) {
      setError("Password is required")
      return false
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    return true
  }

  const register = async (userData) => {
    console.log("🚀 Starting registration process...")

    // Попробуем разные варианты API endpoints для регистрации
    const registerVariants = [
      {
        name: "Standard registration",
        url: "https://admin.ilkin.site/api/auth/register/",
        body: {
          username: userData.username,
          email: userData.email,
          password: userData.password,
          first_name: userData.firstName,
          last_name: userData.lastName,
        },
      },
      {
        name: "DRF registration",
        url: "https://admin.ilkin.site/api/auth/registration/",
        body: {
          username: userData.username,
          email: userData.email,
          password1: userData.password,
          password2: userData.confirmPassword,
          first_name: userData.firstName,
          last_name: userData.lastName,
        },
      },
      {
        name: "Dj-rest-auth registration",
        url: "https://admin.ilkin.site/api/dj-rest-auth/registration/",
        body: {
          username: userData.username,
          email: userData.email,
          password1: userData.password,
          password2: userData.confirmPassword,
          first_name: userData.firstName,
          last_name: userData.lastName,
        },
      },
      {
        name: "Simple registration",
        url: "https://admin.ilkin.site/api/register/",
        body: {
          username: userData.username,
          email: userData.email,
          password: userData.password,
          first_name: userData.firstName,
          last_name: userData.lastName,
        },
      },
      {
        name: "Users endpoint",
        url: "https://admin.ilkin.site/api/users/",
        body: {
          username: userData.username,
          email: userData.email,
          password: userData.password,
          first_name: userData.firstName,
          last_name: userData.lastName,
        },
      },
    ]

    let lastError = null
    const detailedErrors = []

    for (const [index, variant] of registerVariants.entries()) {
      try {
        console.log(`\n🔄 Trying registration variant ${index + 1}: ${variant.name}`)
        console.log(`📡 URL: ${variant.url}`)
        console.log(`📦 Body:`, { ...variant.body, password: "***", password1: "***", password2: "***" })

        const res = await fetch(variant.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          mode: "cors",
          body: JSON.stringify(variant.body),
        })

        console.log(`📡 Response status: ${res.status}`)

        const responseText = await res.text()
        console.log(`📄 Response text:`, responseText)

        let responseData = {}
        try {
          responseData = JSON.parse(responseText)
        } catch (e) {
          console.log("⚠️ Response is not JSON:", responseText)
          responseData = { rawText: responseText }
        }

        if (res.ok) {
          console.log("✅ Registration successful with variant", index + 1)
          console.log("📊 Response data:", responseData)
          return responseData
        } else {
          // Сохраняем детальную информацию об ошибке
          const errorMessage = parseErrorMessage(responseData)

          detailedErrors.push({
            variant: index + 1,
            variantName: variant.name,
            url: variant.url,
            status: res.status,
            statusText: res.statusText,
            body: responseData,
            errorMessage,
            rawResponse: responseText,
          })

          console.log(`❌ Variant ${index + 1} failed:`, {
            status: res.status,
            statusText: res.statusText,
            body: responseData,
            errorMessage,
          })

          lastError = new Error(errorMessage || `HTTP ${res.status}`)
        }
      } catch (error) {
        console.error(`💥 Network error with variant ${index + 1}:`, error)

        detailedErrors.push({
          variant: index + 1,
          variantName: variant.name,
          url: variant.url,
          error: error.message,
          type: "NetworkError",
        })

        lastError = error
      }
    }

    // Логируем все попытки для отладки
    console.log("\n📊 Registration attempt summary:")
    console.table(detailedErrors)

    // Анализируем ошибки
    const networkErrors = detailedErrors.filter((e) => e.type === "NetworkError")
    if (networkErrors.length === registerVariants.length) {
      throw new Error("Cannot connect to the server. Please check your internet connection and try again.")
    }

    // Проверяем специфичные ошибки регистрации
    const has400Errors = detailedErrors.some((e) => e.status === 400)
    if (has400Errors) {
      const error400 = detailedErrors.find((e) => e.status === 400)
      const errorMsg = error400.errorMessage || "Registration data is invalid"
      throw new Error(errorMsg)
    }

    throw lastError || new Error("Registration failed - no working endpoints found")
  }

  const parseErrorMessage = (responseData) => {
    // Извлекаем сообщение об ошибке из разных возможных полей
    if (responseData.non_field_errors && Array.isArray(responseData.non_field_errors)) {
      return responseData.non_field_errors[0]
    }
    if (responseData.detail) {
      return responseData.detail
    }
    if (responseData.message) {
      return responseData.message
    }
    if (responseData.error) {
      return responseData.error
    }
    if (responseData.errors) {
      // Если errors это объект с полями
      if (typeof responseData.errors === "object") {
        const errorMessages = []
        for (const [field, messages] of Object.entries(responseData.errors)) {
          if (Array.isArray(messages)) {
            errorMessages.push(`${field}: ${messages[0]}`)
          } else {
            errorMessages.push(`${field}: ${messages}`)
          }
        }
        return errorMessages.join(", ")
      }
      return responseData.errors
    }

    // Проверяем специфичные поля ошибок
    const fieldErrors = []
    if (responseData.username) {
      fieldErrors.push(
        `Username: ${Array.isArray(responseData.username) ? responseData.username[0] : responseData.username}`,
      )
    }
    if (responseData.email) {
      fieldErrors.push(`Email: ${Array.isArray(responseData.email) ? responseData.email[0] : responseData.email}`)
    }
    if (responseData.password) {
      fieldErrors.push(
        `Password: ${Array.isArray(responseData.password) ? responseData.password[0] : responseData.password}`,
      )
    }
    if (responseData.password1) {
      fieldErrors.push(
        `Password: ${Array.isArray(responseData.password1) ? responseData.password1[0] : responseData.password1}`,
      )
    }

    if (fieldErrors.length > 0) {
      return fieldErrors.join(", ")
    }

    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      console.log("🚀 Starting registration...")
      const result = await register(formData)

      console.log("✅ Registration successful:", result)
      setSuccess("Registration successful! You can now log in with your credentials.")

      // Очищаем форму
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
      })

      // Перенаправляем на страницу логина через 2 секунды
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err) {
      console.error("❌ Registration error:", err)
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword)
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="w-full max-w-md">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">C</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-600 mt-2">Join C-News today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="input-field"
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="input-field"
                  autoComplete="family-name"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleInputChange}
                className="input-field"
                required
                autoComplete="username"
              />
              <div className="mt-1 text-xs text-gray-500">
                At least 3 characters, letters, numbers, and underscores only
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field"
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field pr-10"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("password")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              <div className="mt-1 text-xs text-gray-500">At least 8 characters</div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="input-field pr-10"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <div>
                    <p className="text-green-600 text-sm font-medium">Registration Successful!</p>
                    <p className="text-green-600 text-sm mt-1">{success}</p>
                    <p className="text-green-500 text-xs mt-2">Redirecting to login page...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start">
                  <span className="text-red-500 mr-2">⚠️</span>
                  <div>
                    <p className="text-red-600 text-sm font-medium">Registration Failed</p>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : success ? (
                "Account Created!"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>

          {/* Terms */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>

          {/* Help info */}
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 mb-2">
              <strong>Registration Tips:</strong>
            </p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Choose a unique username (3+ characters)</li>
              <li>• Use a valid email address</li>
              <li>• Create a strong password (8+ characters)</li>
              <li>• Check browser console (F12) if issues occur</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
