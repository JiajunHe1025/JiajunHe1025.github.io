import { useLayoutEffect, useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export type Theme = "garden" | "cloud" | "courtyard";
type Vector = [number, number, number];
export const palettes = {
  garden: {
    background: "#eef0d7",
    ground: "#92ad75",
    rim: "#e1e9c9",
    accent: "#e7ab83",
    plant: "#659374",
    pot: "#f2c3a4",
  },
  cloud: {
    background: "#e6f1f9",
    ground: "#d2e1ef",
    rim: "#f4f7fd",
    accent: "#f2b39f",
    plant: "#8fa9c3",
    pot: "#b9cfe1",
  },
  courtyard: {
    background: "#f9eadf",
    ground: "#e6c7ac",
    rim: "#f9e5cf",
    accent: "#a3725d",
    plant: "#7b9986",
    pot: "#d39d7b",
  },
};
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.2, 0.8, 0.3, 1),
} as const;
function Ball({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  color,
}: {
  position?: Vector;
  scale?: Vector;
  color: string;
}) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <sphereGeometry args={[1, 48, 32]} />
      <meshStandardMaterial color={color} roughness={0.48} />
    </mesh>
  );
}
function Box({
  position,
  size,
  color,
}: {
  position: Vector;
  size: Vector;
  color: string;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.65} />
    </mesh>
  );
}
function Cylinder({
  position,
  radius,
  height,
  color,
  rotation = [0, 0, 0],
}: {
  position: Vector;
  radius: number;
  height: number;
  color: string;
  rotation?: Vector;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, height, 64]} />
      <meshStandardMaterial color={color} roughness={0.55} />
    </mesh>
  );
}
function Curve({
  points,
  color = "#3e3634",
  radius = 0.014,
}: {
  points: Vector[];
  color?: string;
  radius?: number;
}) {
  const geometry = useMemo(
    () =>
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))),
        48,
        radius,
        8,
        false,
      ),
    [points, radius],
  );
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}
function FlatShape({
  kind,
  position,
  color,
}: {
  kind: "mouth" | "teeth";
  position: Vector;
  color: string;
}) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    if (kind === "mouth") {
      s.moveTo(-0.36, 0.07);
      s.lineTo(0.36, 0.13);
      s.quadraticCurveTo(0.34, -0.29, 0, -0.31);
      s.quadraticCurveTo(-0.31, -0.3, -0.36, 0.07);
    } else {
      s.moveTo(-0.326, 0.04);
      s.lineTo(0.326, 0.092);
      s.quadraticCurveTo(0.303, -0.26, 0, -0.275);
      s.quadraticCurveTo(-0.283, -0.26, -0.326, 0.04);
    }
    return s;
  }, [kind]);
  return (
    <mesh position={position}>
      <shapeGeometry args={[shape, 32]} />
      <meshBasicMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  );
}
function Lettering() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext("2d")!;
    context.fillStyle = "#292d4a";
    context.font = "160px Arial, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("GAP", 256, 136);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  return (
    <mesh position={[0, 2.01, 0.578]} rotation={[-0.13, 0, 0]}>
      <planeGeometry args={[1.07, 0.53]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}
