"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import config from "../../../config.js"

export default function Profile() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    profilePicture: null,
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        const res = await fetch(`${config.api}auth/profile/`, {
            method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token")
            localStorage.removeItem("refresh")
            router.push("/login")
            return
          }
          throw new Error("Не удалось загрузить данные пользователя")
        }

        const data = await res.json()
        setUser(data)
        setFormData({
          username: data.username || "",
          email: data.email || "",
          bio: data.bio || "",
          profilePicture: null,
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (error) setError("")
    if (success) setSuccess("")
  }

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (passwordError) setPasswordError("")
    if (passwordSuccess) setPasswordSuccess("")
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("refresh")
    router.push("/login")
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setIsUpdating(true)
    setError("")
    setSuccess("")

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    try {
      let hasUpdates = false

      // 1. Update basic profile info
      const basicUpdateData = {}
      if (formData.username !== user.username && formData.username.trim()) {
        basicUpdateData.username = formData.username.trim()
      }
      if (formData.email !== user.email && formData.email.trim()) {
        basicUpdateData.email = formData.email.trim()
      }
      if (formData.bio !== user.bio) {
        basicUpdateData.bio = formData.bio
      }

      if (Object.keys(basicUpdateData).length > 0) {
        const res = await fetch(`${config.api}auth/profile/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(basicUpdateData),
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.detail || errorData.message || "Не удалось обновить профиль")
        }

        const updatedUser = await res.json()
        setUser(updatedUser)
        hasUpdates = true
      }

      // 2. Update profile picture
      if (formData.profilePicture) {
        const formDataPicture = new FormData()
        formDataPicture.append("profile_picture", formData.profilePicture)

        const res = await fetch(`${config.api}auth/profile/`, {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
          },
          body: formDataPicture,
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.detail || "Не удалось обновить фото профиля")
        }

        const updatedUser = await res.json()
        setUser(updatedUser)
        hasUpdates = true
      }

      if (hasUpdates) {
        setSuccess("Профиль успешно обновлен!")
        setFormData((prev) => ({
          ...prev,
          profilePicture: null,
        }))

        // Clear file input
        const fileInput = document.querySelector('input[type="file"]')
        if (fileInput) fileInput.value = ""
      } else {
        setError("Нет изменений для сохранения")
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setIsChangingPassword(true)
    setPasswordError("")
    setPasswordSuccess("")

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    try {
      if (!passwordData.currentPassword.trim() || !passwordData.newPassword.trim()) {
        throw new Error("Заполните все поля для смены пароля")
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error("Новые пароли не совпадают")
      }

      if (passwordData.newPassword.length < 6) {
        throw new Error("Новый пароль должен содержать минимум 6 символов")
      }

      if (passwordData.currentPassword === passwordData.newPassword) {
        throw new Error("Новый пароль должен отличаться от текущего")
      }

      console.log("🔄 Changing password via API...")

      const res = await fetch(`${config.api}auth/change-password/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          old_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
        }),
      })

      console.log(`📊 Response status: ${res.status}`)

      if (!res.ok) {
        const errorData = await res.json()
        console.log("❌ Error response:", errorData)

        // Обработка конкретных ошибок
        if (errorData.old_password) {
          const oldPassError = Array.isArray(errorData.old_password)
            ? errorData.old_password[0]
            : errorData.old_password
          throw new Error(`Текущий пароль: ${oldPassError}`)
        }

        if (errorData.new_password) {
          const newPassError = Array.isArray(errorData.new_password)
            ? errorData.new_password[0]
            : errorData.new_password
          throw new Error(`Новый пароль: ${newPassError}`)
        }

        if (errorData.detail) {
          throw new Error(errorData.detail)
        }

        if (errorData.message) {
          throw new Error(errorData.message)
        }

        throw new Error("Не удалось изменить пароль")
      }

      console.log("✅ Password changed successfully!")
      setPasswordSuccess("Пароль успешно изменен!")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (err) {
      console.error("💥 Password change error:", err.message)
      setPasswordError(err.message)
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка профиля...</p>
        </div>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <div className="glass-card p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Ошибка загрузки</h3>
          <p className="text-red-500 mb-4">{error}</p>
          <Link href="/login" className="btn-primary">
            Войти заново
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="glass-card border-b border-white/20 mb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                C-News
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/list" className="text-gray-600 hover:text-blue-600 transition-colors">
                Статьи
              </Link>
              <button onClick={handleLogout} className="btn-secondary">
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Profile Header */}
          <div className="glass-card p-8">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative">
                <img
                  src={user?.profile_picture || "/placeholder.svg?height=100&width=100"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>

              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl font-bold text-gray-800">{user?.username}</h1>
                <p className="text-gray-600">{user?.email}</p>
                {user?.bio && <p className="text-gray-600 mt-2 italic bg-gray-50 p-2 rounded-lg">"{user.bio}"</p>}
                <div className="flex items-center justify-center sm:justify-start mt-3 space-x-4 text-sm text-gray-500">
                  <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full">Активен</span>
                  <span>Участник с {new Date().getFullYear()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Update Form */}
          <div className="glass-card p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Редактировать профиль</h2>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Фото профиля</label>
                <div className="flex items-center space-x-4">
                  <img
                    src={user?.profile_picture || "/placeholder.svg?height=60&width=60"}
                    alt="Current profile"
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={(e) => handleInputChange("profilePicture", e.target.files[0])}
                    className="input-field flex-1"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Форматы: JPG, PNG. Максимум 5MB</p>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Имя пользователя</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className="input-field"
                  placeholder="Введите имя пользователя"
                  minLength={3}
                  maxLength={30}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email адрес</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="input-field"
                  placeholder="Введите email"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">О себе</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Расскажите о себе..."
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/500 символов</p>
              </div>

              {/* Messages */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                  <span className="text-red-500 text-lg">⚠</span>
                  <div>
                    <p className="text-red-600 text-sm font-medium">Ошибка</p>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start space-x-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <div>
                    <p className="text-green-600 text-sm font-medium">Успешно</p>
                    <p className="text-green-600 text-sm">{success}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Сохранение...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Сохранить изменения</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Password Change Form */}
          <div className="glass-card p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Изменить пароль</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <span className="text-blue-500 text-lg">💡</span>
                <div>
                  <p className="text-blue-800 text-sm font-medium">Подсказки для смены пароля:</p>
                  <ul className="text-blue-700 text-sm mt-2 space-y-1">
                    <li>• Убедитесь, что вводите текущий пароль правильно</li>
                    <li>• Новый пароль должен содержать минимум 6 символов</li>
                    <li>• Новый пароль должен отличаться от текущего</li>
                    <li>• Если забыли пароль, выйдите и войдите заново</li>
                  </ul>
                </div>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Текущий пароль</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                  className="input-field"
                  placeholder="Введите текущий пароль"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Новый пароль</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                  className="input-field"
                  placeholder="Введите новый пароль"
                  minLength={6}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Минимум 6 символов</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Подтвердите новый пароль</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                  className="input-field"
                  placeholder="Повторите новый пароль"
                  minLength={6}
                  required
                />
              </div>

              {/* Password Messages */}
              {passwordError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                  <span className="text-red-500 text-lg">⚠</span>
                  <div>
                    <p className="text-red-600 text-sm font-medium">Ошибка</p>
                    <p className="text-red-600 text-sm">{passwordError}</p>
                  </div>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start space-x-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <div>
                    <p className="text-green-600 text-sm font-medium">Успешно</p>
                    <p className="text-green-600 text-sm">{passwordSuccess}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isChangingPassword ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Изменение пароля...</span>
                  </>
                ) : (
                  <>
                    <span>🔒</span>
                    <span>Изменить пароль</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
