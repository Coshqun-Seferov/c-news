"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import config from "../../../config.js";

export default function Search() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            setError("Please enter a search term.");
            return;
        }
        setError("");
        try {
            const res = await fetch(`${config.api}}`);
            if (!res.ok) {
                throw new Error("Search failed");
            }
            const data = await res.json();
            setResults(data.results);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-center mb-6">Search</h2>
                <form onSubmit={handleSearch} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                        Search
                    </button>
                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}
                </form>
                {results.length > 0 && (
                    <ul className="mt-6 space-y-4">
                        {results.map((result, index) => (
                            <li key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition">
                                {result.title}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}