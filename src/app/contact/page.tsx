export default function ContactPage() {
  return (
    <main className="bg-slate-100 py-8 md:py-10">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 md:p-10">
          <h1 className="mb-6 text-3xl font-bold text-slate-900 md:text-4xl">
            Contact Us
          </h1>

          <div className="space-y-5 text-base leading-8 text-slate-600">
            <p>
              Thank you for using YT Down.
            </p>

            <p>
              If you experience any issues while using our service, have
              questions, or want to share feedback, feel free to contact us.
            </p>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Email Support
              </h2>

              <p>
                Email:{" "}
                <a
                  href="mailto:contact@ytdown.com"
                  className="font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  contact@ytdown.com
                </a>
              </p>
            </section>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Reporting an Issue
              </h2>

              <p>
                To help us investigate problems more quickly, please include:
              </p>

              <ul className="list-disc space-y-2 pl-6">
                <li>The video URL you used</li>
                <li>The selected format (MP3 or MP4)</li>
                <li>Your device type</li>
                <li>Your browser name and version</li>
                <li>The exact error message or screenshot</li>
              </ul>
            </section>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Response Time
              </h2>

              <p>
                We aim to respond to all inquiries within 48 hours.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
} 