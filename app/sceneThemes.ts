export const sceneThemes = ["garden", "cloud", "courtyard"] as const;

export type SceneTheme = (typeof sceneThemes)[number];

export function isSceneTheme(
  value: string | null | undefined,
): value is SceneTheme {
  return sceneThemes.some((theme) => theme === value);
}
