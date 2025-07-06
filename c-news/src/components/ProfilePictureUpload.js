"use client"

import { useState, useRef } from "react"
import { uploadProfilePicture } from "../lib/api.js"
import { getUserAvatar } from "../utils/userUtils.js"

/**
 * Profile Picture Upload Component
 * @param {Object} props
 * @param {Object} props.user - User object
 * @param {function} props.onUpdate - Callback when profile picture is updated
 */
export function ProfilePictureUpload({ user, onUpdate }) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB")
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target.result)
    }
    reader.readAsDataURL(file)

    // Upload file
    handleUpload(file)
  }

  const handleUpload = async (file) => {
    setIsUploading(true)
    setUploadError("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      const updatedUser = await uploadProfilePicture(file, token)
      onUpdate(updatedUser)
      setPreviewUrl(null)
    } catch (error) {
      setUploadError(error.message)
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <img
          src={previewUrl || getUserAvatar(user) || "/placeholder.svg"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
        />

        {/* Upload overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <button onClick={triggerFileSelect} disabled={isUploading} className="text-white text-sm font-medium">
            {isUploading ? "Uploading..." : "Change Photo"}
          </button>
        </div>

        {/* Loading spinner */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

      <button onClick={triggerFileSelect} disabled={isUploading} className="btn-secondary text-sm disabled:opacity-50">
        {isUploading ? "Uploading..." : "Upload New Photo"}
      </button>

      {uploadError && <div className="text-red-600 text-sm text-center">{uploadError}</div>}

      <div className="text-xs text-gray-500 text-center">
        <p>JPG, PNG or GIF. Max size 5MB.</p>
      </div>
    </div>
  )
}
