# Custom values to fill for each client

All of these live in the sub-account under Settings > Custom Values. "Existing" values come from the review-automation snapshot.

## Business

| Name in GHL | Merge tag | What to enter |
| --- | --- | --- |
| 05. Business Name For Texts & Emails (senderID) (existing) | `{{ custom_values.business_name }}` | e.g. Summit Roofing Co |
| 02. Logo Link (400w x 160h) (existing) | `{{ custom_values.logo_link }}` | e.g. https://placehold.co/400x160/0b2545/ffffff/png?text=Summit+Roofing |
| 04. Business Owner First Name For Texts & Emails (existing) | `{{ custom_values.business_owner_name }}` | e.g. Dave |
| Site URL | `{{ custom_values.site_url }}` | Full domain with https and no trailing slash |
| Site ABN | `{{ custom_values.site_abn }}` | e.g. 12 345 678 901 |
| Site Licence | `{{ custom_values.site_licence }}` | Licence line shown in trust bar and footer. Use 'Fully insured' if no licence applies |
| Site Founded Year | `{{ custom_values.site_founded_year }}` | e.g. 2012 |
| Site Years Experience | `{{ custom_values.site_years_experience }}` | e.g. 12+ |
| Site Legal Updated | `{{ custom_values.site_legal_updated }}` | Date the privacy policy and terms were last reviewed |

## Reviews

| Name in GHL | Merge tag | What to enter |
| --- | --- | --- |
| 01. Google Review Link (existing) | `{{ custom_values.google_review_link }}` | e.g. https://g.page/r/EXAMPLE/review |
| Site Google Maps URL | `{{ custom_values.site_google_maps_url }}` | Share link of the Google Business Profile |
| Site Google Rating | `{{ custom_values.site_google_rating }}` | Copy from the Google Business Profile. Must match Google |
| Site Google Review Count | `{{ custom_values.site_google_review_count }}` | Copy from the Google Business Profile. Must match Google |
| Site Review 1 Name | `{{ custom_values.site_review_1_name }}` | e.g. Sarah M. |
| Site Review 1 Suburb | `{{ custom_values.site_review_1_suburb }}` | e.g. Paddington |
| Site Review 1 Text | `{{ custom_values.site_review_1_text }}` | e.g. Dave came out the same day after the storm, showed us photos of the damage and had it fixed by the weekend. Fair price and no mess left behind. |
| Site Review 1 Date | `{{ custom_values.site_review_1_date }}` | Month and year the review was left, as shown on Google, e.g. September 2026 |
| Site Review 2 Name | `{{ custom_values.site_review_2_name }}` | e.g. James T. |
| Site Review 2 Suburb | `{{ custom_values.site_review_2_suburb }}` | e.g. Logan |
| Site Review 2 Text | `{{ custom_values.site_review_2_text }}` | e.g. Three quotes and these guys were the only ones who turned up on time and explained everything. The roof looks brand new. |
| Site Review 2 Date | `{{ custom_values.site_review_2_date }}` | Month and year the review was left, as shown on Google, e.g. September 2026 |
| Site Review 3 Name | `{{ custom_values.site_review_3_name }}` | e.g. Priya K. |
| Site Review 3 Suburb | `{{ custom_values.site_review_3_suburb }}` | e.g. Ipswich |
| Site Review 3 Text | `{{ custom_values.site_review_3_text }}` | e.g. Booked online on Monday, quote by Tuesday, job done Friday. Communication was excellent the whole way through. |
| Site Review 3 Date | `{{ custom_values.site_review_3_date }}` | Month and year the review was left, as shown on Google, e.g. September 2026 |
| Site Review Widget URL | `{{ custom_values.site_review_widget_url }}` | In Reputation > Widgets, build a review widget (5-star only, colours to suit the site), copy its embed code and paste only the iframe src link here. Shown in the hero |

## Market

| Name in GHL | Merge tag | What to enter |
| --- | --- | --- |
| Site Trade | `{{ custom_values.site_trade }}` | The main service category in title case, e.g. Roofing, House Cleaning, Junk Removal |
| Site Trade Person | `{{ custom_values.site_trade_person }}` | What a customer would search for, lower case, e.g. roofer, cleaner, plumber |
| Site City | `{{ custom_values.site_city }}` | Main city or region the business targets |
| Site Service Areas | `{{ custom_values.site_service_areas }}` | Plain sentence listing suburbs and towns served |

