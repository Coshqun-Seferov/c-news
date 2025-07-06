/**
 * Utility functions for user data handling
 */

/**
 * Get user display name safely
 * @param {Object} user - User object
 * @returns {string} Display name
 */
export function getUserDisplayName(user) {
  if (!user) return ""

  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`
  }

  return user.username || user.email || "User"
}

/**
 * Get user avatar URL safely
 * @param {Object} user - User object
 * @returns {string} Avatar URL
 */
export function getUserAvatar(user) {
  if (!user) return "/placeholder.svg?height=40&width=40"

  return user.profile_picture || "/placeholder.svg?height=40&width=40"
}

/**
 * Get user initials safely
 * @param {Object} user - User object
 * @returns {string} User initials
 */
export function getUserInitials(user) {
  if (!user) return "U"

  if (user.first_name && user.last_name) {
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
  }

  if (user.username) {
    return user.username[0].toUpperCase()
  }

  if (user.email) {
    return user.email[0].toUpperCase()
  }

  return "U"
}

/**
 * Check if user is verified
 * @param {Object} user - User object
 * @returns {boolean} Verification status
 */
export function isUserVerified(user) {
  return user && user.verified === true
}

/**
 * Get user role safely
 * @param {Object} user - User object
 * @returns {string} User role
 */
export function getUserRole(user) {
  return user?.role || "User"
}
