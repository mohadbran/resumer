/**
 * ENTRY POINT: Web App
 * - Default: Return all Sheets data as JSON
 * - action=generateResume: Generate formatted resume (Doc + PDF)
 */


/**
 * Resume Generator
 * Google Sheets -> Markdown -> Google Docs + PDF
 *
 * Expected sheets:
 * Personal_Info, Experience, Education, Skills, Projects
 *
 * The first row of each sheet contains column headers.
 */

const CONFIG = {
  OUTPUT_PREFIX: "ATS Resume",
  OUTPUT_FOLDER_ID: "YOUR_OUTPUT_FOLDER_ID",
  ARCHIVE_FOLDER_NAME: "archive",
  FONT_FAMILY: "Arial",
  BODY_FONT_SIZE: 10,
  NAME_FONT_SIZE: 20,
  SECTION_FONT_SIZE: 12
};

/**
 * Web app entry point.
 *
 * /exec                       -> JSON data
 * /exec?action=resumeMarkdown -> Markdown text
 * /exec?action=generateResume -> Generate files and return URLs
 */
function doGet(e) {
  const action = e && e.parameter
    ? e.parameter.action || ""
    : "";

  try {
    if (action === "resumeMarkdown") {
      return ContentService
        .createTextOutput(generateResumeMarkdown())
        .setMimeType(ContentService.MimeType.TEXT);
    }

    if (action === "generateResume") {
      return jsonResponse(generateResume());
    }

    return jsonResponse(getSheetData());

  } catch (error) {
    return jsonResponse({
      success: false,
      error: error.message
    });
  }
}

/**
 * Return JSON response.
 */
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Read all sheets into objects using the first row as headers.
 * Display values are used to preserve dates and phone formatting.
 */
function getSheetData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const result = {};

  ss.getSheets().forEach(function(sheet) {
    const values = sheet.getDataRange().getDisplayValues();

    if (values.length === 0) {
      result[sheet.getName()] = [];
      return;
    }

    const headers = values[0].map(function(header) {
      return String(header).trim();
    });

    result[sheet.getName()] = values
      .slice(1)
      .filter(function(row) {
        return row.some(function(value) {
          return String(value).trim() !== "";
        });
      })
      .map(function(row) {
        const item = {};

        headers.forEach(function(header, index) {
          if (header) {
            item[header] = row[index] || "";
          }
        });

        return item;
      });
  });

  return result;
}

/**
 * Generate the canonical Markdown resume.
 * This function does not create files.
 */
