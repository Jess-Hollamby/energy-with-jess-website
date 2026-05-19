# CRM Kit - Setup Guide

A simple lead management system built on Google tools.
Works on any device - Mac, Windows, or phone - through a browser.

---

## What's in the kit

| File | What it does |
|---|---|
| `crm_dashboard.html` | Visual pipeline dashboard - open in any browser |
| `crm_email_script.gs` | Automated email follow-up sequence |
| `setup_guide.md` | This file |

---

## Before you start - what you need

- A Google account (Gmail or Google Workspace)
- Access to Google Forms and Google Sheets (free)
- 30-45 minutes to set everything up

---

## STEP 1 - Create your Google Sheet

This is where all your leads are stored.

1. Go to sheets.google.com and create a new spreadsheet
2. Rename the sheet tab at the bottom to: **Leads** (must match exactly)
3. Add these column headers in Row 1, one per column:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | First Name | Last Name | Email | Phone | How did you find us? | What are you enquiring about? | Anything else? | Pipeline Stage | Notes | Last Contacted | Email 1 Sent | Email 2 Sent | Email 3 Sent | Email 4 Draft | Email 5 Draft |

**Note:** Columns L through P are filled in automatically by the script - do not type in these columns.

---

## STEP 2 - Create your Google Form

This captures enquiries and sends them straight to your sheet.

1. Go to forms.google.com and create a new form
2. Add these fields:

| Field | Type | Required? |
|---|---|---|
| First Name | Short answer | Yes |
| Last Name | Short answer | No |
| Email | Short answer (or Email) | Yes |
| Phone | Short answer | No |
| How did you find us? | Dropdown or Short answer | No |
| What are you enquiring about? | Dropdown or Short answer | No |
| Anything else? | Paragraph | No |

3. Connect the form to your sheet:
   - Click the **Responses** tab at the top of the form
   - Click the green Sheets icon (or the three-dot menu > Select destination)
   - Choose "Select existing spreadsheet" and choose the sheet you created in Step 1
   - Google will map the responses to your sheet automatically

**Tip:** For "How did you find us?" and "What are you enquiring about?" - use a Dropdown field and list your actual services/sources. This makes filtering in the dashboard much more useful.

---

## STEP 3 - Add the email script

1. Open your Google Sheet
2. Click **Extensions** in the top menu > **Apps Script**
3. Delete any existing code in the editor
4. Open `crm_email_script.gs` from this kit, copy all the text, and paste it in
5. Fill in your details in the **CONFIG section** at the top of the script (see plug-in list below)
6. Click **Save** (the floppy disk icon, or Ctrl+S / Cmd+S)
7. Run the test: select `testSetup` from the function dropdown and click Run (triangle button)
   - The first time you run it, Google will ask for permission - click through and approve
   - Check the logs at the bottom - it should say "Setup looks good"

### Set up triggers (so emails send automatically)

Triggers tell the script when to run.

1. In the Apps Script editor, click the clock icon on the left sidebar (Triggers)
2. Click **+ Add Trigger** (bottom right)
3. Add these two triggers:

**Trigger 1 - Form submit (sends Email 1 immediately)**
- Function: `onFormSubmit`
- Event source: From spreadsheet
- Event type: On form submit
- Save

**Trigger 2 - Daily check (sends Emails 2, 3, and creates drafts 4 and 5)**
- Function: `sendScheduledEmails`
- Event source: Time-driven
- Type: Day timer
- Time: Choose a consistent time (e.g. 8am)
- Save

---

## STEP 4 - Set up the dashboard

1. Open `crm_dashboard.html` in a text editor
   - On Mac: right-click the file > Open With > TextEdit (then turn off rich text: Format > Make Plain Text)
   - On Windows: right-click > Open With > Notepad
2. Find the **PLUG IN SECTION** near the top
3. Update `BUSINESS_NAME` and `SHEET_CSV_URL` (see below for how to get the CSV URL)
4. Save the file
5. Open it in any browser to view your dashboard

### How to get your Google Sheet CSV URL

1. Open your Google Sheet
2. Click **File** > **Share** > **Publish to web**
3. In the first dropdown, choose your **Leads** sheet tab
4. In the second dropdown, choose **Comma-separated values (.csv)**
5. Click **Publish** and confirm
6. Copy the URL that appears
7. Paste it into `crm_dashboard.html` where it says `YOUR_GOOGLE_SHEET_CSV_URL_HERE`

**Note:** The dashboard is read-only. To update a lead's pipeline stage or add notes, go directly to the Google Sheet and edit the row there, then click Refresh on the dashboard.

