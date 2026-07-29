---
name: new-feature
description: >
  Scaffolds a complete new feature folder structure in the DreamSoft WebApp React project.
  Use this skill whenever the user says "add a new feature", "create a feature", "scaffold a feature",
  "set up a new module", or mentions adding something like "customers", "invoices", "reports",
  or any new section to either the landingapp or tenant app. Always use this skill before
  creating any feature folders or boilerplate files — never scaffold a feature manually without
  following this workflow.
---

# New Feature Scaffold Skill

Workflow for creating a complete, consistent feature folder structure in the DreamSoft WebApp.

> Before starting, read `references/feature-anatomy.md` for the exact folder structure,
> file templates, naming conventions, and store registration steps.

---

## Step 1 — Gather Information

Ask the user the following before doing anything. Ask all at once:

1. **What is the feature name?**
   - Use a clear, lowercase noun or noun phrase → e.g. `invoices`, `customers`, `reports`, `billing`
   - This becomes the folder name and the prefix for all generated files

2. **Which app does it belong to?**
   - `landingapp` — public-facing app (landing, auth, onboarding)
   - `tenant` — authenticated tenant portal (dashboard modules)

3. **Does this feature need a Redux slice (form-flow state)?**
   - **Yes** → feature has forms, multi-step flows, or loading/error/success states (like login, register)
   - **No** → feature is display-only or uses Zustand/local state (like dashboard charts, lists)

4. **Does this feature make API calls?**
   - **Yes** → scaffold the `services/<feature>.service.ts` file
   - **No** → leave `services/` empty

Do not proceed until all four answers are confirmed.

---

## Step 2 — Confirm the Target Path

Based on the answers, state the exact path where the feature will be created and ask for confirmation:

- `landingapp` → `src/apps/landingapp/features/<feature>/`
- `tenant`      → `src/apps/tenant/features/<feature>/`

Example:
> "I will create the feature at `src/apps/tenant/features/reports/`. Shall I proceed?"

Wait for confirmation before creating any files.

---

## Step 3 — Create the Folder Structure

Create all folders and files as defined in `references/feature-anatomy.md`.

Always create these folders (even if empty — empty folders show intent):
```
<feature>/
├── components/
├── pages/
├── hooks/
├── services/
├── styles/
├── types/
└── utils/
```

For `landingapp` features, also create:
```
<feature>/
└── store/
```

For `tenant` features, also create:
```
<feature>/
└── stores/
```

Then create the boilerplate files as specified in `references/feature-anatomy.md`.
Read that file now — it contains the exact file templates to use for each file.

---

## Step 4 — Register the Redux Slice (if applicable)

If the user answered **Yes** to needing a Redux slice in Step 1:

1. Open `src/shared/store/store.ts`
2. Add the import for the new slice reducer:
   ```ts
   import <feature>Reducer from '@/apps/<app>/features/<feature>/store/<feature>.slice'
   ```
3. Add the reducer to the `reducer` map:
   ```ts
   <feature>: <feature>Reducer,
   ```

If the user answered **No**, skip this step entirely.

---

## Step 5 — Final Verification Checklist

After all files are created, verify and report back:

- [ ] Feature folder exists at the correct path
- [ ] All 7 subfolders created (`components`, `pages`, `hooks`, `services`, `styles`, `types`, `utils`)
- [ ] `store/` or `stores/` folder created (as appropriate for the app)
- [ ] `<feature>.types.ts` created in `types/`
- [ ] `<feature>.slice.ts` and `<feature>.state.ts` created in `store/` (if Redux was requested)
- [ ] `<feature>.service.ts` created in `services/` (if API calls were requested)
- [ ] Slice registered in `src/shared/store/store.ts` (if Redux was requested)
- [ ] All file names follow the `<feature>.<role>.ts` naming convention

Report all created files with their full paths.
