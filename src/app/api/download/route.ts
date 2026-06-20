import { NextRequest, NextResponse } from "next/server";
import { execFile, spawn } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import os from "os";

const execFileAsync = promisify(execFile);

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const YT_DLP_PATH = process.env.YT_DLP_PATH || "yt-dlp";

function sanitizeFilename(name: string): string {
  return (
    name
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 100) || "video"
  );
}

function cleanupOldTempFiles() {
  const tmpDir = os.tmpdir();

  try {
    const now = Date.now();
    const files = fs.readdirSync(tmpDir);

    for (const f of files) {
      if (!/\.(mp3|mp4|webm|mkv|m4a|part|ytdl|temp)$/i.test(f)) continue;

      try {
        const fullPath = path.join(tmpDir, f);
        const stat = fs.statSync(fullPath);

        if (now - stat.mtimeMs > 10 * 60 * 1000) {
          fs.unlinkSync(fullPath);
        }
      } catch {}
    }
  } catch {}
}

export async function POST(request: NextRequest) {
  cleanupOldTempFiles();

  let downloadedFilePath: string | null = null;

  try {
    const { url, type, quality } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    const cleanUrl = url.trim();

    const ytRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i;

    if (!ytRegex.test(cleanUrl)) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    const isAudio = type === "audio";
    const tmpDir = os.tmpdir();

    let videoInfo;

    try {
      const infoResult = await execFileAsync(
        YT_DLP_PATH,
        ["--dump-json", "--no-warnings", "--no-playlist", cleanUrl],
        {
          timeout: 30000,
          env: process.env,
        }
      );

      videoInfo = JSON.parse(infoResult.stdout);
    } catch (infoErr) {
      console.error("Failed to get video info:", infoErr);

      return NextResponse.json(
        {
          error:
            "Could not retrieve video information. Please check the URL.",
        },
        { status: 400 }
      );
    }

    const safeTitle = sanitizeFilename(videoInfo.title || "video");
    const outTemplate = path.join(tmpDir, `${safeTitle}.%(ext)s`);

    const args: string[] = ["--no-warnings", "--no-playlist"];

    if (isAudio) {
      args.push(
        "-x",
        "--audio-format",
        "mp3",
        "--audio-quality",
        "0",
        "--prefer-ffmpeg"
      );
    } else {
      const selectedQuality = quality || "720";

      const format =
        `bestvideo[height=${selectedQuality}]+bestaudio/` +
        `bestvideo[height<=${selectedQuality}]+bestaudio/` +
        `best[height<=${selectedQuality}]`;

      const outputFormat =
        Number(selectedQuality) > 1080 ? "mkv" : "mp4";

      args.push(
        "-f",
        format,
        "--merge-output-format",
        outputFormat,
        "--embed-thumbnail"
      );
    }

    args.push(
      "-o",
      outTemplate,
      "--no-overwrites",
      "--socket-timeout",
      "30",
      "--concurrent-fragments",
      "5",
      "--retries",
      "3",
      "--fragment-retries",
      "3",
      cleanUrl
    );

    console.log(
      `[download] Starting ${
        isAudio ? "audio" : "video"
      } (${quality || "best"}) download: ${safeTitle}`
    );

    await new Promise<void>((resolve, reject) => {
      const child = spawn(YT_DLP_PATH, args, {
        timeout: 600000,
        cwd: tmpDir,
        env: process.env,
      });

      let stderrData = "";

      child.stderr.on("data", (data) => {
        stderrData += data.toString();
      });

      child.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          console.error(
            `[download] yt-dlp exited with code ${code}:`,
            stderrData
          );

          reject(
            new Error(
              `yt-dlp exited with code ${code}: ${stderrData.slice(-200)}`
            )
          );
        }
      });

      child.on("error", (err) => {
        reject(err);
      });
    });

    const expectedExt = isAudio
      ? "mp3"
      : Number(quality || "720") > 1080
        ? "mkv"
        : "mp4";

    let filePath = path.join(tmpDir, `${safeTitle}.${expectedExt}`);

    if (!fs.existsSync(filePath)) {
      const allFiles = fs.readdirSync(tmpDir);

      const matching = allFiles
        .filter((f) => {
          if (!f.startsWith(safeTitle)) return false;
          if (/\.(part|ytdl|temp|part-Frag)$/i.test(f)) return false;
          return true;
        })
        .map((f) => {
          const full = path.join(tmpDir, f);

          try {
            return {
              path: full,
              mtime: fs.statSync(full).mtimeMs,
            };
          } catch {
            return null;
          }
        })
        .filter(Boolean)
        .sort((a, b) => (b!.mtime || 0) - (a!.mtime || 0));

      if (matching.length === 0) {
        throw new Error("Download completed but file not found on disk");
      }

      filePath = matching[0]!.path;
    }

    downloadedFilePath = filePath;

    const stat = fs.statSync(filePath);

    const fileBuffer = fs.readFileSync(filePath);

    fs.unlinkSync(filePath);
    downloadedFilePath = null;

    const actualExt = path.extname(filePath).slice(1) || expectedExt;
    const finalFilename = `${safeTitle}.${actualExt}`;

    const contentType = isAudio
      ? actualExt === "mp3"
        ? "audio/mpeg"
        : "application/octet-stream"
      : actualExt === "mp4"
        ? "video/mp4"
        : actualExt === "mkv"
          ? "video/x-matroska"
          : "application/octet-stream";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeRFC5987(
          finalFilename
        )}; filename="${encodeLegacy(finalFilename)}"`,
        "Content-Length": stat.size.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: unknown) {
    console.error("[download] Error:", error);

    if (downloadedFilePath) {
      try {
        fs.unlinkSync(downloadedFilePath);
      } catch {}
    }

    const message =
      error instanceof Error ? error.message : "Unknown error";

    if (
      message.includes("timed out") ||
      message.includes("ETIMEDOUT")
    ) {
      return NextResponse.json(
        {
          error:
            "Download timed out. The video may be too large — try a lower quality.",
        },
        { status: 408 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to download. Please try again or try a different quality.",
      },
      { status: 500 }
    );
  }
}

function encodeRFC5987(str: string): string {
  return encodeURIComponent(str).replace(
    /[!'()*]/g,
    (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase()
  );
}

function encodeLegacy(str: string): string {
  return str.replace(/[^\x20-\x7E]/g, "_").replace(/"/g, "'");
}