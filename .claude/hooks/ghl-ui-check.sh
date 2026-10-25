#!/bin/sh
# Marcus corrected GHL menu directions twice (25 Oct 2026): never give GHL UI steps from memory.
grep -qiE 'ghl|gohighlevel|highlevel|builder|tracking code|section id' && echo "Before giving GHL UI steps (menus, tabs, icons, where a setting lives): look at Marcus's screen or a screenshot first, or say plainly you haven't seen it. Don't send menu names from memory. Prefer a fix that needs no hunting in the UI."
exit 0
