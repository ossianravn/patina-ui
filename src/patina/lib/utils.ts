import { createCn } from "cn/config"

// Class merging that knows Patina's theme. Without this, cn reads `text-small` or `text-button` as a text colour
// and drops it when a colour class such as `text-ink` follows; the same goes for the φ spacing names, the sheet
// radius and the voice fonts. Every kit component imports cn from here, not from "cn".
export const cn = createCn({
  extend: {
    theme: {
      text: [
        "label",
        "small",
        "ui",
        "button",
        "body",
        "lead",
        "h2",
        "h1",
        "title",
        "display",
      ],
      leading: ["body", "small", "ui", "heading", "subhead", "display", "lead"],
      spacing: [
        "hair",
        "tight",
        "snug",
        "line",
        "section",
        "page",
        "control",
        "control-compact",
      ],
      radius: ["sheet"],
      shadow: ["sheet", "lift"],
      font: ["read", "label", "hand", "ui"],
    },
  },
})
