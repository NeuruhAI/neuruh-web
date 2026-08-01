'use client'

/**
 * Scene error boundary.
 *
 * SCENE_CONTRACT.md §10: "a scene error at runtime -> scene error boundary drops
 * to tier 0; the DOM layer never unmounts."
 *
 * This boundary therefore wraps ONLY the canvas subtree. If it wrapped the page
 * it would satisfy the letter of the contract and violate its point.
 *
 * A React error boundary does not see everything that can kill a WebGL scene:
 * a lost context arrives as a DOM event and an exception thrown inside the
 * rAF-driven frame loop never passes through React's renderer. Both are handled
 * explicitly by the Stage; this class covers the render-phase case.
 */

import { Component, type ErrorInfo, type ReactNode } from 'react'
import { getHarness } from '@/lib/metrics'

interface Props {
  children: ReactNode
  onFailure: (reason: string) => void
}

interface State {
  failed: boolean
}

export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const reason = `scene render error: ${error.message}`
    getHarness().recordError(`${reason} | ${info.componentStack?.slice(0, 400) ?? ''}`)
    // Reported through a callback rather than by rendering a message here: the
    // tier-0 route is an authored composition owned by the page, not a fallback
    // string owned by the boundary.
    this.props.onFailure(reason)
  }

  render() {
    if (this.state.failed) return null
    return this.props.children
  }
}
