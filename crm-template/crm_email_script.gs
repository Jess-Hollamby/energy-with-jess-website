// ============================================================
// CRM EMAIL AUTOMATION - Google Apps Script
// ============================================================
// HOW TO INSTALL:
//   1. Open your Google Sheet
//   2. Click Extensions > Apps Script
//   3. Delete any existing code and paste this entire file
//   4. Fill in your details in the CONFIG section below
//   5. Save (Ctrl+S / Cmd+S)
//   6. Set up triggers - see setup guide for instructions
// ============================================================


// ============================================================
// PLUG IN YOUR DETAILS
// ============================================================

const CONFIG = {
  businessName:  "YOUR BUSINESS NAME",           // shown in email sign-off
  yourName:      "YOUR FIRST NAME",              // your name for sign-off
  yourEmail:     "you@yourbusiness.com",          // emails sent FROM this address
  replyToEmail:  "you@yourbusiness.com",          // replies go here (usually same as above)
  bookingLink:   "https://YOUR-BOOKING-LINK",     // link to your booking page
  websiteLink:   "https://YOUR-WEBSITE",          // your website homepage
  sheetName:     "Leads",                         // name of the sheet tab (check it matches exactly)
};

// Column positions - must match your Google Sheet column order
// 0 = Column A, 1 = Column B, etc.
const COLS = {
  timestamp:          0,   // A - auto-filled by form
  firstName:          1,   // B
  lastName:           2,   // C
  email:              3,   // D
  phone:              4,   // E
  source:             5,   // F - "How did you find us?"
  interest:           6,   // G - "What are you enquiring about?"
  message:            7,   // H - "Anything else?"
  stage:              8,   // I - Pipeline Stage
  notes:              9,   // J - Notes
  lastContacted:     10,   // K - Last Contacted
  email1Sent:        11,   // L - auto-filled by script (do not edit)
  email2Sent:        12,   // M - auto-filled by script (do not edit)
  email3Sent:        13,   // N - auto-filled by script (do not edit)
  email4DraftDone:   14,   // O - auto-filled by script (do not edit)
  email5DraftDone:   15,   // P - auto-filled by script (do not edit)
};

// ============================================================
// EMAIL TEMPLATES
// Personalise each one in your client's voice.
// [BRACKETS] = placeholder text to fill in.
// ============================================================


// --- EMAIL 1: Confirmation + welcome (sent immediately, auto) ---
function getEmail1(firstName) {
  return {
    subject: `Thanks for reaching out, ${firstName}`,
    body:
`Hi ${firstName},

Thank you for getting in touch - I've received your enquiry and will be back to you shortly.

[2-3 SENTENCES: Warm welcome. Who you are, what you do, and what happens next.
Example: "In the meantime, feel free to have a look around the website - you'll find more about how I work and what sessions look like."]

If you have any questions before then, you're welcome to reply to this email.

[SIGN-OFF],
${CONFIG.yourName}
${CONFIG.businessName}
${CONFIG.websiteLink}`
  };
}


// --- EMAIL 2: Personal follow-up (sent day 3, auto) ---
function getEmail2(firstName) {
  return {
    subject: `Following up, ${firstName}`,
    body:
`Hi ${firstName},

Just following up on your enquiry from a few days ago - I wanted to check in and see if you had any questions.

[2-3 SENTENCES: Keep it warm and low pressure. Acknowledge what they might be going through.
Example: "Sometimes it takes a little time to figure out where to start, and that's completely okay."]

If you're ready to book or want to have a chat first, you can do that here:
${CONFIG.bookingLink}

Otherwise, no rush - just reply to this email and we can work out what feels right.

[SIGN-OFF],
${CONFIG.yourName}
${CONFIG.businessName}`
  };
}


// --- EMAIL 3: Value email + soft offer (sent day 7, auto) ---
function getEmail3(firstName) {
  return {
    subject: `[SHORT SUBJECT - a question or something relevant to what they enquired about]`,
    body:
`Hi ${firstName},

[3-5 SENTENCES: Share something genuinely useful - a common question you hear, something clients often say when they first reach out, or a small piece of advice related to their enquiry. This is connection, not a pitch.]

If you're thinking about [SERVICE NAME / WHAT THEY ENQUIRED ABOUT], I'd love to help.

You can book a [SESSION TYPE / FREE CALL] here:
${CONFIG.bookingLink}

No pressure at all - just here when you're ready.

[SIGN-OFF],
${CONFIG.yourName}
${CONFIG.businessName}
${CONFIG.websiteLink}`
  };
}


// --- EMAIL 4: Personalised follow-up (day 14, DRAFT - review before sending) ---
function getEmail4(firstName) {
  return {
    subject: `[WRITE YOUR OWN SUBJECT - keep it personal]`,
    body:
`Hi ${firstName},

[THIS IS A DRAFT - personalise before sending.

Suggested approach: reference what they were interested in specifically,
ask a genuine question about where they're at, or share something that
feels relevant to their situation. Keep it short and human.]

[SIGN-OFF],
${CONFIG.yourName}`
  };
}


// --- EMAIL 5: Final touchpoint (day 30, DRAFT - review before sending) ---
function getEmail5(firstName) {
  return {
    subject: `Still here when you're ready, ${firstName}`,
    body:
`Hi ${firstName},

[THIS IS A DRAFT - personalise before sending.

Suggested approach: short, warm, zero pressure. Let them know you're
still available and give them one easy next step if they want to take it.]

${CONFIG.bookingLink}

[SIGN-OFF],
${CONFIG.yourName}
${CONFIG.businessName}`
  };
}


