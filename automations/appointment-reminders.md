# Appointment reminders

One system sends appointment emails: the **"Appointment booked" workflow**
(trigger: Appointment, status confirmed, calendar `SPC8i6GpsZiPmxyFFG4G`).
The calendar's own notifications stay off for the contact, otherwise every
booking sends two confirmations and extra reminders.

## Turn off the calendar's built-in contact messages

In the calendar's settings, open **Notifications & policies** (left menu).
Each row shows which channels are on (green = enabled). Use the pencil on
the right of a row to change it.

- **Appointment booked (Status: Confirmed)**: Email and SMS off
- **Reminder**: Email and SMS off
- In-app: fine to leave on (that's for you, not the client)

Left on, the contact gets a second confirmation email plus extra SMS on top
of the workflow's.

How to spot the built-in ones: subject has the full date in it
("Appointment Confirmation on Saturday, ...", "Reminder: Upcoming
Appointment on ...") and Gmail shows a calendar icon (.ics attached).

## Reminder cadence

| When | Channel |
|---|---|
| On booking | Confirmation email (date, time, join link, add-to-calendar, cancel/reschedule) |
| 24 h before | Email |
| 1 h before | Email + SMS |
| 5 min before | Email + SMS (they're at the laptop, so the email link gets clicked) |

The 24 h step is skipped automatically when someone books less than 24 h
out. That's expected.

## Copy

All reminder copy, demo and onboarding: [reminder-copy.md](reminder-copy.md). Paste-ready HTML: `emails/` (rebuild with `python3 automations/build-emails.py` after editing the copy).
Don't say "Zoom Meeting ID" anywhere. The meeting location is a Google Meet link.