---

## PLUG-IN CHECKLIST

Everything you need to fill in before handing to your client.

### In crm_email_script.gs (CONFIG section)

- [ ] `businessName` - your business name
- [ ] `yourName` - your first name (for email sign-offs)
- [ ] `yourEmail` - the email address you send from
- [ ] `replyToEmail` - where replies should go (usually the same)
- [ ] `bookingLink` - your booking page URL
- [ ] `websiteLink` - your website homepage URL
- [ ] `sheetName` - must match your sheet tab name exactly (default: Leads)

### In crm_email_script.gs (email templates)

- [ ] Email 1 - welcome message in your voice (replace [BRACKETS])
- [ ] Email 2 - follow-up check-in (replace [BRACKETS])
- [ ] Email 3 - value email + soft offer (replace [BRACKETS])
- [ ] Emails 4 and 5 - draft structure only, written personally before each send

### In crm_dashboard.html (PLUG IN SECTION)

- [ ] `BUSINESS_NAME` - your business name
- [ ] `SHEET_CSV_URL` - published CSV link from Google Sheets

### Optional customisation in crm_dashboard.html

- [ ] Brand colours (CSS variables at the top of the file)
- [ ] Pipeline stage names (STAGES array - must match what's typed in your sheet)

---

## Pipeline stage reference

These are the default stages. Update them in both the dashboard file and the sheet if you want different names - they must match exactly.

| Stage | What it means |
|---|---|
| New Lead | Just submitted the form - not yet contacted |
| Contacted | You've reached out or replied |
| Follow Up | Waiting for a response or next step |
| Booked | Session or call is confirmed |
| Client | Active or completed client |
| Cold | No response, not a fit, or closed |

To move a lead between stages: open the Google Sheet, find their row, and type the new stage name in Column I.

---

## Email sequence overview

| Email | Timing | Sent how | What it does |
|---|---|---|---|
| Email 1 | Immediately | Auto | Confirmation + warm welcome |
| Email 2 | Day 3 | Auto | Gentle follow-up |
| Email 3 | Day 7 | Auto | Value email + soft offer |
| Email 4 | Day 14 | Draft (review first) | Personalised check-in |
| Email 5 | Day 30 | Draft (review first) | Final touchpoint |

Emails 4 and 5 are created as drafts in Gmail - check your Drafts folder, personalise them, then send manually.

---

## Troubleshooting

**Dashboard says "Could not load data"**
- Check the sheet is published to web (File > Share > Publish to web)
- Make sure the CSV URL in the dashboard file is correct
- Try opening the CSV URL directly in a browser - if it shows data, the URL is correct

**Emails not sending**
- Run `testSetup` in Apps Script and check the logs
- Make sure the form is connected to the correct sheet
- Check that the `onFormSubmit` trigger exists and is linked to the right function
- Check Apps Script permissions have been approved

**Sheet tab not found error**
- The `sheetName` in CONFIG must match the sheet tab name exactly, including capitalisation
- Default is: Leads

**New leads not appearing in dashboard**
- Click the Refresh button - the dashboard does not update in real time
- The dashboard auto-refreshes every 5 minutes when the browser tab is open

---

## Notes for service providers building this for clients

- This kit works as-is for most service-based businesses
- Adjust the pipeline stage names to match how the client actually talks about their process
- The email templates are intentionally left sparse - fill them in with the client's actual voice before handing over
- For clients with existing freebie opt-in funnels, swap the enquiry form for a freebie form and update Email 1 to include the download link
- For clients on Microsoft 365 (Outlook, Excel) - a separate version is available on request

### If the client has both a freebie funnel AND a booking system

Use two separate sheet tabs instead of one - a **Contacts** tab (freebie leads, enters the nurture sequence) and a **Bookings** tab (paying or booked clients, no automated emails). This prevents booking clients from receiving the freebie welcome sequence, which happens when everything is in one tab. The Apps Script writes to the correct tab based on how the contact came in.

---

## Troubleshooting

**Dropdown menus have disappeared from the sheet**

Dropdown validation is stored at the cell level in Google Sheets. It can be accidentally wiped when rows are deleted, columns are reformatted, or data is pasted over. To protect against this:

- Hardcode the dropdown lists in the Apps Script and include a restore function (e.g. `restoreDropdowns()`) that re-applies them to all rows at once
- Run the restore function any time menus go missing - it is safe to run repeatedly and will not affect data
- This is especially important for columns clients edit regularly (pipeline stage, source, status) where accidental clearing is most likely