// ============================================================
// CORE FUNCTIONS - no need to edit below this line
// ============================================================

// Triggered immediately when a form is submitted
function onFormSubmit(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.sheetName);
  if (!sheet) { Logger.log("ERROR: Sheet not found - " + CONFIG.sheetName); return; }

  const row     = e.range.getRow();
  const data    = sheet.getRange(row, 1, 1, 16).getValues()[0];
  const email   = (data[COLS.email]     || "").trim();
  const first   = (data[COLS.firstName] || "there").trim();

  if (!email) { Logger.log("No email address found in row " + row); return; }

  // Set initial pipeline stage if empty
  if (!data[COLS.stage]) {
    sheet.getRange(row, COLS.stage + 1).setValue("New Lead");
  }

  // Send Email 1
  try {
    const e1 = getEmail1(first);
    GmailApp.sendEmail(email, e1.subject, e1.body, {
      name: CONFIG.businessName,
      replyTo: CONFIG.replyToEmail
    });
    sheet.getRange(row, COLS.email1Sent    + 1).setValue(new Date().toISOString());
    sheet.getRange(row, COLS.lastContacted + 1).setValue(new Date().toLocaleDateString("en-AU"));
    Logger.log("Email 1 sent to " + email);
  } catch(err) {
    Logger.log("Email 1 failed for " + email + ": " + err);
  }
}


// Runs on a daily schedule to send follow-up emails
// Set this up as a time-based trigger: see setup guide
function sendScheduledEmails() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.sheetName);
  if (!sheet) { Logger.log("ERROR: Sheet not found"); return; }

  const data = sheet.getDataRange().getValues();
  const now  = new Date();

  for (let i = 1; i < data.length; i++) {
    const row       = data[i];
    const email     = (row[COLS.email]     || "").trim();
    const first     = (row[COLS.firstName] || "there").trim();
    const ts        = row[COLS.timestamp];
    const rowNum    = i + 1;

    if (!email || !ts) continue;

    const daysSince = Math.floor((now - new Date(ts)) / 864e5);

    // Email 2 - day 3 (auto-send)
    if (daysSince >= 3 && !row[COLS.email2Sent]) {
      try {
        const e2 = getEmail2(first);
        GmailApp.sendEmail(email, e2.subject, e2.body, { name: CONFIG.businessName, replyTo: CONFIG.replyToEmail });
        sheet.getRange(rowNum, COLS.email2Sent    + 1).setValue(new Date().toISOString());
        sheet.getRange(rowNum, COLS.lastContacted + 1).setValue(new Date().toLocaleDateString("en-AU"));
        Logger.log("Email 2 sent to " + email);
      } catch(err) { Logger.log("Email 2 failed for " + email + ": " + err); }
    }

    // Email 3 - day 7 (auto-send)
    if (daysSince >= 7 && !row[COLS.email3Sent]) {
      try {
        const e3 = getEmail3(first);
        GmailApp.sendEmail(email, e3.subject, e3.body, { name: CONFIG.businessName, replyTo: CONFIG.replyToEmail });
        sheet.getRange(rowNum, COLS.email3Sent    + 1).setValue(new Date().toISOString());
        sheet.getRange(rowNum, COLS.lastContacted + 1).setValue(new Date().toLocaleDateString("en-AU"));
        Logger.log("Email 3 sent to " + email);
      } catch(err) { Logger.log("Email 3 failed for " + email + ": " + err); }
    }

    // Email 4 - day 14 (draft only - needs manual review before sending)
    if (daysSince >= 14 && !row[COLS.email4DraftDone]) {
      try {
        const e4 = getEmail4(first);
        GmailApp.createDraft(email, e4.subject, e4.body, { name: CONFIG.businessName, replyTo: CONFIG.replyToEmail });
        sheet.getRange(rowNum, COLS.email4DraftDone + 1).setValue(new Date().toISOString());
        Logger.log("Email 4 DRAFT created for " + email + " - check Gmail Drafts before sending");
      } catch(err) { Logger.log("Email 4 draft failed for " + email + ": " + err); }
    }

    // Email 5 - day 30 (draft only - needs manual review before sending)
    if (daysSince >= 30 && !row[COLS.email5DraftDone]) {
      try {
        const e5 = getEmail5(first);
        GmailApp.createDraft(email, e5.subject, e5.body, { name: CONFIG.businessName, replyTo: CONFIG.replyToEmail });
        sheet.getRange(rowNum, COLS.email5DraftDone + 1).setValue(new Date().toISOString());
        Logger.log("Email 5 DRAFT created for " + email + " - check Gmail Drafts before sending");
      } catch(err) { Logger.log("Email 5 draft failed for " + email + ": " + err); }
    }
  }
}


// ============================================================
// TEST FUNCTION
// Run this first to confirm everything is connected correctly.
// Click the run button (triangle) with this function selected.
// ============================================================
function testSetup() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.sheetName);
  if (!sheet) {
    Logger.log("FAIL: Sheet tab '" + CONFIG.sheetName + "' not found. Check the sheetName in CONFIG matches your sheet tab name exactly.");
    return;
  }
  Logger.log("OK: Sheet found - " + CONFIG.sheetName);
  Logger.log("OK: Business name - " + CONFIG.businessName);
  Logger.log("OK: Sending as - " + CONFIG.yourEmail);
  Logger.log("OK: Reply-to - " + CONFIG.replyToEmail);
  Logger.log("---");
  Logger.log("Setup looks good. Next: set up your triggers (see setup guide).");
}
