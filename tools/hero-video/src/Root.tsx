import { Composition } from "remotion";
import { HeroFilm } from "./Composition";
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="LittleG-garden"
      component={HeroFilm}
      defaultProps={{ theme: "garden" }}
      durationInFrames={240}
      fps={30}
      width={1280}
      height={800}
    />
    <Composition
      id="LittleG-cloud"
      component={HeroFilm}
      defaultProps={{ theme: "cloud" }}
      durationInFrames={240}
      fps={30}
      width={1280}
      height={800}
    />
    <Composition
      id="LittleG-courtyard"
      component={HeroFilm}
      defaultProps={{ theme: "courtyard" }}
      durationInFrames={240}
      fps={30}
      width={1280}
      height={800}
    />
  </>
);
