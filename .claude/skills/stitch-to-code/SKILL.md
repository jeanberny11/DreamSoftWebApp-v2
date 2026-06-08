---
name: stitch-to-code
description: >
  Fetches a design from Google Stitch via MCP and replicates it faithfully into the DreamSoft WebApp
  React project. Use this skill whenever the user mentions fetching, importing, or replicating a Stitch
  design, or says anything like "get the design from Stitch", "replicate this Stitch screen",
  "build the X design from Stitch", or "implement the Stitch design for X". Always use this skill
  before writing any code related to a Stitch design — never attempt to replicate a Stitch design
  without following this workflow.
---

# Stitch → Code Skill

Workflow for fetching a Google Stitch design and replicating it correctly into the DreamSoft WebApp.

> Before starting, read `references/project-structure.md` for folder conventions, CSS variable rules,
> and i18n namespace mapping. You will need it in Steps 3 and 4.

---

## Step 1 — Confirm the Design Name

**The design name is required.** If the user did not provide it, ask:
> "What is the exact name of the Stitch design you want to replicate?"

Once you have a name:
1. Use the Stitch MCP server to search for the design by that name
2. **Before fetching anything**, show the user what was found:
   > "I found a design named **[exact name from Stitch]**. Is this the correct one?"
3. Wait for confirmation. If the name does not match exactly or multiple results appear, list them and ask the user to pick one.
4. Only proceed after the user confirms the correct design.

**Never fetch or replicate a design that hasn't been explicitly confirmed by the user.**

---

## Step 2 — Fetch the Design HTML

Once the design is confirmed:
1. Use the Stitch MCP server to fetch the full HTML output of the confirmed design
2. Do not modify or interpret the HTML yet — just hold it
3. Confirm to the user: "Design fetched successfully. Now I need a few details before building."

---

## Step 3 — Gather Placement Information

Ask the user the following **before writing any code**. Ask all three questions at once:

1. **Which app does this design belong to?**
   - `landingapp` — public-facing landing, login, register, pricing pages
   - `tenant` — authenticated tenant portal (dashboard, customers, invoices, etc.)

2. **Which feature does it belong to?**
   - Examples for `landingapp`: `login`, `register`, `home`, `pricing`
   - Examples for `tenant`: `customers`, `invoices`, `dashboard`
   - If it's a new feature that doesn't exist yet, the agent will create the folder structure

3. **Is this a page or a component?**
   - **Page** → a full screen/view, goes in `features/<feature>/pages/`
   - **Component** → a reusable UI piece, goes in `features/<feature>/components/`

Use the answers to determine the exact file paths. Refer to `references/project-structure.md`
for the full folder structure and file naming rules.

---

## Step 4 — Build the Files

### 4a. Read CSS variables first
Before writing any styles, read `src/styles/variables.css` to know which variables already exist.
Never hardcode hex values, rgba values, or named colors — always use or create CSS variables.

### 4b. Separate HTML from CSS
The Stitch output is HTML with inline or embedded styles. Split it into two files:

**TSX file** — structure and logic only:
- Convert HTML to JSX (className, self-closing tags, etc.)
- No inline styles — all styling goes in the CSS file
- Import the CSS file at the top: `import '../styles/<name>.css'`
- Wrap all text labels with `t()` (see 4c)

**CSS file** — all styles:
- Place in `features/<feature>/styles/<name>.css`
- Replace every hardcoded color, spacing, or value with the matching CSS variable
- If a variable doesn't exist yet, add it to `src/styles/variables.css` under the correct section

### 4c. Replace all hardcoded strings with i18n keys
No hardcoded text is allowed in the component. For every visible string:
1. Determine the correct namespace using `references/project-structure.md`
2. Create a meaningful key following the naming convention in the reference file
3. Add the key + English translation to `src/shared/i18n/locales/en/<namespace>.json`
4. Add the key + Spanish translation to `src/shared/i18n/locales/es/<namespace>.json`
5. Use `useTranslation('<namespace>')` in the component and wrap all text in `t('key')`

If the namespace doesn't exist, create it:
- Add both `en/<namespace>.json` and `es/<namespace>.json`
- Register it in `src/shared/i18n/config.ts`

### 4d. Create missing folders
If the feature folder doesn't exist yet, create the full structure:
```
features/<feature>/
├── components/
├── pages/
├── hooks/
├── services/
├── styles/
├── types/
└── utils/
```

---

## Step 5 — Final Verification Checklist

After all files are written, run through this checklist before reporting done:

- [ ] TSX file exists at the correct path (`pages/` or `components/`)
- [ ] CSS file exists at `features/<feature>/styles/<name>.css`
- [ ] CSS is imported in the TSX file
- [ ] No hardcoded hex, rgba, or named color values remain in the CSS file
- [ ] No inline styles remain in the TSX file
- [ ] No hardcoded text strings remain in the TSX file (all wrapped in `t()`)
- [ ] i18n keys added to both `en/` and `es/` locale files
- [ ] If a new namespace was created, it is registered in `config.ts`
- [ ] If new CSS variables were created, they are in `variables.css`
- [ ] File and folder names follow the naming conventions in `references/project-structure.md`

Report the checklist result to the user, listing all created/modified files with their full paths.

---

## Quick Reference

| Question | Answer source |
|----------|---------------|
| Where do files go? | `references/project-structure.md` → Folder Conventions |
| Which CSS variables exist? | `src/styles/variables.css` |
| Which i18n namespace to use? | `references/project-structure.md` → Namespace Mapping |
| How to name files? | `references/project-structure.md` → File Placement Rules |
