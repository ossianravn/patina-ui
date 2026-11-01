import type {
  ConceptEdge,
  ConceptEdgeType,
  ConceptNode,
} from "@/patina/extras/concept-map"

// Two Fieldbook concept maps: the grey heron's place in the reserve, laid out by its seed, and the sluice gate at
// high water, placed by hand.

export const HERON = {
  types: [
    { id: "feeds", label: "Feeds on", directed: true },
    { id: "habitat", label: "Shares habitat with", short: "shares habitat" },
    { id: "found", label: "Found at", directed: true },
  ] satisfies ConceptEdgeType[],
  nodes: [
    { id: "heron", label: "Grey heron" },
    { id: "eel", label: "Eel" },
    { id: "flounder", label: "Flounder" },
    { id: "vole", label: "Water vole" },
    { id: "crab", label: "Shore crab" },
    { id: "egret", label: "Little egret" },
    { id: "bittern", label: "Bittern" },
    { id: "flats", label: "Tidal flats", shape: "box" },
    { id: "reeds", label: "Reed bed", shape: "box" },
    { id: "sluice", label: "Sluice gate", shape: "box" },
  ] satisfies ConceptNode[],
  edges: [
    { from: "heron", to: "eel", type: "feeds" },
    { from: "heron", to: "flounder", type: "feeds" },
    { from: "heron", to: "vole", type: "feeds" },
    { from: "heron", to: "crab", type: "feeds" },
    { from: "egret", to: "crab", type: "feeds" },
    { from: "heron", to: "egret", type: "habitat" },
    { from: "heron", to: "bittern", type: "habitat" },
    { from: "heron", to: "flats", type: "found" },
    { from: "heron", to: "reeds", type: "found" },
    { from: "heron", to: "sluice", type: "found" },
  ] satisfies ConceptEdge[],
}

export const SLUICE = {
  types: [
    { id: "through", label: "Passes through", directed: true },
    { id: "waits", label: "Waits at", directed: true },
    { id: "feeds", label: "Feeds on", directed: true },
  ] satisfies ConceptEdgeType[],
  nodes: [
    { id: "sluice", label: "Sluice gate", shape: "box", x: 0.5, y: 0.5 },
    { id: "eel", label: "Eel", x: 0.16, y: 0.26 },
    { id: "flounder", label: "Flounder", x: 0.18, y: 0.78 },
    { id: "heron", label: "Grey heron", x: 0.84, y: 0.24 },
    { id: "cormorant", label: "Cormorant", x: 0.82, y: 0.78 },
  ] satisfies ConceptNode[],
  edges: [
    { from: "eel", to: "sluice", type: "through" },
    { from: "flounder", to: "sluice", type: "through" },
    { from: "heron", to: "sluice", type: "waits" },
    { from: "cormorant", to: "sluice", type: "waits" },
    { from: "heron", to: "eel", type: "feeds" },
    { from: "cormorant", to: "flounder", type: "feeds" },
  ] satisfies ConceptEdge[],
}
