import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Folder, Mail, BarChart3, TrendingUp } from "lucide-react"
import { FeaturedArticlesList } from "@/components/featured-articles-list"

const categories = [
  { id: "1", name: "Technology", slug: "technology", count: 45 },
  { id: "2", name: "Science", slug: "science", count: 32 },
  { id: "3", name: "Environment", slug: "environment", count: 28 },
  { id: "4", name: "Economics", slug: "economics", count: 24 },
  { id: "5", name: "Health", slug: "health", count: 19 },
]

export function Sidebar() {
  return (
    <div className="space-y-6">
      {/* Featured Articles */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
          Featured Articles
        </h3>
        <FeaturedArticlesList />
      </div>

      {/* Newsletter */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Mail className="w-5 h-5 text-yellow-500 mr-2" />
          Newsletter
        </h3>
        <p className="text-gray-600 text-sm mb-4">Get the latest news directly to your email</p>
        <form className="space-y-3">
          <Input type="email" placeholder="Your email address" className="w-full" />
          <Button type="submit" className="w-full">
            Subscribe
          </Button>
        </form>
      </div>

      {/* Categories */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Folder className="w-5 h-5 text-blue-500 mr-2" />
          Categories
        </h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-blue-50 transition-colors group"
            >
              <span className="text-sm text-gray-700 group-hover:text-blue-600">{category.name}</span>
              <Badge variant="secondary" className="text-xs">
                {category.count}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 text-green-500 mr-2" />
          Statistics
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Total Articles</span>
            <span className="font-semibold text-gray-800">148</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Categories</span>
            <span className="font-semibold text-blue-600">5</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Total Views</span>
            <span className="font-semibold text-green-600">25.4K</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">This Month</span>
            <span className="font-semibold text-purple-600">3.2K</span>
          </div>
        </div>
      </div>
    </div>
  )
}
