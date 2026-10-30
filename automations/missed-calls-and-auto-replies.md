# Missed calls and auto-replies

Two separate things fire when someone calls the Meridian number
(+61 468 061 475) and nobody picks up. Neither checks who the caller is, so
cold-call prospects who ring back get the same texts as everyone else.

Found on 30 Oct 2026 when Josh (Angle Linemarking, tagged `cold call`)
called back twice after a cold call and got four automated messages.

| Time (AEDT) | What Josh got | Where it came from |
|---|---|---|
| 4:15 pm | Missed call #1 | |
| 4:18 pm | SMS "this number isn't monitored for replies..." | Workflow (source `workflow`) |
| 4:18 pm | Email "This is our marketing email so we don't have access to your reply" | Same workflow |
| 4:18 pm | SMS "I saw that we just missed your call how can I help?" | Missed Call Text Back (source `app`, no user) |
| 4:20 pm | Missed call #2 | |
| 4:22 pm | SMS "I saw that we just missed your call..." again | Missed Call Text Back |

## 1. Missed Call Text Back (phone number setting)

**Settings → Phone Numbers → +61 468 061 475 → ⋮ Edit → Missed Call Text
Back.** It texts every missed inbound call, every time, with no filters. It
can't exclude tags, which is why Josh got it twice.

Fix: turn it **off**. If a missed-call text is still wanted for real leads,
rebuild it as a workflow (below) so it can skip prospects.

Replacement workflow, "13. Missed Call Text Back":

- Trigger: **Call Status**, direction Incoming, status No Answer (and Voicemail)
- Trigger filter: **Contact Tag does not include `cold call`**
- Action: Send SMS "Hi this is Meridian AI Solutions, sorry we missed your
  call. How can I help?"
- Settings: Allow re-entry off, so a second missed call doesn't text again

## 2. "04. Customer Responds (re-direct to client)"

Comes from the review reactivation snapshot. It sends the "number isn't
monitored" SMS and the "marketing email" email whenever a contact replies,
and an inbound call counts as a reply (it fired 2 minutes after the missed
call and tagged Josh `replied`). That copy is meant for a client's
customers replying to review requests, not for Meridian's own prospects.

Fix: open the workflow, edit its trigger (expected to be **Customer
Replied**; the definition couldn't be read through the API) and add the filter **Contact Tag does not include `cold call`**. Save and publish.

The `cold call` tag is added to every contact imported from
`leads/` (see `automations/lead-prep/outscraper-to-ghl.py`), so one filter
covers all prospects. If a prospect becomes a client, remove the tag.

The workflow API isn't enabled for this sub-account, so these changes are
made in the GHL UI, not through Claude.
