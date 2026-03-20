# Fit Check — Review Prompts

Reusable prompts for code review. Copy-paste these into Cursor chat as needed.

---

## Step 1: Self-Review (use your default Cursor agent)

```
Review only the files changed since the last review. Run:

git diff main --name-only

If on main, diff against the previous phase's commit instead.

Read those files plus .cursorrules and docs/ for context. Check for:

- TypeScript: no `any` types, no @ts-ignore, explicit return types
- Files under 200 lines
- Error handling on all async operations
- Fit engine calculations match docs/master-tables.md exactly
- No console.log statements
- No user-facing text that uses "ideal," "correct," "proper," or "should"
- Code follows patterns in .cursorrules

Format as:
### ✅ Looks Good
- [items]

### ⚠️ Issues Found
- **[CRITICAL/HIGH/MEDIUM/LOW]** [File] — [Issue]
  - Fix: [Suggested fix]
```

---

## Step 2: Peer Review (switch to a different model in Cursor)

```
You are reviewing code written by another developer. You have no prior 
context on this project beyond what's in the repo.

Review only the recently changed files. Run:

git diff main --name-only

If on main, diff against the previous phase's commit instead.

Read those files plus .cursorrules and docs/ for context. Focus on:

- Architecture problems that will cause issues later
- Security issues (API keys, permissions, data handling)
- Logic errors, especially in fit calculations
- Inconsistencies between code and docs/
- Anything incomplete or likely to break

Be critical. Don't assume anything is correct because it exists.

Format each finding as:
- **[CRITICAL/HIGH/MEDIUM/LOW]** [File] — [Issue description]
```

---

## Step 3: Take findings to CTO Project (claude.ai)

```
We completed [PHASE NAME] and ran two code reviews. Evaluate each 
finding — tell me which are real issues to fix, which are false flags, 
and what the priority is.

## Self-review findings:
[paste Step 1 output]

## Peer review findings:
[paste Step 2 output]
```

---

## Step 4: Fix and commit

Ask the CTO to generate Cursor prompts for any confirmed issues. 
After fixes:

```
git add .
git commit -m "[Phase name] review fixes"
git push
```

---

## When to run reviews
- After any phase that adds logic (fit engine, API integration, UI with state)
- Before testing with friends
- Before Chrome Web Store submission
- NOT after pure scaffolding or config-only phases
