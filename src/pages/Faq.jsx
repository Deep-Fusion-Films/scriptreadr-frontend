

export default function Faq() {
  return (
    <section className="py-16 px-6 max-w-5xl mx-auto mb2">
      <h1 className="text-4xl font-bold text-center text-[#2E3A87] mb-10">
        Frequently Asked Questions
      </h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-[#2E3A87] mb-2">
            What is ScriptReadr?
          </h2>
          <p className="text-white">
            ScriptReadr is an AI-powered tool designed for creatives and producers that reads your scripts aloud using natural-sounding voice technology. It's a perfect solution for scriptwriters, filmmakers, or content teams who want to hear how their script flows before final production.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[#2E3A87] mb-2">
            Who can use ScriptReadr?
          </h2>
          <p className="text-white">
            Anyone working with written scripts or narrative content — including screenwriters, producers, directors, educators, and content creators — can benefit from ScriptReadr. No technical background is required to use the platform.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[#2E3A87] mb-2">
            Do I need to install any software?
          </h2>
          <p className="text-white">
            No installation is needed. ScriptReadr is a fully web-based platform accessible through your browser on desktop, tablet, or mobile devices.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[#2E3A87] mb-2">
            How accurate are the AI voices?
          </h2>
          <p className="text-white">
            ScriptReadr uses advanced AI voice synthesis to deliver high-quality, natural speech. While not a substitute for human actors, our voices offer clear intonation and pacing that help you understand flow, tone, and timing.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[#2E3A87] mb-2">
            Is there a free version?
          </h2>
          <p className="text-white">
            Yes! ScriptReadr offers a free plan with limited features so you can test the platform. Premium and Pro plans provide access to advanced voice features, longer script lengths, and additional export options.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[#2E3A87] mb-2">
            Can I export audio from ScriptReadr?
          </h2>
          <p className="text-white">
            Yes, users on Premium and Pro plans can export their script audio in MP3 format for easy sharing or personal review.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[#2E3A87] mb-2">
            How do subscriptions work?
          </h2>
          <p className="text-white">
            Once you subscribe, your account will be upgraded to your selected plan (Basic, Premium, or Pro). Subscription status is stored securely in your profile and can be upgraded or cancelled at any time via your dashboard.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[#2E3A87] mb-2">
            Is my script data private?
          </h2>
          <p className="text-white">
            Absolutely. ScriptReadr takes privacy seriously. Your scripts are never shared with third parties, and we use encrypted storage and secure authentication to protect your data. You can read more in our{" "}
            <a href="/privacypolicies" className="text-blue-600 underline">
              Privacy Policy
            </a>.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[#2E3A87] mb-2">
            Who do I contact for support?
          </h2>
          <p className="text-white">
            For help, questions, or technical support, you can reach us at{" "}
            <a href="mailto:support@scriptreadr.com" className="text-white underline">
              support@scriptreadr.com
            </a>. Our team typically responds within 24 hours.
          </p>
        </div>
      </div>
    </section>
  );
}
