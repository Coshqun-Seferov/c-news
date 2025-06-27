import React from "react";
import config from "../../../../config.js";

async function getPost(slug) {
    const res = await fetch(`${config.api}articles/${slug}/`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Статья не найдена");
    return res.json();
}

export default async function PostPage({ params }) {
    const post = await getPost(params.slug);

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-start">
            <div className="max-w-3xl bg-white p-6 rounded-xl shadow-lg">
                <img
                    src={post.featured_image}
                    alt=""
                    className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
                <p className="text-gray-500 text-sm mb-4">
                    Опубликовано: {new Date(post.publish_date).toLocaleDateString()}
                </p>
                <div
                    className="text-gray-800 leading-relaxed whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </div>
        </div>
    );
}

export async function generateMetadata({ params }) {
    const post = await getPost(params.slug);
    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [post.featured_image],
        },
    };
}