# Add Your Own MockIt Mode

MockIt supports community-made text modes.

## Fast path

1. Open `src/modes/community.js`
2. Add a new mode object to the `communityModes` array
3. Give it:
   - `value`: unique id
   - `label`: name shown in the app
   - `description`: short explanation
   - `transform(text, intensity)`: function that returns the remixed text
4. Run `npm run dev`
5. Open a pull request on GitHub

## Example

```js
import { createMode } from "./helpers";

function robotMode(text, intensity) {
  let result = text.replace(/\bhello\b/gi, "greetings unit");

  if (intensity > 6) {
    result = result.toUpperCase();
  }

  return result;
}

export const communityModes = [
  createMode({
    value: "robot",
    label: "Robot Voice",
    description: "Makes everything sound like a dramatic machine.",
    transform: robotMode
  })
];
```

## Tips

- Keep modes playful and safe for public contributions
- Return a string every time
- Try to preserve punctuation when possible
- If you add several modes, just add more `createMode(...)` entries
- Built-in modes live in `src/modes/builtins.js`

## Optional helpers

`src/modes/helpers.js` includes:

- `createMode(...)` for consistent mode objects
- `preserveCase(source, replacement)` if your mode swaps words and should keep capitalization