function generateResumeMarkdown() {
  const data = getSheetData();
  const personal = firstItem(data, "Personal_Info");

  if (!personal.Name) {
    throw new Error(
      'Personal_Info must contain a non-empty "Name" field.'
    );
  }

  const lines = [];

  // Contact information
  lines.push("# " + personal.Name);
  lines.push("");

  const contact = [];

  if (personal.Email) {
    contact.push("Email: " + personal.Email);
  }

  if (personal.Phone) {
    contact.push("Phone: " + personal.Phone);
  }

  if (personal.LinkedIn) {
    contact.push("LinkedIn: " + personal.LinkedIn);
  }

  if (personal.Website) {
    contact.push("Website: " + personal.Website);
  }

  if (contact.length) {
    lines.push(contact.join(" | "));
    lines.push("");
  }

  // Summary
  addSection(lines, "PROFESSIONAL SUMMARY");

  if (personal.Summary) {
    lines.push(cleanText(personal.Summary));
    lines.push("");
  }

  // Skills
  const skills = getRows(data, "Skills");

  if (skills.length) {
    addSection(lines, "TECHNICAL SKILLS");

    skills.forEach(function(skill) {
      const name = cleanText(skill.Skill);
      const category = cleanText(skill.Category);
      const proficiency = cleanText(skill.Proficiency);

      if (!name) return;

      let label = category
        ? "**" + category + ":** "
        : "";

      let value = name;

      if (proficiency) {
        value += " (" + proficiency + ")";
      }

      lines.push("- " + label + value);
    });

    lines.push("");
  }

  // Professional experience
  const experiences = getRows(data, "Experience");

  if (experiences.length) {
    addSection(lines, "PROFESSIONAL EXPERIENCE");

    experiences.forEach(function(exp) {
      const role = cleanText(exp.Role);
      const company = cleanText(exp.Company);
      const start = cleanText(exp.Start_Date);
      const end = cleanText(exp.End_Date);
      const location = cleanText(exp.Location);

      const heading = [
        role,
        company ? "— " + company : "",
        location ? "| " + location : ""
      ].filter(Boolean).join(" ");

      if (heading) {
        lines.push("### " + heading);
      }

      const dates = [start, end].filter(Boolean).join(" – ");

      if (dates) {
        lines.push("*" + dates + "*");
      }

      lines.push("");

      addDescriptionBullets(lines, exp.Description);

      if (exp.Achievements) {
        addDescriptionBullets(lines, exp.Achievements);
      }

      lines.push("");
    });
  }

  // Education
  const education = getRows(data, "Education");

  if (education.length) {
    addSection(lines, "EDUCATION");

    education.forEach(function(item) {
      const degree = cleanText(item.Degree);
      const institution = cleanText(item.Institution);
      const year = cleanText(item.Year);

      const heading = [
        degree,
        institution ? "— " + institution : "",
        year ? ", " + year : ""
      ].filter(Boolean).join(" ");

      if (heading) {
        lines.push("**" + heading + "**");
      }

      if (item.Achievements) {
        lines.push(cleanText(item.Achievements));
      }

      lines.push("");
    });
  }

  // Projects
  const projects = getRows(data, "Projects");

  if (projects.length) {
    addSection(lines, "PROJECTS");

    projects.forEach(function(project) {
      const name = cleanText(project.Name);

      if (name) {
        lines.push("### " + name);
      }

      if (project.Description) {
        lines.push(cleanText(project.Description));
      }

      if (project.Tech_Stack) {
        lines.push(
          "- **Technologies:** " +
          cleanText(project.Tech_Stack)
        );
      }

      if (project.Link) {
        const link = cleanText(project.Link);

        lines.push(
          "- **Link:** " + formatMarkdownLink(link)
        );
      }

      lines.push("");
    });
  }

  // Certifications (optional sheet)
  const certifications = getRows(data, "Certifications");

  if (certifications.length) {
    addSection(lines, "CERTIFICATIONS");

    certifications.forEach(function(item) {
      const title = cleanText(item.Title || item.Name);
      const issuer = cleanText(item.Issuer);
      const year = cleanText(item.Year);

      const details = [issuer, year].filter(Boolean).join(", ");
      const text = [title, details].filter(Boolean).join(" — ");

      if (text) lines.push("- " + text);
    });

    lines.push("");
  }

  return lines.join("\n").trim() + "\n";
}

/**
 * Create Markdown, Google Doc, and PDF files in Drive.
 */

/**
 * Create Markdown, Google Doc, and PDF files
 * inside the generated-resumes Drive folder.
 */

/**
 * Generate the latest resume files.
 *
 * Current files use stable names.
 * Previous generated files are moved into the archive folder.
 */
function generateResume() {
  const markdown = generateResumeMarkdown();

  // Get the configured destination folder.
  const outputFolder = getOrCreateOutputFolder();

  // Archive existing generated files before creating replacements.
  const archiveResult =
    archivePreviousResumeFiles(outputFolder);

  // Stable filenames prevent timestamp-based clutter.
  const markdownName = CONFIG.OUTPUT_PREFIX + ".md";
  const docName = CONFIG.OUTPUT_PREFIX;
  const pdfName = CONFIG.OUTPUT_PREFIX + ".pdf";

  // 1. Create the Markdown file in the output folder.
  const markdownFile = outputFolder.createFile(
    markdownName,
    markdown,
    MimeType.PLAIN_TEXT
  );

  // 2. Create and format the Google Doc.
  const doc = DocumentApp.create(docName);
  const body = doc.getBody();

  body.clear();
  renderMarkdownToDoc(body, markdown);

  doc.saveAndClose();

  // Move the newly created Google Doc into the output folder.
  const docFile = DriveApp.getFileById(doc.getId());
  docFile.moveTo(outputFolder);

  // 3. Export the Google Doc as a PDF.
  const pdfBlob = docFile
    .getAs(MimeType.PDF)
    .setName(pdfName);

  const pdfFile = outputFolder.createFile(pdfBlob);

  return {
    success: true,
    folderUrl: outputFolder.getUrl(),
    archiveUrl: archiveResult.folder.getUrl(),
    archivedCount: archiveResult.archivedCount,
    markdownUrl: markdownFile.getUrl(),
    docUrl: docFile.getUrl(),
    pdfUrl: pdfFile.getUrl(),
    markdown: markdown
  };
}



