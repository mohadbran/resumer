# Resumer Setup Guide

This guide explains how to configure Resumer from a fresh checkout, connect it to Google Sheets, deploy the Apps Script backend, and run the React frontend.

## 1. Prerequisites

Install or prepare:

- Node.js and npm
- A Google account
- Google Drive, Google Sheets, Google Docs, and Google Apps Script access
- The Resumer source code

## 2. Clone and Install

Open a terminal in the project root:

```bash
git clone <YOUR_REPOSITORY_URL>
cd personal-resume-system
npm install
```

Check that the frontend can build:

```bash
npm run build
```

## 3. Prepare the Google Sheets Database

Resumer expects a native Google Sheets spreadsheet. The included `src/server-data/resume-db.xlsx` workbook can be used as a starting template.

### Convert the Excel workbook

1. Upload `resume-db.xlsx` to your Google Drive.
2. Open the uploaded workbook.
3. In Google Sheets, choose **File → Save as Google Sheets** (the exact menu wording may vary).
4. Open the newly created Google Sheets document.
5. Verify the worksheet names and column headers.

The Apps Script backend reads the active spreadsheet, so the script should be created from the converted spreadsheet using **Extensions → Apps Script**.

### Required worksheets and columns

Worksheet names and field names must match the backend's expectations.

#### `Personal_Info`

Expected fields:

- `Name` — required
- `Email`
- `Phone`
- `LinkedIn`
- `Website`
- `Summary`

The backend uses the first non-empty data row as the personal profile.

#### `Experience`

Expected fields:

- `Role`
- `Company`
- `Start_Date`
- `End_Date`
- `Location`
- `Description`
- `Achievements`

Use one row per position. For descriptions and achievements, separate individual bullet points with line breaks where appropriate.

#### `Education`

Expected fields:

- `Degree`
- `Institution`
- `Year`
- `Achievements`

Use one row per education record.

#### `Skills`

Expected fields:

- `Skill`
- `Category`
- `Proficiency`

Use one row per skill.

#### `Projects`

Expected fields:

- `Name`
- `Description`
- `Tech_Stack`
- `Link`

Use one row per project.

#### `Certifications` (optional)

Expected fields:

- `Title` or `Name`
- `Issuer`
- `Year`

The backend includes certifications only when the worksheet contains data rows.

### Spreadsheet guidelines

- Put column headers in the first row.
- Use the exact worksheet names and column headers shown above.
- Avoid duplicate or blank column headers.
- Keep dates and phone numbers formatted as desired; the backend reads display values.
- Remove any example records you don't want published in your resume.

## 4. Install the Apps Script Backend

### Create the bound script

1. Open the converted Google Sheets document.
2. Select **Extensions → Apps Script**.
3. Open `src/server-data/resume-backend.js` from your local project.
4. Copy its contents into the Apps Script editor, replacing the default code.
5. Save the project.

The script uses `SpreadsheetApp.getActiveSpreadsheet()`, so keep it bound to the intended spreadsheet. If you later convert it to a standalone Apps Script project, update the spreadsheet-access logic accordingly.

### Configure Google Drive output

In the Apps Script editor, find the `CONFIG` object:

```javascript
const CONFIG = {
  OUTPUT_PREFIX: "ATS Resume",
  OUTPUT_FOLDER_ID: "YOUR_OUTPUT_FOLDER_ID",
  ARCHIVE_FOLDER_NAME: "archive",
  FONT_FAMILY: "Arial",
  BODY_FONT_SIZE: 10,
  NAME_FONT_SIZE: 20,
  SECTION_FONT_SIZE: 12
};
```

Create a destination folder in Google Drive. Copy its folder ID from the folder URL and replace `YOUR_OUTPUT_FOLDER_ID` with the actual ID.

For example, a URL such as:

```text
https://drive.google.com/drive/folders/EXAMPLE_FOLDER_ID
```

has a folder ID represented by `EXAMPLE_FOLDER_ID`. Use your real ID, not this placeholder.

You can choose another value for `OUTPUT_PREFIX` if you want a different filename prefix. The archive folder is created automatically if it does not exist.

### Authorize and test

1. Select `testGenerateResume` in the Apps Script editor.
2. Run the function.
3. Follow the authorization prompts.
4. Review the execution log for errors and the generated file URLs.
5. Open the destination Drive folder and verify the Markdown, Google Docs, and PDF files.

This test performs actual file creation and moves previous generated files into the archive. Use it only after checking your configuration.

## 5. Deploy the Apps Script Web App

