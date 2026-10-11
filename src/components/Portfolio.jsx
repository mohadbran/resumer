import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { getResumeMarkdown } from "../api/resume-server.js";

export default function Portfolio() {
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadResume() {
      try {
        setLoading(true);
        setError("");

        const content = await getResumeMarkdown();

        if (!controller.signal.aborted) {
          setMarkdown(content);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load the resume."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadResume();

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <p className="py-8 text-center text-slate-500">
        Loading resume...
      </p>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
      >
        {error}
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl text-sm leading-7 text-slate-700 sm:text-base">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-3 mt-8 border-b border-slate-200 pb-2 text-lg font-bold uppercase tracking-wide text-slate-900">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-1 mt-5 text-base font-bold text-slate-900">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-3 whitespace-pre-wrap">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 list-disc space-y-1 pl-6">
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className="pl-1">{children}</li>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="break-words text-blue-700 underline underline-offset-2 hover:text-blue-900"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-slate-900">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-slate-600">{children}</em>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
}