## SEO

| Name in GHL | Merge tag | What to enter |
| --- | --- | --- |
| Site Schema Type | `{{ custom_values.site_schema_type }}` | schema.org type: RoofingContractor, Plumber, Electrician, HVACBusiness, HousePainter, GeneralContractor, Locksmith, MovingCompany, or HomeAndConstructionBusiness if none fit |
| Site Hours Schema | `{{ custom_values.site_hours_schema }}` | schema.org openingHours format |

## Contact

| Name in GHL | Merge tag | What to enter |
| --- | --- | --- |
| Site Phone Display | `{{ custom_values.site_phone_display }}` | Phone as people read it |
| Site Phone Link | `{{ custom_values.site_phone_link }}` | Phone in +61 format with no spaces, used for tap-to-call |
| Site Email | `{{ custom_values.site_email }}` | e.g. hello@summitroofing.com.au |
| Site Street Address | `{{ custom_values.site_street_address }}` | Leave blank for service-area businesses that hide their address on Google |
| Site Suburb | `{{ custom_values.site_suburb }}` | e.g. Newstead |
| Site State | `{{ custom_values.site_state }}` | e.g. QLD |
| Site Postcode | `{{ custom_values.site_postcode }}` | e.g. 4006 |
| Site Hours Text | `{{ custom_values.site_hours_text }}` | e.g. Mon to Fri 7am to 5pm, Sat 8am to 12pm |
| Site Map Embed URL | `{{ custom_values.site_map_embed_url }}` | Google Maps > Share > Embed a map, then copy only the src link. Leave blank to hide the map |
| Site Facebook URL | `{{ custom_values.site_facebook_url }}` | Full Facebook page link. Leave blank to hide the icon |
| Site Instagram URL | `{{ custom_values.site_instagram_url }}` | Full Instagram profile link. Leave blank to hide the icon |

## Copy

| Name in GHL | Merge tag | What to enter |
| --- | --- | --- |
| Site Hero Headline | `{{ custom_values.site_hero_headline }}` | Outcome the customer wants plus the pain they want to avoid, under 9 words, e.g. [Outcome] without [pain]. The H1 adds the trade and city automatically |
| Site Hero Subheadline | `{{ custom_values.site_hero_subheadline }}` | e.g. Leaks, storm damage and full restorations for Brisbane homes. Free, no-obligation quotes within 24 hours. |
| Site USP 1 | `{{ custom_values.site_usp_1 }}` | e.g. Free quote within 24 hours |
| Site USP 2 | `{{ custom_values.site_usp_2 }}` | e.g. Licensed, insured and local |
| Site USP 3 | `{{ custom_values.site_usp_3 }}` | e.g. 10-year workmanship guarantee |
| Site Guarantee | `{{ custom_values.site_guarantee }}` | e.g. If you are not happy with the job, we come back and make it right at no cost. Every job is backed by our 10-year workmanship guarantee. |
| Site Offer | `{{ custom_values.site_offer }}` | Short offer for the CTA band. Keep it true and current |
| Site Owner Bio | `{{ custom_values.site_owner_bio }}` | e.g. I started Summit Roofing because I was tired of seeing homeowners get burned by cowboys. We are a small local team, we answer the phone, we turn up when we say we will, and we treat your home like our own. |

## Services

