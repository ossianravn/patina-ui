import {
  defaultAppearance,
  normalize,
  STORAGE_KEY,
  type Appearance,
} from "./appearance"

/**
 * An inline script for <head> that applies the saved appearance before the first paint, so the page never flashes
 * the wrong paper. Pass the same defaults the app uses at runtime.
 */
export function appearanceScript(defaults: Appearance = defaultAppearance) {
  const fallback = JSON.stringify(normalize(defaults))
  return `(()=>{const d=${fallback};let a=d;try{a={...d,...JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)})||"{}")}}catch{}const r=document.documentElement,t=a.theme==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"night":"day"):a.theme;r.dataset.theme=t==="night"?"night":"day";r.dataset.themePreference=a.theme;r.dataset.stock=a.stock;r.dataset.variation=a.variation;r.dataset.patina=a.patina})()`
}
