export const MODES = [
  { value: "randomCaps", label: "Random Caps" },
  { value: "runic", label: "Runic Fantasy" },
  { value: "dramatic", label: "Dramatic Stretch" },
  { value: "tiny", label: "Tiny Shout" },
  { value: "british", label: "Bri'ish Banter" },
  { value: "australian", label: "Mate Mode" }
];

const runicMap = {
  a: "ᔑ",
  b: "ʖ",
  c: "ᓵ",
  d: "↸",
  e: "ᒷ",
  f: "⎓",
  g: "⊣",
  h: "⍑",
  i: "╎",
  j: "⋮",
  k: "ꖌ",
  l: "ꖎ",
  m: "ᒲ",
  n: "リ",
  o: "𝙹",
  p: "!¡",
  q: "ᑑ",
  r: "∷",
  s: "ᓭ",
  t: "ℸ",
  u: "⚍",
  v: "⍊",
  w: "∴",
  x: "̇/",
  y: "||",
  z: "⨅"
};

function randomCapsTransform(text, intensity) {
  const chance = 0.28 + intensity * 0.05;
  return [...text]
    .map((char) => {
      if (!/[a-z]/i.test(char)) return char;
      return Math.random() < chance ? char.toUpperCase() : char.toLowerCase();
    })
    .join("");
}

function runicTransform(text) {
  return [...text]
    .map((char) => {
      const lower = char.toLowerCase();
      return runicMap[lower] ?? char;
    })
    .join("");
}

function dramaticTransform(text, intensity) {
  const repeatEvery = Math.max(2, 8 - intensity);
  let result = "";

  [...text].forEach((char, index) => {
    if (/\s/.test(char)) {
      result += " ";
      return;
    }

    result += char.toUpperCase();
    if ((index + 1) % repeatEvery === 0) {
      result += "!!!";
    } else if (/[aeiou]/i.test(char) && intensity > 4) {
      result += char.toLowerCase().repeat(Math.max(1, intensity - 4));
    }
  });

  return result;
}

function tinyTransform(text, intensity) {
  const separator = intensity > 6 ? " . " : " ";
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      if (word.length < 2) return word.toUpperCase();
      return word[0].toLowerCase() + word.slice(1).toUpperCase();
    })
    .join(separator);
}

function preserveCase(source, replacement) {
  if (source.toUpperCase() === source) return replacement.toUpperCase();
  if (source[0] && source[0].toUpperCase() === source[0]) {
    return replacement[0].toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

function britishTransform(text, intensity) {
  let result = text;
  const replacements = [
    [/\bmy\b/gi, "me"],
    [/\bfriend\b/gi, "mate"],
    [/\bvery\b/gi, "proper"],
    [/\bhey\b/gi, "oi"],
    [/\bhello\b/gi, "ello"],
    [/\bwhat\b/gi, "wot"],
    [/\bplease\b/gi, "if you please"]
  ];

  replacements.forEach(([pattern, replacement]) => {
    result = result.replace(pattern, (match) => preserveCase(match, replacement));
  });

  if (intensity >= 4) {
    result = result.replace(/th/gi, (match) => preserveCase(match, "f"));
  }

  if (intensity >= 6) {
    result = result.replace(/ter\b/gi, (match) => preserveCase(match, "tah"));
  }

  if (intensity >= 7) {
    result = result.replace(/\bbr(it)?ish\b/gi, (match) => preserveCase(match, "bri'ish"));
  }

  if (intensity >= 5 && !/[.!?]\s*$/.test(result)) {
    result += ", innit?";
  }

  return result;
}

function australianTransform(text, intensity) {
  let result = text;
  const replacements = [
    [/\bfriend\b/gi, "mate"],
    [/\beveryone\b/gi, "the whole crew"],
    [/\bafternoon\b/gi, "arvo"],
    [/\bbreakfast\b/gi, "brekkie"],
    [/\bbarbecue\b/gi, "barbie"],
    [/\bawesome\b/gi, "ripper"],
    [/\bexcellent\b/gi, "beaut"]
  ];

  replacements.forEach(([pattern, replacement]) => {
    result = result.replace(pattern, (match) => preserveCase(match, replacement));
  });

  if (intensity >= 4) {
    result = result.replace(/\byou\b/gi, (match) => preserveCase(match, "ya"));
  }

  if (intensity >= 6) {
    result = result.replace(/\bgoing to\b/gi, (match) => preserveCase(match, "gonna"));
  }

  if (intensity >= 7) {
    result = result.replace(/\bthanks\b/gi, (match) => preserveCase(match, "cheers"));
  }

  if (intensity >= 5 && !/[.!?]\s*$/.test(result)) {
    result += ", mate";
  }

  return result;
}

export function transformText(text, mode, intensity) {
  switch (mode) {
    case "randomCaps":
      return randomCapsTransform(text, intensity);
    case "runic":
      return runicTransform(text);
    case "dramatic":
      return dramaticTransform(text, intensity);
    case "tiny":
      return tinyTransform(text, intensity);
    case "british":
      return britishTransform(text, intensity);
    case "australian":
      return australianTransform(text, intensity);
    default:
      return text;
  }
}
