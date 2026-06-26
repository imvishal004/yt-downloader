import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const YT_DLP_PATH = process.env.YT_DLP_PATH || "yt-dlp";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const cleanUrl = url.trim();

    const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i;

    if (!ytRegex.test(cleanUrl)) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 },
      );
    }

    const { stdout } = await execFileAsync(
      YT_DLP_PATH,
      [
        "--dump-json",
        "--no-warnings",
        "--no-playlist",
        "--socket-timeout",
        "30",

        "--user-agent",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",

        cleanUrl,
      ],
      {
        timeout: 30000,
        env: process.env,
      },
    );

    const videoInfo = JSON.parse(stdout);

    const qualities: number[] = [
      ...new Set<number>(
        (videoInfo.formats || [])
          .filter(
            (f: any) => typeof f.height === "number" && f.vcodec !== "none",
          )
          .map((f: any) => Number(f.height)),
      ),
    ].sort((a, b) => b - a);

    return NextResponse.json({
      id: videoInfo.id,
      title: videoInfo.title,
      thumbnail: videoInfo.thumbnail || videoInfo.thumbnails?.at(-1)?.url,
      duration: videoInfo.duration,
      durationString: videoInfo.duration_string,
      views: videoInfo.view_count,
      author: videoInfo.channel,
      uploadDate: videoInfo.upload_date,
      description: videoInfo.description?.slice(0, 200) || "",
      qualities,
    });
  } catch (error: any) {
    console.error("Error fetching video info:", error);

    const stderr = error?.stderr || "";

    if (stderr.includes("DRM protected")) {
      return NextResponse.json(
        {
          error:
            "This YouTube video is DRM protected and cannot be downloaded.",
        },
        { status: 400 },
      );
    }

    if (stderr.includes("Sign in to confirm")) {
      return NextResponse.json(
        {
          error:
            "YouTube is temporarily blocking this request. Please try another video.",
        },
        { status: 400 },
      );
    }

    if (error?.message?.includes("timed out")) {
      return NextResponse.json(
        {
          error: "Request timed out. Please try again.",
        },
        { status: 408 },
      );
    }

    return NextResponse.json(
      {
        error: "Could not fetch video information.",
      },
      { status: 400 },
    );
  }
}
