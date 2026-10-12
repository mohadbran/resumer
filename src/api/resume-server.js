
import { CONFIG } from "../config/index.js";

/**
 * Central API gateway for the resume portfolio.
 *
 * All requests to the Google Apps Script backend
 * should be handled through this file.
 */

// Replace this URL if you deploy a new Google Apps Script version.
const RESUME_API_URL = CONFIG.RESUME_API_URL;

/**
 * Builds a URL with the requested API action.
 *
 * @param {string} action - The backend action to execute.
 * @returns {string} The complete API URL.
 */
function buildApiUrl(action) {
  const url = new URL(RESUME_API_URL);

  url.searchParams.set("action", action);

  return url.toString();
}

/**
 * Performs a GET request and returns the response.
 *
 * @param {string} action - The backend action.
 * @returns {Promise<Response>} The HTTP response.
 */
async function request(action) {
  let response;

  try {
    response = await fetch(buildApiUrl(action), {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain",
      },
    });
  } catch (error) {
    const message =
        error instanceof Error ? error.message : String(error);

    throw new Error(
        `Unable to connect to the resume server. ${message}`.trim(),
        { cause: error }
    );
  }

  if (!response.ok) {
    throw new Error(
      `Resume server request failed with status ${response.status}.`
    );
  }

  return response;
}

/**
 * Fetches the canonical resume in Markdown format.
 *
 * Backend action:
 * GET ?action=resumeMarkdown
 *
 * @returns {Promise<string>} Resume Markdown content.
 */
export async function getResumeMarkdown() {
  const response = await request("resumeMarkdown");
  const markdown = await response.text();

  if (!markdown.trim()) {
    throw new Error("The resume server returned empty Markdown.");
  }

  return markdown;
}

/**
 * Generates resume files and saves them to Google Drive.
 *
 * Backend action:
 * GET ?action=generateResume
 *
 * Expected response:
 * {
 *   success: true,
 *   markdownUrl: "...",
 *   docUrl: "...",
 *   pdfUrl: "...",
 *   markdown: "..."
 * }
 *
 * @returns {Promise<object>} Generated resume file information.
 */
export async function generateResume() {
  const response = await request("generateResume");

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error(
      "The resume server returned an invalid JSON response."
    );
  }

  if (!result || result.success !== true) {
    throw new Error(
      result?.error || result?.message || "Resume generation failed."
    );
  }

  return result;
}
