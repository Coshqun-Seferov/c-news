"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"

export function FeaturedCarousel() {
  const [articles, setArticles] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const intervalRef = useRef(null)

  useEffect(() => {
    fetchFeaturedArticles()
  }, [])

  useEffect(() => {
    if (isAutoPlaying && articles.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % articles.length)
      }, 5000)
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

  const fetchFeaturedArticles = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("https://admin.ilkin.site/api/articles/")

      if (!response.ok) {
        throw new Error("Failed to load featured articles")
      }

      const data = await response.json()
      // Фильтруем только статьи с is_featured: true
      const featuredArticles = (data.results || data || []).filter((article) => article.is_featured === true)
      setArticles(featuredArticles)
      setError("")
    } catch (err) {
      console.error("Error fetching featured articles:", err)
      setError("Failed to load featured articles")
      setArticles([])
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
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="text-blue-500 mr-2">⭐</span>
            Featured
          </h3>
        </div>
        <div className="animate-pulse">
          <div className="bg-gray-200 h-32 rounded-xl mb-4"></div>
          <div className="bg-gray-200 h-4 rounded mb-2"></div>
          <div className="bg-gray-200 h-3 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (error || articles.length === 0) {
    return null // Не показываем виджет если нет рекомендуемых статей
  }

  const currentArticle = articles[currentIndex]

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="text-blue-500 mr-2">⭐</span>
          Featured
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleAutoPlay}
            className="w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors"
            title={isAutoPlaying ? "Pause autoplay" : "Start autoplay"}
          >
            {isAutoPlaying ? "⏸️" : "▶️"}
          </button>
        </div>
      </div>

      <div className="relative flex-1 flex flex-col">
        {/* Main Carousel */}
        <div className="relative overflow-hidden rounded-xl mb-4 flex-shrink-0">
          <Link href={`/article/${currentArticle.slug}`} className="block group">
            <div className="relative">
              <Image
                src={currentArticle.featured_image || "/placeholder.svg?height=150&width=300"}
                alt={currentArticle.title}
                width={300}
                height={150}
                className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Featured Badge */}
              <div className="absolute top-2 left-2">
                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <span className="mr-1">⭐</span>
                  FEATURED
                </span>
              </div>

              {/* Category Badge */}
              {currentArticle.category && (
                <div className="absolute top-2 right-2">
                  <span className="bg-gray-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {currentArticle.category.name}
                  </span>
                </div>
              )}

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h4 className="text-white font-semibold text-sm mb-1 line-clamp-2 group-hover:text-yellow-300 transition-colors">
                  {currentArticle.title}
                </h4>
                <div className="flex items-center justify-between text-white/80 text-xs">
                  <div className="flex items-center space-x-2">
                    <span>👁 {currentArticle.view_count || 0}</span>
                    <span>
                      📅{" "}
                      {new Date(currentArticle.publish_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <span className="text-yellow-300 font-medium">→</span>
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
              className="absolute left-2 top-12 w-6 h-6 bg-black/30 hover:bg-black/50 text-white rounded-full z-10 flex items-center justify-center transition-colors text-sm"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-12 w-6 h-6 bg-black/30 hover:bg-black/50 text-white rounded-full z-10 flex items-center justify-center transition-colors text-sm"
            >
              →
            </button>
          </>
        )}

        {/* Slide Indicators */}
        {articles.length > 1 && (
          <div className="flex justify-center space-x-1 mb-3">
            {articles.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-blue-500 w-6" : "bg-gray-300 hover:bg-gray-400 w-1.5"
                }`}
              />
            ))}
          </div>
        )}

        {/* Article Preview */}
        <div className="space-y-2">
          <p
            className="text-gray-600 text-xs line-clamp-2"
            dangerouslySetInnerHTML={{ __html: currentArticle.excerpt }}
          />

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>by {currentArticle.author}</span>
            <div className="flex items-center space-x-1">
              <span>{currentIndex + 1}</span>
              <span>/</span>
              <span>{articles.length}</span>
            </div>
          </div>
        </div>

        {/* Thumbnail Navigation */}
        {articles.length > 1 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex space-x-1 overflow-x-auto pb-1">
              {articles.map((article, index) => (
                <button
                  key={article.id}
                  onClick={() => goToSlide(index)}
                  className={`flex-shrink-0 w-12 h-8 rounded overflow-hidden border transition-all duration-200 ${
                    index === currentIndex
                      ? "border-blue-500 ring-1 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={article.featured_image || "/placeholder.svg?height=32&width=48"}
                    alt={article.title}
                    width={48}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* View All Button */}
      <div className="mt-auto pt-3 border-t border-gray-200">
        <Link
          href="/list?filter=featured"
          className="block w-full text-center text-xs text-gray-600 hover:text-blue-600 transition-colors"
        >
          View All Featured →
        </Link>
      </div>
    </div>
  )
}
