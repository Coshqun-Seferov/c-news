"use client"

import { useState } from "react"
import Link from "next/link"
import { requestPasswordReset } from "../../lib/api.js"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setMessage("")

    if (!email.trim()) {
      setError("Email is required")
      setIsLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      await requestPasswordReset(email.trim())
      setIsSuccess(true)
      setMessage(
        "Password reset instructions have been sent to your email address. Please check your inbox and follow the instructions to reset your password.",
      )
      setEmail("")
    } catch (err) {
      console.error("❌ Password reset request error:", err)
      setError(err.message || "Failed to send password reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setEmail(e.target.value)
    setError("")
    setMessage("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="w-full max-w-md">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">🔑</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Forgot Password</h2>
            <p className="text-gray-600 mt-2">Enter your email to reset your password</p>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                  autoComplete="email"
                />
                <div className="mt-1 text-xs text-gray-500">We'll send password reset instructions to this email</div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-start">
                    <span className="text-red-500 mr-2">⚠️</span>
                    <div>
                      <p className="text-red-600 text-sm font-medium">Error</p>
                      <p className="text-red-600 text-sm mt-1">{error}</p>
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
                    Sending...
                  </div>
                ) : (
                  "Send Reset Instructions"
                )}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-500 text-2xl">✅</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Check Your Email</h3>
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl mb-6">
                <p className="text-green-600 text-sm">{message}</p>
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                <p>Didn't receive the email?</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Check your spam/junk folder</li>
                  <li>Make sure you entered the correct email address</li>
                  <li>Wait a few minutes and check again</li>
                </ul>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-blue-600 hover:underline">
              ← Back to Login
            </Link>
          </div>

          {!isSuccess && (
            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <Link href="/register" className="text-blue-600 hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
