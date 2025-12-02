# Team Prototyping Setup Guide

> How to set up branch-based team prototyping with Vercel subdomains

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Initial Setup](#initial-setup)
5. [GitHub Configuration](#github-configuration)
6. [Vercel Configuration](#vercel-configuration)
7. [Onboarding New Team Members](#onboarding-new-team-members)
8. [Daily Workflow](#daily-workflow)
9. [Merging to Production](#merging-to-production)
10. [Keeping Branches Synced](#keeping-branches-synced)
11. [Automation Scripts](#automation-scripts)
12. [Troubleshooting](#troubleshooting)
13. [FAQ](#faq)

---

## Overview

This guide sets up a collaborative prototyping environment where:

- **Single repository** (`comfy-vibe`) contains all code
- **Each team member** has their own protected branch
- **Each branch** auto-deploys to a unique subdomain
- **Features** flow from personal branches → main → public

### Key Benefits

| Benefit | Description |
|---------|-------------|
| Isolation | Team members cannot modify each other's code |
| Visibility | Each prototype has a live URL for review |
| Traceability | All changes go through PR review |
| Simplicity | Single repo, no package publishing |

---

## Architecture

```
                           comfy-vibe.git
                                │
         ┌──────────────────────┼──────────────────────┐
         │                      │                      │
         ▼                      ▼                      ▼
       main                  pablo                   alex
         │                      │                      │
         ▼                      ▼                      ▼
  comfy-vibe.           pablo.comfy-vibe.      alex.comfy-vibe.
  vercel.app            vercel.app             vercel.app
  (Production)          (Pablo's prototype)    (Alex's prototype)
```

### Branch Structure

```
main (protected)
├── pablo          → pablo.comfy-vibe.vercel.app
├── alex           → alex.comfy-vibe.vercel.app
├── sarah          → sarah.comfy-vibe.vercel.app
├── marco          → marco.comfy-vibe.vercel.app
└── ...
```

### Deployment Flow

```
1. Pablo pushes to `pablo` branch
   ↓
2. Vercel auto-deploys to pablo.comfy-vibe.vercel.app
   ↓
3. Internal team reviews at that URL
   ↓
4. Pablo creates PR: pablo → main
   ↓
5. Team approves, PR merged
   ↓
6. Vercel auto-deploys to comfy-vibe.vercel.app (production)
```

---

## Prerequisites

### Accounts & Access

- [ ] GitHub organization or repository with admin access
- [ ] Vercel Team account (for collaboration features)
- [ ] Domain configured in Vercel (e.g., `comfy-vibe.vercel.app`)

### Team Requirements

- [ ] List of team members with GitHub usernames
- [ ] Designated admin(s) for repository management
- [ ] Agreed naming convention for branches (lowercase usernames recommended)

---

## Initial Setup

### Step 1: Repository Preparation

```bash
# Ensure main branch is clean and stable
git checkout main
git pull origin main

# Verify the project builds successfully
pnpm install
pnpm build
```

### Step 2: Create Team Member Branches

Run this for each team member:

```bash
# Create branch from main
git checkout main
git checkout -b pablo
git push -u origin pablo

git checkout main
git checkout -b alex
git push -u origin alex

# Repeat for each team member...
```

### Step 3: Verify Branch Structure

```bash
git branch -a
# Should show:
# * main
#   remotes/origin/main
#   remotes/origin/pablo
#   remotes/origin/alex
#   ...
```

---

## GitHub Configuration

### Branch Protection Rules

Navigate to: **Repository → Settings → Branches → Add rule**

#### Rule 1: Protect `main` Branch

| Setting | Value |
|---------|-------|
| Branch name pattern | `main` |
| Require pull request reviews | ✅ Yes |
| Required approving reviews | 2 |
| Dismiss stale reviews | ✅ Yes |
| Require status checks | ✅ Yes |
| Require branches to be up to date | ✅ Yes |
| Restrict who can push | ✅ Administrators only |

#### Rule 2: Protect Individual Branches

Create a rule for each team member:

| Setting | Value (example for Pablo) |
|---------|---------------------------|
| Branch name pattern | `pablo` |
| Restrict who can push | ✅ Yes |
| People/teams that can push | `@pablo` (GitHub username) |
| Allow force pushes | ✅ Specify who can force push |
| Force push allowlist | `@pablo` |

**Repeat for each team member's branch.**

### Alternative: Ruleset (GitHub Enterprise/Team)

If using GitHub Enterprise or Team plan, use Rulesets for easier management:

```yaml
# Example ruleset configuration
name: "Team Member Branches"
target: "branch"
conditions:
  ref_name:
    include:
      - "refs/heads/pablo"
      - "refs/heads/alex"
      - "refs/heads/sarah"
rules:
  - type: "restrict_pushes"
    parameters:
      restrict_pushes: true
```

### CODEOWNERS File (Optional)

Create `.github/CODEOWNERS` for additional review requirements:

```
# Require review from specific people for certain paths
/src/components/ui/    @ui-team-lead
/src/lib/              @tech-lead
*.config.*             @tech-lead

# Note: CODEOWNERS doesn't restrict pushes, only requires reviews
```

---

## Vercel Configuration

### Step 1: Connect Repository

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `comfy-vibe` repository
3. Configure build settings:
   - Framework: Vue.js / Vite
   - Build Command: `pnpm build`
   - Output Directory: `dist`
   - Install Command: `pnpm install`

### Step 2: Configure Production Domain

1. Go to **Project → Settings → Domains**
2. Add domain: `comfy-vibe.vercel.app`
3. Set **Production Branch**: `main`

### Step 3: Configure Branch Subdomains

For each team member, add a branch domain:

1. Go to **Project → Settings → Domains**
2. Click **Add**
3. Enter: `pablo.comfy-vibe.vercel.app`
4. Under **Git Branch**, select: `pablo`
5. Click **Add**

Repeat for each team member:

| Subdomain | Git Branch |
|-----------|------------|
| `pablo.comfy-vibe.vercel.app` | `pablo` |
| `alex.comfy-vibe.vercel.app` | `alex` |
| `sarah.comfy-vibe.vercel.app` | `sarah` |
| `marco.comfy-vibe.vercel.app` | `marco` |

### Step 4: Environment Variables (if needed)

If different branches need different env vars:

1. Go to **Project → Settings → Environment Variables**
2. Add variable with specific branch:
   - Name: `VITE_API_URL`
   - Value: `https://staging-api.comfy.com`
   - Environment: Preview
   - Branch: `pablo` (or leave blank for all preview branches)

### Vercel Configuration File (Optional)

Create `vercel.json` in repository root:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install",
  "framework": "vue",
  "git": {
    "deploymentEnabled": {
      "main": true,
      "pablo": true,
      "alex": true,
      "sarah": true,
      "marco": true
    }
  }
}
```

---

## Onboarding New Team Members

### Admin Checklist

```markdown
## New Member Onboarding: [NAME]

### GitHub Setup
- [ ] Add [NAME] to repository with **Write** access
- [ ] Create branch: `git checkout -b [username] && git push -u origin [username]`
- [ ] Add branch protection rule restricting push to @[username]

### Vercel Setup
- [ ] Add domain: `[username].comfy-vibe.vercel.app`
- [ ] Link domain to branch: `[username]`

### Communication
- [ ] Share this setup guide with new member
- [ ] Add to team Slack/Discord channel
- [ ] Schedule onboarding call if needed

### Verification
- [ ] New member can clone repo
- [ ] New member can push to their branch
- [ ] New member's subdomain is live
- [ ] New member CANNOT push to other branches
```

### New Member Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/comfy-org/comfy-vibe.git
cd comfy-vibe

# 2. Install dependencies
pnpm install

# 3. Switch to your branch
git checkout [your-username]

# 4. Verify you're on the right branch
git branch
# Should show: * [your-username]

# 5. Start development
pnpm dev

# 6. Make changes and push
git add .
git commit -m "My first change"
git push origin [your-username]

# 7. Check your live site
# https://[your-username].comfy-vibe.vercel.app
```

---

## Daily Workflow

### Starting Work

```bash
# 1. Make sure you're on your branch
git checkout pablo

# 2. (Optional) Sync with latest main
git fetch origin
git merge origin/main
# Or: git rebase origin/main

# 3. Start dev server
pnpm dev
```

### Making Changes

```bash
# 1. Make your changes
# ... edit files ...

# 2. Check what changed
git status
git diff

# 3. Commit with clear message
git add .
git commit -m "Add dark mode toggle to sidebar"

# 4. Push to your branch (auto-deploys!)
git push origin pablo
```

### Checking Your Deployment

1. Go to `https://pablo.comfy-vibe.vercel.app`
2. Or check Vercel dashboard for deployment status
3. Share URL with team for feedback

### Working with Feature Sub-branches (Optional)

If you want to experiment without affecting your main prototype:

```bash
# Create a feature branch from your branch
git checkout pablo
git checkout -b pablo/dark-mode-experiment

# Work on it...
git push origin pablo/dark-mode-experiment

# When ready, merge back to your branch
git checkout pablo
git merge pablo/dark-mode-experiment
git push origin pablo
```

---

## Merging to Production

### When Your Feature is Ready

```bash
# 1. Ensure your branch is up to date with main
git checkout pablo
git fetch origin
git merge origin/main

# 2. Resolve any conflicts
# ... fix conflicts if any ...
git add .
git commit -m "Merge main into pablo"

# 3. Push updated branch
git push origin pablo

# 4. Create Pull Request on GitHub
# Go to: https://github.com/comfy-org/comfy-vibe/compare/main...pablo
```

### PR Template

When creating a PR, use this template:

```markdown
## Summary
Brief description of what this feature/change does.

## Changes
- Added X
- Modified Y
- Removed Z

## Screenshots
[Include screenshots of your prototype]

## Testing
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] No console errors
- [ ] Build passes locally (`pnpm build`)

## Review URL
https://pablo.comfy-vibe.vercel.app

## Notes for Reviewers
Any specific areas to focus on or context needed.
```

### Review Process

1. **2 team members** must approve the PR
2. **CI checks** must pass (build, lint, etc.)
3. **Admin** or **author** merges after approvals
4. **Vercel** auto-deploys to production

### After Merge

```bash
# Sync your branch with the new main
git checkout pablo
git fetch origin
git merge origin/main
git push origin pablo
```

---

## Keeping Branches Synced

### Why Sync?

- Get latest shared components/styles
- Avoid large merge conflicts later
- Stay compatible with main codebase

### Recommended: Weekly Sync

```bash
# Every Monday (or your preferred schedule)
git checkout pablo
git fetch origin
git merge origin/main

# If conflicts:
# 1. Resolve them
# 2. git add .
# 3. git commit -m "Sync with main"

git push origin pablo
```

### Merge vs Rebase

| Method | Pros | Cons |
|--------|------|------|
| **Merge** | Simple, preserves history | Messier git log |
| **Rebase** | Clean linear history | Harder, can cause issues if not careful |

**Recommendation:** Use **merge** unless team is comfortable with rebase.

---

## Automation Scripts

### Script: Create New Team Member

Add to `package.json`:

```json
{
  "scripts": {
    "team:add": "node scripts/add-team-member.js"
  }
}
```

Create `scripts/add-team-member.js`:

```javascript
#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter new team member username: ', (username) => {
  const branchName = username.toLowerCase().replace(/[^a-z0-9]/g, '');

  console.log(`\nCreating branch: ${branchName}`);

  try {
    // Create and push branch
    execSync(`git checkout main`, { stdio: 'inherit' });
    execSync(`git pull origin main`, { stdio: 'inherit' });
    execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });
    execSync(`git push -u origin ${branchName}`, { stdio: 'inherit' });
    execSync(`git checkout main`, { stdio: 'inherit' });

    console.log(`\n✅ Branch "${branchName}" created successfully!`);
    console.log(`\n📋 Next steps (manual):`);
    console.log(`   1. Add branch protection rule for "${branchName}" in GitHub Settings`);
    console.log(`   2. Add domain "${branchName}.comfy-vibe.vercel.app" in Vercel`);
    console.log(`   3. Link domain to branch "${branchName}"`);
    console.log(`   4. Add @${username} to repository with Write access`);

  } catch (error) {
    console.error('Error creating branch:', error.message);
  }

  rl.close();
});
```

### Script: Sync Branch with Main

Add to `package.json`:

```json
{
  "scripts": {
    "sync": "git fetch origin && git merge origin/main"
  }
}
```

### Script: Check Branch Status

Add to `package.json`:

```json
{
  "scripts": {
    "status": "echo 'Current branch:' && git branch --show-current && echo '\nBehind main by:' && git rev-list --count HEAD..origin/main && echo 'commits'"
  }
}
```

---

## Troubleshooting

### "Permission denied" when pushing

**Cause:** You're trying to push to a protected branch you don't own.

**Solution:**
```bash
# Check which branch you're on
git branch

# Switch to your branch
git checkout [your-username]
```

### Deployment not triggering

**Cause:** Vercel may not have the branch configured for deployment.

**Solution:**
1. Check Vercel dashboard → Project → Settings → Git
2. Ensure "Deployment Enabled" is on for your branch
3. Or check `vercel.json` configuration

### Merge conflicts with main

**Solution:**
```bash
# 1. Fetch latest
git fetch origin

# 2. Merge main into your branch
git merge origin/main

# 3. Conflicts will be marked in files
# Open each conflicted file and resolve

# 4. After resolving all conflicts
git add .
git commit -m "Resolve merge conflicts with main"
git push origin [your-branch]
```

### Wrong code deployed

**Cause:** Pushed to wrong branch or Vercel cached old build.

**Solution:**
```bash
# 1. Verify you're on correct branch
git branch

# 2. Force redeploy in Vercel
# Go to Vercel → Deployments → ... menu → Redeploy
```

### Cannot see other team members' branches

**Cause:** Need to fetch remote branches.

**Solution:**
```bash
git fetch --all
git branch -a  # Shows all remote branches
```

---

## FAQ

### Can I see other team members' code?

**Yes.** Everyone has read access to all branches:
```bash
git fetch origin
git checkout alex  # View Alex's code (read-only for you)
git checkout pablo  # Switch back to your branch to edit
```

### What if I accidentally commit to wrong branch?

```bash
# If you haven't pushed yet:
git stash
git checkout [correct-branch]
git stash pop

# If you already pushed (and it was rejected):
# Good - the branch protection worked!
# Just switch to your branch and cherry-pick your commit
```

### Can I have multiple sub-branches?

**Yes.** Create feature branches under your namespace:
```bash
git checkout pablo
git checkout -b pablo/feature-x
# Work on it...
git push origin pablo/feature-x
```

### How do I delete an old branch?

Only admins should delete branches:
```bash
# Delete remote branch
git push origin --delete [branch-name]

# Delete local branch
git branch -d [branch-name]
```

### What happens if someone leaves the team?

1. Admin removes their branch protection rule
2. Admin removes their Vercel subdomain
3. Branch can be archived or deleted
4. Their code remains in git history

### Can I use a custom subdomain?

Yes, if you own a domain. Contact admin to configure:
- `pablo.comfy-prototypes.com` instead of `pablo.comfy-vibe.vercel.app`

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│                    DAILY COMMANDS                           │
├─────────────────────────────────────────────────────────────┤
│  Start work:     git checkout [your-branch]                 │
│  Sync:           pnpm sync (or git merge origin/main)       │
│  Dev server:     pnpm dev                                   │
│  Push:           git push origin [your-branch]              │
│  Your URL:       https://[you].comfy-vibe.vercel.app        │
├─────────────────────────────────────────────────────────────┤
│                    MERGE TO PRODUCTION                      │
├─────────────────────────────────────────────────────────────┤
│  1. Sync with main first                                    │
│  2. Create PR: [your-branch] → main                         │
│  3. Get 2 approvals                                         │
│  4. Merge PR                                                │
│  5. Celebrate! 🎉                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-XX-XX | [Admin] | Initial setup guide |
