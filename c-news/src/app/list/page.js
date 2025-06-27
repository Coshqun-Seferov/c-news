"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import config from "../../../config.js";


export default function List() {
    const router = useRouter();
    const [articles, setArticles] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await fetch(`${config.api}articles/`);
                if (!res.ok) throw new Error("Ошибка загрузки статей");
                const data = await res.json();
                setArticles(data.results);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchArticles();
    }, []);

    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (isLoading) return <div className="text-center text-gray-500">Загрузка статей...</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-center mb-6">Список статей</h2>
                <ul className="space-y-4">
                    {articles.map((article) => (
                        <li
                            key={article.id}
                            onClick={() => router.push(`/post/${article.slug}`)}
                            className="cursor-pointer p-4 border rounded-lg hover:bg-gray-50 transition"
                        >
                            <img
                                src={article.featured_image}
                                alt=""
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-xl font-semibold">{article.title}</h3>
                            <p
                                className="text-gray-600"
                                dangerouslySetInnerHTML={{ __html: article.excerpt }}
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Опубликовано: {new Date(article.publish_date).toLocaleDateString()}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

