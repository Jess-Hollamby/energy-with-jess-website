"""
generate_pdf.py
Converts setup_guide.md to a polished PDF using ReportLab.
"""

import re
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, Flowable
)
from reportlab.platypus import KeepTogether
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ---------------------------------------------------------------------------
# Colour palette
# ---------------------------------------------------------------------------
PRIMARY      = colors.HexColor("#4a6fa5")   # blue
DARK_GREY    = colors.HexColor("#2d2d2d")
MID_GREY     = colors.HexColor("#555555")
LIGHT_GREY   = colors.HexColor("#f2f2f2")
TABLE_HEADER = PRIMARY
TABLE_ROW_ALT = colors.HexColor("#f7f9fc")
WHITE        = colors.white
RULE_COLOUR  = colors.HexColor("#c8d4e8")
CODE_BG      = colors.HexColor("#f0f0f0")

PAGE_W, PAGE_H = A4
MARGIN = 2 * cm

# ---------------------------------------------------------------------------
# Styles
# ---------------------------------------------------------------------------
styles = getSampleStyleSheet()

def make_style(**kw):
    return ParagraphStyle("custom_" + str(id(kw)), **kw)

TITLE_STYLE = ParagraphStyle(
    "title",
    fontName="Helvetica-Bold",
    fontSize=22,
    textColor=PRIMARY,
    leading=28,
    spaceAfter=6,
    alignment=TA_CENTER,
)

SUBTITLE_STYLE = ParagraphStyle(
    "subtitle",
    fontName="Helvetica",
    fontSize=11,
    textColor=MID_GREY,
    leading=16,
    spaceAfter=14,
    alignment=TA_CENTER,
)

H2_STYLE = ParagraphStyle(
    "h2",
    fontName="Helvetica-Bold",
    fontSize=13,
    textColor=PRIMARY,
    leading=18,
    spaceBefore=14,
    spaceAfter=2,
)

H3_STYLE = ParagraphStyle(
    "h3",
    fontName="Helvetica-Bold",
    fontSize=11,
    textColor=DARK_GREY,
    leading=16,
    spaceBefore=10,
    spaceAfter=4,
)

BODY_STYLE = ParagraphStyle(
    "body",
    fontName="Helvetica",
    fontSize=10.5,
    textColor=DARK_GREY,
    leading=15,
    spaceBefore=2,
    spaceAfter=2,
)

BULLET_STYLE = ParagraphStyle(
    "bullet",
    fontName="Helvetica",
    fontSize=10.5,
    textColor=DARK_GREY,
    leading=15,
    leftIndent=14,
    firstLineIndent=0,
    spaceBefore=1,
    spaceAfter=1,
    bulletIndent=4,
)

NUMBERED_STYLE = ParagraphStyle(
    "numbered",
    fontName="Helvetica",
    fontSize=10.5,
    textColor=DARK_GREY,
    leading=15,
    leftIndent=20,
    firstLineIndent=-14,
    spaceBefore=1,
    spaceAfter=1,
)

CODE_STYLE = ParagraphStyle(
    "code",
    fontName="Courier",
    fontSize=9,
    textColor=DARK_GREY,
    leading=13,
    leftIndent=6,
    rightIndent=6,
    spaceBefore=2,
    spaceAfter=2,
    backColor=CODE_BG,
)

BOLD_LABEL_STYLE = ParagraphStyle(
    "bold_label",
    fontName="Helvetica-Bold",
    fontSize=10.5,
    textColor=DARK_GREY,
    leading=15,
    spaceBefore=6,
    spaceAfter=2,
)

NOTE_STYLE = ParagraphStyle(
    "note",
    fontName="Helvetica-Oblique",
    fontSize=10,
    textColor=MID_GREY,
    leading=14,
    spaceBefore=4,
    spaceAfter=4,
    leftIndent=10,
)

# ---------------------------------------------------------------------------
# Custom Flowables
# ---------------------------------------------------------------------------

