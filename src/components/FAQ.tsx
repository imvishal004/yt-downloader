const questions = [
  {
    q: "Is this tool free to use?",
    a: "Yes, you can download videos and audio without creating an account.",
  },
  {
    q: "Which formats are supported?",
    a: "MP4 video downloads and MP3 audio downloads are supported.",
  },
  {
    q: "Which qualities are available?",
    a: "Available qualities depend on the original video and may include 360p, 720p, 1080p, 1440p, and 2160p.",
  },
  {
    q: "Do I need to install software?",
    a: "No. Everything works directly in your browser.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="mt-16">
      <h2 className="mb-8 text-center text-3xl font-bold">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {questions.map((item) => (
          <div
            key={item.q}
            className="card rounded-2xl p-5"
          >
            <h3 className="font-semibold">{item.q}</h3>
            <p className="mt-2 muted">
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