function LittleG() {
  const frame = useCurrentFrame();
  const wave = interpolate(frame, [24, 47, 102, 125], [0, 1, 1, 0], clamp);
  const blink = Math.max(
    0,
    1 - Math.abs(frame - 105) / 3,
    1 - Math.abs(frame - 195) / 3,
  );
  return (
    <group
      position={[0, 0.42 + Math.sin(frame / 18) * 0.014, 0.35]}
      rotation={[
        0,
        interpolate(frame, [0, 50, 150, 220], [-0.23, 0.05, -0.07, 0], clamp),
        Math.sin(frame / 35) * 0.016,
      ]}
    >
      <Ball
        position={[-0.32, 0.25, 0.09]}
        scale={[0.27, 0.22, 0.41]}
        color="#f9f8f1"
      />
      <Ball
        position={[0.32, 0.25, 0.09]}
        scale={[0.27, 0.22, 0.41]}
        color="#f9f8f1"
      />
      <Ball
        position={[-0.31, 0.69, 0]}
        scale={[0.27, 0.51, 0.31]}
        color="#777a81"
      />
      <Ball
        position={[0.31, 0.69, 0]}
        scale={[0.27, 0.51, 0.31]}
        color="#777a81"
      />
      <Ball
        position={[0, 1.94, 0]}
        scale={[0.84, 0.91, 0.58]}
        color="#5969bb"
      />
      <Ball
        position={[0, 2.57, -0.28]}
        scale={[0.74, 0.45, 0.47]}
        color="#4c5aa3"
      />
      <group position={[-0.72, 2.39, 0.015]} rotation={[0, 0, -0.21]}>
        <Ball
          position={[0, -0.38, 0]}
          scale={[0.255, 0.58, 0.29]}
          color="#5969bb"
        />
        <Ball
          position={[0, -0.86, 0.035]}
          scale={[0.215, 0.23, 0.19]}
          color="#faf9f3"
        />
      </group>
      <group
        position={[0.73, 2.38, 0]}
        rotation={[
          0.18 * wave,
          0,
          0.17 + wave * (2.4 + Math.sin(frame / 4) * 0.23),
        ]}
      >
        <Ball
          position={[0, -0.37, 0]}
          scale={[0.255, 0.54, 0.29]}
          color="#5969bb"
        />
        <Ball
          position={[0, -0.88, 0.03]}
          scale={[0.22, 0.27, 0.18]}
          color="#faf9f3"
        />
      </group>
      <Lettering />
      <Curve
        points={[
          [-0.13, 2.52, 0.5],
          [-0.12, 2.34, 0.567],
          [-0.12, 2.17, 0.586],
        ]}
        color="#c0c9ec"
        radius={0.015}
      />
      <Curve
        points={[
          [0.13, 2.52, 0.5],
          [0.12, 2.34, 0.567],
          [0.12, 2.17, 0.586],
        ]}
        color="#c0c9ec"
        radius={0.015}
      />
      <group
        rotation={[
          0.06,
          0,
          interpolate(frame, [40, 80, 130, 175], [0, -0.045, 0.06, 0], clamp),
        ]}
        position={[0, 3.15, 0]}
      >
        <Ball scale={[1.03, 0.96, 0.83]} color="#fffdf5" />
        <group position={[-0.29, 0.12, 0.786]} scale={[1, 1 - blink * 0.94, 1]}>
          <Ball scale={[0.029, 0.033, 0.015]} color="#373335" />
        </group>
        <group position={[0.29, 0.12, 0.786]} scale={[1, 1 - blink * 0.94, 1]}>
          <Ball scale={[0.029, 0.033, 0.015]} color="#373335" />
        </group>

        <FlatShape kind="mouth" position={[0, -0.09, 0.834]} color="#363436" />
        <FlatShape kind="teeth" position={[0, -0.09, 0.84]} color="#fffdf7" />
        <Curve
          points={[
            [-0.29, -0.47, 0.71],
            [-0.15, -0.555, 0.729],
            [0, -0.575, 0.74],
            [0.15, -0.555, 0.729],
            [0.29, -0.47, 0.71],
          ]}
          color="#494442"
          radius={0.014}
        />
      </group>
    </group>
  );
}
function Plant({
  position,
  theme,
  scale = 1,
}: {
  position: Vector;
  theme: Theme;
  scale?: number;
}) {
  const frame = useCurrentFrame();
  const p = palettes[theme];
  return (
    <group position={position} scale={scale}>
      <Cylinder
        position={[0, 0.23, 0]}
        radius={0.3}
        height={0.44}
        color={p.pot}
      />
      <Cylinder
        position={[0, 0.43, 0]}
        radius={0.325}
        height={0.09}
        color={p.rim}
      />
      <group
        rotation={[
          0,
          Math.sin(frame / 40) * 0.025,
          Math.sin(frame / 26) * 0.022,
        ]}
      >
        <Cylinder
          position={[0, 0.91, 0]}
          radius={0.035}
          height={0.96}
          color={p.plant}
        />
        {[-1, 1].map((side) => (
          <group
            key={side}
            rotation={[0, side * 0.7, side * 0.6]}
            position={[0, 0.86, 0]}
          >
            <Ball
              position={[0, 0.31, 0]}
              scale={[0.22, 0.43, 0.055]}
              color={p.plant}
            />
            <Ball
              position={[0, 0.68, -0.06]}
              scale={[0.17, 0.32, 0.055]}
              color={p.plant}
            />
          </group>
        ))}
      </group>
    </group>
  );
}
function AudioRig({ theme }: { theme: Theme }) {
  const frame = useCurrentFrame();
  const p = palettes[theme];
  return (
    <group position={[-2.07, 0.51, -0.26]} rotation={[0, 0.2, 0]}>
      <Box position={[0, 0.79, 0]} size={[1.06, 1.6, 0.62]} color={p.rim} />
      <Box
        position={[0, 0.8, 0.319]}
        size={[0.86, 1.36, 0.024]}
        color="#3e5063"
      />
      {[0.55, 1.13].map((y, i) => (
        <group key={y} position={[0, y, 0.352]}>
          <Cylinder
            position={[0, 0, 0]}
            radius={i === 0 ? 0.31 : 0.14}
            height={0.035}
            color="#22364b"
            rotation={[Math.PI / 2, 0, 0]}
          />
          <Cylinder
            position={[0, 0, 0.025]}
            radius={i === 0 ? 0.21 : 0.07}
            height={0.045}
            color="#8096b0"
            rotation={[Math.PI / 2, 0, 0]}
          />
          <Cylinder
            position={[0, 0, 0.052]}
            radius={i === 0 ? 0.105 : 0.045}
            height={0.05}
            color={p.accent}
            rotation={[Math.PI / 2, 0, 0]}
          />
        </group>
      ))}
      <group position={[0, 2.05, 0]}>
        {Array.from({ length: 9 }, (_, i) => (
          <Ball
            key={i}
            position={[(i - 4) * 0.15, 0, 0]}
            scale={[
              0.038,
              0.13 + Math.abs(Math.sin(frame / 7 + i * 0.8)) * 0.31,
              0.038,
            ]}
            color={i % 2 === 0 ? p.accent : "#8fadd3"}
          />
        ))}
      </group>
    </group>
  );
}
function Books({ theme }: { theme: Theme }) {
  const p = palettes[theme];
  return (
    <group position={[1.72, 0.44, 1.01]} rotation={[0, -0.32, 0]}>
      {["#7892be", p.accent, "#f4dd95"].map((c, i) => (
        <group
          key={c}
          position={[0, 0.12 + i * 0.19, 0]}
          rotation={[0, (i - 1) * 0.13, 0]}
        >
          <Box position={[0, 0, 0]} size={[1.18, 0.055, 0.88]} color={c} />
          <Box
            position={[0, 0.073, 0]}
            size={[1.06, 0.105, 0.77]}
            color="#fff9ed"
          />
          <Box position={[0, 0.14, 0]} size={[1.18, 0.055, 0.88]} color={c} />
        </group>
      ))}
    </group>
  );
}
function Headphones({ theme }: { theme: Theme }) {
  const p = palettes[theme];
  return (
    <group position={[1.77, 0.65, -1.0]} rotation={[0, -0.24, 0]}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <torusGeometry args={[0.85, 0.13, 16, 64, Math.PI]} />
        <meshStandardMaterial color={p.accent} roughness={0.4} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.82, 1.24, 0]}>
          <Ball scale={[0.2, 0.43, 0.28]} color="#526883" />
          <Ball
            position={[-side * 0.12, 0, 0]}
            scale={[0.09, 0.36, 0.24]}
            color="#e4eaf0"
          />
        </group>
      ))}
      <Cylinder
        position={[0, 0.36, 0]}
        radius={0.045}
        height={1.18}
        color="#8da2b5"
      />
      <Cylinder
        position={[0, -0.21, 0]}
        radius={0.44}
        height={0.07}
        color="#61788d"
      />
    </group>
  );
}
function Camera() {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.lookAt(0, 1.75, 0);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}
function World({ theme }: { theme: Theme }) {
  const frame = useCurrentFrame();
  const p = palettes[theme];
  return (
    <>
      <Camera />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#f6f9ff", "#baa689", 0.6]} />
      <directionalLight
        position={[-4, 9, 7]}
        intensity={2.6}
        castShadow
        shadow-radius={5}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
      />
      <directionalLight position={[4, 5, -4]} intensity={0.8} color="#d8e7ff" />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.12, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial color={p.background} toneMapped={false} />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.11, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <shadowMaterial transparent opacity={0.1} />
      </mesh>
      <group
        position={[3.5, 0, 0]}
        rotation={[
          0,
          interpolate(frame, [0, 56, 160, 239], [-0.38, 0.03, -0.02, 0], clamp),
          0,
        ]}
      >
        <Cylinder
          position={[0, 0.05, 0]}
          radius={3.5}
          height={0.28}
          color={p.rim}
        />
        <Cylinder
          position={[0, 0.245, 0]}
          radius={3.37}
          height={0.12}
          color={p.ground}
        />
        <Cylinder
          position={[0, 0.335, 0.3]}
          radius={1.18}
          height={0.1}
          color={p.rim}
        />
        <LittleG />
        <AudioRig theme={theme} />
        <Headphones theme={theme} />
        <Books theme={theme} />
        <Plant position={[-2.02, 0.33, 1.68]} theme={theme} scale={0.83} />
        <Plant position={[2.14, 0.34, 1.94]} theme={theme} scale={0.6} />
        <Plant position={[0.31, 0.33, -2.17]} theme={theme} scale={1.06} />
        {Array.from({ length: 7 }, (_, i) => (
          <Ball
            key={i}
            position={[-2.62 + i * 0.66, 0.33, 2.1 + Math.sin(i) * 0.2]}
            scale={[0.23, 0.065, 0.14]}
            color="#f7edd5"
          />
        ))}
      </group>
    </>
  );
}
export function HeroFilm({ theme = "garden" }: { theme?: Theme }) {
  const { width, height } = useVideoConfig();
  const p = palettes[theme];
  return (
    <AbsoluteFill style={{ background: p.background }}>
      <ThreeCanvas
        width={width}
        height={height}
        orthographic
        camera={{ position: [0, 5.6, 14], zoom: 79, near: 0.1, far: 250 }}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <World theme={theme} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
}
