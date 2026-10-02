import { ONBOARDING_PATH_PREFIX, THEME_STORAGE_KEY } from "./resolve.ts";

/**
 * Runs before hydration so the first paint already matches the stored theme
 * instead of flashing the wrong one. Injected as an inline script by
 * `app/layout.tsx`.
 *
 * Onboarding routes are painted light here for the same reason the provider
 * locks them: it is the only place that can act before React mounts, and a
 * dark first frame would otherwise be visible to every OS-dark user.
 *
 * The constants are interpolated from `resolve.ts` so the script cannot drift
 * from the resolver that runs after hydration.
 */
export const THEME_SCRIPT = `(function(){try{var p=location.pathname;var o=p==='${ONBOARDING_PATH_PREFIX}'||p.indexOf('${ONBOARDING_PATH_PREFIX}/')===0;var t=localStorage.getItem('${THEME_STORAGE_KEY}')||'system';var d=!o&&(t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches));document.documentElement.classList.toggle('dark',d);document.documentElement.dataset.theme=d?'dark':'light';document.documentElement.style.colorScheme=d?'dark':'light'}catch(e){}})()`;