| Name in GHL | Merge tag | What to enter |
| --- | --- | --- |
| Site Service 1 Name | `{{ custom_values.site_service_1_name }}` | e.g. Roof Repairs |
| Site Service 1 Slug | `{{ custom_values.site_service_1_slug }}` | Must match the GHL page path for this service |
| Site Service 1 Desc | `{{ custom_values.site_service_1_desc }}` | e.g. Leaks, cracked tiles and broken flashing found and fixed fast, with photos before and after. |
| Site Service 1 Image URL | `{{ custom_values.site_service_1_image_url }}` | Photo that shows this service, about 800 x 600 WebP. Upload to Media and paste the link. Shown on the service card |
| Site Service 1 Body | `{{ custom_values.site_service_1_body }}` | Two to four sentences unique to this service, used on its own page. Unique copy is what lets each service page rank |
| Site Service 2 Name | `{{ custom_values.site_service_2_name }}` | e.g. Roof Restoration |
| Site Service 2 Slug | `{{ custom_values.site_service_2_slug }}` | e.g. roof-restoration |
| Site Service 2 Desc | `{{ custom_values.site_service_2_desc }}` | e.g. Clean, repair, re-point and re-coat to add 15+ years to your roof for a fraction of a replacement. |
| Site Service 2 Image URL | `{{ custom_values.site_service_2_image_url }}` | Photo that shows this service, about 800 x 600 WebP. Upload to Media and paste the link. Shown on the service card |
| Site Service 2 Body | `{{ custom_values.site_service_2_body }}` | Two to four sentences unique to this service, used on its own page. Unique copy is what lets each service page rank |
| Site Service 3 Name | `{{ custom_values.site_service_3_name }}` | e.g. Re-Roofing |
| Site Service 3 Slug | `{{ custom_values.site_service_3_slug }}` | e.g. re-roofing |
| Site Service 3 Desc | `{{ custom_values.site_service_3_desc }}` | e.g. Full tile-to-metal and metal-to-metal replacements with a clean site every day. |
| Site Service 3 Image URL | `{{ custom_values.site_service_3_image_url }}` | Photo that shows this service, about 800 x 600 WebP. Upload to Media and paste the link. Shown on the service card |
| Site Service 3 Body | `{{ custom_values.site_service_3_body }}` | Two to four sentences unique to this service, used on its own page. Unique copy is what lets each service page rank |
| Site Service 4 Name | `{{ custom_values.site_service_4_name }}` | e.g. Storm Damage |
| Site Service 4 Slug | `{{ custom_values.site_service_4_slug }}` | e.g. storm-damage |
| Site Service 4 Desc | `{{ custom_values.site_service_4_desc }}` | e.g. Emergency make-safe and insurance-ready reports after hail, wind and storm events. |
| Site Service 4 Image URL | `{{ custom_values.site_service_4_image_url }}` | Photo that shows this service, about 800 x 600 WebP. Upload to Media and paste the link. Shown on the service card |
| Site Service 4 Body | `{{ custom_values.site_service_4_body }}` | Two to four sentences unique to this service, used on its own page. Unique copy is what lets each service page rank |
| Site Service 5 Name | `{{ custom_values.site_service_5_name }}` | e.g. Gutters and Downpipes |
| Site Service 5 Slug | `{{ custom_values.site_service_5_slug }}` | e.g. gutters-downpipes |
| Site Service 5 Desc | `{{ custom_values.site_service_5_desc }}` | e.g. New gutters, downpipes and guards that stop overflow and protect your foundations. |
| Site Service 5 Image URL | `{{ custom_values.site_service_5_image_url }}` | Photo that shows this service, about 800 x 600 WebP. Upload to Media and paste the link. Shown on the service card |
| Site Service 5 Body | `{{ custom_values.site_service_5_body }}` | Two to four sentences unique to this service, used on its own page. Unique copy is what lets each service page rank |
| Site Service 6 Name | `{{ custom_values.site_service_6_name }}` | e.g. Roof Inspections |
| Site Service 6 Slug | `{{ custom_values.site_service_6_slug }}` | e.g. roof-inspections |
| Site Service 6 Desc | `{{ custom_values.site_service_6_desc }}` | e.g. Detailed photo reports for buyers, sellers and insurers, usually within 48 hours. |
| Site Service 6 Image URL | `{{ custom_values.site_service_6_image_url }}` | Photo that shows this service, about 800 x 600 WebP. Upload to Media and paste the link. Shown on the service card |
| Site Service 6 Body | `{{ custom_values.site_service_6_body }}` | Two to four sentences unique to this service, used on its own page. Unique copy is what lets each service page rank |

## Service areas