1. In the Apps Script editor, select **Deploy → New deployment**.
2. Choose **Web app**.
3. Select the execution identity appropriate for your setup. Running as the deploying account generally allows the script to access that account's authorized spreadsheet and Drive resources.
4. Select the access level appropriate for your intended users.
5. Deploy and complete any authorization steps.
6. Copy the web app URL ending in `/exec`.

For a public portfolio, make sure the selected access settings are compatible with your intended audience. A publicly accessible endpoint may expose personal information and allow visitors to trigger document generation.

Do not assume that keeping the URL private provides adequate access control.

### Available backend operations

The deployed endpoint supports:

| URL | Result |
|---|---|
| `<WEB_APP_URL>/exec` | Spreadsheet data as JSON |
| `<WEB_APP_URL>/exec?action=resumeMarkdown` | Resume Markdown as plain text |
| `<WEB_APP_URL>/exec?action=generateResume` | Generated document URLs and Markdown in JSON |

Replace `<WEB_APP_URL>` with your actual deployment URL.

You can test the Markdown endpoint by opening the URL in a browser. Test document generation only when you are ready for the script to create or archive files.

## 6. Configure the React Frontend

The frontend configuration is located at `src/config/index.js`:

```javascript
export const CONFIG = {
  RESUME_API_URL: import.meta.env.VITE_RESUME_API_URL || ''
};
```

Create a `.env` file in the project root, alongside `package.json`:

```dotenv
VITE_RESUME_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Replace the example URL with your actual Apps Script `/exec` URL.

The frontend uses `src/api/resume-server.js` to construct requests to the backend. You do not need to hardcode the deployment URL in that file.

Restart Vite after modifying `.env`:

```bash
npm run dev
```

**Security note:** variables prefixed with `VITE_` are included in client-side code. Store only the public endpoint URL here, never passwords, private keys, or other secrets.

## 7. Run the Application

Start the development server:

```bash
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

Verify the following:

1. The portfolio loads without frontend errors.
2. The resume preview displays the expected content.
3. The Generate Resume button initiates document generation.
4. A successful response displays links to the generated files.
5. The Markdown, Google Docs, and PDF files open successfully.
6. A second generation archives the previous generated files and creates the latest set.

## 8. Production Build

Build the frontend:

```bash
npm run build
```

Vite writes the production output to `dist/` by default.

Deploy the contents of `dist/` to your preferred static hosting service. Configure the production build with the correct `VITE_RESUME_API_URL` value before building.

After deployment, test the portfolio against the deployed Apps Script backend. The development server and the production host may behave differently, especially with browser cross-origin restrictions and Google Apps Script redirects.

## 9. Troubleshooting

### The resume preview is empty or fails to load

- Verify `VITE_RESUME_API_URL`.
- Check that the URL ends in `/exec`.
- Confirm the Apps Script deployment is active.
- Check the browser console and Network tab.
- Check Apps Script execution logs.
- Verify the backend is bound to the correct spreadsheet.

### The backend returns an error

- Confirm the spreadsheet contains a non-empty `Name` field in `Personal_Info`.
- Check that sheet names and column headers match the documented schema.
- Verify the output folder ID.
- Confirm the script's Google account has the required permissions.

### Document generation fails

- Run `testGenerateResume` from Apps Script and inspect the execution log.
- Check that the configured Drive folder exists and is accessible.
- Verify that authorization has been completed.
- Check Apps Script quotas and execution limits.

### Files are generated in the wrong folder

- Recheck `OUTPUT_FOLDER_ID`.
- Confirm the folder ID belongs to the intended destination folder.
- Check whether previous files were moved into the `archive` subfolder.

### Frontend environment changes do not apply

- Confirm `.env` is in the project root.
- Confirm the variable is named `VITE_RESUME_API_URL`.
- Restart the Vite server.
- Rebuild the frontend after changing production environment variables.

## 10. Security Checklist

Before making a deployment public:

- [ ] Remove real personal data from sample files committed to Git.
- [ ] Keep `.env` out of version control.
- [ ] Review Apps Script access and execution settings.
- [ ] Ensure only intended users can access private resume data.
- [ ] Consider controls against unauthorized or excessive document generation.
- [ ] Review Google Drive sharing permissions on generated files.
- [ ] Test the deployed frontend and backend together.

## Related Documentation

- [README.md](README.md)
- [Vite documentation](https://vite.dev/guide/)
- [Google Apps Script web apps](https://developers.google.com/apps-script/guides/web)
- [Google Sheets documentation](https://developers.google.com/sheets)
- [Google Drive documentation](https://developers.google.com/drive)