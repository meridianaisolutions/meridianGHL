# Every change Marcus has asked for, as a check. Run before replying: python3 checks/requests.py
import glob, os, re, sys
D = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
f = lambda n: open(glob.glob(f"{D}/{n}*")[0]).read()
head, steps = f("00-"), [f(f"0{i}-") for i in range(1, 9)]
gconnect = steps.pop(1)  # step 2, Google integration; steps[] keeps its old indexes
allsteps = "".join(steps) + gconnect
checks = [
    ("no phone number anywhere", "0403" not in allsteps and "tel:" not in allsteps),
    ("no progress bar", "mr-bar" not in allsteps + head),
    ("'Step X of 7' on the right of the header", all(f'Step {i+1} of 8</p></div></header>' in s for i, s in enumerate(steps[:1] + [gconnect] + steps[1:])) and "justify-content:space-between" in head),
    ("socials: Facebook, Instagram, YouTube, LinkedIn, Google", re.findall(r"<li>(\w+)</li>", steps[1]) == ["Facebook", "Instagram", "YouTube", "LinkedIn", "Google"]),
    ("socials button -> client's social planner, new window", "location/LOCATION_ID/marketing/social-planner\" target=\"_blank\"" in steps[1]),
    ("contacts button -> client's contacts import, new window", "location/LOCATION_ID/contacts/import\" target=\"_blank\"" in steps[2]),
    ("contacts: name, mobile, email on separate lines, no last job", "<li>Mobile number</li><li>Email address</li>" in steps[2] and "last job" not in steps[2]),
    ("no forms needed on any step", "form below" not in allsteps.lower()),
    ("location ID filled automatically per account", "{{location.id}}" in head),
    ("CRM links to Zapier", 'href="https://zapier.com/"' in steps[3]),
    ("card: no 'I've added my card' button", "added my card" not in steps[4]),
    ("card: plan specifics shown", all(x in steps[4] for x in ["Up to 20 new review requests", "20 to 100", "100+", "Every plan includes"])),
    ("image: Marcus's new example image (6ae122c5...jpeg)", "media/6ae122c5e477f470ceaae8db.jpeg" in steps[5] and "base64" not in steps[5]),
    ("image: no 'Want something changed'", "something changed" not in steps[5].lower()),
    ("image: photo from Instagram/Facebook or they send one", "Instagram or Facebook" in steps[5]),
    ("referral: new client tells us on signup, we credit referrer", "they tell us you referred them" in steps[6] and "credit your account" in steps[6]),
    ("referral: no 'Refer a business below' line", "Refer a business below" not in steps[6]),
    ("what happens next: start requesting reviews + watch GBP", "start sending your review requests" in steps[6] and "Keep an eye on your Google Business Profile" in steps[6]),
    ("logo only in step 1's header, nowhere else", allsteps.count("6adb502955feecaeeac98c46") == 1 and "6adb502955" in steps[0].split("</header>")[0]),
    ("every step is a jump target so Back/Next work on one page", all(f'id="{p}"' in s for p, s in zip(["onboarding-google", "onboarding-google-connect","onboarding-socials","onboarding-contacts","onboarding-crm","onboarding-card","onboarding-your-image","onboarding-referral"], steps[:1] + [gconnect] + steps[1:])) and "scrollIntoView" in head),
    ("contacts: export buttons per CRM linking to export help pages", re.findall(r'<li><a href="https://[^"]+" target="_blank" rel="noopener">([\w ]+)</a></li>', steps[2]) == ["ServiceM8", "Tradify", "simPRO", "Jobber", "Fergus"] and "<li>Something else</li>" in steps[2]),
    ("CRM: no systems list, just Zapier description + Open Zapier", "mr-chips" not in steps[3] and "through Zapier" in steps[3] and 'href="https://zapier.com/"' in steps[3]),
    ("card: Pro trial button level with Starter (inline flex, button pushed to bottom)", steps[4].count('style="display:flex;flex-direction:column"') == 3 and steps[4].count('style="margin-top:auto">Start free trial') == 3),
    ("referral How it works: circles 1 and 2 white, 3 yellow", steps[6].count('<li class="mr-w"') == 2 and "li.mr-w::before{background:#fff}" in steps[6]),
    ("GHL links use dashboard.meridianaisolutions.com.au, not app.gohighlevel.com", "app.gohighlevel.com" not in allsteps and 'https://dashboard.meridianaisolutions.com.au/v2/location/LOCATION_ID/contacts/import"' in allsteps and 'https://dashboard.meridianaisolutions.com.au/v2/location/LOCATION_ID/marketing/social-planner"' in allsteps),
    ("GBP manager email wraps on mobile", '<strong style="overflow-wrap:anywhere">marcus@' in steps[0]),
    ("no code screen and no sign-in step; GBP is step 1", "mr-gate" not in head and "var pin" not in head and "dashboard.meridianaisolutions.com.au/\" target" not in allsteps and "Google Business Profile" in steps[0].split("</h1>")[0] and len(steps) == 7),  # steps excludes the Google integration step
    ("step 2 connects Google + GBP integrations via the client's lc-integrations page, new window", 'location/LOCATION_ID/settings/lc-integrations" target="_blank"' in gconnect and "Google Business Profile" in gconnect),
    ("no em/en dashes in copy", "—" not in allsteps and "–" not in allsteps),
]
bad = [n for n, ok in checks if not ok]
for n, ok in checks: print("PASS" if ok else "FAIL", n)
sys.exit(1 if bad else 0)
