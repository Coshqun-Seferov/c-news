const API_BASE = "https://admin.ilkin.site/api"

/**
 * @typedef {Object} Article
 * @property {string} id
 * @property {string} title
 * @property {string} slug
 * @property {string} excerpt
 * @property {string} content
 * @property {string} featured_image
 * @property {string} publish_date
 * @property {Object} category
 * @property {Array} tags
 * @property {string} author
 * @property {number} view_count
 */

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string} description
 * @property {string} featured_image
 */

/**
 * @typedef {Object} Tag
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 */

// Server-side API functions
/**
 * Get list of articles
 * @param {string} [search] - search query
 * @returns {Promise<Article[]>}
 */
export async function getArticles(search) {
  const url = search ? `${API_BASE}/articles/?search=${encodeURIComponent(search)}` : `${API_BASE}/articles/`

  const res = await fetch(url, {
    next: { revalidate: 300 }, // Revalidate every 5 minutes
  })

  if (!res.ok) {
    throw new Error("Failed to fetch articles")
  }

  const data = await res.json()
  return data.results || []
}

/**
 * Get featured articles
 * @returns {Promise<Article[]>}
 */
export async function getFeaturedArticles() {
  try {
    const res = await fetch(`${API_BASE}/articles/featured/`, {
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      // Fallback to regular articles if featured not available
      return getArticles()
    }

    const data = await res.json()
    return data.results || data || []
  } catch (error) {
    // Fallback to regular articles
    return getArticles()
  }
}

/**
 * Get hot articles
 * @returns {Promise<Article[]>}
 */
export async function getHotArticles() {
  try {
    const res = await fetch(`${API_BASE}/articles/hot/`, {
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      // Fallback to regular articles sorted by view_count
      const articles = await getArticles()
      return articles.sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    }

    const data = await res.json()
    return data.results || data || []
  } catch (error) {
    // Fallback to regular articles sorted by view_count
    const articles = await getArticles()
    return articles.sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
  }
}

/**
 * Get article by slug
 * @param {string} slug
 * @returns {Promise<Article>}
 */
export async function getArticle(slug) {
  const res = await fetch(`${API_BASE}/articles/${slug}/`, {
    next: { revalidate: 300 },
  })

  if (!res.ok) {
    throw new Error("Article not found")
  }

  return res.json()
}

/**
 * Get articles by category
 * @param {string} slug
 * @returns {Promise<Article[]>}
 */
export async function getCategoryArticles(slug) {
  const res = await fetch(`${API_BASE}/articles/?category=${slug}`, {
    next: { revalidate: 300 },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch category articles")
  }

  const data = await res.json()
  return data.results || []
}

/**
 * Get list of categories
 * @returns {Promise<Category[]>}
 */
export async function getCategories() {
  const res = await fetch(`${API_BASE}/categories/`, {
    cache: "force-cache",
    next: { revalidate: 3600 }, // Revalidate every hour
  })

  if (!res.ok) {
    throw new Error("Failed to fetch categories")
  }

  const data = await res.json()
  return data.results || data
}

/**
 * Get list of tags
 * @returns {Promise<Tag[]>}
 */
export async function getTags() {
  const res = await fetch(`${API_BASE}/tags/`, {
    cache: "force-cache",
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch tags")
  }

  const data = await res.json()
  return data.results || data
}

/**
 * Get site settings
 * @returns {Promise<Object>}
 */
export async function getSiteSettings() {
  const res = await fetch(`${API_BASE}/settings/`, {
    cache: "force-cache",
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch site settings")
  }

  return res.json()
}

// Client-side API functions for authenticated requests
/**
 * Subscribe to newsletter
 * @param {string} email
 * @returns {Promise<Object>}
 */
export async function subscribeNewsletter(email) {
  const res = await fetch(`${API_BASE}/newsletter/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "Failed to subscribe")
  }

  return res.json()
}

/**
 * Upload profile picture
 * @param {File} file
 * @param {string} token
 * @returns {Promise<Object>}
 */
export async function uploadProfilePicture(file, token) {
  const formData = new FormData()
  formData.append("profile_picture", file)

  const res = await fetch(`${API_BASE}/auth/profile/`, {
    method: "PATCH",
    headers: {
      Authorization: `Token ${token}`,
    },
    body: formData,
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "Failed to upload profile picture")
  }

  return res.json()
}

/**
 * Change password - исправлено под ваш API формат
 * @param {string} currentPassword
 * @param {string} newPassword
 * @param {string} token
 * @returns {Promise<Object>}
 */
export async function changePassword(currentPassword, newPassword, token) {
  console.log("🔄 Changing password...")

  const res = await fetch("https://admin.ilkin.site/api/auth/change-password/", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({
      old_password: currentPassword,
      new_password: newPassword,
    }),
  })

  console.log(`📊 Response status: ${res.status}`)

  if (!res.ok) {
    const errorData = await res.json()
    console.log("❌ Error response:", errorData)

    // Обработка конкретных ошибок как в вашем коде
    if (errorData.old_password) {
      const oldPassError = Array.isArray(errorData.old_password) ? errorData.old_password[0] : errorData.old_password
      throw new Error(`Current password: ${oldPassError}`)
    }

    if (errorData.new_password) {
      const newPassError = Array.isArray(errorData.new_password) ? errorData.new_password[0] : errorData.new_password
      throw new Error(`New password: ${newPassError}`)
    }

    if (errorData.detail) {
      throw new Error(errorData.detail)
    }

    if (errorData.message) {
      throw new Error(errorData.message)
    }

    throw new Error("Failed to change password")
  }

  console.log("✅ Password changed successfully!")
  return res.json().catch(() => ({ success: true }))
}

/**
 * Request password reset
 * @param {string} email
 * @returns {Promise<Object>}
 */
export async function requestPasswordReset(email) {
  console.log("🔄 Requesting password reset for:", email)

  const res = await fetch(`${API_BASE}/auth/password-reset/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  })

  console.log(`📊 Password reset request status: ${res.status}`)

  if (!res.ok) {
    const errorData = await res.json()
    console.log("❌ Password reset request error:", errorData)

    if (errorData.email) {
      const emailError = Array.isArray(errorData.email) ? errorData.email[0] : errorData.email
      throw new Error(`Email: ${emailError}`)
    }

    if (errorData.detail) {
      throw new Error(errorData.detail)
    }

    if (errorData.message) {
      throw new Error(errorData.message)
    }

    throw new Error("Failed to request password reset")
  }

  const data = await res.json()
  console.log("✅ Password reset request successful:", data)
  return data
}

/**
 * Reset password with token
 * @param {string} uidb64
 * @param {string} token
 * @param {string} newPassword
 * @returns {Promise<Object>}
 */
export async function resetPassword(uidb64, token, newPassword) {
  console.log("🔄 Resetting password with token...")

  const res = await fetch(`${API_BASE}/auth/reset-password/${uidb64}/${token}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uidb64, token, new_password: newPassword }),
  })

  console.log(`📊 Password reset status: ${res.status}`)

  if (!res.ok) {
    const errorData = await res.json()
    console.log("❌ Password reset error:", errorData)

    if (errorData.new_password) {
      const passwordError = Array.isArray(errorData.new_password) ? errorData.new_password[0] : errorData.new_password
      throw new Error(`New password: ${passwordError}`)
    }

    if (errorData.detail) {
      throw new Error(errorData.detail)
    }

    if (errorData.message) {
      throw new Error(errorData.message)
    }

    if (errorData.error) {
      throw new Error(errorData.error)
    }

    throw new Error("Failed to reset password")
  }

  const data = await res.json()
  console.log("✅ Password reset successful:", data)
  return data
}

/**
 * Test login with credentials
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Object>}
 */
export async function testLogin(username, password) {
  console.log("🔍 Testing login credentials...")

  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })

  const data = await res.json()
  const token = data.token || data.access || data.key

  return {
    success: res.ok,
    status: res.status,
    hasToken: !!token,
    token: token,
    response: data,
  }
}

/**
 * Get user bookmarks (requires authentication)
 * @param {string} token
 * @returns {Promise<Article[]>}
 */
export async function getBookmarks(token) {
  const res = await fetch(`${API_BASE}/bookmarks/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch bookmarks")
  }

  const data = await res.json()
  return data.results || data
}

/**
 * Add bookmark (requires authentication)
 * @param {string} articleId
 * @param {string} token
 * @returns {Promise<Object>}
 */
export async function addBookmark(articleId, token) {
  const res = await fetch(`${API_BASE}/bookmarks/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ article: articleId }),
  })

  if (!res.ok) {
    throw new Error("Failed to add bookmark")
  }

  return res.json()
}

/**
 * Remove bookmark (requires authentication)
 * @param {string} articleId
 * @param {string} token
 * @returns {Promise<void>}
 */
export async function removeBookmark(articleId, token) {
  const res = await fetch(`${API_BASE}/bookmarks/${articleId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error("Failed to remove bookmark")
  }
}
