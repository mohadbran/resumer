
import { useState } from "react";
import { generateResume } from "../api/resume-server.js";

export default function ResumeControls() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleGenerateResume() {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const generatedResume = await generateResume();

      setResult(generatedResume);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate the resume."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <p className="text-sm leading-6 text-slate-300">
        Generate my latest resume from my Google Sheets data
        and view the Markdown, Google Docs, and PDF versions.
      </p>

      <button
        type="button"
        onClick={handleGenerateResume}
        disabled={loading}
        className="w-full rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400/30 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {loading ? "Generating resume..." : "Generate Resume"}
      </button>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200"
        >
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <h3 className="font-semibold text-white">
            Resume generated successfully
          </h3>

          {result.markdownUrl && (
            <a
              href={result.markdownUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-300 underline underline-offset-4 hover:text-white"
            >
              View the Markdown file
            </a>
          )}

          {result.docUrl && (
            <a
              href={result.docUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-300 underline underline-offset-4 hover:text-white"
            >
              Open the Google Docs resume
            </a>
          )}

          {result.pdfUrl && (
            <a
              href={result.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-300 underline underline-offset-4 hover:text-white"
            >
              View the PDF resume
            </a>
          )}
        </div>
      )}
    </div>
  );
}