| Name in GHL | Merge tag | What to enter |
| --- | --- | --- |
| Site Area 1 Name | `{{ custom_values.site_area_1_name }}` | Suburb, town or region this page targets |
| Site Area 1 Slug | `{{ custom_values.site_area_1_slug }}` | Must match the GHL page path for this area, e.g. trade-suburb |
| Site Area 1 Suburbs | `{{ custom_values.site_area_1_suburbs }}` | Nearby suburbs covered from this area, as a sentence list |
| Site Area 1 Body | `{{ custom_values.site_area_1_body }}` | A paragraph or two (100 to 200 words) about working in this area: local housing, weather, typical jobs, landmarks. Write it fresh for each area. Copied or lightly reworded text makes Google treat the pages as duplicates |
| Site Area 2 Name | `{{ custom_values.site_area_2_name }}` | Suburb, town or region this page targets |
| Site Area 2 Slug | `{{ custom_values.site_area_2_slug }}` | Must match the GHL page path for this area, e.g. trade-suburb |
| Site Area 2 Suburbs | `{{ custom_values.site_area_2_suburbs }}` | Nearby suburbs covered from this area, as a sentence list |
| Site Area 2 Body | `{{ custom_values.site_area_2_body }}` | A paragraph or two (100 to 200 words) about working in this area: local housing, weather, typical jobs, landmarks. Write it fresh for each area. Copied or lightly reworded text makes Google treat the pages as duplicates |
| Site Area 3 Name | `{{ custom_values.site_area_3_name }}` | Suburb, town or region this page targets |
| Site Area 3 Slug | `{{ custom_values.site_area_3_slug }}` | Must match the GHL page path for this area, e.g. trade-suburb |
| Site Area 3 Suburbs | `{{ custom_values.site_area_3_suburbs }}` | Nearby suburbs covered from this area, as a sentence list |
| Site Area 3 Body | `{{ custom_values.site_area_3_body }}` | A paragraph or two (100 to 200 words) about working in this area: local housing, weather, typical jobs, landmarks. Write it fresh for each area. Copied or lightly reworded text makes Google treat the pages as duplicates |
| Site Area 4 Name | `{{ custom_values.site_area_4_name }}` | Suburb, town or region this page targets |
| Site Area 4 Slug | `{{ custom_values.site_area_4_slug }}` | Must match the GHL page path for this area, e.g. trade-suburb |
| Site Area 4 Suburbs | `{{ custom_values.site_area_4_suburbs }}` | Nearby suburbs covered from this area, as a sentence list |
| Site Area 4 Body | `{{ custom_values.site_area_4_body }}` | A paragraph or two (100 to 200 words) about working in this area: local housing, weather, typical jobs, landmarks. Write it fresh for each area. Copied or lightly reworded text makes Google treat the pages as duplicates |
| Site Area 5 Name | `{{ custom_values.site_area_5_name }}` | Suburb, town or region this page targets |
| Site Area 5 Slug | `{{ custom_values.site_area_5_slug }}` | Must match the GHL page path for this area, e.g. trade-suburb |
| Site Area 5 Suburbs | `{{ custom_values.site_area_5_suburbs }}` | Nearby suburbs covered from this area, as a sentence list |
| Site Area 5 Body | `{{ custom_values.site_area_5_body }}` | A paragraph or two (100 to 200 words) about working in this area: local housing, weather, typical jobs, landmarks. Write it fresh for each area. Copied or lightly reworded text makes Google treat the pages as duplicates |
| Site Area 6 Name | `{{ custom_values.site_area_6_name }}` | Suburb, town or region this page targets |
| Site Area 6 Slug | `{{ custom_values.site_area_6_slug }}` | Must match the GHL page path for this area, e.g. trade-suburb |
| Site Area 6 Suburbs | `{{ custom_values.site_area_6_suburbs }}` | Nearby suburbs covered from this area, as a sentence list |
| Site Area 6 Body | `{{ custom_values.site_area_6_body }}` | A paragraph or two (100 to 200 words) about working in this area: local housing, weather, typical jobs, landmarks. Write it fresh for each area. Copied or lightly reworded text makes Google treat the pages as duplicates |

## Gallery