/**
 * Render a useful ATS-friendly subset of Markdown into Google Docs.
 * Supports headings, bullets, bold, italic, and Markdown links.
 */
function renderMarkdownToDoc(body, markdown) {
  const lines = markdown.split("\n");

  lines.forEach(function(line) {
    const value = line.trim();

    if (!value) {
      return;
    }

    if (/^---+$/.test(value)) {
      const paragraph = body.appendParagraph("");
      paragraph.setSpacingAfter(4);
      return;
    }

    const headingMatch = value.match(/^(#{1,3})\s+(.+)$/);

    if (headingMatch) {
      const level = headingMatch[1].length;
      const headingText = headingMatch[2];

      const paragraph = body.appendParagraph("");
      paragraph.setFontFamily(CONFIG.FONT_FAMILY);
      paragraph.setSpacingBefore(level === 1 ? 0 : 8);
      paragraph.setSpacingAfter(3);

      if (level === 1) {
        paragraph.setHeading(DocumentApp.ParagraphHeading.TITLE);
        paragraph.setFontSize(CONFIG.NAME_FONT_SIZE);
        paragraph.setBold(true);
      } else if (level === 2) {
        paragraph.setHeading(DocumentApp.ParagraphHeading.HEADING2);
        paragraph.setFontSize(CONFIG.SECTION_FONT_SIZE);
        paragraph.setBold(true);
      } else {
        paragraph.setHeading(DocumentApp.ParagraphHeading.HEADING3);
        paragraph.setFontSize(11);
        paragraph.setBold(true);
      }

      appendInlineMarkdown(paragraph, headingText);
      return;
    }

    if (/^[-*]\s+/.test(value)) {
      const item = body.appendListItem("");
      item.setGlyphType(DocumentApp.GlyphType.BULLET);
      item.setFontFamily(CONFIG.FONT_FAMILY);
      item.setFontSize(CONFIG.BODY_FONT_SIZE);
      appendInlineMarkdown(item, value.replace(/^[-*]\s+/, ""));
      return;
    }

    // Italic-only lines are typically employment dates.
    const isItalicLine = /^\*.+\*$/.test(value);
    const text = isItalicLine
      ? value.slice(1, -1)
      : value;

    const paragraph = body.appendParagraph("");
    paragraph.setFontFamily(CONFIG.FONT_FAMILY);
    paragraph.setFontSize(CONFIG.BODY_FONT_SIZE);
    paragraph.setSpacingAfter(3);

    if (isItalicLine) {
      paragraph.setItalic(true);
      paragraph.appendText(text);
    } else {
      appendInlineMarkdown(paragraph, text);
    }
  });
}

/**
 * Append text segments while preserving simple inline Markdown styles.
 */

function appendInlineMarkdown(element, source) {
  const pattern =
    /(\*\*[^*]+\*\*|\*[^*]+\*|__[^_]+__|_[^_]+_|\[[^\]]+\]\(https?:\/\/[^)\s]+\))/g;

  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(source)) !== null) {
    // Append plain text before the Markdown token.
    if (match.index > lastIndex) {
      element.appendText(
        source.substring(lastIndex, match.index)
      );
    }

    const token = match[0];
    let text = token;
    let style = "";

    // Identify bold, italic, or link syntax.
    if (token.startsWith("**") && token.endsWith("**")) {
      text = token.slice(2, -2);
      style = "bold";
    } else if (
      token.startsWith("__") &&
      token.endsWith("__")
    ) {
      text = token.slice(2, -2);
      style = "bold";
    } else if (
      token.startsWith("*") &&
      token.endsWith("*")
    ) {
      text = token.slice(1, -1);
      style = "italic";
    } else if (
      token.startsWith("_") &&
      token.endsWith("_")
    ) {
      text = token.slice(1, -1);
      style = "italic";
    } else {
      const link = token.match(
        /^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/
      );

      if (link) {
        text = link[1];

        // appendText() returns the Text element.
        const appendedText = element.appendText(text);

        appendedText
          .setLinkUrl(0, text.length - 1, link[2])
          .setUnderline(0, text.length - 1, true);

        lastIndex = pattern.lastIndex;
        continue;
      }
    }

    // Format the appended Text element, not the ListItem
    // or Paragraph element.
    const appendedText = element.appendText(text);

    if (text.length > 0 && style === "bold") {
      appendedText.setBold(0, text.length - 1, true);
    } else if (text.length > 0 && style === "italic") {
      appendedText.setItalic(0, text.length - 1, true);
    }

    lastIndex = pattern.lastIndex;
  }

  // Append any remaining plain text.
  if (lastIndex < source.length) {
    element.appendText(source.substring(lastIndex));
  }
}


