/* Same card as Open Graph — Twitter/X reads twitter:image first and only
   falls back to og:image inconsistently, so we ship it explicitly. */
export { default, alt, size, contentType } from "./opengraph-image";
