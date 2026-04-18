import styles from './ThumbPattern.module.css'

/**
 * Abstrakte Grid-Layout-Thumbnails fuer Core-Cards.
 * Austauschbar per `thumbPattern`-Key in cases.config.json.
 * Default-Fallback ist ein neutrales 2x2-Pattern, damit neue
 * Cases ohne eigenes Pattern trotzdem rendern.
 *
 * Pattern-IDs:
 *  - grid-4x1-figures   : 4 vertikale Figuren-Silhouetten
 *  - grid-3x2-faces     : 6 runde Face-Kreise (Expression)
 *  - grid-2x2-world     : 4 World-Tiles (Location)
 *  - grid-2x2-framing   : 4 Framing-Tiles (Shot Coverage)
 *  - grid-4x1-story     : 4 Story-Beats (Progression)
 *  - split-ref-master   : REF → MASTER (Normalizer)
 *  - split-start-end    : START | END (Video)
 *  - world-zones        : 3 Zonen (Zone Board)
 *  - scratch            : "+"-Symbol fuer Start-From-Scratch
 */
export default function ThumbPattern({ pattern, className }) {
  const cls = [styles.thumb, className].filter(Boolean).join(' ')

  switch (pattern) {
    case 'grid-4x1-figures':
      return (
        <div className={cls}>
          <div className={styles.grid4x1}>
            <FigureSilhouette view="front" />
            <FigureSilhouette view="right" />
            <FigureSilhouette view="left" />
            <FigureSilhouette view="back" />
          </div>
        </div>
      )
    case 'grid-3x2-faces':
      return (
        <div className={cls}>
          <div className={styles.grid3x2}>
            {Array.from({ length: 6 }).map((_, i) => (
              <FaceDot key={i} />
            ))}
          </div>
        </div>
      )
    case 'grid-2x2-world':
      return (
        <div className={cls}>
          <div className={styles.grid2x2}>
            <WorldTile variant="a" />
            <WorldTile variant="b" />
            <WorldTile variant="c" />
            <WorldTile variant="d" />
          </div>
        </div>
      )
    case 'grid-2x2-framing':
      return (
        <div className={cls}>
          <div className={styles.grid2x2}>
            <FramingTile size="wide" />
            <FramingTile size="medium" />
            <FramingTile size="close" />
            <FramingTile size="detail" />
          </div>
        </div>
      )
    case 'grid-4x1-story':
      return (
        <div className={cls}>
          <div className={styles.grid4x1}>
            {[0.35, 0.5, 0.65, 0.8].map((o, i) => (
              <StoryBeat key={i} opacity={o} offset={i * 5} />
            ))}
          </div>
        </div>
      )
    case 'split-ref-master':
      return (
        <div className={cls}>
          <div className={styles.splitTwo}>
            <div className={styles.splitCell}>
              <FigureSilhouette view="bust" />
              <div className={styles.refLabel}>REF</div>
            </div>
            <div className={styles.splitArrow}>→</div>
            <div className={styles.splitCell}>
              <FigureSilhouette view="full" />
            </div>
          </div>
        </div>
      )
    case 'split-start-end':
      return (
        <div className={cls}>
          <div className={styles.splitTwo}>
            <div className={styles.splitCell}>
              <div className={styles.startEndLabel}>START</div>
              <FigureSilhouette view="front" />
            </div>
            <div className={styles.splitArrow}>→</div>
            <div className={styles.splitCell}>
              <div className={styles.startEndLabel}>END</div>
              <FigureSilhouette view="right" />
            </div>
          </div>
        </div>
      )
    case 'world-zones':
      return (
        <div className={cls}>
          <div className={styles.worldZones}>
            <div className={`${styles.worldZoneShape} ${styles.worldZoneA}`} />
            <div className={`${styles.worldZoneShape} ${styles.worldZoneB}`} />
            <div className={`${styles.worldZoneShape} ${styles.worldZoneC}`} />
            <div className={styles.worldHorizon} />
          </div>
        </div>
      )
    case 'preset': {
      return (
        <div className={cls}>
          <div className={styles.grid4x1}>
            <FigureSilhouette view="front" />
            <FigureSilhouette view="right" />
            <FigureSilhouette view="left" />
            <FigureSilhouette view="back" />
          </div>
        </div>
      )
    }
    default:
      return (
        <div className={cls}>
          <div className={styles.grid2x2}>
            <WorldTile variant="a" />
            <WorldTile variant="b" />
            <WorldTile variant="c" />
            <WorldTile variant="d" />
          </div>
        </div>
      )
  }
}

