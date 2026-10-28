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

## Reminder cadence (4 touches)

| When | Channel | Message |
|---|---|---|
| On booking | Email | Confirmation: date, time, join link, add-to-calendar, reschedule/cancel |
| 24 h before | Email | Reminder + join link |
| 1 h before | SMS | Short reminder |
| 5 min before | SMS | Join link |

Removed: the 1 h email and the 5 min email. They repeat the SMS sent at the
same moment.

The 24 h step is skipped automatically when someone books less than 24 h
out. That's expected.

## Copy

1 h SMS:

> Hi {{contact.first_name}}, quick reminder our call is in an hour. Join here: {{appointment.meeting_location}} - {{location.name}}

5 min SMS:

> Hi {{contact.first_name}}, we're starting now. Jump in here: {{appointment.meeting_location}} - {{location.name}}

24 h email (body):

> Hi {{contact.first_name}},
>
> Just a reminder that we're meeting tomorrow, {{appointment.only_start_date}} at {{appointment.only_start_time}} ({{appointment.timezone}}).
>
> Join here: {{appointment.meeting_location}}
>
> Need a different time? Reschedule here: {{appointment.reschedule_link}}
>
> {{location.name}}

Don't say "Zoom Meeting ID" anywhere: the meeting location is a link,
and it isn't always Zoom.
