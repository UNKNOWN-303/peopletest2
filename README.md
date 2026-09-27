# People Organizer v2

GitHub Pages-ready, non-animated, local-first people organizer.

## Fixed
- Categories, traits and interests are now separate libraries.
- All three can be added, renamed, deleted and assigned to people.
- Custom items no longer accidentally appear in the wrong library.
- People can have multiple categories, traits and interests.
- Search/filter/sort.
- Dashboard.
- Favorites.
- Follow-up dates.
- Last interaction.
- How met.
- Contact info.
- Strengths and goals.
- Notes.
- JSON backup/restore.
- CSV export.
- Dark/light mode.
- Browser autosave.
- PIN lock: 0000.

## Hosting
Upload `index.html`, `style.css`, and `app.js` to the GitHub Pages repository.

## Storage/security
Data is saved in browser localStorage. The PIN is a client-side lock, not a cryptographic security boundary, because this is a static GitHub Pages app. Do not treat it as protection against someone who can inspect the site's source/browser storage.
