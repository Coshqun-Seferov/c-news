"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/AuthContext.js"
import { Header } from "../../components/Header.js"
import { ProfilePictureUpload } from "../../components/ProfilePictureUpload.js"
import { ChangePasswordForm } from "../../components/ChangePasswordForm.js"
import { getUserDisplayName, getUserRole, isUserVerified } from "../../utils/userUtils.js"

export default function Profile() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("profile") // profile, security, diagnostic
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    bio: "",
  })
  const [updateLoading, setUpdateLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        bio: user.bio || "",
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpdateLoading(true)
    setMessage("")

    try {
      await updateUser(formData)
      setMessage("Profile updated successfully!")
      setIsEditing(false)
    } catch (error) {
      setMessage(error.message || "Failed to update profile")
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleProfilePictureUpdate = (updatedUser) => {
    updateUser(updatedUser)
    setMessage("Profile picture updated successfully!")
  }

  const handlePasswordChangeSuccess = () => {
    setMessage("Password changed successfully! Please test your new password using the diagnostic tool.")
    setTimeout(() => setMessage(""), 10000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-8">
              <div className="animate-pulse">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="glass-card p-8 mb-8">
            <div className="text-center">
              <ProfilePictureUpload user={user} onUpdate={handleProfilePictureUpdate} />
              <h1 className="text-2xl font-bold text-gray-800 mt-4">{getUserDisplayName(user)}</h1>
              <p className="text-gray-600">{user.email || ""}</p>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {getUserRole(user)}
                </span>
                {isUserVerified(user) && (
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    ✓ Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Success/Error Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl ${
                message.includes("successfully") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              }`}
            >
              {message}
            </div>
          )}

          {/* Tabs */}
          <div className="glass-card mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-8 pt-6">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "profile"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  👤 Profile Information
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "security"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  🔒 Security
                </button>
                <button
                  onClick={() => setActiveTab("diagnostic")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "diagnostic"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  🔧 Password Diagnostic
                </button>
              </nav>
            </div>

            <div className="p-8">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input-field disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="input-field disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="input-field disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={4}
                      className="input-field disabled:bg-gray-50"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="flex justify-between">
                    {isEditing ? (
                      <div className="flex space-x-4">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="btn-secondary"
                          disabled={updateLoading}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={updateLoading}>
                          {updateLoading ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => setIsEditing(true)} className="btn-primary">
                        Edit Profile
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <ChangePasswordForm onSuccess={handlePasswordChangeSuccess} />

                  {/* Account Security Info */}
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="text-blue-500 mr-2">🛡️</span>
                      Account Security
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                        </div>
                        <button className="btn-secondary text-sm">Enable 2FA</button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">Login Sessions</p>
                          <p className="text-sm text-gray-600">Manage your active login sessions</p>
                        </div>
                        <button className="btn-secondary text-sm">View Sessions</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Diagnostic Tab - упрощенная версия */}
              {activeTab === "diagnostic" && (
                <div className="space-y-6">
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="text-yellow-500 mr-2">⚠️</span>
                      Password Change Issues?
                    </h3>
                    <div className="space-y-3 text-sm text-gray-600">
                      <p>
                        <strong>If you can't log in with your new password:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Make sure you're using the exact password you set</li>
                        <li>Check for typos, case sensitivity, and extra spaces</li>
                        <li>Try logging out completely and logging back in</li>
                        <li>Clear your browser cache and cookies</li>
                        <li>Check the browser console (F12) for error messages</li>
                      </ul>
                      <p className="mt-4">
                        <strong>Common causes:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Password wasn't actually saved on the server</li>
                        <li>Server requires password in different format</li>
                        <li>Session/token issues after password change</li>
                        <li>Browser autocomplete using old password</li>
                      </ul>
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-700 text-sm">
                          <strong>Quick test:</strong> Try logging in with your new password in an incognito/private
                          browser window.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Info */}
          <div className="glass-card p-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Username:</span>
                <span className="ml-2 font-medium">{user.username || "N/A"}</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className={`ml-2 font-medium ${isUserVerified(user) ? "text-green-600" : "text-yellow-600"}`}>
                  {isUserVerified(user) ? "Verified" : "Unverified"}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Role:</span>
                <span className="ml-2 font-medium">{getUserRole(user)}</span>
              </div>
              <div>
                <span className="text-gray-600">Member since:</span>
                <span className="ml-2 font-medium">2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
