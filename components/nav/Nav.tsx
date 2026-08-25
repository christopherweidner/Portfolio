import DesktopDock from "./DesktopDock";
import MobileMenu from "./MobileMenu";

/**
 * Navigation for the whole site.
 *
 * Two entirely separate designs, switched by CSS rather than by measuring the
 * viewport in JavaScript. `window.innerWidth` does not exist on the server, so
 * a JS switch renders the wrong one first and then corrects itself — a visible
 * flash and a hydration mismatch. With CSS the first painted frame is right.
 *
 * Both read their links from content/navigation.ts, so the two layouts can
 * diverge as much as they like without the content ever drifting apart.
 */
export default function Nav() {
  return (
    <>
      <DesktopDock />
      <MobileMenu />
    </>
  );
}
