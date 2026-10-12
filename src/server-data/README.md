# Resumer Backend Setup

The Resumer backend runs on Google Apps Script and uses a Google Sheets document as its source of resume data.

## Setup

1. Upload `resume-db.xlsx` to Google Drive.
2. Open it and save it as a native Google Sheets document.
3. Open the converted spreadsheet and select **Extensions → Apps Script**.
4. Copy the contents of `resume-backend.js` into the Apps Script editor.
5. Configure `OUTPUT_FOLDER_ID` in the backend's `CONFIG` object.
6. Save the script and run `testGenerateResume` to authorize and test document generation.
7. Deploy the script as a web app and copy its `/exec` URL.
8. Configure the frontend's `VITE_RESUME_API_URL` environment variable with that URL.

See the root [SETUP.md](../../SETUP.md) for detailed instructions, required spreadsheet columns, deployment guidance, and troubleshooting.

## Important

- The script must be bound to the intended Google Sheets document because it uses `SpreadsheetApp.getActiveSpreadsheet()`.
- The first row of each worksheet contains column headers.
- The configured Google account must have access to the spreadsheet and destination Drive folder.
- Review web app permissions before exposing the endpoint publicly.
- Never commit real personal resume data or private credentials to the repository.