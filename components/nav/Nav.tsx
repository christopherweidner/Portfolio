import TopBar from "./TopBar";

/**
 * Navigation for the whole site. One component at every width, so there is
 * no viewport switch and nothing to flash on first paint. Links live in
 * content/navigation.ts.
 */
export default function Nav() {
  return <TopBar />;
}
