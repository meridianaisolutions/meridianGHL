# Client onboarding funnel (GHL)

Run `python3 checks/requests.py` after any change. It checks every change requested so far.

Eight steps to run through with the client on the onboarding call. Each step is one custom-code block in Meridian green and yellow, with the Inter font and the logo at the top.

## Setup

1. Create a funnel in GHL (Sites > Funnels > New funnel, blank).
2. Funnel Settings > Head tracking code: paste `00-funnel-head-code.html`. Every step needs it, because funnels don't load the website's head code. It holds the styles and the script that puts the client's account ID into the GHL links.
3. Add 8 steps with these exact paths, since the Back and Next buttons link to them. In each step add one full-width section, one row, one column, then a Custom Code element, and paste the block.

| Step | Path | Paste |
|---|---|---|
| 1 Google Business Profile manager | `onboarding-google` | `01-onboarding-google.html` |
| 2 Google integration | `onboarding-google-connect` | `02-onboarding-google-connect.html` |
| 3 Social media | `onboarding-socials` | `03-onboarding-socials.html` |
| 4 Contacts | `onboarding-contacts` | `04-onboarding-contacts.html` |
| 5 CRM | `onboarding-crm` | `05-onboarding-crm.html` |
| 6 Card on file | `onboarding-card` | `06-onboarding-card.html` |
| 7 Personalised image | `onboarding-your-image` | `07-onboarding-your-image.html` |
| 8 Referral | `onboarding-referral` | `08-onboarding-referral.html` |

## Client account links (automatic)

Build the funnel once and add it to your client snapshot, so every client sub-account gets its own copy. The head code uses GHL's `{{location.id}}`, which fills in the ID of the account the funnel is in. "Connect my accounts" (step 3) then opens `dashboard.meridianaisolutions.com.au/v2/location/<their ID>/marketing/social-planner` and "Upload my contacts" (step 4) opens `.../contacts/import`, with nothing for you to fill in. "Open integrations" (step 2) opens `.../settings/lc-integrations` the same way. The Google connect popup itself can't be opened from the funnel, because it belongs to the dashboard, so the client clicks Connect there.

If a copy ever runs outside a client account, add `?loc=<location ID>` to the address and it uses that instead. If neither is there, the buttons show a reminder rather than opening the wrong account.

## Notes

- Step 1 asks clients to add marcus@meridianaisolutions.com.au as a Google Business Profile manager.
- Step 6 has no Next button. After checkout, Stripe sends people to whatever the payment link's confirmation page is set to (currently /book-onboarding on the main site). Point those three links at `/onboarding-your-image` if you want it to carry on by itself, or just change the URL yourself on the call.
- Step 7 shows the example image from your GHL media (`6ae122c5e477f470ceaae8db.jpeg`). To swap it, change the image link in that block.
- All eight blocks also work stacked on a single page. The logo only shows at the top of step 1, and Back/Next scroll to the right step.
- Step 4 export links: Fergus has no export article, so its button opens the Fergus help centre. ServiceM8's client export needs its Advanced Reporting Pack add-on.
