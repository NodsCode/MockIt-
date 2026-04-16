export function preserveCase(source, replacement) {
  if (source.toUpperCase() === source) return replacement.toUpperCase();
  if (source[0] && source[0].toUpperCase() === source[0]) {
    return replacement[0].toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

export function createMode({ value, label, description, transform }) {
  return {
    value,
    label,
    description,
    transform
  };
}
