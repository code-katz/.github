# Adding Graphics to Code Katz

## 1. Clone the repo

Create a `code-katz` folder first, then clone from inside it:

```bash
mkdir -p code-katz
cd code-katz
git clone https://github.com/code-katz/.github.git
cd .github
```

## 2. Add your files

Drop files into the appropriate folders:

| What | Where |
|---|---|
| Logo files (full, icon, dark/light variants) | `media/logos/` |
| One-pagers, banners, social cards | `media/collateral/` |
| App/tool screenshots | `media/screenshots/` |

## 3. Create a branch and push

```bash
git checkout -b add-brand-assets
git add media/
git commit -m "Add brand logos and collateral"
git push origin add-brand-assets
```

## 4. Create a pull request

After pushing, go to:

**https://github.com/code-katz/.github/pulls**

You'll see a banner saying "add-brand-assets had recent pushes" with a **Compare & pull request** button. Click it, add a short description, and submit.

Or from the terminal:

```bash
gh pr create --title "Add brand logos and collateral" --body "Logo variations and collateral assets for Code Katz."
```
