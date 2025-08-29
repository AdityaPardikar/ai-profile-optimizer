'use client';

import { useState } from 'react';

export default function Home() {
  // All useState hooks MUST be inside the component function
  const [headline, setHeadline] = useState('');
  const [about, setAbout] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ headline, about }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received response from API:', data);
      setResult(data);

    } catch (error) {
      console.error("Failed to fetch AI response:", error);
      alert("An error occurred. Please check the console and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 bg-gray-900 text-white">
      <h1 className="text-2xl md:text-4xl font-bold mb-8 text-center">AI Career Profile Optimizer</h1>
      <p className="mb-10 text-base md:text-lg text-gray-400 text-center max-w-2xl">
        Paste your current LinkedIn "About" section and headline to get an optimized version.
      </p>

      <form className="w-full max-w-2xl" onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="headline" className="block mb-2 text-sm font-medium text-gray-300">
            Current Headline
          </label>
          <input
            type="text"
            id="headline"
            className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="e.g., Software Engineer at Google"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="about_section" className="block mb-2 text-sm font-medium text-gray-300">
            Current "About" Section
          </label>
          <textarea
            id="about_section"
            rows={10}
            className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Paste your 'About' section here..."
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          ></textarea>
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Optimize My Profile
        </button>
      </form>

      {/* Loading Indicator */}
      {loading && (
        <div className="mt-10 text-center">
          <p className="text-lg animate-pulse">Optimizing your profile with AI... ✨</p>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="mt-10 w-full max-w-2xl p-6 bg-gray-800 rounded-lg border border-gray-700 animate-fade-in">
          <h2 className="text-2xl font-bold mb-4 text-white">Your Optimized Profile:</h2>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-blue-400">Optimized Headline:</h3>
            <p className="p-3 bg-gray-700 rounded-md whitespace-pre-wrap">{result.optimizedHeadline}</p>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-blue-400">Optimized "About" Section:</h3>
            <p className="p-3 bg-gray-700 rounded-md whitespace-pre-wrap">{result.optimizedSummary}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-blue-400">Identified Keywords:</h3>
            <div className="flex flex-wrap gap-2">
              {result.keywords.map((keyword: string) => (
                <span key={keyword} className="px-3 py-1 bg-gray-600 text-sm rounded-full">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}