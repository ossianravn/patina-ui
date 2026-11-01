import { sharedFilters } from "@/patina/ink/filters"

const filters = sharedFilters()

/** The shared SVG filters every pen line, wash and sketch frame refers to. Render once, inside <body>. */
export function PatinaDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute" }}
      dangerouslySetInnerHTML={{ __html: filters }}
    />
  )
}
