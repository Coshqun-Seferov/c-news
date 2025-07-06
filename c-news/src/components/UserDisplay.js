"use client"

import { getUserDisplayName, getUserAvatar, getUserRole, isUserVerified } from "../utils/userUtils.js"

/**
 * Safe user display component
 * @param {Object} props
 * @param {Object} props.user - User object
 * @param {string} [props.variant] - Display variant: 'full', 'compact', 'minimal'
 * @param {string} [props.className] - Additional CSS classes
 */
export function UserDisplay({ user, variant = "full", className = "" }) {
  // Early return if no user
  if (!user) {
    return null
  }

  // Debug log
  console.log("UserDisplay rendering user:", user)

  const displayName = getUserDisplayName(user)
  const avatar = getUserAvatar(user)
  const role = getUserRole(user)
  const verified = isUserVerified(user)

  if (variant === "minimal") {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <img src={avatar || "/placeholder.svg"} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
        <span className="text-sm font-medium">{displayName}</span>
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <img
          src={avatar || "/placeholder.svg"}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
        />
        <div>
          <p className="font-medium text-gray-800">{displayName}</p>
          <p className="text-sm text-gray-600">{user.email || ""}</p>
        </div>
      </div>
    )
  }

  // Full variant
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="relative">
        <img
          src={avatar || "/placeholder.svg"}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
        />
        {verified && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        )}
      </div>
      <div>
        <p className="font-medium text-gray-800">{displayName}</p>
        <p className="text-sm text-gray-600">{user.email || ""}</p>
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full mt-1">{role}</span>
      </div>
    </div>
  )
}
