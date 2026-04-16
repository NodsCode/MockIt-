import { builtInModes } from "./builtins";
import { communityModes } from "./community";

export const MODES = [...builtInModes, ...communityModes];

const modeMap = new Map(MODES.map((mode) => [mode.value, mode]));

export function getModeByValue(value) {
  return modeMap.get(value);
}

export function transformText(text, modeValue, intensity) {
  const mode = getModeByValue(modeValue);
  if (!mode) return text;
  return mode.transform(text, intensity);
}