/**
 * Helpers
 */
function firstItem(data, sheetName) {
  const rows = getRows(data, sheetName);
  return rows.length ? rows[0] : {};
}

function getRows(data, sheetName) {
  return data[sheetName] || [];
}

function addSection(lines, heading) {
  lines.push("## " + heading);
  lines.push("");
}

/**
 * Convert a description into Markdown bullets.
 * Use one bullet per line in the spreadsheet for best results.
 */
function addDescriptionBullets(lines, description) {
  if (!description) return;

  String(description)
    .split(/\n|•\s*/)
    .map(function(part) {
      return cleanText(part);
    })
    .filter(Boolean)
    .forEach(function(part) {
      lines.push("- " + part.replace(/^[-*]\s+/, ""));
    });
}

function cleanText(value) {
  return value == null
    ? ""
    : String(value).trim();
}

/**
 * Avoid treating ordinary URLs as Markdown link syntax.
 * Existing URL text is ATS-readable.
 */
function formatMarkdownLink(value) {
  const url = cleanText(value);

  if (/^https?:\/\//i.test(url)) {
    return "[" + url + "](" + url + ")";
  }

  return url;
}

/**
 * Run manually from the Apps Script editor to test generation.
 * doGet() itself should be tested using the deployed /exec URL.
 */
function testGenerateResume() {
  const result = generateResume();
  Logger.log(JSON.stringify(result, null, 2));
}

/**
 * Get the generated-resumes folder in My Drive.
 * Create it if it does not already exist.
 */
/**
 * Get the exact output folder by ID.
 * Works for folders at any nesting level.
 */
function getOrCreateOutputFolder() {
  const folderId = CONFIG.OUTPUT_FOLDER_ID;

  if (!folderId || folderId === "YOUR_OUTPUT_FOLDER_ID") {
    throw new Error(
      "Configure OUTPUT_FOLDER_ID with your actual Google Drive folder ID."
    );
  }

  return DriveApp.getFolderById(folderId);
}


/**
 * Get or create the archive folder inside the output folder.
 */
function getOrCreateArchiveFolder(outputFolder) {
  const folders = outputFolder.getFoldersByName(
    CONFIG.ARCHIVE_FOLDER_NAME
  );

  if (folders.hasNext()) {
    return folders.next();
  }

  return outputFolder.createFolder(
    CONFIG.ARCHIVE_FOLDER_NAME
  );
}

/**
 * Archive previously generated resume files.
 *
 * Only files whose names begin with OUTPUT_PREFIX are moved.
 * Other files in the output folder remain untouched.
 */
function archivePreviousResumeFiles(outputFolder) {
  const archiveFolder = getOrCreateArchiveFolder(outputFolder);
  const files = outputFolder.getFiles();
  const filesToArchive = [];

  // Collect files before moving them.
  while (files.hasNext()) {
    const file = files.next();
    const fileName = file.getName();

    if (
      fileName.startsWith(CONFIG.OUTPUT_PREFIX) &&
      fileName !== CONFIG.ARCHIVE_FOLDER_NAME
    ) {
      filesToArchive.push(file);
    }
  }

  // Move the previous versions into the archive.
  filesToArchive.forEach(function(file) {
    file.moveTo(archiveFolder);
  });

  return {
    folder: archiveFolder,
    archivedCount: filesToArchive.length
  };
}
