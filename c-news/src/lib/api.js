const API_BASE_URL = "https://admin.ilkin.site/api"

// Generic API call function
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API Error ${response.status}:`, errorText)
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error)
    throw error
  }
}

// Articles API
export async function getArticles(params = {}) {
  const queryParams = new URLSearchParams()

  // Handle different parameter formats
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
      // Для некоторых API может потребоваться другой формат параметров
      if (key === "category") {
        // Пропускаем category параметр, так как API его не поддерживает
        return
      }
      queryParams.append(key, params[key])
    }
  })

  const endpoint = `/articles/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
  return apiCall(endpoint)
}

export async function getFeaturedArticles() {
  try {
    const data = await getArticles()
    // Фильтруем статьи с is_featured: true
    const featuredArticles = (data.results || data || []).filter((article) => article.is_featured === true)
    return featuredArticles
  } catch (error) {
    console.error("Error fetching featured articles:", error)
    return []
  }
}

export async function getHotArticles() {
  try {
    const data = await getArticles()
    // Фильтруем статьи с is_hot: true
    const hotArticles = (data.results || data || []).filter((article) => article.is_hot === true)
    return hotArticles
  } catch (error) {
    console.error("Error fetching hot articles:", error)
    return []
  }
}

export async function getArticleBySlug(slug) {
  return apiCall(`/articles/${slug}/`)
}

// Categories API
export async function getCategories() {
  try {
    const data = await apiCall("/categories/")
    return data.results || data || []
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function getCategoryBySlug(slug) {
  try {
    // Сначала пробуем получить категорию по slug
    const categories = await getCategories()
    const category = categories.find((cat) => cat.slug === slug)

    if (category) {
      return category
    }

    // Если не найдена, возвращаем базовую информацию
    return {
      name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " "),
      slug: slug,
      description: `Articles in ${slug} category`,
    }
  } catch (error) {
    console.error("Error fetching category:", error)
    return {
      name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " "),
      slug: slug,
      description: "",
    }
  }
}

// Site Settings API
export async function getSiteSettings() {
  try {
    const data = await apiCall("/settings/")
    return data
  } catch (error) {
    console.error("Error fetching site settings:", error)
    // Возвращаем дефолтные настройки если API недоступен
    return {
      site_name: "C-News",
      site_description: "Your source for the latest news and interesting articles",
      contact_email: null,
      logo: null,
    }
  }
}

// Tags API
export async function getTags() {
  try {
    const data = await apiCall("/tags/")
    return data.results || data || []
  } catch (error) {
    console.error("Error fetching tags:", error)
    return []
  }
}

// Search API
export async function searchArticles(query, filters = {}) {
  const params = {
    search: query,
    ...filters,
  }
  return getArticles(params)
}

// Comments API (если нужно)
export async function getComments(articleId) {
  try {
    const data = await apiCall(`/articles/${articleId}/comments/`)
    return data.results || data || []
  } catch (error) {
    console.error("Error fetching comments:", error)
    return []
  }
}

export async function postComment(articleId, commentData, token) {
  return apiCall(`/articles/${articleId}/comments/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(commentData),
  })
}

// User API
export async function getUserProfile(token) {
  return apiCall("/user/profile/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function updateUserProfile(profileData, token) {
  return apiCall("/user/profile/", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  })
}

// Auth API
export async function loginUser(credentials) {
  return apiCall("/auth/login/", {
    method: "POST",
    body: JSON.stringify(credentials),
  })
}

export async function registerUser(userData) {
  return apiCall("/auth/register/", {
    method: "POST",
    body: JSON.stringify(userData),
  })
}

export async function refreshToken(refreshToken) {
  return apiCall("/auth/refresh/", {
    method: "POST",
    body: JSON.stringify({ refresh: refreshToken }),
  })
}

// Newsletter API
export async function subscribeNewsletter(email) {
  try {
    return await apiCall("/newsletter/subscribe/", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  } catch (error) {
    console.error("Error subscribing to newsletter:", error)
    throw error
  }
}

// Utility functions
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatRelativeTime(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return "just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`

  return formatDate(dateString)
}

export function truncateText(text, maxLength = 150) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + "..."
}

// Export default object with all functions
export default {
  getArticles,
  getFeaturedArticles,
  getHotArticles,
  getArticleBySlug,
  getCategories,
  getCategoryBySlug,
  getSiteSettings,
  getTags,
  searchArticles,
  getComments,
  postComment,
  getUserProfile,
  updateUserProfile,
  loginUser,
  registerUser,
  refreshToken,
  subscribeNewsletter,
  formatDate,
  formatRelativeTime,
  truncateText,
}