function FigureSilhouette({ view }) {
  if (view === 'front') {
    return (
      <svg viewBox="0 0 24 24" className={styles.figureSvg}>
        <path
          d="M12 5c-1.5 0-2.5 1-2.5 2.5v1c0 1 .5 2 1.5 2.5v.5l-2 .5c-1 .3-1.5 1-1.5 2v5h9v-5c0-1-.5-1.7-1.5-2l-2-.5v-.5c1-.5 1.5-1.5 1.5-2.5v-1C14.5 6 13.5 5 12 5z"
          fill="currentColor"
          opacity="0.45"
        />
      </svg>
    )
  }
  if (view === 'right') {
    return (
      <svg viewBox="0 0 24 24" className={styles.figureSvg}>
        <path
          d="M14 5c-1.5 0-2.5 1-2.5 2.5v1c0 1 .5 2 1.5 2.5v.5l-2 .5c-1 .3-1.5 1-1.5 2v5h7v-14z"
          fill="currentColor"
          opacity="0.45"
        />
      </svg>
    )
  }
  if (view === 'left') {
    return (
      <svg viewBox="0 0 24 24" className={styles.figureSvg}>
        <path
          d="M10 5c1.5 0 2.5 1 2.5 2.5v1c0 1-.5 2-1.5 2.5v.5l2 .5c1 .3 1.5 1 1.5 2v5H7v-14z"
          fill="currentColor"
          opacity="0.45"
        />
      </svg>
    )
  }
  if (view === 'back') {
    return (
      <svg viewBox="0 0 24 24" className={styles.figureSvg}>
        <path
          d="M12 5c-1.5 0-2.5 1-2.5 2.5v1c0 1 .5 2 1.5 2.5v.5l-2 .5c-1 .3-1.5 1-1.5 2v5h9v-5c0-1-.5-1.7-1.5-2l-2-.5v-.5c1-.5 1.5-1.5 1.5-2.5v-1C14.5 6 13.5 5 12 5z"
          fill="currentColor"
          opacity="0.28"
        />
      </svg>
    )
  }
  if (view === 'bust') {
    return (
      <svg viewBox="0 0 24 24" className={styles.figureSvg}>
        <path
          d="M12 6c-1.5 0-2.5 1-2.5 2.5v1c0 1 .5 2 1.5 2.5v1h2v-1c1-.5 1.5-1.5 1.5-2.5v-1C14.5 7 13.5 6 12 6z"
          fill="currentColor"
          opacity="0.5"
        />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className={styles.figureSvg}>
      <path
        d="M12 4c-1.5 0-2.5 1-2.5 2.5v1c0 1 .5 2 1.5 2.5v.5l-2 .5c-1 .3-1.5 1-1.5 2v7h9v-7c0-1-.5-1.7-1.5-2l-2-.5v-.5c1-.5 1.5-1.5 1.5-2.5v-1C14.5 5 13.5 4 12 4z"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  )
}

function FaceDot() {
  return (
    <svg viewBox="0 0 24 24" className={styles.figureSvg}>
      <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.42" />
    </svg>
  )
}

function WorldTile({ variant }) {
  return <div className={`${styles.worldTile} ${styles[`worldTile_${variant}`]}`} />
}

function FramingTile({ size }) {
  return (
    <div className={styles.framingTile}>
      <div className={`${styles.framingMark} ${styles[`framing_${size}`]}`} />
    </div>
  )
}

function StoryBeat({ opacity, offset }) {
  return (
    <div className={styles.storyBeat}>
      <div
        className={styles.storyBeatMark}
        style={{ opacity, marginLeft: `${offset}%` }}
      />
    </div>
  )
}
