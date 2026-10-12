# Resumer

**An open-source, data-driven personal resume system.**

Resumer turns structured career information into an up-to-date resume that can be previewed on a personal portfolio and generated as Markdown, Google Docs, and PDF documents.

It uses Google Sheets as the resume data source, Google Apps Script as the generation backend, and React + Vite for the frontend.

## Features

- **Centralized resume data:** Manage personal information, experience, education, skills, and projects in Google Sheets.
- **Markdown-first generation:** Generate Markdown as the canonical resume representation.
- **Multiple document formats:** Generate Markdown, Google Docs, and PDF versions.
- **Personal portfolio:** Preview the resume through a React-based web interface.
- **Google Drive integration:** Save generated files to a configured Drive folder.
- **Version archiving:** Move previous generated resume files into an `archive` subfolder.
- **Customizable templates:** Adjust resume content and Google Docs formatting through the Apps Script backend.
- **Simple deployment:** Run the frontend with Vite and deploy the backend as a Google Apps Script web app.

## How It Works

```text
Google Sheets
     |
     v
Google Apps Script
     |
     v
Resume Markdown
     |
     +------> Markdown file
     +------> Google Docs
     +------> PDF
     |
     v
Google Drive

React + Vite Portfolio
     |
     +------> Fetch and preview Markdown
     |
     +------> Request document generation
```

Google Sheets holds the source data. Apps Script reads the spreadsheet, builds the Markdown resume, creates the Google Docs and PDF versions, and stores the generated files in Google Drive.

The frontend communicates with Apps Script through a centralized API module.

## Technology Stack

- React 19
- Vite
- JavaScript (ES modules)
- Tailwind CSS 4
- React Markdown
- Google Sheets
- Google Apps Script
- Google Docs and Google Drive

## Project Structure

```text
personal-resume-system/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── api/
│   │   └── resume-server.js
│   ├── assets/
│   ├── components/
│   │   ├── Portfolio.jsx
│   │   ├── ResumeControls.jsx
│   │   └── index.js
│   ├── config/
│   │   └── index.js
│   ├── server-data/
│   │   ├── README.md
│   │   ├── resume-backend.js
│   │   └── resume-db.xlsx
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── README.md
└── SETUP.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- A Google account
- Access to Google Sheets, Google Apps Script, Google Docs, and Google Drive

### Installation

```bash
git clone https://github.com/mohadbran/resumer.git
cd resumer
npm install
```

Create a `.env` file in the project root:

```dotenv
VITE_RESUME_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Replace the example URL with your deployed Apps Script web app URL.

Start the development server:

```bash
npm run dev
```

For detailed Google Sheets, Apps Script, and Drive configuration, see [SETUP.md](SETUP.md).

## Available Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the frontend for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Backend API

The Apps Script web app supports these operations:

| Endpoint | Description |
|---|---|
| `/exec` | Return spreadsheet data as JSON |
| `/exec?action=resumeMarkdown` | Generate and return resume Markdown |
| `/exec?action=generateResume` | Generate and save resume documents |

The generation endpoint returns JSON containing the URLs of the generated Markdown, Google Docs, and PDF files.

## Customization

You can customize Resumer by:

- Editing your Google Sheets data.
- Updating Markdown generation logic in `src/server-data/resume-backend.js`.
- Adjusting Google Docs formatting constants such as font family and font sizes.
- Updating the React components and Tailwind styles.
- Configuring the destination folder and archive folder in the Apps Script backend.

## Privacy and Security

Before deploying or publishing Resumer:

- Do not commit private `.env` files.
- Do not publish your real resume spreadsheet if it contains personal information.
- Use sanitized sample data in public repositories.
- Remember that Vite environment variables prefixed with `VITE_` are exposed to frontend code.
- Review Apps Script deployment permissions carefully.
- Restrict access to personal data and generated documents as appropriate.
- Consider protecting the generation endpoint against unauthorized use and excessive requests before offering a public deployment.

## Contributing

Contributions, suggestions, and bug reports are welcome.

Please keep pull requests focused, test the resume generation workflow, and avoid committing personal information or credentials.

## License

Resumer is open-source software licensed under the [MIT License](LICENSE).

## Project Status

Resumer is a personal resume management and document-generation project. Features and deployment requirements may evolve as the project develops.