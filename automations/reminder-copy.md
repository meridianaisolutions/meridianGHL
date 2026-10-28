# Reminder copy: demo and onboarding calls

Sequence after the confirmation email: 24 h email, 1 h email + SMS,
5 min email + SMS. Meeting link is Google Meet via
`{{appointment.meeting_location}}`.

## How the wording keeps people booked

- **Sell the call, not the appointment.** Each email says what they get out
  of it. "Just a friendly reminder of your appointment" gives nobody a
  reason to turn up.
- **Get a small commitment.** Demo: they reply with the one thing they want
  sorted. Onboarding: they prep a short list. People who've put something
  in tend to show up.
- **Reschedule in reminders, cancel only in the confirmation.** A cancel
  link next to the join link makes leaving one click away. Reschedule keeps
  them in the calendar.
- **Sound certain.** "See you at 3", not "if you can still make it".
- **Get shorter as the call gets closer.** 24 h has the detail. 1 h and
  5 min are the link and little else.
- **Only say what's true.** Nothing like "I'm on the call" before anyone is.

## SMS rules

- One segment is 160 characters. Checked with a long first name
  (Christopher), a Google Meet link (36 chars) and "Meridian AI
  Solutions". Each SMS below comes in at 145 or less.
- Use a straight apostrophe (') and no emoji. A curly apostrophe or an
  emoji switches the SMS to unicode, which drops the limit to 70
  characters and splits the message.

---

## Demo calls

### 24 h email

**Subject:** Tomorrow at {{appointment.only_start_time}}: your call with {{location.name}}

> Hi {{contact.first_name}},
>
> Looking forward to our chat tomorrow, {{appointment.only_start_date}} at {{appointment.only_start_time}} ({{appointment.timezone}}).
>
> We'll go through how things work for you now and show you what we'd set up for your business.
>
> One quick thing: what's the one thing you'd most like sorted? Hit reply and tell us, and we'll make sure we cover it.
>
> Join on Google Meet: {{appointment.meeting_location}}
>
> If the time doesn't suit anymore, pick another one here: {{appointment.reschedule_link}}
>
> {{location.name}}

### 1 h email

**Subject:** See you at {{appointment.only_start_time}}

> Hi {{contact.first_name}},
>
> See you in an hour. Here's the link so it's handy:
>
> {{appointment.meeting_location}}
>
> Something come up? Grab another time here: {{appointment.reschedule_link}}
>
> {{location.name}}

### 1 h SMS (107 chars)

> Hi {{contact.first_name}}, see you in an hour! Join here: {{appointment.meeting_location}} - {{location.name}}

### 5 min email

**Subject:** Starting in 5 minutes

> Hi {{contact.first_name}},
>
> We're starting in 5 minutes. Join here:
>
> {{appointment.meeting_location}}
>
> {{location.name}}

### 5 min SMS (112 chars)

> Hi {{contact.first_name}}, we're starting in 5 min. Join here: {{appointment.meeting_location}} - {{location.name}}

---

## Onboarding calls

### 24 h email

**Subject:** Tomorrow at {{appointment.only_start_time}}: getting you set up

> Hi {{contact.first_name}},
>
> Looking forward to getting you set up tomorrow, {{appointment.only_start_date}} at {{appointment.only_start_time}} ({{appointment.timezone}}).
>
> To get the most out of the call, please:
>
> - Be logged into your Google Business Profile and your job tool (ServiceM8, Jobber, Fergus etc.)
> - Bring your client list so we can contact them to leave a review
> - Bring your ACN company extract for registering a mobile number
> - Come armed with any other questions you may have!
>
> Join on Google Meet: {{appointment.meeting_location}}
>
> Need a different time? {{appointment.reschedule_link}}
>
> {{location.name}}

### 1 h email

**Subject:** See you at {{appointment.only_start_time}}

> Hi {{contact.first_name}},
>
> See you in an hour. Quick check before we start: are you logged into your Google Business Profile and job tool, and do you have your client list and ACN extract handy?
>
> Join here: {{appointment.meeting_location}}
>
> {{location.name}}

### 1 h SMS (143 chars, no sign-off to stay in 1 segment)

> Hi {{contact.first_name}}, see you in an hour! Please be logged into Google Business Profile and your job tool. Join: {{appointment.meeting_location}}

### 5 min email

**Subject:** Starting in 5 minutes

> Hi {{contact.first_name}},
>
> We're starting in 5 minutes. Join here:
>
> {{appointment.meeting_location}}
>
> {{location.name}}

### 5 min SMS (112 chars)

> Hi {{contact.first_name}}, we're starting in 5 min. Join here: {{appointment.meeting_location}} - {{location.name}}
