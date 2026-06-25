export default function DmcaPage() {
  return (
    <main className="bg-slate-100 py-8 md:py-10">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 md:p-10">
          <h1 className="mb-6 text-3xl font-bold text-slate-900 md:text-4xl">
            DMCA & Copyright Claims
          </h1>

          <p className="mb-8 text-sm text-slate-500">
            Last updated: June 21, 2026
          </p>

          <div className="space-y-5 text-base leading-8 text-slate-600">
            <p>
              YT Down respects the intellectual property rights of others and
              expects users to comply with applicable copyright laws.
            </p>

            <p>
              YT Down does not host, store, upload, or distribute video, audio,
              image, or other media files on its own servers.
            </p>

            <p>
              Our service processes publicly available links submitted by users.
              Users are solely responsible for ensuring that they have the
              necessary rights or permissions to access, download, or use any
              content.
            </p>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Filing a Copyright Complaint
              </h2>

              <p>
                If you believe that content accessible through YT Down infringes
                your copyright, please send a notice to:
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

              <p className="mt-4">
                Your notice should include the following information:
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>Your full name or organization name.</li>
                <li>Your contact information.</li>
                <li>The specific URL or content in question.</li>
                <li>Proof that you own or represent the copyright.</li>
                <li>
                  A statement that the information provided is accurate and
                  submitted in good faith.
                </li>
              </ul>
            </section>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Review Process
              </h2>

              <p>
                Upon receiving a complete and valid notice, we will review the
                request and may restrict access to the reported content or take
                other appropriate action.
              </p>

              <p>
                Requests that are incomplete, inaccurate, or unrelated to
                copyright matters may not be processed.
              </p>
            </section>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Third-Party Content
              </h2>

              <p>
                YT Down is not affiliated with YouTube, Facebook, Instagram,
                TikTok, X (formerly Twitter), or any other third-party
                platform.
              </p>

              <p>
                Copyright owners who wish to remove original content should
                contact the platform where the content is hosted.
              </p>
            </section>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                User Responsibility
              </h2>

              <p>
                Users are responsible for ensuring their use of YT Down
                complies with applicable laws, copyright regulations, and
                third-party platform terms.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}