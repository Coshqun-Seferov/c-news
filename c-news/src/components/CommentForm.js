"use client"
import { useState } from "react"
import { useAuth } from "../contexts/AuthContext.js"
import { getUserDisplayName, getUserAvatar } from "../utils/userUtils.js"

/**
 * Comment Form Component
 * @param {Object} props
 * @param {string} props.articleSlug - Article slug
 * @param {function} props.onCommentAdded - Callback when comment is added
 * @param {number} [props.parentId] - Parent comment ID for replies
 * @param {function} [props.onCancel] - Cancel callback for reply forms
 */
export function CommentForm({ articleSlug, onCommentAdded, parentId, onCancel }) {
  const { user } = useAuth()
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!content.trim()) {
      setError("Please enter a comment")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      const url = parentId
        ? `https://admin.ilkin.site/api/articles/${articleSlug}/comments/${parentId}/replies/`
        : `https://admin.ilkin.site/api/articles/${articleSlug}/comments/`

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
          ...(parentId && { parent: parentId }),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || errorData.message || "Failed to post comment")
      }

      const newComment = await response.json()
      onCommentAdded(newComment)
      setContent("")

      if (onCancel) {
        onCancel() // Close reply form
      }
    } catch (err) {
      console.error("Error posting comment:", err)
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setContent("")
    setError("")
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* User Info */}
      <div className="flex items-center space-x-3 mb-4">
        <img
          src={getUserAvatar(user) || "/placeholder.svg"}
          alt="Your avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="text-sm font-medium text-gray-700">{getUserDisplayName(user)}</span>
      </div>

      {/* Comment Input */}
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={parentId ? "Write a reply..." : "Share your thoughts..."}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={parentId ? 3 : 4}
          maxLength={1000}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">{content.length}/1000 characters</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3">
        {onCancel && (
          <button type="button" onClick={handleCancel} className="btn-secondary text-sm" disabled={isSubmitting}>
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {parentId ? "Replying..." : "Posting..."}
            </div>
          ) : parentId ? (
            "Reply"
          ) : (
            "Post Comment"
          )}
        </button>
      </div>
    </form>
  )
}
