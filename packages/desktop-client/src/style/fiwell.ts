import lightThemeCss from '@actual-app/components/themes/light.css?inline';

import fiwellCss from './fiwell.css?inline';

/**
 * The Fiwell theme. fiwell.css sets every color token itself; the light
 * theme goes first only as a fallback for tokens Actual adds before
 * fiwell.css catches up (fiwell.test.ts flags those).
 */
export const fiwellThemeCss = `${lightThemeCss}\n${fiwellCss}`;
