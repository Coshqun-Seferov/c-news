import Link from "next/link"
import config from "../../../../config.js"

async function getPost(slug) {
  const res = await fetch(`${config.api}articles/${slug}/`, {
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Статья не найдена")
  return res.json()
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await getPost(slug)

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featured_image],
    },
  }
}

export default async function PostPage({ params }) {
  const { slug } = await params
  const post = await getPost(slug)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="glass-card border-b border-white/20 mb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center space-x-2 w-fit">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              C-News
            </span>
          </Link>
        </div>
      </header>

      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link href="/" className="text-blue-600 hover:underline">
              Главная
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600">Статья</span>
          </nav>

          <div className="glass-card p-8 lg:p-12">
            {/* Featured Image */}
            <div className="relative overflow-hidden rounded-2xl mb-8">
              <img
                src={post.featured_image || "/placeholder.svg?height=400&width=800"}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                  <span>Автор</span>
                </div>
                <span>•</span>
                <time className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                  {new Date(post.publish_date).toLocaleDateString("ru-RU", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            </header>

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Article Footer */}
            <footer className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link href="/list" className="btn-secondary">
                  ← Все статьи
                </Link>

                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">Поделиться:</span>
                  <div className="flex space-x-2">
                    <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                      <span className="text-sm font-bold">f</span>
                    </button>
                    <button className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors">
                      <span className="text-sm font-bold">t</span>
                    </button>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </div>
  )
}
