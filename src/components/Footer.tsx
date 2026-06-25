import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[#12020b]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          {/* Logo + Social */}
          <div>
            <h2 className="text-5xl font-extrabold">
              <span className="text-[#00E676]">YT</span>
              <span className="text-white">DL</span>
            </h2>

            <p className="mt-4 max-w-sm text-slate-400">
              Fast, free YouTube video downloader. Download videos and audio in
              high quality.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-white">Company</h3>

            <div className="mt-6 flex flex-col gap-4 text-slate-400">
              <Link href="/about" className="hover:text-white">
                About Us
              </Link>

              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>

              <Link href="/terms" className="hover:text-white">
                Terms of Service
              </Link>

              <Link href="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white">Resources</h3>

            <div className="mt-6 flex flex-col gap-4 text-slate-400">
              <Link href="/disclaimer" className="hover:text-white">
                Disclaimer
              </Link>

              <Link href="/dmca" className="hover:text-white">
                DMCA
              </Link>

              <a href="#" className="hover:text-white">
                MP4 Downloader
              </a>

              <a href="#" className="hover:text-white">
                MP3 Downloader
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <p className="text-sm text-slate-500">
            For personal use only. Respect creators&apos; rights.
          </p>

          <p className="mt-3 text-sm text-slate-500">
            © 2026 YT Downloader. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
