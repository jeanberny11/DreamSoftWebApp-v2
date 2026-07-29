---
name: mem
description: >
  Manages the project's persistent memory across sessions. Use this skill at the START of every
  session to load context from PROJECT_KNOWLEDGE.md and SESSION_LOG.md. Use it during the session
  whenever a new decision, convention, recurring fix, or important discovery is made — write it to
  PROJECT_KNOWLEDGE.md immediately without asking. Use it at the END of every session to append a
  compact summary entry to SESSION_LOG.md. Also trigger this skill whenever the user says anything
  like "remember this", "save this", "add this to memory", "log this", "don't forget this", or
  "update the memory files".
---

# Memory Skill (mem)

Manages two persistent memory files that give the agent continuity across sessions.

---

## File Paths (always use absolute paths)

| File | Absolute Path |
|---|---|
| `PROJECT_KNOWLEDGE.md` | `C:\Users\ingbe\Documents\Projects\React Projects\DreamSoftWebApp\.claude\PROJECT_KNOWLEDGE.md` |
| `SESSION_LOG.md` | `C:\Users\ingbe\Documents\Projects\React Projects\DreamSoftWebApp\.claude\SESSION_LOG.md` |

---

## Trigger 1 — Session Start

At the beginning of every session, before doing anything else:

1. Read `PROJECT_KNOWLEDGE.md` using the absolute path above
2. Read `SESSION_LOG.md` using the absolute path above
3. Apply everything in `PROJECT_KNOWLEDGE.md` silently — do not summarize it back to the user
4. Use `SESSION_LOG.md` only as background context

---

## Trigger 2 — During Session (automatic saves)

Write to `PROJECT_KNOWLEDGE.md` automatically — without asking — when any of these occur:

- A **decision** is made about how something should be done in this project
- A **recurring issue** is identified and fixed (something that keeps coming up)
- A **new convention** is established (naming, structure, pattern)
- A **rule** is declared ("always do X", "never do Y in this project")
- The user explicitly says "remember this", "save this", "add this to memory", or similar

### How to write to PROJECT_KNOWLEDGE.md
- Find the correct section (see file structure below)
- Append the new entry under that section
- Keep it to 1–3 lines maximum
- Use the date format `[YYYY-MM-DD]` as a prefix
- Never duplicate an existing entry — update it in place if it already exists

---

## Trigger 3 — Session End

When the session is ending or the user says goodbye / "we're done":

1. Write a new entry at the **top** of `.claude/SESSION_LOG.md` (newest first)
2. Format it exactly as shown in the SESSION_LOG structure below
3. Keep it to 3–5 bullet points maximum — no deep detail
4. Focus on: what was built, what was decided, what was fixed

---

## PROJECT_KNOWLEDGE.md Structure

```markdown
# Project Knowledge

## Decisions
<!-- Architectural or design decisions made during sessions -->
<!-- [YYYY-MM-DD] Short description of the decision and why -->

## Conventions
<!-- Naming rules, file patterns, coding styles specific to this project -->
<!-- [YYYY-MM-DD] Short description -->

## Recurring Fixes
<!-- Things that need to be fixed or checked every session -->
<!-- [YYYY-MM-DD] Issue description → fix applied -->

## Skills
<!-- Skills available in .claude/skills/ and what they do -->
<!-- Keep this updated when new skills are added or modified -->

## Never Do
<!-- Hard rules — things that must never happen in this project -->
<!-- [YYYY-MM-DD] Rule description -->

## Notes
<!-- Anything that doesn't fit the above categories -->
```

---

## SESSION_LOG.md Structure

```markdown
# Session Log
<!-- Newest session at the top -->

---
## [YYYY-MM-DD] — Short session title
- bullet: what was built or changed
- bullet: what was decided
- bullet: what was fixed
- bullet: anything worth remembering
---
```

---

## Rules

- Always use the absolute paths defined in the File Paths table above
- Never ask the user before writing to either file — just write and optionally mention it briefly
- Never write more than 3 lines per entry in `PROJECT_KNOWLEDGE.md`
- Never write more than 5 bullets per session in `SESSION_LOG.md`
- Always put the newest session entry at the TOP of `SESSION_LOG.md`
- If the user asks to save something specific, confirm it was saved with a one-line acknowledgment
- Do not read these files out loud unless the user asks
