# Little G research homepage

The homepage opens with an eight-second silent 3D film. The existing garden, cloud and courtyard switches choose green, pale-blue and warm palettes of the same miniature audio stage. Little G turns, waves, blinks and tilts his head while the stage turns to face the visitor, audio bars move and leaves sway.

The character was rebuilt from the owner's confirmed 小G胖 reference with a wide white head, small dot eyes, outlined open smile, short double-chin arc, roomy blue-purple GAP hoodie and gray trousers. Visual reference: https://www.sohu.com/a/632833013_159592 (the G胖 illustration). It is a modeled interpretation, not an official character asset. The earlier generated scene illustrations remain in `public/scenes` as design history but no longer appear in the main hero.

## Video assets

- `public/videos/little-g-garden.mp4`
- `public/videos/little-g-cloud.mp4`
- `public/videos/little-g-courtyard.mp4`
- Matching `little-g-<theme>-poster.jpg` stills from the final frame.

Each film is 1280 × 800, 30 fps, eight seconds, H.264 with limited-range yuv420p and faststart, about 500 KB. It contains no audio track. Editable Remotion / React Three Fiber source and its lockfile are in `tools/hero-video`, with separate build instructions. The website serves the finished MP4 through a native video element and adds no 3D libraries to its runtime.

## Playback and research

Playback starts only after preference restoration, when the video is at least 15% visible and automatic motion is allowed. It pauses when the scene leaves the viewport or the document is hidden. It plays once and rests on its final frame. Manual pause remains paused when the visitor scrolls away and back. Play and replay controls permit intentional motion, including with a reduced-motion preference. Newly enabling reduced motion pauses playback. An autoplay rejection leaves a usable manual play control.

Scene selection remounts the video, while changing language preserves its current time. Text stays still. The previous CSS entrance rotation and pointer parallax are no longer applied to the video.

Three fixed research buttons sit below the visual, opening the existing paper method figure, research description and benchmark context in a keyboard-accessible dialog. They remain in fixed positions while the film moves. The four languages include video labels and controls. Mobile shows text followed by a 400px video stage cropped toward the character at the right, then the research buttons.

## Preserved content

The four languages, nine older themes, travel gallery, calendar and music controls remain available. The homepage includes search and year filters for all 22 publication records, plus links to the three existing technical reports. Theme and language preferences carry across the homepage, notes index and report pages.

## Build and preview

```sh
npm ci
npm run lint
npm test
npm run build:pages
python3 -m http.server 8879 --bind 127.0.0.1 --directory out
```

The GitHub Pages workflow publishes the static `out` export when changes are merged into `main`. Work remains on `codex/three-research-scenes` in the existing draft PR until reviewed.
