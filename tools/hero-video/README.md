# Little G homepage film

Editable Remotion 4.0.532 / React Three Fiber source for the homepage's three 8-second, 1280 × 800, 30 fps videos. The website only serves the rendered MP4s; it does not ship Three.js or Remotion to visitors.

The character follows the owner's confirmed 小G胖 reference: wide white head, small dot eyes, an outlined open smile, short double-chin arc, roomy blue-purple GAP hoodie, gray trousers. Public visual reference: https://www.sohu.com/a/632833013_159592 (the G胖 illustration). This is a modeled interpretation, not an official character asset. No remote video footage was reused.

The timeline turns the stage into its front view, raises and waves the character's arm, blinks twice, tilts the head, moves the audio bars and gently sways the leaves. All motion comes from the current Remotion frame. Final frames rest with the arm lowered.

```sh
npm ci
npm run lint
npx remotion studio --no-open
npx remotion render src/index.ts LittleG-garden ../../public/videos/little-g-garden.mp4 --codec=h264 --crf=20 --pixel-format=yuv420p --gl=angle --concurrency=2
```

Use `LittleG-cloud` and `LittleG-courtyard` for the other palettes. After rendering, normalize the output to limited-range `yuv420p` with FFmpeg and add `-movflags +faststart`; create each `little-g-<theme>-poster.jpg` from the final frame at 7.966 seconds. The three poster images provide a static scene when automatic motion is disabled or video decoding is unavailable. No audio track is included.

Scene colors and geometry live in `src/Composition.tsx`. Composition dimensions and duration live in `src/Root.tsx`. Keep the left 40% clear for page text; the character occupies the right side, which the mobile layout crops with `object-position: 75%`.
