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
    const value = e.target.value;
    setUrl(value);
    setError(null);

    // Auto-fetch when URL looks complete (has a video ID)
    const ytRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[a-zA-Z0-9_-]+/;
    if (ytRegex.test(value)) {
      fetchVideoInfo(value);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData("text");
    setUrl(pastedText);
    setError(null);
    const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (ytRegex.test(pastedText.trim())) {
      await fetchVideoInfo(pastedText.trim());
    }
  };

  const handleDownload = async (type: DownloadType, quality?: string) => {
    if (!videoInfo) return;

    setDownloading(type);
    setProgress(0);
    setError(null);

    abortRef.current = new AbortController();

    try {
      // Simulate progress since we can't get real progress from streaming
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          type,
          quality: quality || videoInfo.qualities[0]?.toString() || "720",
        }),
        signal: abortRef.current.signal,
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Download failed");
        setDownloading(null);
        setProgress(0);
        return;
      }

      setProgress(95);

      // Extract filename from Content-Disposition header (supports RFC 5987 UTF-8)
      const contentDisposition = res.headers.get("Content-Disposition");
      let filename = `${videoInfo.title || "video"}.${type === "audio" ? "mp3" : "mp4"}`;
      if (contentDisposition) {
        // Prefer RFC 5987 filename*=UTF-8''encoded name
        const rfc5987Match = contentDisposition.match(
          /filename\*=UTF-8''([^;]+)/i,
        );
        if (rfc5987Match) {
          filename = decodeURIComponent(rfc5987Match[1].trim());
        } else {
          const match = contentDisposition.match(/filename="?([^";]+)"?/i);
          if (match) {
            filename = decodeURIComponent(match[1].trim());
          }
        }
      }

      // Download the file
      setProgress(98);
      const blob = await res.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Delay revoke slightly so browser can start the download
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      console.error(err);
      setError("Download failed. Please check your connection and try again.");
    } finally {
      // Brief delay so user sees the completion state
      setTimeout(() => {
        setDownloading(null);
        setProgress(0);
        abortRef.current = null;
      }, 800);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
          <button  onClick={handleReset}  className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </div>
            <span className="text-base sm:text-lg font-semibold tracking-tight">
              YT Downloader
            </span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        {!videoInfo ? (
          <div className="w-full max-w-xl space-y-8">
            {/* Hero */}
            <div className="text-center space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
                Download YouTube Videos
              </h1>
              <p className="text-gray-400 text-base sm:text-lg">
                Paste a link, pick a format. Done.
              </p>
            </div>

            {/* URL Input */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 group">
                  <input
                    ref={inputRef}
                    type="url"
                    value={url}
                    onChange={handleInputChange}
                    onPaste={handlePaste}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !loading && url.trim()) {
                        fetchVideoInfo(url);
                      }
                    }}
                    placeholder="Paste YouTube URL here..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                    autoFocus
                  />

                  {loading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                    </div>
                  )}
                </div>

                <button
                  onClick={() => fetchVideoInfo(url)}
                  disabled={!url.trim() || loading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#00e676] px-6 py-4 font-semibold text-white transition-colors duration-300 hover:bg-[#00c853]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-white" />
                      <span className="text-white">Loading</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5 text-white" />
                      <span className="text-white">Search</span>
                    </>
                  )}
                </button>
              </div>

              {error && !videoInfo && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
              <span>4K Video</span>
              <span className="w-1 h-1 bg-gray-600 rounded-full" />
              <span>Video MP4</span>
              <span className="w-1 h-1 bg-gray-600 rounded-full" />
              <span>Audio MP3</span>
              <span className="w-1 h-1 bg-gray-600 rounded-full" />
              <span>No signup</span>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-xl space-y-6 animate-in">
            {/* Video Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
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
              <div className="p-5 space-y-2">
                <h2 className="text-lg font-semibold leading-snug line-clamp-2">
                  {videoInfo.title}
                </h2>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span className="font-medium text-gray-300">
                    {videoInfo.author}
                  </span>
                  <span className="w-1 h-1 bg-gray-600 rounded-full" />
                  <span>{formatViews(videoInfo.views)}</span>
                </div>
              </div>
            </div>

            {/* Download Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {videoInfo.qualities.map((quality) => (
                <button
                  key={quality}
                  onClick={() => handleDownload("video", quality.toString())}
                  disabled={downloading !== null}
                  className="group relative overflow-hidden flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 transition-all duration-300 hover:border-green-500/50 hover:bg-green-500/10 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] disabled:opacity-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/15">
                      <Film className="h-5 w-5 text-green-400" />
                    </div>

                    <div className="text-left">
                      <p className="font-medium text-white">Video</p>
                      <p className="text-sm text-gray-400">{quality}p • MP4</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white transition-transform group-hover:scale-105">
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
              className="group relative overflow-hidden flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 transition-all duration-300 hover:border-green-500/50 hover:bg-green-500/10 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] disabled:opacity-50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/15">
                  <Music className="h-5 w-5 text-green-400" />
                </div>

                <div className="text-left">
                  <p className="font-medium text-white">Audio Only</p>
                  <p className="text-sm text-gray-400">Best quality • MP3</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white transition-transform group-hover:scale-105">
                <Download className="h-4 w-4" />
                Download
              </div>
            </button>

            {/* Download Progress */}
            {downloading && (
              <>
                <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />

                <div className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-slate-900 p-5 sm:p-6 shadow-2xl">
                  <button
                    onClick={() => setDownloading(null)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>

                  <div className="mb-5 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/15">
                      <Loader2 className="h-6 w-6 animate-spin text-green-400" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-white">
                        Downloading...
                      </h3>

                      <p className="text-sm text-gray-400">
                        {Math.round(progress)}% complete
                      </p>
                    </div>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <p className="mt-4 text-center text-sm text-gray-400">
                    Your download will start automatically.
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

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-gray-600">
          Come Back Again, Happy Downloading
        </div>
      </footer>
    </div>
  );
}
