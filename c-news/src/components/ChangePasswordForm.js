"use client"

import { useState } from "react"
import { changePassword } from "../lib/api.js"

/**
 * Change Password Form Component
 * @param {Object} props
 * @param {function} props.onSuccess - Callback when password is changed successfully
 */
export function ChangePasswordForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
    setSuccess("")
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    })
  }

  const validateForm = () => {
    if (!formData.currentPassword) {
      setError("Current password is required")
      return false
    }

    if (!formData.newPassword) {
      setError("New password is required")
      return false
    }

    if (formData.newPassword.length < 8) {
      setError("New password must be at least 8 characters long")
      return false
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match")
      return false
    }

    if (formData.currentPassword === formData.newPassword) {
      setError("New password must be different from current password")
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
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      await changePassword(formData.currentPassword, formData.newPassword, token)

      setSuccess("Password changed successfully!")

      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      onSuccess?.()
    } catch (error) {
      console.error("❌ Password change error:", error)
      setError(error.message || "Failed to change password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <span className="text-orange-500 mr-2">🔒</span>
        Change Password
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
          <div className="relative">
            <input
              type={showPasswords.current ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="input-field pr-10"
              placeholder="Enter current password"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.current ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
          <div className="relative">
            <input
              type={showPasswords.new ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="input-field pr-10"
              placeholder="Enter new password"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.new ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          <div className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="input-field pr-10"
              placeholder="Confirm new password"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.confirm ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm font-medium">✅ {success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium">❌ {error}</p>
          </div>
        )}

        <button type="submit" disabled={isLoading} className="w-full btn-primary disabled:opacity-50">
          {isLoading ? "Changing Password..." : "Change Password"}
        </button>
      </form>
    </div>
  )
}
