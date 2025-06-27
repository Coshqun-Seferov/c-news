import React from "react";
import config from "../../../../config.js";

async function getCategoryArticles(slug) {
    const res = await fetch(`${config.api}categories/articles/?search=${slug}`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Не удалось загрузить статьи категории");
    const data = await res.json();
    return data.results;
}

export default async function CategoryPage({ params }) {
    const articles = await getCategoryArticles(params.slug);

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-start">
            <div className="max-w-3xl w-full bg-white rounded-xl p-6 shadow-lg">
                <h1 className="text-2xl font-bold mb-4">Категория: {params.slug}</h1>
                <ul className="space-y-6">
                    {articles.map(article => (
                        <li key={article.id} className="border p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                            <a href={`/post/${article.slug}`}>
                                <img
                                    src={article.featured_image}
                                    alt={article.title}
                                    className="w-full h-48 object-cover rounded mb-4"
                                />
                                <h2 className="text-xl font-semibold">{article.title}</h2>
                                <div
                                    className="text-gray-600 mt-2"
                                    dangerouslySetInnerHTML={{ __html: article.excerpt }}
                                />
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
