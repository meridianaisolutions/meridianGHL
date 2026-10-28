# Reminder copy: demo and onboarding calls

Copy for the 24 h, 1 h and 5 min reminders, one set for demo calls and one
for onboarding calls. Meeting link is Google Meet via
`{{appointment.meeting_location}}`.

`[reschedule link]` means: paste the same reschedule merge field your
confirmation email already uses.

## What makes these work

There's no reliable public A/B data on exact subject lines, so these follow
the habits that reduce no-shows:

- Put the time in the subject. People decide from the inbox preview.
- Keep it short and plain, like a person typed it. No images or banners.
- One link per email, the Meet link. Reschedule is the only other option.
- Make rescheduling easy. A moved call beats a no-show.
- Demo emails give a reason to turn up. Onboarding emails help them prepare.
- Sign off with a real name. It gets read more than a company name.

## Is 5 minutes too much?

No, as long as it's short and carries the join link. People click it to
join instead of digging through their inbox. Send it as **SMS** though:
most people won't open an email five minutes before a call. If you send
both, keep the email to two lines.

---

## Demo calls

### 24 h email

**Subject:** Tomorrow at {{appointment.only_start_time}}: your call with {{location.name}}

> Hi {{contact.first_name}},
>
> Just a reminder we're meeting tomorrow, {{appointment.only_start_date}} at {{appointment.only_start_time}} ({{appointment.timezone}}).
>
> I'll walk you through what we'd set up for your business, and you can ask me anything. No pressure to decide on the call.
>
> Join on Google Meet: {{appointment.meeting_location}}
>
> If that time doesn't work anymore, pick another one here: [reschedule link]
>
> Marcus
> {{location.name}}

### 1 h email

**Subject:** See you at {{appointment.only_start_time}}

> Hi {{contact.first_name}},
>
> We're on in an hour. Here's the link so you don't have to dig for it:
> {{appointment.meeting_location}}
>
> Something come up? Just reply and we'll find another time.
>
> Marcus

### 5 min email

**Subject:** I'm on the call now

> Hi {{contact.first_name}}, I've opened the call. Join here: {{appointment.meeting_location}}
>
> Marcus

### 5 min SMS (use this one)

> Hi {{contact.first_name}}, it's Marcus. I'm on the call now, join here: {{appointment.meeting_location}}

---

## Onboarding calls

### 24 h email

**Subject:** Your onboarding call is tomorrow at {{appointment.only_start_time}}

> Hi {{contact.first_name}},
>
> Looking forward to getting you set up tomorrow, {{appointment.only_start_date}} at {{appointment.only_start_time}} ({{appointment.timezone}}).
>
> It'll go quicker if you have these handy:
>
> - your logo and a few photos of your work
> - the services you offer and the areas you cover
> - logins for your domain and Google Business Profile, if you have them
>
> Don't worry if you can't find everything. We'll sort out the rest on the call.
>
> Join on Google Meet: {{appointment.meeting_location}}
>
> Need to move it? [reschedule link]
>
> Marcus
> {{location.name}}

### 1 h email

**Subject:** Onboarding in an hour

> Hi {{contact.first_name}},
>
> We start at {{appointment.only_start_time}}. Here's the link: {{appointment.meeting_location}}
>
> Marcus

### 5 min email

**Subject:** I'm on the call now

> Hi {{contact.first_name}}, I've opened the call. Join here: {{appointment.meeting_location}}
>
> Marcus

### 5 min SMS (use this one)

> Hi {{contact.first_name}}, it's Marcus. I'm on the call now, join here: {{appointment.meeting_location}}

---

Edit the onboarding checklist to match what you actually collect. Swap
"Marcus" for whoever runs the call if it isn't you.