class CheckboxItem(Flowable):
    """A checkbox square followed by text."""
    def __init__(self, text, width, style):
        Flowable.__init__(self)
        self.text_content = text
        self.avail_width = width
        self.style = style
        self.box_size = 9
        self.gap = 6

    def wrap(self, aW, aH):
        self.avail_width = aW
        # Build a temporary paragraph to get height
        p = Paragraph(self.text_content, self.style)
        text_w = aW - self.box_size - self.gap
        w, h = p.wrap(text_w, aH)
        self.para = p
        self.height = max(h, self.box_size + 2)
        return aW, self.height

    def draw(self):
        c = self.canv
        box_y = self.height - self.box_size - 1
        c.setStrokeColor(PRIMARY)
        c.setLineWidth(0.8)
        c.rect(0, box_y, self.box_size, self.box_size, fill=0)
        # Draw the paragraph
        self.para.drawOn(c, self.box_size + self.gap, 0)


class CodeBlock(Flowable):
    """A code block with a light grey background box."""
    def __init__(self, text, avail_width):
        Flowable.__init__(self)
        self.code_text = text
        self.avail_width = avail_width
        self.pad = 8

    def wrap(self, aW, aH):
        self.avail_width = aW
        inner_w = aW - self.pad * 2
        # Split into lines and measure
        lines = self.code_text.split("\n")
        self.lines = lines
        # Estimate height: ~13pt per line + padding
        self.height = len(lines) * 13 + self.pad * 2
        return aW, self.height

    def draw(self):
        c = self.canv
        c.setFillColor(CODE_BG)
        c.setStrokeColor(colors.HexColor("#cccccc"))
        c.setLineWidth(0.5)
        c.roundRect(0, 0, self.avail_width, self.height, 4, fill=1, stroke=1)
        c.setFillColor(DARK_GREY)
        c.setFont("Courier", 9)
        y = self.height - self.pad - 10
        for line in self.lines:
            c.drawString(self.pad + 2, y, line)
            y -= 13

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def escape_xml(text):
    """Escape characters that break ReportLab XML parsing."""
    text = text.replace("&", "&amp;")
    text = text.replace("<", "&lt;")
    text = text.replace(">", "&gt;")
    return text

def inline_markup(text):
    """Convert inline markdown (bold, inline code) to ReportLab XML."""
    # Inline code first (before bold, to avoid interference)
    text = re.sub(
        r"`([^`]+)`",
        lambda m: (
            '<font name="Courier" size="9.5" color="#555555">'
            + escape_xml(m.group(1))
            + "</font>"
        ),
        text,
    )
    # Bold **text**
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    # Italic *text*
    text = re.sub(r"\*(.+?)\*", r"<i>\1</i>", text)
    return text

def process_inline(text):
    """Escape XML, then apply inline markup."""
    # We need to escape BEFORE applying markup tags
    # Split on code spans first to protect them
    parts = re.split(r"(`[^`]+`)", text)
    result = []
    for part in parts:
        if part.startswith("`") and part.endswith("`"):
            inner = escape_xml(part[1:-1])
            result.append(
                f'<font name="Courier" size="9.5" color="#555555">{inner}</font>'
            )
        else:
            escaped = escape_xml(part)
            # Bold
            escaped = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", escaped)
            # Italic
            escaped = re.sub(r"\*(.+?)\*", r"<i>\1</i>", escaped)
            result.append(escaped)
    return "".join(result)


def make_table(headers, rows, col_widths=None):
    """Build a styled ReportLab Table."""
    usable_w = PAGE_W - 2 * MARGIN

    if col_widths is None:
        n = len(headers)
        col_widths = [usable_w / n] * n

    header_cells = [
        Paragraph(
            f"<font color='white'><b>{escape_xml(h)}</b></font>", BODY_STYLE
        )
        for h in headers
    ]

    table_data = [header_cells]
    for row in rows:
        table_data.append(
            [Paragraph(process_inline(str(cell)), BODY_STYLE) for cell in row]
        )

    tbl = Table(table_data, colWidths=col_widths, repeatRows=1)

    style_cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), TABLE_HEADER),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("LEADING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#cccccc")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, TABLE_ROW_ALT]),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]
    tbl.setStyle(TableStyle(style_cmds))
    return tbl


