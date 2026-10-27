# Custom values to fill for each client

All of these live in the sub-account under Settings > Custom Values. "Existing" values come from the review-automation snapshot.

## Business

| Name in GHL | Merge tag | What to enter |
| --- | --- | --- |
| 05. Business Name For Texts & Emails (senderID) (existing) | `{{ custom_values.business_name }}` | e.g. Summit Roofing Co |
| Site Logo (existing) | `{{ custom_values.site_logo }}` | e.g. https://placehold.co/400x160/0b2545/ffffff/png?text=Summit+Roofing |
| 04. Business Owner First Name For Texts & Emails (existing) | `{{ custom_values.business_owner_name }}` | e.g. Dave |
| Site ABN | `{{ custom_values.site_abn }}` | e.g. 12 345 678 901 |

## Reviews

| Name in GHL | Merge tag | What to enter |
| --- | --- | --- |
| 01. Google Review Link (existing) | `{{ custom_values.google_review_link }}` | e.g. https://g.page/r/EXAMPLE/review |

## Contact

| Name in GHL | Merge tag | What to enter |
| --- | --- | --- |
| Site Phone Display | `{{ custom_values.site_phone_display }}` | Phone as people read it |
| Site Email | `{{ custom_values.site_email }}` | e.g. hello@summitroofing.com.au |
| Site Address | `{{ custom_values.site_address }}` | Street, suburb, state and postcode in this format, e.g. 12 Example Street, Newstead QLD 4006 |
