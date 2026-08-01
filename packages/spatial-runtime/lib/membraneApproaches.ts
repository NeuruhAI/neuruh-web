/**
 * Membrane approach names and labels.
 *
 * Deliberately three-free. The DOM layer needs to name the approaches (rail
 * labels, URL parsing, benchmark rows) and must not drag the WebGL runtime into
 * the initial bundle to do it — ASSET_MANIFEST.yaml puts a hard 180 KB ceiling
 * on the initial payload "before ANY scene asset loads", and a stray value
 * import from a three module is the usual way that ceiling gets breached.
 */

export type MembraneApproach = 'physical' | 'ssr' | 'fresnel' | 'baked'

export const MEMBRANE_APPROACHES: MembraneApproach[] = ['physical', 'ssr', 'fresnel', 'baked']

export const APPROACH_LABEL: Record<MembraneApproach, string> = {
  physical: 'MeshPhysicalMaterial · live transmission',
  ssr: 'MeshTransmissionMaterial · screen-space refraction',
  fresnel: 'Fresnel + analytic scatter · APPROXIMATION, not transmission',
  baked: 'Baked thickness + normal · no transmission (tier 2/1 fallback)',
}
