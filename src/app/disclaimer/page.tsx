export default function DisclaimerPage() {
  return (
    <main className="bg-slate-100 py-8 md:py-10">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 md:p-10">
          <h1 className="mb-6 text-3xl font-bold text-slate-900 md:text-4xl">
            Disclaimer
          </h1>

          <p className="mb-8 text-sm text-slate-500">
            Last updated: June 21, 2026
          </p>

          <div className="space-y-5 text-base leading-8 text-slate-600">
            <p>
              YT Down is an independent online tool that helps users process
              publicly available media links.
            </p>

            <p>
              YT Down does not host, store, upload, or distribute any video,
              audio, image, or other media files on its own servers.
            </p>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                No Affiliation
              </h2>

              <p>
                YT Down is not affiliated with, endorsed by, sponsored by, or
                officially connected to YouTube, Facebook, Instagram, TikTok,
                X (formerly Twitter), or any other third-party platform.
              </p>

              <p>
                All trademarks, logos, brand names, and service marks belong to
                their respective owners.
              </p>
            </section>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                User Responsibility
              </h2>

              <p>
                Users are solely responsible for ensuring that their use of YT
                Down complies with applicable laws, copyright regulations, and
                the terms of service of third-party platforms.
              </p>

              <p>
                You should only download or use content when you have the legal
                right or authorization to do so.
              </p>
            </section>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                No Legal Advice
              </h2>

              <p>
                The information provided on YT Down is for general information
                purposes only and should not be considered legal advice.
              </p>

              <p>
                If you are uncertain about your rights or obligations, consult
                a qualified legal professional.
              </p>
            </section>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Service Availability
              </h2>

              <p>
                We strive to provide a reliable service, but we do not
                guarantee uninterrupted availability, accuracy, or compatibility.
              </p>

              <p>
                YT Down may modify, suspend, or discontinue any part of the
                service at any time without prior notice.
              </p>
            </section>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Contact Us
              </h2>

              <p>
                If you have questions regarding this Disclaimer, please contact
                us at:
              </p>

              <p className="font-medium">
                Email:{" "}
                <a
                  href="mailto:contact@ytdown.com"
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  contact@ytdown.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}