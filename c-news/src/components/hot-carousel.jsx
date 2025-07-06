"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"

// Mock data as fallback
const mockHotArticles = [
  {
    id: "1",
    title: "Breaking: Revolutionary AI Breakthrough Changes Everything",
    excerpt: "Scientists announce a groundbreaking AI discovery that could reshape technology as we know it.",
    featured_image: "/placeholder.svg?height=400&width=800",
    publish_date: "2024-01-15T10:00:00Z",
    category: { id: "1", name: "Technology", slug: "technology" },
    author: "Dr. Sarah Johnson",
    view_count: 15420,
    slug: "ai-breakthrough-changes-everything",
  },
  {
    id: "2",
    title: "Global Markets React to Unprecedented Economic Shift",
    excerpt: "World financial markets experience dramatic changes following major policy announcements.",
    featured_image: "/placeholder.svg?height=400&width=800",
    publish_date: "2024-01-15T08:30:00Z",
    category: { id: "2", name: "Economics", slug: "economics" },
    author: "Mike Chen",
    view_count: 12800,
    slug: "global-markets-economic-shift",
  },
  {
    id: "3",
    title: "Climate Emergency: New Data Reveals Shocking Trends",
    excerpt: "Latest climate research unveils alarming patterns that demand immediate global attention.",
    featured_image: "/placeholder.svg?height=400&width=800",
    publish_date: "2024-01-14T16:45:00Z",
    category: { id: "3", name: "Environment", slug: "environment" },
    author: "Emma Rodriguez",
    view_count: 9600,
    slug: "climate-emergency-shocking-trends",
  },
]

export function HotCarousel() {
  const [articles, setArticles] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const intervalRef = useRef(null)

  useEffect(() => {
    fetchHotArticles()
  }, [])

  useEffect(() => {
    if (isAutoPlaying && articles.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % articles.length)
      }, 4000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying, articles.length])

  const fetchHotArticles = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("https://admin.ilkin.site/api/articles/hot/")

      if (!response.ok) {
        if (response.status === 404) {
          // Fallback to regular articles if hot endpoint doesn't exist
          const fallbackResponse = await fetch("https://admin.ilkin.site/api/articles/?limit=5")
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json()
            setArticles(fallbackData.results || fallbackData || [])
          } else {
            throw new Error("No hot articles available")
          }
        } else {
          throw new Error("Failed to load hot articles")
        }
      } else {
        const data = await response.json()
        setArticles(data.results || data || [])
      }
      setError("")
    } catch (err) {
      console.error("Error fetching hot articles:", err)
      setError("Failed to load hot articles")
      // Use mock data as fallback
      setArticles(mockHotArticles)
    } finally {
      setIsLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <span className="text-red-500 mr-2">🔥</span>
            Hot News
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mx-auto" />
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="glass-card p-8 animate-pulse">
            <div className="bg-gray-200 h-64 rounded-xl mb-4"></div>
            <div className="bg-gray-200 h-6 rounded mb-2"></div>
            <div className="bg-gray-200 h-4 rounded w-3/4"></div>
          </div>
        </div>
      </section>
    )
  }

  if (error && articles.length === 0) {
    return null // Don't show anything if there's an error and no fallback data
  }

  if (articles.length === 0) {
    return null
  }

  const currentArticle = articles[currentIndex]

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
          <span className="text-red-500 mr-2">🔥</span>
          Hot News
        </h2>
        <p className="text-lg text-gray-600 mb-4">Trending stories everyone's talking about</p>
        <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mx-auto" />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="glass-card p-6 lg:p-8">
          <div className="relative">
            {/* Main Carousel */}
            <div className="relative overflow-hidden rounded-2xl mb-6">
              <Link href={`/article/${currentArticle.slug}`} className="block group">
                <div className="relative">
                  <Image
                    src={currentArticle.featured_image || "/placeholder.svg?height=400&width=800"}
                    alt={currentArticle.title}
                    width={800}
                    height={400}
                    className="w-full h-64 md:h-80 lg:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                  {/* Hot Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <span className="mr-1">🔥</span>
                      HOT
                    </span>
                  </div>

                  {/* Category Badge */}
                  {currentArticle.category && (
                    <div className="absolute top-4 left-20">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {currentArticle.category.name}
                      </span>
                    </div>
                  )}

                  {/* View Count */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center">
                      <span className="mr-1">👁</span>
                      {currentArticle.view_count || 0}
                    </span>
                  </div>

                  {/* Auto-play Control */}
                  <div className="absolute top-4 right-20">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toggleAutoPlay()
                      }}
                      className="w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      {isAutoPlaying ? "⏸️" : "▶️"}
                    </button>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                    <h3 className="text-white font-bold text-xl md:text-2xl lg:text-3xl mb-3 line-clamp-2 group-hover:text-yellow-300 transition-colors">
                      {currentArticle.title}
                    </h3>
                    <p className="text-white/90 text-sm md:text-base mb-4 line-clamp-2">{currentArticle.excerpt}</p>
                    <div className="flex items-center justify-between text-white/80 text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <span className="mr-1">📅</span>
                          <span>
                            {new Date(currentArticle.publish_date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <span>by {currentArticle.author}</span>
                      </div>
                      <span className="text-yellow-300 font-medium flex items-center">Read more →</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Navigation Arrows */}
            {articles.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full z-10 flex items-center justify-center transition-colors text-xl"
                >
                  ←
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full z-10 flex items-center justify-center transition-colors text-xl"
                >
                  →
                </button>
              </>
            )}

            {/* Slide Indicators */}
            {articles.length > 1 && (
              <div className="flex justify-center space-x-2 mb-4">
                {articles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex ? "bg-red-500 w-8" : "bg-gray-300 hover:bg-gray-400 w-2"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Thumbnail Navigation */}
            {articles.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {articles.map((article, index) => (
                  <button
                    key={article.id}
                    onClick={() => goToSlide(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === currentIndex
                        ? "border-red-500 ring-2 ring-red-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={article.featured_image || "/placeholder.svg?height=64&width=80"}
                      alt={article.title}
                      width={80}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
