export default function TermsPage() {
  return (
    <main className="bg-slate-100 py-8 md:py-10">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 md:p-10">
          <h1 className="mb-6 text-3xl font-bold text-slate-900 md:text-4xl">
            Terms of Service
          </h1>

          <p className="mb-8 text-sm text-slate-500">
            Last updated: June 21, 2026
          </p>

          <div className="space-y-5 text-base leading-8 text-slate-600">
            <p>
              Welcome to YT Down. By accessing or using our website and
              services, you agree to comply with these Terms of Service.
            </p>

            <p>
              If you do not agree with these terms, please do not use YT Down.
            </p>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Use of the Service
              </h2>

              <p>
                YT Down provides tools that help users process publicly
                available media links and download content for personal use,
                subject to applicable laws and platform terms.
              </p>

              <p>
                You are solely responsible for ensuring that your use of the
                service complies with all applicable laws, regulations, and
                third-party terms of service.
              </p>
            </section>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                User Responsibilities
              </h2>

              <ul className="list-disc space-y-2 pl-6">
                <li>Use the service only for lawful purposes.</li>
                <li>Respect intellectual property rights.</li>
                <li>Obtain permission when required by content owners.</li>
                <li>
                  Comply with the terms and policies of third-party platforms.
                </li>
              </ul>
            </section>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Prohibited Activities
              </h2>

              <ul className="list-disc space-y-2 pl-6">
                <li>Downloading or distributing content unlawfully.</li>
                <li>Violating copyright or intellectual property rights.</li>
                <li>Attempting to disrupt or abuse the service.</li>
                <li>Using automated tools to overload our systems.</li>
                <li>Engaging in fraudulent or harmful activities.</li>
              </ul>
            </section>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Third-Party Platforms
              </h2>

              <p>
                YT Down is not affiliated with, endorsed by, or sponsored by
                YouTube, Facebook, Instagram, TikTok, X (formerly Twitter), or
                any other third-party platform.
              </p>

              <p>
                All trademarks, brand names, and logos belong to their
                respective owners.
              </p>
            </section>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Disclaimer of Warranties
              </h2>

              <p>
                YT Down is provided on an "as is" and "as available" basis
                without warranties of any kind.
              </p>

              <p>
                We do not guarantee uninterrupted availability, accuracy, or
                compatibility of the service.
              </p>
            </section>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Limitation of Liability
              </h2>

              <p>
                YT Down shall not be liable for any direct, indirect,
                incidental, consequential, or special damages arising from the
                use of or inability to use the service.
              </p>
            </section>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Changes to These Terms
              </h2>

              <p>
                We may update these Terms of Service at any time. Continued use
                of YT Down after changes are posted constitutes acceptance of
                the updated terms.
              </p>
            </section>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Contact Us
              </h2>

              <p>
                If you have questions about these Terms of Service, contact us
                at:
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