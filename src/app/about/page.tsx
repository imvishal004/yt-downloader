export default function AboutPage() {
  return (
    <main className="bg-slate-100 py-8 md:py-10">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 md:p-10">
          <h1 className="mb-6 text-3xl font-bold text-slate-900 md:text-4xl">
            About YT Down
          </h1>

          <div className="space-y-5 text-base leading-8 text-slate-600">
            <p>
              Welcome to YT Down — a simple, fast, and free online video
              downloader and converter.
            </p>

            <p>
              YT Down helps users save publicly available online videos and
              audio for offline access through a fast, browser-based
              experience. Convert YouTube videos to MP3 or MP4 in just a few
              clicks without installing any software.
            </p>

            <p>
              With YT Down, simply copy a video link, paste it into the
              download box, choose your preferred format, and start your
              download in seconds.
            </p>

            <p>
              Our goal is to provide a clean, reliable, and user-friendly
              experience across desktop, tablet, and mobile devices.
            </p>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Our Mission
              </h2>

              <p>
                We believe online media tools should be simple, accessible,
                and efficient. YT Down is designed to help users quickly
                access content they are legally allowed to download and use.
              </p>
            </section>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Fair Use Notice
              </h2>

              <p>
                YT Down respects content creators and intellectual property
                rights. Users are responsible for ensuring they have the legal
                right to download or use any content processed through our
                platform.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}