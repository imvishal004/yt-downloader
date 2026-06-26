"use client";

import { useState, useCallback, useRef } from "react";
import {
  Download,
  Film,
  Music,
  Loader2,
  AlertCircle,
  Search,
  Play,
} from "lucide-react";

interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  durationString: string;
  views: number;
  author: string;
  uploadDate: string;
  description: string;
  qualities: number[];
}

type DownloadType = "video" | "audio";

function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K views`;
  return `${views} views`;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<DownloadType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [downloadMessage, setDownloadMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchVideoInfo = useCallback(async (videoUrl: string) => {
    if (!videoUrl.trim()) return;

    // Validate it looks like a YouTube URL
    const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!ytRegex.test(videoUrl.trim())) return;

    setLoading(true);
    setError(null);
    setVideoInfo(null);

    try {
      const res = await fetch("/api/video-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: videoUrl.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setVideoInfo(data);
    } catch {
      setError("Failed to fetch video information");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setUrl(value);
    setError(null);

    const ytRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[a-zA-Z0-9_-]+/;
    if (ytRegex.test(value)) {
      fetchVideoInfo(value);
    }
  };

  const handleDownload = async (type: DownloadType, quality?: string) => {
    if (!videoInfo) return;

    setDownloading(type);
    setProgress(0);
    setDownloadMessage("Initializing...");
    setError(null);

    abortRef.current = new AbortController();

    let progressInterval: NodeJS.Timeout | undefined;

    try {
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          let next = prev;

          if (prev < 25) next = prev + Math.random() * 10;
          else if (prev < 60) next = prev + Math.random() * 5;
          else if (prev < 90) next = prev + Math.random() * 2;
          else next = 90;

          next = Math.min(next, 90);

          if (next < 25) {
            setDownloadMessage("Fetching video information...");
          } else if (next < 60) {
            setDownloadMessage("Downloading video from YouTube...");
          } else if (next < 90) {
            setDownloadMessage("Processing video and audio...");
          } else {
            setDownloadMessage("Preparing browser download...");
          }

          return Math.round(next);
        });
      }, 700);

      const res = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          type,
          quality: quality || videoInfo.qualities[0]?.toString() || "720",
        }),
        signal: abortRef.current.signal,
      });

      if (progressInterval) {
        clearInterval(progressInterval);
      }

      if (!res.ok) {
        const data = await res.json();

        setError(data.error || "Download failed");
        setDownloading(null);
        setProgress(0);
        setDownloadMessage("");

        return;
      }

      setProgress(96);
      setDownloadMessage("Sending file to your browser...");

      const contentDisposition = res.headers.get("Content-Disposition");

      let filename = `${videoInfo.title}.${type === "audio" ? "mp3" : "mp4"}`;

      if (contentDisposition) {
        const rfc5987Match = contentDisposition.match(
          /filename\*=UTF-8''([^;]+)/i,
        );

        if (rfc5987Match) {
          filename = decodeURIComponent(rfc5987Match[1]);
        } else {
          const match = contentDisposition.match(/filename="?([^";]+)"?/i);

          if (match) {
            filename = decodeURIComponent(match[1]);
          }
        }
      }

      const blob = await res.blob();

      setProgress(100);
      setDownloadMessage("Download started successfully.");

      const downloadUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;

      document.body.appendChild(a);
      a.click();
      a.remove();

      setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
    } catch (err) {
      if (progressInterval) {
        clearInterval(progressInterval);
      }

      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }

      console.error(err);

      setError("Download failed. Please try again.");
      setDownloadMessage("");
    } finally {
      setTimeout(() => {
        setDownloading(null);
        setProgress(0);
        setDownloadMessage("");
        abortRef.current = null;
      }, 1500);
    }
  };

  const handleCancel = () => {
    abortRef.current?.abort();
    setDownloading(null);
    setProgress(0);
  };

  const handleReset = () => {
    setUrl("");
    setVideoInfo(null);
    setError(null);
    setLoading(false);
    setDownloading(null);
    setProgress(0);
    inputRef.current?.focus();
  };

  return (
    <div id="top" className="relative flex flex-col">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute right-0 top-96 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 pt-12 md:pt-16">
        {!videoInfo ? (
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-12 space-y-16">
            {" "}
            {/* 1. Hero Section */}
            <div className="text-center space-y-6">
              <h1 className="text-4xl font-bold sm:text-5xl md:text-7xl text-center leading-tight mx-auto">
                Download YouTube Videos
                <span className="block text-emerald-500">in MP4 & MP3</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500">
                Download videos, music, shorts, and audio in high quality. Fast,
                free, secure, and works on desktop and mobile.
              </p>

              {/* URL Input */}
              <div className="mx-auto mt-8 w-full max-w-3xl">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      type="url"
                      value={url}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !loading && url.trim()) {
                          fetchVideoInfo(url);
                        }
                      }}
                      placeholder="Paste YouTube URL here..."
                      className="h-14 w-full rounded-2xl border px-5 text-base outline-none transition-all placeholder:text-slate-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 sm:h-16 sm:px-6"
                      style={{
                        backgroundColor: "var(--card)",
                        borderColor: "var(--border)",
                        color: "var(--text)",
                      }}
                      autoFocus
                    />
                    {loading && (
                      <Loader2 className="absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-slate-400" />
                    )}
                  </div>
                  <button
                    onClick={() => fetchVideoInfo(url)}
                    disabled={loading || !url.trim()}
                    className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl px-8 text-base font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed sm:h-16 sm:w-auto"
                    style={{
                      background:
                        loading || !url.trim()
                          ? "#00E676"
                          : "linear-gradient(135deg, #00C97B 0%, #00E676 100%)",
                      boxShadow:
                        loading || !url.trim()
                          ? "none"
                          : "0 10px 30px rgba(0, 230, 118, 0.28)",
                      opacity: 1,
                    }}
                  >
                    <Search className="h-6 w-6 text-white" strokeWidth={2.5} />
                    <span className="text-white">Search</span>
                  </button>
                </div>

                {error && !videoInfo && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mt-3">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
                <span>4K Video</span>
                <span>•</span>
                <span>Video MP4</span>
                <span>•</span>
                <span>Audio MP3</span>
                <span>•</span>
                <span>No signup</span>
              </div>
            </div>
            {/* 2. Introduction Section */}
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <h2 className="text-2xl font-bold">
                The Easiest YouTube Downloader
              </h2>
              <p className="muted">
                Our powerful yet simple YouTube downloader lets you save videos
                and audio from YouTube directly to your device. Whether you need
                MP4 videos or MP3 audio, we've got you covered—all in your
                browser, no installations needed.
              </p>
            </div>
            {/* 3. How It Works */}
            <div>
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold">
                  How to Download YouTube Videos
                </h2>
                <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#00e676]" />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="card rounded-2xl p-6">
                  <div className="inline-flex rounded-xl bg-emerald-500/20 p-3 text-emerald-400 mb-4">
                    <Film className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold">Paste URL</h3>
                  <p className="mt-2 muted text-sm">
                    Paste any YouTube video link or short URL.
                  </p>
                </div>
                <div className="card rounded-2xl p-6">
                  <div className="inline-flex rounded-xl bg-emerald-500/20 p-3 text-emerald-400 mb-4">
                    <Search className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold">Select Format</h3>
                  <p className="mt-2 muted text-sm">
                    Choose MP4 video or MP3 audio with your desired quality.
                  </p>
                </div>
                <div className="card rounded-2xl p-6">
                  <div className="inline-flex rounded-xl bg-emerald-500/20 p-3 text-emerald-400 mb-4">
                    <Download className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold">Download</h3>
                  <p className="mt-2 muted text-sm">
                    Start the download and save to your device instantly.
                  </p>
                </div>
              </div>
            </div>
            {/* 4. Supported vs Unsupported */}
            <section id="mp4">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold">What You Can Download</h2>
                <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#00e676]" />
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-emerald-500">
                    ✓ Supported
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-slate-900">
                      <span>🎥</span>
                      <span className="font-medium">Standard Videos</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-slate-900">
                      <span>📱</span>
                      <span className="font-medium">YouTube Shorts</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-slate-900">
                      <span>🎵</span>
                      <span className="font-medium">Music Videos</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-slate-900">
                      <span>🔴</span>
                      <span className="font-medium">Live Streams</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-red-600">
                    ✕ Unsupported
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-slate-900">
                      <span>🔒</span>
                      <span className="font-medium">Private Videos</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-slate-900">
                      <span>🔞</span>
                      <span className="font-medium">
                        Age-Restricted Content
                      </span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-slate-900">
                      <span>👥</span>
                      <span className="font-medium">Members-Only Videos</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-slate-900">
                      <span>💳</span>
                      <span className="font-medium">Rental Content</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* 5. Format & Quality Guide */}
            <section id="mp3">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold">
                  Available Download Qualities
                </h2>
                <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#00e676]" />
              </div>
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-4 text-left font-semibold text-slate-900">
                        Format
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-900">
                        Quality
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-900">
                        Best For
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="px-6 py-3 text-slate-900">MP3</td>
                      <td className="px-6 py-3 text-slate-600">128 kbps</td>
                      <td className="px-6 py-3 text-slate-600">Small files</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="px-6 py-3 text-slate-900">MP3</td>
                      <td className="px-6 py-3 text-slate-600">320 kbps</td>
                      <td className="px-6 py-3 text-slate-600">Music</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="px-6 py-3 text-slate-900">MP4</td>
                      <td className="px-6 py-3 text-slate-600">360p</td>
                      <td className="px-6 py-3 text-slate-600">Mobile</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="px-6 py-3 text-slate-900">MP4</td>
                      <td className="px-6 py-3 text-slate-600">720p</td>
                      <td className="px-6 py-3 text-slate-600">Standard HD</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="px-6 py-3 text-slate-900">MP4</td>
                      <td className="px-6 py-3 text-slate-600">1080p</td>
                      <td className="px-6 py-3 text-slate-600">Full HD</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="px-6 py-3 text-slate-900">MP4</td>
                      <td className="px-6 py-3 text-slate-600">1440p</td>
                      <td className="px-6 py-3 text-slate-600">2K</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 text-slate-900">MP4</td>
                      <td className="px-6 py-3 text-slate-600">2160p</td>
                      <td className="px-6 py-3 text-slate-600">4K</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            {/* 6. Troubleshooting Accordion */}
            <div>
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold">Troubleshooting</h2>
                <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#00e676]" />
              </div>
              <div className="space-y-3">
                <details className="group rounded-2xl border border-slate-200 bg-white p-6">
                  <summary className="cursor-pointer font-semibold text-slate-900">
                    Why is my download slow?
                  </summary>
                  <p className="mt-4 text-slate-600">
                    Download speed depends on your internet connection and the
                    video size. Try choosing a lower quality if you're
                    experiencing slow speeds.
                  </p>
                </details>
                <details className="group rounded-2xl border border-slate-200 bg-white p-6">
                  <summary className="cursor-pointer font-semibold text-slate-900">
                    Can I download live streams?
                  </summary>
                  <p className="mt-4 text-slate-600">
                    We support downloading live recordings after they've been
                    archived by YouTube. Active live streams cannot be
                    downloaded.
                  </p>
                </details>
                <details className="group rounded-2xl border border-slate-200 bg-white p-6">
                  <summary className="cursor-pointer font-semibold text-slate-900">
                    Is it legal to download YouTube videos?
                  </summary>
                  <p className="mt-4 text-slate-600">
                    Downloading is legal, but ensure you have permission from
                    the copyright holder. Personal use is generally acceptable,
                    but redistribution may violate terms.
                  </p>
                </details>
                <details className="group rounded-2xl border border-slate-200 bg-white p-6">
                  <summary className="cursor-pointer font-semibold text-slate-900">
                    What formats are supported?
                  </summary>
                  <p className="mt-4 text-slate-600">
                    We support MP4 for video (360p to 2160p) and MP3 for audio
                    (128 to 320 kbps). These are the most compatible formats for
                    all devices.
                  </p>
                </details>
              </div>
            </div>
            {/* 7. Why Choose Us */}
            <div>
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold">
                  Why Choose YT Downloader?
                </h2>
                <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#00e676]" />
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="card rounded-2xl p-5 text-center">
                  <div className="text-3xl mb-3">⚡</div>
                  <h3 className="font-semibold mb-2">Fast & Reliable</h3>
                  <p className="muted text-sm">
                    Download your videos in seconds, not minutes.
                  </p>
                </div>
                <div className="card rounded-2xl p-5 text-center">
                  <div className="text-3xl mb-3">🔒</div>
                  <h3 className="font-semibold mb-2">100% Free</h3>
                  <p className="muted text-sm">
                    No premium plans, no hidden fees, no registration.
                  </p>
                </div>
                <div className="card rounded-2xl p-5 text-center">
                  <div className="text-3xl mb-3">🎯</div>
                  <h3 className="font-semibold mb-2">High Quality</h3>
                  <p className="muted text-sm">
                    Download up to 4K resolution and 320 kbps audio.
                  </p>
                </div>
                <div className="card rounded-2xl p-5 text-center">
                  <div className="text-3xl mb-3">🌐</div>
                  <h3 className="font-semibold mb-2">No Installation</h3>
                  <p className="muted text-sm">
                    Use directly in your browser, works on any device.
                  </p>
                </div>
              </div>
            </div>
            {/* 8. CTA Section */}
            <section className="rounded-[32px] bg-gradient-to-r from-emerald-500 to-emerald-600 p-12 text-center text-white">
              <h2 className="text-4xl font-bold">Ready to Download?</h2>
              <p className="mt-4 text-emerald-50">
                Paste your YouTube link above and start downloading instantly.
              </p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="mt-8 rounded-2xl bg-white px-8 py-4 font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors"
              >
                Start Downloading
              </button>
            </section>
            {/* 9. FAQ */}
            <section id="faq">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold">
                  Frequently Asked Questions
                </h2>
                <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#00e676]" />
              </div>
              <div className="space-y-3">
                <details className="group rounded-2xl border border-slate-200 bg-white p-6">
                  <summary className="cursor-pointer font-semibold text-slate-900">
                    Is this tool free?
                  </summary>
                  <p className="mt-4 text-slate-600">
                    Yes. No signup or subscription is required.
                  </p>
                </details>
                <details className="group rounded-2xl border border-slate-200 bg-white p-6">
                  <summary className="cursor-pointer font-semibold text-slate-900">
                    Which formats are supported?
                  </summary>
                  <p className="mt-4 text-slate-600">
                    MP4 video downloads and MP3 audio downloads are supported
                    across all quality levels.
                  </p>
                </details>
                <details className="group rounded-2xl border border-slate-200 bg-white p-6">
                  <summary className="cursor-pointer font-semibold text-slate-900">
                    Which qualities are available?
                  </summary>
                  <p className="mt-4 text-slate-600">
                    Available qualities depend on the original video and may
                    include 360p, 720p, 1080p, 1440p, and 2160p.
                  </p>
                </details>
                <details className="group rounded-2xl border border-slate-200 bg-white p-6">
                  <summary className="cursor-pointer font-semibold text-slate-900">
                    Do I need to install software?
                  </summary>
                  <p className="mt-4 text-slate-600">
                    No. Everything works directly in your browser without any
                    downloads or installations.
                  </p>
                </details>
              </div>
            </section>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-4xl space-y-6 animate-in">
            {/* Video Card */}
            <div className="card rounded-2xl overflow-hidden">
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-800">
                <img
                  src={videoInfo.thumbnail}
                  alt={videoInfo.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-medium">
                  {videoInfo.durationString}
                </div>
              </div>

              {/* Video Info */}
              <div
                className="space-y-2 p-5"
                style={{
                  backgroundColor: "var(--card)",
                }}
              >
                <h2
                  className="line-clamp-2 text-lg font-semibold leading-snug"
                  style={{ color: "var(--text)" }}
                >
                  {videoInfo.title}
                </h2>

                <div
                  className="flex items-center gap-3 text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span
                    className="font-medium"
                    style={{ color: "var(--text)" }}
                  >
                    {videoInfo.author}
                  </span>

                  <span
                    className="h-1 w-1 rounded-full"
                    style={{ backgroundColor: "var(--text-muted)" }}
                  />

                  <span>{formatViews(videoInfo.views)}</span>
                </div>
              </div>
            </div>

            {/* Download Options */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {videoInfo.qualities.map((quality) => (
                <button
                  key={quality}
                  onClick={() => handleDownload("video", quality.toString())}
                  disabled={downloading !== null}
                  className="group relative flex items-center justify-between rounded-2xl px-5 py-4 shadow-sm transition-all duration-300 hover:shadow-md disabled:opacity-50"
                  style={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15">
                      <Film className="h-5 w-5 text-emerald-400" />
                    </div>

                    <div className="text-left">
                      <p
                        className="font-medium"
                        style={{ color: "var(--text)" }}
                      >
                        Video
                      </p>

                      <p
                        className="text-sm"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {quality}p • MP4
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-[#00e676] px-4 py-2 text-sm font-semibold text-white transition-transform group-hover:scale-105 hover:bg-[#00d46a]">
                    <Download className="h-4 w-4" />
                    Download
                  </div>
                </button>
              ))}
            </div>

            {/* Audio Only */}
            <button
              onClick={() => handleDownload("audio")}
              disabled={downloading !== null}
              className="group relative flex w-full items-center justify-between rounded-2xl px-5 py-4 shadow-sm transition-all duration-300 hover:shadow-md disabled:opacity-50"
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15">
                  <Music className="h-5 w-5 text-emerald-400" />
                </div>

                <div className="text-left">
                  <p className="font-medium" style={{ color: "var(--text)" }}>
                    Audio Only
                  </p>

                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    Best quality • MP3
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-[#00e676] px-4 py-2 text-sm font-semibold text-white transition-transform group-hover:scale-105 hover:bg-[#00d46a]">
                <Download className="h-4 w-4" />
                Download
              </div>
            </button>

            {/* Download Progress */}
            {downloading && (
              <>
                <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />

                <div
                  className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl p-5 shadow-2xl sm:p-6"
                  style={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <button
                    onClick={handleCancel}
                    className="absolute right-4 top-4 transition-colors hover:opacity-80"
                    style={{ color: "var(--text-muted)" }}
                  >
                    ✕
                  </button>

                  <div className="mb-5 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15">
                      <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
                    </div>

                    <div>
                      <h3
                        className="font-semibold"
                        style={{ color: "var(--text)" }}
                      >
                        {Math.round(progress)}% Downloaded
                      </h3>

                      <p
                        className="text-sm"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {downloadMessage}
                      </p>
                    </div>
                  </div>

                  <div
                    className="h-3 overflow-hidden rounded-full"
                    style={{ backgroundColor: "var(--border)" }}
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-[#00e676] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p
                    className="mt-4 text-center text-sm"
                    style={{ color: "var(--text)" }}
                  >
                    Please keep this tab open while we prepare your file.
                  </p>
                </div>
              </>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
