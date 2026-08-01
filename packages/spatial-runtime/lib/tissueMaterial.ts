/**
 * Tissue material — per-instance state drives emissive in one draw call.
 *
 * ASSET_MANIFEST.yaml, tissue_block: "Per-cell state (dormant/verified/review/
 * contradiction) rides in an instanced attribute, so the eleven-state system is
 * expressed on the GPU rather than as separate meshes."
 *
 * The emissive colours come from tokens/scene.css and are the SAME values as the
 * DOM's --status-* tokens. ASSET_MANIFEST.yaml `emissive_law`: "An emissive
 * value that does not correspond to a state token is forbidden."
 *
 * Focus radius (SCENE_CONTRACT.md §1) is applied here as a world-space gate, not
 * as a separate object. That is the mechanism the contract names for expressing
 * recognition without adding geometry.
 */

import { Color, MeshStandardMaterial, type IUniform } from 'three'
import type { SceneTokens } from './sceneTokens'

export interface TissueUniforms {
  uFocusRadius: IUniform<number>
  uStateColors: IUniform<Color[]>
  uEmissiveGain: IUniform<number>
  uTime: IUniform<number>
  /** 0..1 progress of the signature trace; lights cells along the channel. */
  uTraceProgress: IUniform<number>
  uTraceColor: IUniform<Color>
  uDormantColor: IUniform<Color>
}

export function makeTissueMaterial(tokens: SceneTokens): {
  material: MeshStandardMaterial
  uniforms: TissueUniforms
} {
  const uniforms: TissueUniforms = {
    uFocusRadius: { value: 0 },
    uStateColors: {
      value: [
        new Color(tokens.emissiveDormant),
        new Color(tokens.emissiveVerified),
        new Color(tokens.emissiveReview),
        new Color(tokens.emissiveContradiction),
        new Color(tokens.emissiveIlluminated),
      ],
    },
    uEmissiveGain: { value: 1 },
    uTime: { value: 0 },
    uTraceProgress: { value: 0 },
    uTraceColor: { value: new Color(tokens.emissiveVerified) },
    uDormantColor: { value: new Color(tokens.emissiveDormant) },
  }

  const material = new MeshStandardMaterial({
    color: new Color('#3a4352'),
    roughness: tokens.mineralRoughness,
    metalness: tokens.mineralMetalness,
    flatShading: true,
  })

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms)

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        attribute float aState;
        attribute float aSeed;
        attribute float aDistance;
        varying float vState;
        varying float vSeed;
        varying float vDistance;`,
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vState = aState;
        vSeed = aSeed;
        vDistance = aDistance;`,
      )

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform float uFocusRadius;
        uniform vec3 uStateColors[5];
        uniform float uEmissiveGain;
        uniform float uTime;
        uniform float uTraceProgress;
        uniform vec3 uTraceColor;
        uniform vec3 uDormantColor;
        varying float vState;
        varying float vSeed;
        varying float vDistance;

        vec3 neuruhStateColor( float s ) {
          int i = int( floor( s + 0.5 ) );
          if ( i <= 0 ) return uStateColors[0];
          if ( i == 1 ) return uStateColors[1];
          if ( i == 2 ) return uStateColors[2];
          if ( i == 3 ) return uStateColors[3];
          return uStateColors[4];
        }`,
      )
      // Injected BEFORE lighting: `outgoingLight` is assembled from
      // totalEmissiveRadiance further down meshphysical.glsl, so writing to it
      // after <opaque_fragment> would have no effect at all. This is the kind of
      // thing that silently renders nothing and gets called "the GPU can't do it".
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        {
          // Focus radius: cells within uFocusRadius of the core are lit. The
          // edge is softened over roughly one cell width so recognition reads as
          // a front travelling outward rather than a hard circle.
          float focus = 1.0 - smoothstep( uFocusRadius - 0.42, uFocusRadius + 0.14, vDistance );

          // The trace front. Cells light as the evidence signal reaches them and
          // stay lit: on completion the traced path holds, it does not fade.
          float traceFront = uTraceProgress * 4.6;
          float traced = step( vDistance, traceFront ) * step( 0.001, uTraceProgress );

          vec3 stateCol = neuruhStateColor( vState );
          // Dormant cells emit nothing, whatever the focus. Illumination is
          // earned — the design system's second master visual rule.
          float isDormant = step( vState, 0.5 );
          float breathe = 0.86 + 0.14 * sin( uTime * 1.1 + vSeed * 6.2831 );

          vec3 emissive = stateCol * focus * uEmissiveGain * breathe * ( 1.0 - isDormant );
          emissive = mix( emissive, uTraceColor * 1.35, traced * 0.75 * focus );

          totalEmissiveRadiance += emissive;
        }`,
      )
  }

  material.customProgramCacheKey = () => 'neuruh-tissue-instanced-state'

  return { material, uniforms }
}
