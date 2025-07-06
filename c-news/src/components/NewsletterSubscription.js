"use client"

import { useState } from "react"
import { subscribeNewsletter } from "../lib/api.js"

export function NewsletterSubscription() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)
    setMessage("")

    try {
      await subscribeNewsletter(email)
      setMessage("Successfully subscribed to newsletter!")
      setIsSuccess(true)
      setEmail("")
    } catch (error) {
      setMessage(error.message || "Failed to subscribe")
      setIsSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <span className="text-yellow-500 mr-2">📧</span>
        Newsletter
      </h3>
      <p className="text-gray-600 text-sm mb-4">Get the latest news directly to your email</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button type="submit" disabled={isLoading} className="w-full btn-primary text-sm py-2 disabled:opacity-50">
          {isLoading ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {message && (
        <div
          className={`mt-3 p-2 rounded text-sm ${isSuccess ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
        >
          {message}
        </div>
      )}
    </div>
  )
}
