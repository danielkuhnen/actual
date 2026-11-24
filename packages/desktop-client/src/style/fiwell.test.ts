import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import { theme } from '@actual-app/components/theme';

// Vitest does not load CSS, so read the theme files from disk.
const require = createRequire(path.join(__dirname, 'fiwell.test.ts'));

function readCss(specifier: string) {
  return readFileSync(require.resolve(specifier), 'utf8');
}

const fiwellCss = readFileSync(path.join(__dirname, 'fiwell.css'), 'utf8');

function declaredTokens(css: string) {
  return new Set(
    Array.from(css.matchAll(/(--color-[A-Za-z0-9]+)\s*:/g), match => match[1]),
  );
}

function referencedTokens(values: string[]) {
  return values.flatMap(value =>
    Array.from(value.matchAll(/var\((--color-[A-Za-z0-9]+)/g), m => m[1]),
  );
}

describe('Fiwell theme', () => {
  it('sets every color token an Actual theme has', () => {
    const fiwellTokens = declaredTokens(fiwellCss);
    const actualTokens = new Set([
      ...declaredTokens(readCss('@actual-app/components/themes/light.css')),
      ...declaredTokens(readCss('@actual-app/components/themes/dark.css')),
      ...declaredTokens(readCss('@actual-app/components/themes/midnight.css')),
      ...referencedTokens(Object.values(theme)),
    ]);

    const missing = [...actualTokens].filter(token => !fiwellTokens.has(token));

    expect(actualTokens.size).toBeGreaterThan(200);
    expect(missing).toEqual([]);
  });

  it('uses no purple from the Actual palette', () => {
    expect(fiwellCss).toContain('--color-pageBackground:');
    expect(fiwellCss).not.toMatch(/--palette-purple/);
  });
});
