import { useGlobalPref } from '#hooks/useGlobalPref';

import { parseInstalledTheme } from './customThemes';
import fiwellCss from './fiwell.css?inline';
import { useTheme } from './theme';

/**
 * Fiwell brand colors on top of the built-in light theme. Rendered right
 * after ThemeStyle, so a custom theme the user installs still wins.
 */
export function FiwellThemeStyle() {
  const [activeTheme] = useTheme();
  const [installedCustomLightThemeJson] = useGlobalPref(
    'installedCustomLightTheme',
  );

  if (parseInstalledTheme(installedCustomLightThemeJson)) {
    return null;
  }

  if (activeTheme === 'light') {
    return <style>{fiwellCss}</style>;
  }

  if (activeTheme === 'auto') {
    return <style media="(prefers-color-scheme: light)">{fiwellCss}</style>;
  }

  return null;
}