# ---------------------------------------------------------------------------
# Markdown parser -> ReportLab flowables
# ---------------------------------------------------------------------------

def parse_markdown(md_text, usable_width):
    flowables = []

    lines = md_text.split("\n")
    i = 0

    def add_spacer(h=4):
        flowables.append(Spacer(1, h))

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # --- Fenced code block ---
        if stripped.startswith("```"):
            code_lines = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith("```"):
                code_lines.append(lines[i])
                i += 1
            i += 1  # skip closing ```
            code_text = "\n".join(code_lines)
            flowables.append(Spacer(1, 4))
            flowables.append(CodeBlock(code_text, usable_width))
            flowables.append(Spacer(1, 4))
            continue

        # --- Horizontal rule ---
        if stripped in ("---", "***", "___") or re.match(r"^-{3,}$", stripped):
            flowables.append(Spacer(1, 6))
            flowables.append(
                HRFlowable(
                    width="100%",
                    thickness=0.5,
                    color=RULE_COLOUR,
                    spaceAfter=6,
                )
            )
            i += 1
            continue

        # --- H1 (title) ---
        if stripped.startswith("# ") and not stripped.startswith("## "):
            text = process_inline(stripped[2:].strip())
            flowables.append(Paragraph(text, TITLE_STYLE))
            i += 1
            continue

        # --- H2 ---
        if stripped.startswith("## ") and not stripped.startswith("### "):
            text = process_inline(stripped[3:].strip())
            flowables.append(Spacer(1, 8))
            flowables.append(Paragraph(text, H2_STYLE))
            flowables.append(
                HRFlowable(
                    width="100%",
                    thickness=0.8,
                    color=PRIMARY,
                    spaceAfter=4,
                )
            )
            i += 1
            continue

        # --- H3 ---
        if stripped.startswith("### "):
            text = process_inline(stripped[4:].strip())
            flowables.append(Spacer(1, 6))
            flowables.append(Paragraph(text, H3_STYLE))
            i += 1
            continue

        # --- H4 (bold trigger labels like **Trigger 1 - ...** on own line) ---
        if stripped.startswith("#### "):
            text = process_inline(stripped[5:].strip())
            flowables.append(Paragraph(f"<b>{text}</b>", BODY_STYLE))
            i += 1
            continue

        # --- Markdown table ---
        if stripped.startswith("|"):
            # Collect all table lines
            table_lines = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                table_lines.append(lines[i].strip())
                i += 1

            # Parse headers (first row)
            headers = [c.strip() for c in table_lines[0].strip("|").split("|")]
            # Skip separator row (second row)
            data_rows = []
            for tline in table_lines[2:]:
                row = [c.strip() for c in tline.strip("|").split("|")]
                # Pad or trim to header count
                while len(row) < len(headers):
                    row.append("")
                row = row[: len(headers)]
                data_rows.append(row)

            # Column widths - distribute evenly, but give more to longer cols
            n = len(headers)
            col_widths = [usable_width / n] * n

            flowables.append(Spacer(1, 4))
            flowables.append(make_table(headers, data_rows, col_widths))
            flowables.append(Spacer(1, 6))
            continue

        # --- Checklist item ---
        if re.match(r"^- \[ \] ", stripped):
            text = process_inline(stripped[6:].strip())
            cb_style = ParagraphStyle(
                "cb_text",
                parent=BODY_STYLE,
                leftIndent=0,
                spaceBefore=2,
                spaceAfter=2,
            )
            flowables.append(CheckboxItem(text, usable_width, cb_style))
            i += 1
            continue

        # --- Bullet point ---
        if stripped.startswith("- "):
            text = process_inline(stripped[2:].strip())
            flowables.append(
                Paragraph(f"<bullet>&bull;</bullet>{text}", BULLET_STYLE)
            )
            i += 1
            continue

        # --- Numbered list item ---
        num_match = re.match(r"^(\d+)\.\s+(.*)", stripped)
        if num_match:
            num = num_match.group(1)
            text = process_inline(num_match.group(2).strip())
            # Collect continuation lines (indented)
            while i + 1 < len(lines):
                next_stripped = lines[i + 1].strip()
                # Sub-items (indented bullets)
                if next_stripped.startswith("- "):
                    break
                # Next numbered item or blank
                if re.match(r"^\d+\.", next_stripped) or next_stripped == "":
                    break
                # Continuation
                i += 1
                text += " " + process_inline(lines[i].strip())

            flowables.append(
                Paragraph(f"{num}. {text}", NUMBERED_STYLE)
            )
            i += 1
            continue

        # --- Bold-only line (standalone **text**) used as label ---
        bold_only = re.match(r"^\*\*(.+)\*\*$", stripped)
        if bold_only and stripped:
            text = process_inline(stripped)
            flowables.append(Spacer(1, 4))
            flowables.append(Paragraph(text, BOLD_LABEL_STYLE))
            i += 1
            continue

        # --- Note / Tip lines ---
        if stripped.startswith("**Note:**") or stripped.startswith("**Tip:**"):
            text = process_inline(stripped)
            flowables.append(Paragraph(text, NOTE_STYLE))
            i += 1
            continue

        # --- Blank line ---
        if stripped == "":
            i += 1
            continue

        # --- Default: body paragraph ---
        flowables.append(Paragraph(process_inline(stripped), BODY_STYLE))
        i += 1

    return flowables


