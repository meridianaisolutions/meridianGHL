"""Build paste-ready HTML for each email in reminder-copy.md -> emails/*.html."""
import re, html, pathlib, json
here = pathlib.Path(__file__).parent
md = (here / "reminder-copy.md").read_text()
WRAP = '<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#222222;">\n{}\n</div>\n'
P = '<p style="margin:0 0 14px 0;">{}</p>'

def inline(s):
    s = html.escape(s, quote=False)
    s = s.replace("{{appointment.meeting_location}}", '<a href="{{appointment.meeting_location}}" style="color:#1a56db;">{{appointment.meeting_location}}</a>')
    return re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2" style="color:#1a56db;">\1</a>', s)

def body(lines):
    out, para, items = [], [], []
    def flush():
        if para: out.append(P.format("<br>\n".join(inline(l) for l in para))); para.clear()
        if items:
            out.append('<ul style="margin:0 0 14px 0;padding-left:20px;">\n' + "\n".join(f"<li>{inline(i)}</li>" for i in items) + "\n</ul>"); items.clear()
    for l in lines:
        if not l: flush()
        elif l.startswith("- "):
            if para: flush()
            items.append(l[2:])
        else:
            if items: flush()
            para.append(l)
    flush()
    return WRAP.format("\n".join(out))

emails, call = [], None
for sec in re.split(r"^(?=## |### )", md, flags=re.M):
    if sec.startswith("## "):
        call = "demo" if sec.startswith("## Demo") else "onboarding" if sec.startswith("## Onboarding") else None
        continue
    if not sec.startswith("### ") or not call: continue
    head, rest = sec[4:].split("\n", 1)
    m = re.search(r"\*\*Subject:\*\* (.+)", rest)
    if "email" not in head.lower() or not m: continue
    quote = [re.sub(r"^> ?", "", l) for l in rest.split("\n") if l.startswith(">")]
    slug = f"{call}-" + re.sub(r"[^a-z0-9]+", "-", head.lower().split("(")[0]).strip("-")
    h = body(quote)
    (here / "emails" / f"{slug}.html").write_text(h)
    emails.append({"call": call, "name": head.split("(")[0].strip(), "subject": m.group(1), "html": h, "file": slug})
(here / "emails" / "emails.json").write_text(json.dumps(emails, indent=1))
assert len(emails) == 8, len(emails)
print("\n".join(e["file"] for e in emails))
