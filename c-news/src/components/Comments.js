"use client"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext.js"
import { CommentForm } from "./CommentForm.js"
import { CommentItem } from "./CommentItem.js"

/**
 * Comments Component
 * @param {Object} props
 * @param {string} props.articleSlug - Article slug for API calls
 */
export function Comments({ articleSlug }) {
  const { isAuthenticated } = useAuth()
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [totalComments, setTotalComments] = useState(0)

  useEffect(() => {
    fetchComments()
  }, [articleSlug])

  const fetchComments = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`https://admin.ilkin.site/api/articles/${articleSlug}/comments/`)

      if (!response.ok) {
        throw new Error("Failed to load comments")
      }

      const data = await response.json()
      const commentsData = data.results || data || []
      setComments(commentsData)
      setTotalComments(commentsData.length)
      setError("")
    } catch (err) {
      console.error("Error fetching comments:", err)
      setError("Failed to load comments")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [newComment, ...prev])
    setTotalComments((prev) => prev + 1)
  }

  const handleReplyAdded = (parentId, newReply) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          }
        }
        return comment
      }),
    )
    setTotalComments((prev) => prev + 1)
  }

  const handleCommentDeleted = (commentId, isReply = false, parentId = null) => {
    if (isReply && parentId) {
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: comment.replies.filter((reply) => reply.id !== commentId),
            }
          }
          return comment
        }),
      )
    } else {
      setComments((prev) => prev.filter((comment) => comment.id !== commentId))
    }
    setTotalComments((prev) => prev - 1)
  }

  if (isLoading) {
    return (
      <div className="glass-card p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Comments</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-3 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <span className="text-blue-500 mr-2">💬</span>
          Comments ({totalComments})
        </h3>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-sm">{error}</p>
          <button onClick={fetchComments} className="mt-2 text-red-600 hover:text-red-800 text-sm underline">
            Try again
          </button>
        </div>
      )}

      {/* Comment Form */}
      {isAuthenticated ? (
        <div className="mb-8">
          <CommentForm articleSlug={articleSlug} onCommentAdded={handleCommentAdded} />
        </div>
      ) : (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
          <p className="text-blue-700 mb-3">Please sign in to leave a comment</p>
          <div className="space-x-3">
            <a href="/login" className="btn-primary text-sm">
              Sign In
            </a>
            <a href="/register" className="btn-secondary text-sm">
              Sign Up
            </a>
          </div>
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              articleSlug={articleSlug}
              onReplyAdded={handleReplyAdded}
              onCommentDeleted={handleCommentDeleted}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">💬</span>
          </div>
          <h4 className="text-lg font-medium text-gray-800 mb-2">No comments yet</h4>
          <p className="text-gray-600">Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  )
}
