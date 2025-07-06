"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "../../contexts/AuthContext.js"

export default function Login() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState(null)
  const [resetSuccess, setResetSuccess] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get("message") === "password-reset-success") {
      setResetSuccess(true)
      // Убираем параметр из URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
    setConnectionStatus(null)
  }

  const testConnection = async () => {
    setIsLoading(true)
    setError("")
    setConnectionStatus("testing")

    try {
      console.log("🔍 Testing server connection...")

      const response = await fetch("https://admin.ilkin.site/api/", {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
        },
      })

      console.log("✅ Connection test result:", response.status, response.ok)

      if (response.ok) {
        setConnectionStatus("success")
        setError("")
      } else {
        setConnectionStatus("error")
        setError(`Server responded with status ${response.status}`)
      }
    } catch (error) {
      console.error("❌ Connection test failed:", error)
      setConnectionStatus("failed")
      setError(`Connection failed: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setConnectionStatus(null)

    // Валидация
    if (!formData.username.trim()) {
      setError("Username or email is required")
      setIsLoading(false)
      return
    }

    if (!formData.password.trim()) {
      setError("Password is required")
      setIsLoading(false)
      return
    }

    try {
      console.log("🚀 Starting login process...")
      await login(formData.username.trim(), formData.password)
      console.log("✅ Login successful, redirecting...")
      router.push("/profil")
    } catch (err) {
      console.error("❌ Login error:", err)

      // Обработка разных типов ошибок
      if (err.message.includes("Cannot connect to the server") || err.message.includes("Cannot connect to server")) {
        setError("Cannot connect to the server. Please check your internet connection and try again.")
        setConnectionStatus("failed")
      } else if (err.message.includes("Network request failed")) {
        setError("Network error occurred. Please check your internet connection and try again.")
        setConnectionStatus("failed")
      } else if (err.message.includes("Invalid username or password")) {
        setError("Invalid username or password. Please check your credentials and try again.")
      } else if (err.message.includes("Authentication failed")) {
        setError("Authentication failed. Please verify your username and password.")
      } else if (err.message.includes("Request error")) {
        setError(err.message)
      } else if (err.message.includes("Login service not found")) {
        setError("Login service is not available. Please try again later or contact support.")
      } else if (err.message.includes("Login method not supported")) {
        setError("Login method is not supported. Please contact support.")
      } else if (err.message.includes("Failed to fetch")) {
        setError("Network connection failed. Please check your internet connection and try again.")
        setConnectionStatus("failed")
      } else {
        setError("Login failed. Please try again or contact support if the problem persists.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="w-full max-w-md">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">C</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {/* Connection Status */}
          {connectionStatus && (
            <div
              className={`mb-4 p-3 rounded-lg ${
                connectionStatus === "success"
                  ? "bg-green-50 border border-green-200"
                  : connectionStatus === "failed"
                    ? "bg-red-50 border border-red-200"
                    : connectionStatus === "testing"
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-yellow-50 border border-yellow-200"
              }`}
            >
              <div className="flex items-center">
                {connectionStatus === "success" && <span className="text-green-500 mr-2">✅</span>}
                {connectionStatus === "failed" && <span className="text-red-500 mr-2">❌</span>}
                {connectionStatus === "testing" && <span className="text-blue-500 mr-2">🔍</span>}
                {connectionStatus === "error" && <span className="text-yellow-500 mr-2">⚠️</span>}
                <span
                  className={`text-sm font-medium ${
                    connectionStatus === "success"
                      ? "text-green-700"
                      : connectionStatus === "failed"
                        ? "text-red-700"
                        : connectionStatus === "testing"
                          ? "text-blue-700"
                          : "text-yellow-700"
                  }`}
                >
                  {connectionStatus === "success" && "Server connection successful"}
                  {connectionStatus === "failed" && "Cannot connect to server"}
                  {connectionStatus === "testing" && "Testing connection..."}
                  {connectionStatus === "error" && "Server connection error"}
                </span>
              </div>
            </div>
          )}

          {resetSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <div>
                  <p className="text-green-600 text-sm font-medium">Password Reset Successful</p>
                  <p className="text-green-600 text-sm mt-1">
                    Your password has been reset successfully. You can now log in with your new password.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username or Email</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username or email"
                value={formData.username}
                onChange={handleInputChange}
                className="input-field"
                required
                autoComplete="username"
              />
              <div className="mt-1 text-xs text-gray-500">You can use either your username or email address</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start">
                  <span className="text-red-500 mr-2">⚠️</span>
                  <div>
                    <p className="text-red-600 text-sm font-medium">Login Failed</p>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                    {error.includes("Invalid username or password") && (
                      <div className="mt-3 text-xs text-red-500">
                        <p className="font-medium">Try:</p>
                        <ul className="mt-1 space-y-1">
                          <li>• Creating a new account first</li>
                          <li>• Using the forgot password feature</li>
                          <li>• Double-checking spelling and case sensitivity</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>

              <button
                type="button"
                onClick={testConnection}
                disabled={isLoading}
                className="btn-secondary disabled:opacity-50"
                title="Test server connection"
              >
                🔧
              </button>
            </div>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot your password?
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-600 hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
