"use client"

import { createContext, useContext, useEffect, useState } from "react"

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} username
 * @property {string} email
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} [bio]
 * @property {string} [profile_picture]
 * @property {string} role
 * @property {boolean} verified
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User|null} user
 * @property {boolean} isLoading
 * @property {boolean} isAuthenticated
 * @property {function(string, string): Promise<void>} login
 * @property {function(): void} logout
 * @property {function(Partial<User>): Promise<void>} updateUser
 */

const AuthContext = createContext(undefined)

/**
 * Authentication context provider
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const res = await fetch("https://admin.ilkin.site/api/auth/profile/", {
            headers: {
              Authorization: `Token ${token}`,
            },
          })
          if (res.ok) {
            const userData = await res.json()
            console.log("User data loaded:", userData)
            setUser(userData)
          } else {
            console.log("Token invalid, removing from storage")
            localStorage.removeItem("token")
            localStorage.removeItem("refresh")
          }
        } catch (error) {
          console.error("Error loading user:", error)
          localStorage.removeItem("token")
          localStorage.removeItem("refresh")
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const parseErrorMessage = (responseData) => {
    // Извлекаем сообщение об ошибке из разных возможных полей
    if (responseData.non_field_errors && Array.isArray(responseData.non_field_errors)) {
      return responseData.non_field_errors[0]
    }
    if (responseData.detail) {
      return responseData.detail
    }
    if (responseData.message) {
      return responseData.message
    }
    if (responseData.error) {
      return responseData.error
    }
    if (responseData.errors) {
      // Если errors это объект с полями
      if (typeof responseData.errors === "object") {
        const firstError = Object.values(responseData.errors)[0]
        if (Array.isArray(firstError)) {
          return firstError[0]
        }
        return firstError
      }
      return responseData.errors
    }
    return null
  }

  const testServerConnection = async () => {
    try {
      console.log("🔍 Testing server connection...")

      // Тестируем базовое подключение к серверу
      const response = await fetch("https://admin.ilkin.site/api/", {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
        },
      })

      console.log("✅ Server connection test:", {
        status: response.status,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
      })

      return { connected: true, status: response.status }
    } catch (error) {
      console.error("❌ Server connection failed:", error)
      return { connected: false, error: error.message }
    }
  }

  const makeRequest = async (url, options, retries = 2) => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt + 1}/${retries + 1} for ${url}`)

        const response = await fetch(url, {
          ...options,
          mode: "cors",
          credentials: "omit", // Убираем credentials для первого теста
          headers: {
            ...options.headers,
            Accept: "application/json",
            "User-Agent": "C-News-App/1.0",
          },
        })

        console.log(`📡 Response from ${url}:`, {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
        })

        return response
      } catch (error) {
        console.error(`❌ Request attempt ${attempt + 1} failed:`, error)

        if (attempt === retries) {
          // Последняя попытка - выбрасываем ошибку с подробностями
          throw new Error(`Network request failed after ${retries + 1} attempts: ${error.message}`)
        }

        // Ждем перед следующей попыткой
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)))
      }
    }
  }

  const login = async (username, password) => {
    console.log("🚀 Starting login process for:", username)

    // Сначала тестируем подключение к серверу
    const connectionTest = await testServerConnection()
    if (!connectionTest.connected) {
      throw new Error(
        `Cannot connect to server: ${connectionTest.error}. Please check your internet connection or try again later.`,
      )
    }

    // Попробуем разные варианты API endpoints и форматы данных
    const loginVariants = [
      // Стандартные варианты
      {
        name: "Standard login with username",
        url: "https://admin.ilkin.site/api/auth/login/",
        body: { username, password },
        headers: { "Content-Type": "application/json" },
      },
      {
        name: "Standard login with email",
        url: "https://admin.ilkin.site/api/auth/login/",
        body: { email: username, password },
        headers: { "Content-Type": "application/json" },
      },
      // Django REST Framework варианты
      {
        name: "DRF Token auth",
        url: "https://admin.ilkin.site/api/auth/token/",
        body: { username, password },
        headers: { "Content-Type": "application/json" },
      },
      {
        name: "Simple token endpoint",
        url: "https://admin.ilkin.site/api/token/",
        body: { username, password },
        headers: { "Content-Type": "application/json" },
      },
      // Dj-rest-auth варианты
      {
        name: "Dj-rest-auth with username",
        url: "https://admin.ilkin.site/api/dj-rest-auth/login/",
        body: { username, password },
        headers: { "Content-Type": "application/json" },
      },
      {
        name: "Dj-rest-auth with email",
        url: "https://admin.ilkin.site/api/dj-rest-auth/login/",
        body: { email: username, password },
        headers: { "Content-Type": "application/json" },
      },
      // Form data варианты
      {
        name: "Form data login",
        url: "https://admin.ilkin.site/api/auth/login/",
        body: new URLSearchParams({ username, password }),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    ]

    let lastError = null
    const detailedErrors = []
    const credentialsErrors = []
    const networkErrors = []

    for (const [index, variant] of loginVariants.entries()) {
      try {
        console.log(`\n🔄 Trying variant ${index + 1}: ${variant.name}`)
        console.log(`📡 URL: ${variant.url}`)
        console.log(`📦 Body:`, variant.body)
        console.log(`📋 Headers:`, variant.headers)

        const requestOptions = {
          method: "POST",
          headers: variant.headers,
          body: variant.headers["Content-Type"] === "application/json" ? JSON.stringify(variant.body) : variant.body,
        }

        const res = await makeRequest(variant.url, requestOptions)

        // Получаем ответ сервера
        const responseText = await res.text()
        console.log(`📄 Response text:`, responseText)

        let responseData = {}
        try {
          responseData = JSON.parse(responseText)
        } catch (e) {
          console.log("⚠️ Response is not JSON:", responseText)
          responseData = { rawText: responseText }
        }

        if (res.ok) {
          console.log("✅ Login successful with variant", index + 1)
          console.log("📊 Response data:", responseData)

          // Ищем токен в разных полях
          const token =
            responseData.token ||
            responseData.access ||
            responseData.access_token ||
            responseData.key ||
            responseData.auth_token

          if (token) {
            localStorage.setItem("token", token)
            console.log("💾 Token saved:", token.substring(0, 10) + "...")

            if (responseData.refresh || responseData.refresh_token) {
              localStorage.setItem("refresh", responseData.refresh || responseData.refresh_token)
            }

            // Пробуем загрузить профиль пользователя
            await loadUserProfile(token)
            return // Успешный логин
          } else {
            console.log("⚠️ No token found in response")
            // Если нет токена, но ответ успешный, возможно это другой тип аутентификации
            if (responseData.user) {
              setUser(responseData.user)
              return
            }
          }
        } else {
          // Сохраняем детальную информацию об ошибке
          const errorMessage = parseErrorMessage(responseData)

          detailedErrors.push({
            variant: index + 1,
            variantName: variant.name,
            url: variant.url,
            status: res.status,
            statusText: res.statusText,
            body: responseData,
            errorMessage,
            rawResponse: responseText,
          })

          console.log(`❌ Variant ${index + 1} failed:`, {
            status: res.status,
            statusText: res.statusText,
            body: responseData,
            errorMessage,
          })

          // Если это ошибка с учетными данными
          if (
            errorMessage &&
            (errorMessage.toLowerCase().includes("unable to log in") ||
              errorMessage.toLowerCase().includes("invalid credentials") ||
              errorMessage.toLowerCase().includes("incorrect username") ||
              errorMessage.toLowerCase().includes("incorrect password"))
          ) {
            credentialsErrors.push({
              variant: index + 1,
              variantName: variant.name,
              url: variant.url,
              message: errorMessage,
            })
          }

          // Сохраняем последнюю ошибку
          lastError = new Error(errorMessage || `HTTP ${res.status}`)
        }
      } catch (error) {
        console.error(`💥 Network error with variant ${index + 1}:`, error)

        networkErrors.push({
          variant: index + 1,
          variantName: variant.name,
          url: variant.url,
          error: error.message,
          type: error.name,
        })

        detailedErrors.push({
          variant: index + 1,
          variantName: variant.name,
          url: variant.url,
          error: error.message,
          type: "NetworkError",
        })

        lastError = error
      }
    }

    // Логируем все попытки для отладки
    console.log("\n📊 Login attempt summary:")
    console.table(detailedErrors)

    // Анализируем ошибки и даём более понятное сообщение
    if (networkErrors.length === loginVariants.length) {
      console.log("🌐 All requests failed with network errors:", networkErrors)
      throw new Error("Cannot connect to the server. Please check your internet connection and try again.")
    }

    if (credentialsErrors.length > 0) {
      console.log("🔐 Credentials errors found:", credentialsErrors)
      throw new Error("Invalid username or password. Please check your credentials and try again.")
    }

    // Проверяем другие типы ошибок
    const has400Errors = detailedErrors.some((e) => e.status === 400)
    const has401Errors = detailedErrors.some((e) => e.status === 401)
    const has404Errors = detailedErrors.some((e) => e.status === 404)
    const has405Errors = detailedErrors.some((e) => e.status === 405)

    if (has401Errors) {
      throw new Error("Authentication failed. Please check your username and password.")
    } else if (has400Errors) {
      const error400 = detailedErrors.find((e) => e.status === 400)
      const errorMsg = error400.errorMessage || "Bad request"
      throw new Error(`Request error: ${errorMsg}`)
    } else if (has404Errors) {
      throw new Error("Login service not found. Please contact support.")
    } else if (has405Errors) {
      throw new Error("Login method not supported. Please contact support.")
    } else {
      throw lastError || new Error("Login failed - no working endpoints found")
    }
  }

  const loadUserProfile = async (token) => {
    const profileEndpoints = [
      "https://admin.ilkin.site/api/auth/profile/",
      "https://admin.ilkin.site/api/auth/user/",
      "https://admin.ilkin.site/api/user/",
      "https://admin.ilkin.site/api/users/me/",
      "https://admin.ilkin.site/api/profile/",
    ]

    for (const endpoint of profileEndpoints) {
      try {
        console.log(`👤 Trying to load profile from: ${endpoint}`)

        const res = await makeRequest(endpoint, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        console.log(`👤 Profile response status: ${res.status}`)

        if (res.ok) {
          const userData = await res.json()
          console.log("✅ User profile loaded:", userData)
          setUser(userData)
          return
        }
      } catch (error) {
        console.error(`❌ Error loading profile from ${endpoint}:`, error)
      }
    }

    console.log("⚠️ Could not load user profile, but login was successful")
    // Устанавливаем минимальные данные пользователя
    setUser({ username: "User", email: "", authenticated: true })
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("refresh")
    setUser(null)
  }

  const updateUser = async (userData) => {
    const token = localStorage.getItem("token")
    if (!token) throw new Error("Not authenticated")

    const res = await fetch("https://admin.ilkin.site/api/auth/profile/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(userData),
    })

    if (!res.ok) {
      throw new Error("Failed to update profile")
    }

    const updatedUser = await res.json()
    console.log("User data after update:", updatedUser)
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to use authentication context
 * @returns {AuthContextType}
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
