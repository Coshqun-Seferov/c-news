/**
 * Utility functions for author data handling
 */

/**
 * Get author name safely
 * @param {string|Object} author - Author data (string or object)
 * @returns {string} Author name
 */
export function getAuthorName(author) {
  if (!author) return "Unknown Author"

  if (typeof author === "string") {
    return author
  }

  if (typeof author === "object") {
    return author.username || author.name || author.first_name || "Unknown Author"
  }

  return "Unknown Author"
}

/**
 * Get author initials safely
 * @param {string|Object} author - Author data (string or object)
 * @returns {string} Author initials
 */
export function getAuthorInitials(author) {
  const name = getAuthorName(author)

  if (name === "Unknown Author") return "A"

  return name[0].toUpperCase()
}

/**
 * Get author display info
 * @param {string|Object} author - Author data (string or object)
 * @returns {Object} Author display info
 */
export function getAuthorInfo(author) {
  return {
    name: getAuthorName(author),
    initials: getAuthorInitials(author),
    email: typeof author === "object" ? author.email : null,
    avatar: typeof author === "object" ? author.avatar || author.profile_picture : null,
  }
}
