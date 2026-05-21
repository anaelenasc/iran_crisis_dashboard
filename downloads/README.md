# Dashboard download targets

The banner's two download buttons serve files from this folder.

| Button | Expected file |
| --- | --- |
| Download GTA Data | `gta-crisis-data.xlsx` |
| Download Indicators | `crisis_dashboard_data.xlsx` |

To update either download, drop the new `.xlsx` into this folder with the exact filename above. Vite serves anything under `public/` at the site root, so the dashboard picks the new file up on the next page load — no code change required.

If you need to rename or change the format, update the `DOWNLOADS` config at the top of `src/App.jsx` and these filenames must match.
