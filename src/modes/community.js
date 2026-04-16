import { createMode } from "./helpers";

function pirateMode(text, intensity) {
  let result = text
    .replace(/\bmy\b/gi, "me")
    .replace(/\byou\b/gi, "ye")
    .replace(/\bfriend\b/gi, "matey")
    .replace(/\bis\b/gi, "be");

  if (intensity >= 5 && !/[.!?]\s*$/.test(result)) {
    result += ", arr";
  }

  return result;
}

export const communityModes = [
  createMode({
    value: "pirate",
    label: "Pirate Crowd Mode",
    description: "Example community mode. Replace or extend this file with your own ideas.",
    transform: pirateMode
  })
];
