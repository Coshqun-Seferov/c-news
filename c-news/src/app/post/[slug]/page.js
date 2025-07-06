import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getArticle } from "../../../lib/api.js"
import { Header } from "../../../components/Header.js"
import { HotNews } from "../../../components/HotNews.js"
import { RelatedArticles } from "../../../components/RelatedArticles.js"
import { NewsletterSubscription } from "../../../components/NewsletterSubscription.js"
import { getAuthorName, getAuthorInitials } from "../../../utils/authorUtils.js"

export async function generateMetadata({ params }) {
  const { slug } = await params

  try {
    const post = await getArticle(slug)
    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: post.featured_image ? [post.featured_image] : [],
      },
    }
  } catch {
    return {
      title: "Article Not Found",
    }
  }
}

export default async function PostPage({ params }) {
  const { slug } = await params

  let post
  try {
    post = await getArticle(slug)
  } catch {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link href="/" className="text-blue-600 hover:underline">
              Home
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            {post.category && (
              <>
                <Link href={`/category/${post.category.slug}`} className="text-blue-600 hover:underline">
                  {post.category.name}
                </Link>
                <span className="mx-2 text-gray-400">/</span>
              </>
            )}
            <span className="text-gray-600">Article</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <article className="glass-card p-8 lg:p-12">
                {/* Featured Image */}
                <div className="relative overflow-hidden rounded-2xl mb-8">
                  <Image
                    src={post.featured_image || "/placeholder.svg?height=400&width=800"}
                    alt={post.title}
                    width={800}
                    height={400}
                    priority
                    className="w-full h-64 md:h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                  {/* Category Badge */}
                  {post.category && (
                    <div className="absolute top-4 left-4">
                      <Link href={`/category/${post.category.slug}`}>
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
                          {post.category.name}
                        </span>
                      </Link>
                    </div>
                  )}

                  {/* View Count */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center">
                      👁 {post.view_count || 0} views
                    </span>
                  </div>
                </div>

                {/* Article Header */}
                <header className="mb-8">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                    {post.title}
                  </h1>

                  {/* Article Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{getAuthorInitials(post.author)}</span>
                      </div>
                      <span>by {getAuthorName(post.author)}</span>
                    </div>
                    <span>•</span>
                    <time className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                      {new Date(post.publish_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <span>•</span>
                    <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full">
                      📖 ~{Math.ceil((post.content?.length || 0) / 1000) || 5} min read
                    </span>
                  </div>

                  {/* Article Excerpt */}
                  {post.excerpt && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
                      <div
                        className="text-gray-700 italic text-lg leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: post.excerpt }}
                      />
                    </div>
                  )}
                </header>

                {/* Article Content */}
                <div
                  className="prose prose-lg max-w-none text-gray-800 leading-relaxed prose-headings:text-gray-800 prose-links:text-blue-600 prose-strong:text-gray-800"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags Section */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-gray-600 font-medium">Tags:</span>
                      {post.tags.map((tag) => (
                        <Link
                          key={tag.id}
                          href={`/tag/${tag.slug}`}
                          className="bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 px-3 py-1 rounded-full text-sm transition-colors"
                        >
                          #{tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Article Footer */}
                <footer className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <Link href="/list" className="btn-secondary">
                      ← All Articles
                    </Link>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-600">Share:</span>
                      <div className="flex space-x-2">
                        <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                          <span className="text-sm font-bold">f</span>
                        </button>
                        <button className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors">
                          <span className="text-sm font-bold">t</span>
                        </button>
                        <button className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors">
                          <span className="text-sm font-bold">w</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </footer>
              </article>

              {/* Comments Section Placeholder */}
              <div className="glass-card p-8 mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Comments</h3>
                <div className="text-center py-8 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💬</span>
                  </div>
                  <p>Comments will be available soon</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Hot News */}
              <HotNews excludeSlug={post.slug} limit={5} />

              {/* Related Articles */}
              <RelatedArticles currentSlug={post.slug} limit={4} />

              {/* Newsletter Subscription */}
              <NewsletterSubscription />

              {/* Quick Navigation */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="text-purple-500 mr-2">🧭</span>
                  Quick Navigation
                </h3>
                <div className="space-y-2">
                  <Link href="/list" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    📰 All Articles
                  </Link>
                  <Link href="/search" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    🔍 Search
                  </Link>
                  {post.category && (
                    <Link
                      href={`/category/${post.category.slug}`}
                      className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      📂 {post.category.name}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
