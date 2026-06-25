export default function PrivacyPage() {
  return (
    <main className="bg-slate-100 py-8 md:py-10">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 md:p-10">
          <h1 className="mb-6 text-3xl font-bold text-slate-900 md:text-4xl">
            Privacy Policy
          </h1>

          <p className="mb-8 text-sm text-slate-500">
            Last updated: June 21, 2026
          </p>

          <div className="space-y-5 text-base leading-8 text-slate-600">
            <p>
              Welcome to YT Down. This Privacy Policy explains how we collect,
              use, and protect information when you use our website and
              services.
            </p>

            <p>
              By accessing or using YT Down, you agree to the practices
              described in this Privacy Policy.
            </p>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Information We Collect
              </h2>

              <p>
                YT Down is designed to operate with minimal data collection.
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>
                  Information you voluntarily provide when contacting us, such
                  as your email address and message content.
                </li>
                <li>
                  Technical information automatically collected by your
                  browser, including IP address, browser type, operating
                  system, device information, language preferences, referring
                  pages, and usage data.
                </li>
                <li>
                  Cookies and similar technologies used to improve website
                  performance, remember preferences, and analyze traffic.
                </li>
              </ul>

              <p className="mt-4">
                We do not require users to create an account to use our
                services.
              </p>
            </section>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                How We Use Information
              </h2>

              <ul className="list-disc space-y-2 pl-6">
                <li>Provide and improve our services.</li>
                <li>Maintain website security and prevent abuse.</li>
                <li>Analyze usage trends and website performance.</li>
                <li>Respond to support requests and user inquiries.</li>
                <li>Comply with legal obligations.</li>
              </ul>
            </section>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Cookies
              </h2>

              <p>
                YT Down may use cookies and similar technologies to enhance
                user experience and improve website functionality.
              </p>

              <p>
                You can disable cookies through your browser settings. Some
                features of the website may not function properly if cookies
                are disabled.
              </p>
            </section>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Third-Party Services
              </h2>

              <p>
                We may use third-party services for analytics, advertising,
                website hosting, and performance monitoring.
              </p>

              <p>
                These providers may collect information according to their own
                privacy policies. YT Down is not responsible for the privacy
                practices of third-party websites or services.
              </p>
            </section>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Content Processing
              </h2>

              <p>
                YT Down does not host video, audio, or image files on its own
                servers.
              </p>

              <p>
                Our service processes publicly available links submitted by
                users. Users are responsible for ensuring they have the legal
                right to access, download, or use any content.
              </p>
            </section>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Data Security
              </h2>

              <p>
                We implement reasonable security measures to protect
                information from unauthorized access, alteration, disclosure,
                or destruction.
              </p>

              <p>
                However, no method of transmission over the internet or
                electronic storage is completely secure.
              </p>
            </section>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Children&apos;s Privacy
              </h2>

              <p>
                YT Down is not intended for children under the age required by
                applicable laws in their jurisdiction.
              </p>

              <p>
                We do not knowingly collect personal information from children.
              </p>
            </section>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Changes to This Privacy Policy
              </h2>

              <p>
                We may update this Privacy Policy from time to time. Any
                changes will be posted on this page with an updated revision
                date.
              </p>
            </section>

            <section className="border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Contact Us
              </h2>

              <p>
                If you have questions about this Privacy Policy, please contact
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