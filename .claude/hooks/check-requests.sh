#!/bin/bash
# Blocks a reply to Marcus while any deliverable's request checklist (checks/requests.py) is failing.
fail=0
for c in /mnt/project-files/*/checks/requests.py; do
  [ -f "$c" ] || continue
  out=$(python3 "$c" 2>&1) || { echo "Request checks failing in $c:" >&2; echo "$out" | grep FAIL >&2; fail=1; }
done
[ $fail = 0 ] || { echo "Apply every requested change before replying." >&2; exit 2; }
