# Updating this site from another computer

The live site auto-deploys from GitHub Pages whenever you push to `main`.

- Repo: https://github.com/lynfeir/sunshine-growth-solutions
- Live: https://lynfeir.github.io/sunshine-growth-solutions/

## Copy-paste prompt for Claude (or any AI assistant) on another computer

> I want to update Tanya DiClemente's website, Sunshine Growth Solutions.
>
> The repo is at https://github.com/lynfeir/sunshine-growth-solutions and it auto-deploys to https://lynfeir.github.io/sunshine-growth-solutions/ on every push to `main`.
>
> Please:
> 1. Clone the repo if it isn't already on this machine: `gh repo clone lynfeir/sunshine-growth-solutions`
> 2. Read `README.md` and `UPDATING.md` for the structure, placeholders, and design tokens.
> 3. Make the changes I describe below.
> 4. Test locally by running `python -m http.server 8080` in the repo root and opening http://localhost:8080.
> 5. Commit with a short message describing the change, then push to `main`. The site will rebuild in about a minute.
>
> Things to change:
> [describe what you want updated]

## What lives where

| Change                          | File                                                     |
| ------------------------------- | -------------------------------------------------------- |
| Text on the page                | `index.html` (one file, all sections)                    |
| Colors, fonts, spacing          | `css/styles.css` (tokens live in `:root` at the top)     |
| Animations, form, mobile nav    | `js/main.js`                                             |
| Contact form delivery key       | `index.html`, search for `YOUR_WEB3FORMS_ACCESS_KEY`     |
| Email and phone                 | `index.html` and the JSON-LD block at the top            |
| Stats (15+, $250M+, 40+, 95%)   | `index.html`, search for `class="stat-num"`              |
| Testimonials                    | `index.html`, search for `class="quote"`                 |
| Founder photo                   | `assets/`, then update the `.arch-photo` block           |
| Favicon                         | `assets/favicon.svg`                                     |
| Social share image              | `assets/og-image.png`, regenerate via `scripts/generate_og.py` |

## How to make any change

```bash
# get the latest
git pull

# edit files

# preview locally
python -m http.server 8080
# open http://localhost:8080

# ship the change
git add -A
git commit -m "short description of what you changed"
git push
```

GitHub Pages rebuilds automatically. Check the Actions tab in the repo for build status.

## If you need a different account

The repo is owned by `lynfeir`. To transfer it later: GitHub repo settings, scroll to Danger Zone, Transfer ownership.