| Name in GHL | Merge tag | What to enter |
| --- | --- | --- |
| Site Gallery 1 URL | `{{ custom_values.site_gallery_1_url }}` | Photo of a real job, about 800 x 600. Upload to Media and paste the link. Leave blank to hide this photo |
| Site Gallery 1 Caption | `{{ custom_values.site_gallery_1_caption }}` | Service and suburb, e.g. Roof restoration, Logan |
| Site Gallery 2 URL | `{{ custom_values.site_gallery_2_url }}` | Photo of a real job, about 800 x 600. Upload to Media and paste the link. Leave blank to hide this photo |
| Site Gallery 2 Caption | `{{ custom_values.site_gallery_2_caption }}` | Service and suburb, e.g. Roof restoration, Logan |
| Site Gallery 3 URL | `{{ custom_values.site_gallery_3_url }}` | Photo of a real job, about 800 x 600. Upload to Media and paste the link. Leave blank to hide this photo |
| Site Gallery 3 Caption | `{{ custom_values.site_gallery_3_caption }}` | Service and suburb, e.g. Roof restoration, Logan |
| Site Gallery 4 URL | `{{ custom_values.site_gallery_4_url }}` | Photo of a real job, about 800 x 600. Upload to Media and paste the link. Leave blank to hide this photo |
| Site Gallery 4 Caption | `{{ custom_values.site_gallery_4_caption }}` | Service and suburb, e.g. Roof restoration, Logan |
| Site Gallery 5 URL | `{{ custom_values.site_gallery_5_url }}` | Photo of a real job, about 800 x 600. Upload to Media and paste the link. Leave blank to hide this photo |
| Site Gallery 5 Caption | `{{ custom_values.site_gallery_5_caption }}` | Service and suburb, e.g. Roof restoration, Logan |
| Site Gallery 6 URL | `{{ custom_values.site_gallery_6_url }}` | Photo of a real job, about 800 x 600. Upload to Media and paste the link. Leave blank to hide this photo |
| Site Gallery 6 Caption | `{{ custom_values.site_gallery_6_caption }}` | Service and suburb, e.g. Roof restoration, Logan |

## FAQ

| Name in GHL | Merge tag | What to enter |
| --- | --- | --- |
| Site FAQ 1 Q | `{{ custom_values.site_faq_1_q }}` | e.g. How much does a roof repair cost? |
| Site FAQ 1 A | `{{ custom_values.site_faq_1_a }}` | e.g. Most repairs fall between $350 and $1,500 depending on access and materials. We give you a fixed written price before any work starts, so there are no surprises. |
| Site FAQ 2 Q | `{{ custom_values.site_faq_2_q }}` | e.g. How quickly can you come out? |
| Site FAQ 2 A | `{{ custom_values.site_faq_2_a }}` | e.g. We usually inspect within 1 to 2 business days, and same day for active leaks and storm damage. |
| Site FAQ 3 Q | `{{ custom_values.site_faq_3_q }}` | e.g. Are you licensed and insured? |
| Site FAQ 3 A | `{{ custom_values.site_faq_3_a }}` | e.g. Yes. We hold a current QBCC licence and full public liability insurance, and we are happy to send certificates before we start. |
| Site FAQ 4 Q | `{{ custom_values.site_faq_4_q }}` | e.g. Do you offer a guarantee? |
| Site FAQ 4 A | `{{ custom_values.site_faq_4_a }}` | e.g. Every job comes with our 10-year workmanship guarantee on top of the manufacturer warranty on materials. |

## Brand

| Name in GHL | Merge tag | What to enter |
| --- | --- | --- |
| Site Brand Color | `{{ custom_values.site_brand_color }}` | Main brand colour as a hex code. Used for header, headings and dark sections |
| Site Accent Color | `{{ custom_values.site_accent_color }}` | Button colour. Needs strong contrast with white text (WCAG AA 4.5:1) |
| Site Hero Image URL | `{{ custom_values.site_hero_image_url }}` | 1600 x 1000 WebP under 150 KB, a real photo of the team or a finished job |
| Site Owner Photo URL | `{{ custom_values.site_owner_photo_url }}` | Square 640 x 640 WebP of the owner or team |

## Conversion

| Name in GHL | Merge tag | What to enter |
| --- | --- | --- |
| Site Quote Form ID | `{{ custom_values.site_quote_form_id }}` | ID of the GHL quote form (Sites > Forms > Integrate). Only used if you embed the form with custom code |
| Site Booking URL | `{{ custom_values.site_booking_url }}` | Where Get a Quote buttons go. A GHL calendar link or /contact |
