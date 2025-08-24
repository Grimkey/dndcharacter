// src/utils/characterLoader.js
// Scans src/character/*.json at build time via Vite's import.meta.glob

// Lazy map of all JSON files in ../character
const characterModules = import.meta.glob('../character/*.json');

/** Return a sorted list of file names like ["alice.json", "bob.json"] */
export function listCharacterFiles() {
  return Object.keys(characterModules)
    .map((p) => p.split('/').pop())
    .sort();
}

/** Load and return the parsed JSON for a given file name (e.g., "alice.json") */
export async function readCharacter(fileName) {
  const entry = Object.entries(characterModules).find(([p]) =>
    p.endsWith(`/${fileName}`)
  );

  if (!entry) {
    throw new Error(
      `Character file not found: ${fileName}. Available: ${listCharacterFiles().join(', ') || '(none)'}`
    );
  }

  const load = entry[1];              // dynamic import function
  const mod = await load();           // { default: <parsed JSON> }
  return mod.default;
}