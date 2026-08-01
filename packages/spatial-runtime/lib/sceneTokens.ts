/**
 * Reads art direction out of the design tokens at scene init.
 *
 * tokens/scene.css states the rule plainly: "art direction lives in ONE place
 * instead of being hard-coded into shader files". This module is the only
 * bridge. No component may hard-code a light colour, an intensity, a material
 * constant, or a budget number — it asks here.
 *
 * Every value carries a fallback identical to the token file so the scene still
 * renders correctly if the stylesheet has not applied yet.
 */

export interface SceneTokens {
  fogNear: number
  fogFar: number
  fogColor: string
  keyColor: string
  keyIntensity: number
  fillColor: string
  fillIntensity: number
  rimColor: string
  rimIntensity: number
  ambient: number

  emissiveVerified: string
  emissiveReview: string
  emissiveContradiction: string
  emissiveIlluminated: string
  emissiveDormant: string

  metalRoughness: number
  metalMetalness: number
  mineralRoughness: number
  mineralMetalness: number
  membraneTransmission: number
  membraneThickness: number
  membraneIor: number

  fovDesktop: number
  fovMobile: number
  cameraDamping: number
  chapterDuration: number

  budgetFrameMs: number
  budgetFrameMsMobile: number
  budgetSceneMemoryMb: number
  budgetInitialPayloadKb: number
  budgetFirstMeaningfulMs: number
  budgetDrawCalls: number
}

const FALLBACK: SceneTokens = {
  fogNear: 8,
  fogFar: 46,
  fogColor: '#05060a',
  keyColor: '#e8c98a',
  keyIntensity: 2.4,
  fillColor: '#4a5570',
  fillIntensity: 0.5,
  rimColor: '#cfe6ff',
  rimIntensity: 1.1,
  ambient: 0.18,
  emissiveVerified: '#3ddca0',
  emissiveReview: '#f5b83d',
  emissiveContradiction: '#f6685c',
  emissiveIlluminated: '#ddba6a',
  emissiveDormant: '#2a3140',
  metalRoughness: 0.32,
  metalMetalness: 0.95,
  mineralRoughness: 0.68,
  mineralMetalness: 0.05,
  membraneTransmission: 0.72,
  membraneThickness: 0.4,
  membraneIor: 1.36,
  fovDesktop: 38,
  fovMobile: 52,
  cameraDamping: 0.06,
  chapterDuration: 1400,
  budgetFrameMs: 16.7,
  budgetFrameMsMobile: 22,
  budgetSceneMemoryMb: 220,
  budgetInitialPayloadKb: 180,
  budgetFirstMeaningfulMs: 1200,
  budgetDrawCalls: 120,
}

function readVars(): CSSStyleDeclaration | null {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null
  return getComputedStyle(document.documentElement)
}

function num(css: CSSStyleDeclaration | null, name: string, fallback: number): number {
  const raw = css?.getPropertyValue(name).trim()
  if (!raw) return fallback
  const n = Number.parseFloat(raw)
  return Number.isFinite(n) ? n : fallback
}

function str(css: CSSStyleDeclaration | null, name: string, fallback: string): string {
  const raw = css?.getPropertyValue(name).trim()
  return raw ? raw : fallback
}

let cached: SceneTokens | null = null

export function readSceneTokens(force = false): SceneTokens {
  if (cached && !force) return cached
  const css = readVars()
  cached = {
    fogNear: num(css, '--scene-fog-near', FALLBACK.fogNear),
    fogFar: num(css, '--scene-fog-far', FALLBACK.fogFar),
    fogColor: str(css, '--scene-fog-color', FALLBACK.fogColor),
    keyColor: str(css, '--scene-key-color', FALLBACK.keyColor),
    keyIntensity: num(css, '--scene-key-intensity', FALLBACK.keyIntensity),
    fillColor: str(css, '--scene-fill-color', FALLBACK.fillColor),
    fillIntensity: num(css, '--scene-fill-intensity', FALLBACK.fillIntensity),
    rimColor: str(css, '--scene-rim-color', FALLBACK.rimColor),
    rimIntensity: num(css, '--scene-rim-intensity', FALLBACK.rimIntensity),
    ambient: num(css, '--scene-ambient', FALLBACK.ambient),

    emissiveVerified: str(css, '--scene-emissive-verified', FALLBACK.emissiveVerified),
    emissiveReview: str(css, '--scene-emissive-review', FALLBACK.emissiveReview),
    emissiveContradiction: str(css, '--scene-emissive-contradiction', FALLBACK.emissiveContradiction),
    emissiveIlluminated: str(css, '--scene-emissive-illuminated', FALLBACK.emissiveIlluminated),
    emissiveDormant: str(css, '--scene-emissive-dormant', FALLBACK.emissiveDormant),

    metalRoughness: num(css, '--scene-mat-metal-roughness', FALLBACK.metalRoughness),
    metalMetalness: num(css, '--scene-mat-metal-metalness', FALLBACK.metalMetalness),
    mineralRoughness: num(css, '--scene-mat-mineral-roughness', FALLBACK.mineralRoughness),
    mineralMetalness: num(css, '--scene-mat-mineral-metalness', FALLBACK.mineralMetalness),
    membraneTransmission: num(css, '--scene-mat-membrane-transmission', FALLBACK.membraneTransmission),
    membraneThickness: num(css, '--scene-mat-membrane-thickness', FALLBACK.membraneThickness),
    membraneIor: num(css, '--scene-mat-membrane-ior', FALLBACK.membraneIor),

    fovDesktop: num(css, '--scene-fov-desktop', FALLBACK.fovDesktop),
    fovMobile: num(css, '--scene-fov-mobile', FALLBACK.fovMobile),
    cameraDamping: num(css, '--scene-camera-damping', FALLBACK.cameraDamping),
    chapterDuration: num(css, '--scene-chapter-duration', FALLBACK.chapterDuration),

    budgetFrameMs: num(css, '--budget-frame-ms', FALLBACK.budgetFrameMs),
    budgetFrameMsMobile: num(css, '--budget-frame-ms-mobile', FALLBACK.budgetFrameMsMobile),
    budgetSceneMemoryMb: num(css, '--budget-scene-memory-mb', FALLBACK.budgetSceneMemoryMb),
    budgetInitialPayloadKb: num(css, '--budget-initial-payload-kb', FALLBACK.budgetInitialPayloadKb),
    budgetFirstMeaningfulMs: num(css, '--budget-first-meaningful-ms', FALLBACK.budgetFirstMeaningfulMs),
    budgetDrawCalls: num(css, '--budget-draw-calls', FALLBACK.budgetDrawCalls),
  }
  return cached
}

export const SCENE_TOKEN_FALLBACK = FALLBACK
