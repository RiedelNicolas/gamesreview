// Single source for score thresholds and colors.
// Colors point at CSS tokens defined in src/style.css.
export const SCORE_TIERS = [
  { min: 90, color: 'var(--score-masterpiece)' },
  { min: 75, color: 'var(--score-great)' },
  { min: 50, color: 'var(--score-average)' },
  { min: 25, color: 'var(--score-mediocre)' },
  { min: 0, color: 'var(--score-bad)' }
]

export function scoreTier(score) {
  const s = Number(score) || 0
  return SCORE_TIERS.find(t => s >= t.min) || SCORE_TIERS[SCORE_TIERS.length - 1]
}

export const scoreColor = (score) => scoreTier(score).color

export const UNRATED_LABEL = 'Unrated'

// A score of 0 (or missing) means the game has not been rated yet.
export const isRated = (score) => Number(score) > 0
