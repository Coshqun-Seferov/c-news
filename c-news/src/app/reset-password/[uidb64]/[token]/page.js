"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { resetPassword } from "../../../../lib/api.js"

export default function ResetPassword({ params }) {
  const router = useRouter()
  const [uidb64, setUidb64] = useState("")
  const [token, setToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isValidating, setIsValidating] = useState(true)
  const [linkExpired, setLinkExpired] = useState(false)

  useEffect(() => {
    const getParams = async () => {
      try {
        const resolvedParams = await params
        console.log("🔗 Reset password params:", resolvedParams)

        if (resolvedParams.uidb64 && resolvedParams.token) {
          setUidb64(resolvedParams.uidb64)
          setToken(resolvedParams.token)
          console.log("✅ Valid reset link parameters received")
        } else {
          console.log("❌ Invalid reset link parameters")
          setError("Invalid reset link parameters")
        }
      } catch (err) {
        console.error("❌ Error getting params:", err)
        setError("Failed to load reset link")
      } finally {
        setIsValidating(false)
      }
    }
    getParams()
  }, [params])

  const validateForm = () => {
    if (!newPassword.trim()) {
      setError("New password is required")
      return false
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long")
      return false
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    // Additional password strength validation
    const hasUpperCase = /[A-Z]/.test(newPassword)
    const hasLowerCase = /[a-z]/.test(newPassword)
    const hasNumbers = /\d/.test(newPassword)

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, and one number")
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      console.log("🔄 Attempting password reset with:", { uidb64, token: token.substring(0, 10) + "..." })

      await resetPassword(uidb64, token, newPassword)

      console.log("✅ Password reset successful!")
      setSuccess("Password has been reset successfully! You can now log in with your new password.")
      setNewPassword("")
      setConfirmPassword("")

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login?message=password-reset-success")
      }, 3000)
    } catch (err) {
      console.error("❌ Password reset error:", err)

      // Handle specific error cases
      if (err.message.includes("expired") || err.message.includes("invalid")) {
        setLinkExpired(true)
        setError("This password reset link has expired or is invalid. Please request a new one.")
      } else if (err.message.includes("New password:")) {
        setError(err.message)
      } else {
        setError(err.message || "Failed to reset password. Please try again or request a new reset link.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === "newPassword") {
      setNewPassword(value)
    } else if (name === "confirmPassword") {
      setConfirmPassword(value)
    }
    setError("")
    setSuccess("")
  }

  const togglePasswordVisibility = (field) => {
    if (field === "new") {
      setShowPassword(!showPassword)
    } else if (field === "confirm") {
      setShowConfirmPassword(!showConfirmPassword)
    }
  }

  // Loading state
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating reset link...</p>
        </div>
      </div>
    )
  }

  // Invalid link state
  if (!uidb64 || !token || linkExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="w-full max-w-md">
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {linkExpired ? "Link Expired" : "Invalid Reset Link"}
            </h3>
            <p className="text-red-600 mb-4">
              {linkExpired
                ? "This password reset link has expired or has already been used."
                : "The password reset link is invalid or malformed."}
            </p>
            <div className="space-y-3">
              <Link href="/forgot-password" className="btn-primary block">
                Request New Reset Link
              </Link>
              <Link href="/login" className="btn-secondary block">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="w-full max-w-md">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">🔒</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
            <p className="text-gray-600 mt-2">Enter your new password</p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={handleInputChange}
                    className="input-field pr-10"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Must be 8+ characters with uppercase, lowercase, and numbers
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={handleInputChange}
                    className="input-field pr-10"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">Password strength:</div>
                  <div className="space-y-1">
                    <div className={`text-xs ${newPassword.length >= 8 ? "text-green-600" : "text-red-600"}`}>
                      ✓ At least 8 characters {newPassword.length >= 8 ? "✅" : "❌"}
                    </div>
                    <div className={`text-xs ${/[A-Z]/.test(newPassword) ? "text-green-600" : "text-red-600"}`}>
                      ✓ Uppercase letter {/[A-Z]/.test(newPassword) ? "✅" : "❌"}
                    </div>
                    <div className={`text-xs ${/[a-z]/.test(newPassword) ? "text-green-600" : "text-red-600"}`}>
                      ✓ Lowercase letter {/[a-z]/.test(newPassword) ? "✅" : "❌"}
                    </div>
                    <div className={`text-xs ${/\d/.test(newPassword) ? "text-green-600" : "text-red-600"}`}>
                      ✓ Number {/\d/.test(newPassword) ? "✅" : "❌"}
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-start">
                    <span className="text-red-500 mr-2">⚠️</span>
                    <div>
                      <p className="text-red-600 text-sm font-medium">Error</p>
                      <p className="text-red-600 text-sm mt-1">{error}</p>
                      {error.includes("expired") && (
                        <div className="mt-2">
                          <Link href="/forgot-password" className="text-blue-600 text-sm hover:underline">
                            Request a new reset link →
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Resetting Password...
                  </div>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-500 text-2xl">✅</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Password Reset Successful</h3>
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl mb-6">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
              <div className="text-center">
                <div className="animate-pulse text-blue-600 text-sm mb-2">Redirecting to login page...</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "100%" }}></div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-blue-600 hover:underline">
              ← Back to Login
            </Link>
          </div>

          {/* Debug info in development */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
              <strong>Debug info:</strong>
              <br />
              uidb64: {uidb64}
              <br />
              token: {token ? token.substring(0, 20) + "..." : "not set"}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
