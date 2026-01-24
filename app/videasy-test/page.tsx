"use client";

import { useState } from "react";

export default function HomePage() {
  const [movieTitle, setMovieTitle] = useState("Wicked: For Good");
  const [tmdbId, setTmdbId] = useState("967941");
  const [year, setYear] = useState("2025");
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState<any[]>([]);
  const [subtitles, setSubtitles] = useState<any[]>([]);

  const fetchSources = async () => {
    setLoading(true);
    setSources([]);
    setSubtitles([]);

    try {
      const proxyRes = await fetch("/api/0", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: `https://api.videasy.net/myflixerzupcloud/sources-with-title?title=${encodeURIComponent(
            movieTitle,
          )}&mediaType=movie&year=${year}&tmdbId=${tmdbId}`,
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0",
            Connection: "keep-alive",
          },
          id: tmdbId, // <-- add this
        }),
      });

      const data = await proxyRes.json();

      if (data.status === 200 && data.result) {
        // The decoded response contains sources and subtitles
        setSources(data.result.sources || []);
        setSubtitles(data.result.subtitles || []);
      } else {
        alert("Failed to fetch sources");
      }
    } catch (err: any) {
      console.error(err);
      alert("Error fetching sources");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">Videasy Movie Sources</h1>

      <div className="mb-4 space-x-2">
        <input
          type="text"
          placeholder="Movie Title"
          value={movieTitle}
          onChange={(e) => setMovieTitle(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="TMDB ID"
          value={tmdbId}
          onChange={(e) => setTmdbId(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border p-2 rounded w-24"
        />
        <button
          onClick={fetchSources}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Loading..." : "Fetch Sources"}
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Sources</h2>
        {sources.length === 0 && <p>No sources found.</p>}
        <ul className="list-disc pl-5">
          {sources.map((s, idx) => (
            <li key={idx}>
              {s.quality || "Unknown"}:{" "}
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Play Link
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Subtitles</h2>
        {subtitles.length === 0 && <p>No subtitles found.</p>}
        <ul className="list-disc pl-5">
          {subtitles.map((sub, idx) => (
            <li key={idx}>
              {sub.language}:{" "}
              <a
                href={sub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Download
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
