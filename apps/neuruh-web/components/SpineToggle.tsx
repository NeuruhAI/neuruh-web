'use client'

import { useEffect, useState } from 'react'

type Spine = 'obsidian' | 'bone'
const KEY = 'neuruh-spine'

/**
 * Two co-equal spines. The document-level attribute is set before first paint by
 * the inline script in layout.tsx (stored choice, else the system preference);
 * this control lets a reader switch and remembers the choice on this device only.
 * The control carries a glyph and a word — never colour alone.
 */
export function SpineToggle() {
  const [spine, setSpine] = useState<Spine>('obsidian')
  useEffect(() => {
    const current = document.documentElement.getAttribute('data-spine')
    if (current === 'bone' || current === 'obsidian') setSpine(current)
  }, [])
  const next: Spine = spine === 'obsidian' ? 'bone' : 'obsidian'
  const apply = () => {
    document.documentElement.setAttribute('data-spine', next)
    try { localStorage.setItem(KEY, next) } catch {}
    setSpine(next)
  }
  return (
    <button
      type="button"
      className="spine-toggle"
      onClick={apply}
      aria-pressed={spine === 'bone'}
      aria-label={`Switch to the ${next} spine`}
      title={`Switch to the ${next} spine`}
      data-testid="spine-toggle"
    >
      <span className="glyph" aria-hidden="true">{spine === 'obsidian' ? '◐' : '◑'}</span>
      <span>{spine === 'obsidian' ? 'Bone' : 'Obsidian'}</span>
    </button>
  )
}
