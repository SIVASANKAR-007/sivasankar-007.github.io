/** Prefix a /public path with the deploy base path (e.g. GitHub Pages project sites). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const asset = (p: string) => `${BASE_PATH}${p}`;
