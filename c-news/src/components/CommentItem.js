"use client"
import { useState } from "react"
import { useAuth } from "../contexts/AuthContext.js"
import { CommentForm } from "./CommentForm.js"
import { getUserDisplayName, getUserAvatar } from "../utils/userUtils.js"

/**
 * Comment Item Component
 * @param {Object} props
 * @param {Object} props.comment - Comment object
 * @param {string} props.articleSlug - Article slug
 * @param {function} props.onReplyAdded - Callback when reply is added
 * @param {function} props.onCommentDeleted - Callback when comment is deleted
 * @param {boolean} [props.isReply=false] - Whether this is a reply
 */
export function CommentItem({ comment, articleSlug, onReplyAdded, onCommentDeleted, isReply = false }) {
  const { user, isAuthenticated } = useAuth()
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showReplies, setShowReplies] = useState(true)

  const isOwner = user && comment.user && (user.id === comment.user.id || user.username === comment.user.username)
  const hasReplies = comment.replies && comment.replies.length > 0

  const handleReplyAdded = (newReply) => {
    onReplyAdded(comment.id, newReply)
    setShowReplyForm(false)
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return
    }

    setIsDeleting(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      const response = await fetch(`https://admin.ilkin.site/api/articles/${articleSlug}/comments/${comment.id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete comment")
      }

      onCommentDeleted(comment.id, isReply, comment.parent)
    } catch (err) {
      console.error("Error deleting comment:", err)
      alert("Failed to delete comment. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))
      return diffInMinutes < 1 ? "just now" : `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      })
    }
  }

  return (
    <div className={`${isReply ? "ml-8 border-l-2 border-gray-100 pl-4" : ""}`}>
      <div className="flex space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={getUserAvatar(comment.user) || "/placeholder.svg"}
            alt={`${getUserDisplayName(comment.user)}'s avatar`}
            className="w-10 h-10 rounded-full object-cover"
          />
          {comment.user?.verified && (
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center -mt-2 ml-6">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-medium text-gray-900">{getUserDisplayName(comment.user)}</span>
            {comment.user?.role && comment.user.role !== "user" && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{comment.user.role}</span>
            )}
            <span className="text-gray-500 text-sm">•</span>
            <time className="text-gray-500 text-sm" title={new Date(comment.created_at).toLocaleString()}>
              {formatDate(comment.created_at)}
            </time>
          </div>

          {/* Comment Text */}
          <div className="text-gray-800 mb-3 whitespace-pre-wrap break-words">{comment.content}</div>

          {/* Actions */}
          <div className="flex items-center space-x-4 text-sm">
            {isAuthenticated && !isReply && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                Reply
              </button>
            )}

            {hasReplies && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                {showReplies ? "Hide" : "Show"} {comment.replies.length}{" "}
                {comment.replies.length === 1 ? "reply" : "replies"}
              </button>
            )}

            {isOwner && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <CommentForm
                articleSlug={articleSlug}
                parentId={comment.id}
                onCommentAdded={handleReplyAdded}
                onCancel={() => setShowReplyForm(false)}
              />
            </div>
          )}

          {/* Replies */}
          {hasReplies && showReplies && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  articleSlug={articleSlug}
                  onReplyAdded={onReplyAdded}
                  onCommentDeleted={onCommentDeleted}
                  isReply={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
