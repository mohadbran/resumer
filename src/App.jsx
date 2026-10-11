
import { Portfolio, ResumeControls } from "./components/index.js";

const navigation = [
  { label: "Home", href: "#home" },
  { label: "Resume", href: "#resume" },
  { label: "Contact", href: "#contact" },
];

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"
        >
          <a
            href="#home"
            className="text-lg font-extrabold tracking-tight text-slate-900"
          >
            MB<span className="text-blue-600">.</span>
          </a>

          <div className="flex items-center gap-5 sm:gap-8">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section
          id="home"
          className="relative overflow-hidden bg-white"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-100/70 blur-3xl"
          />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                Software Engineer
              </span>

              <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Building software
                <span className="block text-blue-600">
                  that solves real problems.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                I build web applications, backend APIs, business
                systems, and automation solutions. Explore my
                professional experience, technical skills, and
                selected projects.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#resume"
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                >
                  Explore My Resume
                  <span aria-hidden="true" className="ml-2">
                    ↓
                  </span>
                </a>

                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Get in Touch
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                <span>Full-Stack Development</span>
                <span aria-hidden="true">·</span>
                <span>API Engineering</span>
                <span aria-hidden="true">·</span>
                <span>Automation</span>
              </div>
            </div>

            {/* Professional summary card */}
            <div className="mx-auto w-full max-w-md">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-xl shadow-slate-200/60 sm:p-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white">
                  MB
                </div>

                <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-blue-600">
                  Professional Profile
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  Software Engineer
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  Focused on clean architecture, maintainable
                  applications, and practical software solutions
                  for businesses.
                </p>

                <div className="mt-6 border-t border-slate-200 pt-5">
                  <a
                    href="#resume"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
                  >
                    View professional experience
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resume preview */}
        <section
          id="resume"
          className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                  Career & Experience
                </p>

                <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  My Resume
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-slate-600">
                  A detailed overview of my experience, technical
                  skills, education, and projects, maintained from
                  a single source of resume data.
                </p>
              </div>

              <a
                href="#resume-actions"
                className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Resume Downloads ↓
              </a>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-5 py-4 sm:px-8">
                <div>
                  <h3 className="font-semibold text-slate-800">
                    Resume Preview
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Generated from Google Sheets via Markdown
                  </p>
                </div>

                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                  Live data
                </span>
              </div>

              <div className="p-5 sm:p-10 lg:p-12">
                <Portfolio />
              </div>
            </div>
          </div>
        </section>

        {/* Resume generation and downloads */}
        <section
          id="resume-actions"
          className="scroll-mt-24 border-y border-slate-200 bg-white px-5 py-16 sm:px-8"
        >
          <div className="mx-auto max-w-5xl">
            <div className="rounded-3xl bg-slate-950 p-7 text-white sm:p-10 lg:p-12">
              <div className="grid gap-8 md:grid-cols-2 md:items-center">
                {/* Resume Documents - 50% width */}
                <div className="min-w-0">
                  <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                    Resume Documents
                  </p>

                  <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                    Need a copy of my resume?
                  </h2>

                  <p className="mt-3 max-w-xl leading-7 text-slate-300">
                    Generate an updated resume from my source data
                    and access the Markdown, Google Docs, and PDF
                    versions.
                  </p>
                </div>

                {/* Resume Generator - 50% width */}
                <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="mb-4 text-sm font-medium text-slate-300">
                    Resume generator
                  </p>

                  <ResumeControls />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-20"
        >
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Let's Connect
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Have a project in mind?
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">
              I'm interested in connecting with teams, businesses,
              and professionals working on meaningful software
              projects.
            </p>

            <p className="mt-7 text-sm text-slate-500">
              Contact details and professional links are available
              in my resume above.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-5 py-6 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-center text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>
            © {new Date().getFullYear()} Mohammedbrhan Abdelkadr
          </p>

          <a
            href="#home"
            className="font-medium transition hover:text-blue-600"
          >
            Back to top ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
