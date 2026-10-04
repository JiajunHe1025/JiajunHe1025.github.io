# Three research scenes

The homepage opens in the research garden. The scene switcher also offers a cloud island and a miniature courtyard. All three use Little G (小G胖 from 小蓝和他的朋友), identified and confirmed by the owner as the white round-headed character in a blue GAP hoodie.

## Assets and interaction

- `public/scenes/garden.webp`: Little G standing on the garden path, 418 KB.
- `public/scenes/cloud.webp`: Little G reading a book on the floating island, 240 KB.
- `public/scenes/courtyard.webp`: Little G resting beside the courtyard planter, 263 KB.

The 1672 × 941 illustrations were edited with the built-in image generation tool and compressed to WebP at quality 92. The owner-approved architecture, lighting and compositions were preserved. Public character confirmation reference: https://www.woyaogexing.com/touxiang/katong/2021/1167678.html.

These are rendered illustrations with pointer parallax and three research hotspots, rather than runtime 3D meshes. Hotspots open the existing method figure, research description and benchmark context in a keyboard-accessible dialog. Mobile screens use separate topic buttons below the illustration. Reduced-motion preferences disable the motion. The illustrated scenes use Little G as their mascot; the existing floating basketball pet remains available in the older themes.

## Preserved content

The four languages, nine older themes, travel gallery, calendar and music controls remain available. The homepage now includes search and year filters for all 22 publication records, plus links to the three existing technical reports. Theme and language preferences carry across the homepage, notes index and report pages.

## Build and preview

```sh
npm ci
npm run lint
npm test
npm run build:pages
python3 -m http.server 8879 --bind 127.0.0.1 --directory out
```

The GitHub Pages workflow publishes the static `out` export when changes are merged into `main`. Work on this design lives on `codex/three-research-scenes` until reviewed.
