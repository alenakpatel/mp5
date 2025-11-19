"use client";

import { useState } from "react";
import {createNewAlias} from "@/lib/createNewAlias";

export default function Home() {

    const [url, setUrl] = useState("");
    const [alias, setAlias] = useState("");
    const [shortenedUrl, setShortenedUrl] = useState("");
    const [error, setError] = useState("");

    const shortenURL = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setShortenedUrl("");
        let okay = false;

        try {
            if (!url) {
                throw new Error("Please enter a URL");
            }

            try {
                new URL(url);
                okay = true;
            } catch (error) {
                throw new Error("Please enter a valid URL (include http:// or https://)");
                okay = false;
            }

            const regex = /https?:\/\/([^\/]+)\/([^\/]+)\/?/g;
            okay = regex.test(url);

            if (!okay) {
                throw new Error("Invalid URL");
            }

            const result = await createNewAlias(url, alias);
            console.log(result);

            if (result.success) {
                const baseUrl = window.location.origin;
                setShortenedUrl(`${baseUrl}/${result.alias}`);
            } else {
                setError(result.error || "Failed to create short URL");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        }
    };



    return (
        <div className="min-h-screen bg-blue-200 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-1/2">
                <h1 className="text-6xl font-bold text-gray-800 mb-2 text-center">
                    URL Shortener
                </h1>
                <p className="text-gray-600 mb-6 text-center text-4xl p-5">
                    Create short links!
                </p>

                <form onSubmit={shortenURL} className="space-y-4">
                    <div>
                        <label htmlFor="url" className="block text-gray-700 mb-1 text-3xl font-bold">
                            Long URL
                        </label>
                        <input
                            type="text"
                            id="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com/very/long/url"
                            className="text-2xl w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-blue-950"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="alias" className="block text-3xl font-bold text-gray-700 mb-1">
                            Custom Alias
                        </label>
                        <input
                            type="text"
                            id="alias"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                            placeholder="my-custom-link"
                            className="text-2xl w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-blue-950"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="font-bold text-2xl w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:underline"
                    >
                        Shorten URL
                    </button>
                </form>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {shortenedUrl && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                            Your shortened URL:
                        </p>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={shortenedUrl}
                                readOnly
                                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-blue-950"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