# ---------------------------------------------------------------------------
# Page template (header / footer)
# ---------------------------------------------------------------------------

def on_page(canvas, doc):
    canvas.saveState()
    # Footer: page number centred
    canvas.setFont("Helvetica", 9)
    canvas.setFillColor(MID_GREY)
    page_num = f"Page {doc.page}"
    canvas.drawCentredString(PAGE_W / 2, 1.2 * cm, page_num)
    # Footer rule
    canvas.setStrokeColor(RULE_COLOUR)
    canvas.setLineWidth(0.4)
    canvas.line(MARGIN, 1.5 * cm, PAGE_W - MARGIN, 1.5 * cm)
    canvas.restoreState()


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def generate_pdf(md_path, pdf_path):
    with open(md_path, "r", encoding="utf-8") as f:
        md_text = f.read()

    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=MARGIN,
        bottomMargin=2.5 * cm,   # room for footer
        title="CRM Kit - Setup Guide",
        author="Energy with Jess",
    )

    usable_width = PAGE_W - 2 * MARGIN

    story = []

    # Subtitle under the title (comes from first body paragraph)
    # We'll pull the first non-heading lines as subtitle manually
    lines = md_text.split("\n")
    subtitle_lines = []
    for ln in lines[1:]:
        s = ln.strip()
        if s.startswith("#") or s == "---" or s == "":
            if subtitle_lines:
                break
            continue
        subtitle_lines.append(s)

    subtitle_text = " ".join(subtitle_lines)

    # Remove subtitle lines from md so they aren't double-rendered
    # We'll mark them; easiest: strip from the md we parse
    md_clean = md_text
    if subtitle_text:
        md_clean = md_clean.replace("\n".join(subtitle_lines), "", 1)

    # Parse the rest
    flowables = parse_markdown(md_clean, usable_width)

    # Inject subtitle after the title flowable
    title_idx = None
    for idx, fl in enumerate(flowables):
        if isinstance(fl, Paragraph) and fl.style.name == "title":
            title_idx = idx
            break

    if title_idx is not None and subtitle_text:
        sub = Paragraph(process_inline(subtitle_text), SUBTITLE_STYLE)
        flowables.insert(title_idx + 1, sub)
        flowables.insert(title_idx + 2, HRFlowable(
            width="60%",
            thickness=1.5,
            color=PRIMARY,
            spaceAfter=10,
            hAlign="CENTER",
        ))

    story.extend(flowables)

    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print(f"PDF created: {pdf_path}")
    return pdf_path


if __name__ == "__main__":
    base = os.path.dirname(os.path.abspath(__file__))
    md_path  = os.path.join(base, "setup_guide.md")
    pdf_path = os.path.join(base, "CRM-Kit-Setup-Guide.pdf")
    generate_pdf(md_path, pdf_path)
