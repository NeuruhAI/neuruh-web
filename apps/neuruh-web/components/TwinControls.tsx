'use client'

import { ALIVE_CHAPTERS } from '../../../packages/public-truth/experience'

export type ReadingMode = 'story' | 'reality'

export function TwinControls({
  chapter,
  chapterCount,
  paused,
  canPause,
  readingMode,
  onPauseToggle,
  onPrev,
  onNext,
  onReadingMode,
}: {
  chapter: number
  chapterCount: number
  paused: boolean
  canPause: boolean
  readingMode: ReadingMode
  onPauseToggle: () => void
  onPrev: () => void
  onNext: () => void
  onReadingMode: (mode: ReadingMode) => void
}) {
  const current = ALIVE_CHAPTERS[Math.min(chapterCount, Math.max(1, chapter)) - 1]
  const atStart = chapter <= 1
  const atEnd = chapter >= chapterCount

  return (
    <div className="twin-controls" data-testid="twin-controls" role="region" aria-label="Living twin controls">
      {canPause ? (
        <button
          type="button"
          className="n-btn n-btn--ghost t-ui-sm"
          onClick={onPauseToggle}
          aria-pressed={paused}
          data-testid="twin-pause"
        >
          {paused ? 'Resume scene' : 'Pause scene'}
        </button>
      ) : null}

      <div className="twin-controls__stage">
        <button
          type="button"
          className="n-btn n-btn--ghost t-ui-sm"
          onClick={onPrev}
          disabled={atStart}
          data-testid="twin-prev"
        >
          Previous stage
        </button>
        <p className="twin-controls__index" data-testid="twin-stage-index" aria-live="polite">
          {String(chapter).padStart(2, '0')} / {String(chapterCount).padStart(2, '0')}
          <span>{current?.label ?? 'Presence'}</span>
        </p>
        <button
          type="button"
          className="n-btn n-btn--ghost t-ui-sm"
          onClick={onNext}
          disabled={atEnd}
          data-testid="twin-next"
        >
          Next stage
        </button>
      </div>

      <div className="seg twin-controls__modes" role="group" aria-label="Reading mode">
        <button
          type="button"
          aria-pressed={readingMode === 'story'}
          data-testid="twin-story"
          onClick={() => onReadingMode('story')}
        >
          Story
        </button>
        <button
          type="button"
          aria-pressed={readingMode === 'reality'}
          data-testid="twin-reality"
          onClick={() => onReadingMode('reality')}
        >
          Reality
        </button>
      </div>
    </div>
  )
}
