/**
 * Image sizing helpers.
 *
 * A photo shown with object-fit: cover in a frame of another shape is drawn
 * larger than the frame and cropped. The browser picks which file to
 * download from `sizes`, so `sizes` must describe the drawn width, not the
 * frame's — otherwise a landscape photo in a portrait card is fetched at half
 * the width it needs and stretched.
 */

/** The shape of the home page photo cards (intro polaroids and hero fan). */
export const PHOTO_CARD_ASPECT = 4 / 5;

/**
 * How many frame-widths wide a photo is drawn when it covers a frame of
 * `frameAspect` (width / height). 1 when the photo is as wide or narrower.
 */
export function coverScale(image: { width: number; height: number }, frameAspect: number): number {
  return Math.max(1, image.width / image.height / frameAspect);
}
