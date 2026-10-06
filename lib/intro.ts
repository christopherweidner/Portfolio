/**
 * The intro plays once per browser session. This script runs in <head>
 * before first paint and marks <html> when the intro must not show — already
 * seen this session, or reduced motion requested — so CSS can hide the
 * overlay before it is ever drawn. Storage can throw (private mode, blocked
 * site data); then the intro simply plays.
 */
export const INTRO_SEEN_KEY = "intro-seen";

export const INTRO_GATE_SCRIPT = `(function(){var d=document.documentElement;try{if(sessionStorage.getItem("${INTRO_SEEN_KEY}"))d.dataset.intro="skip"}catch(e){}if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)d.dataset.intro="skip"})();`;
