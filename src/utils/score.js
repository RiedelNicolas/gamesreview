// Single source for score thresholds, labels and colors.
// Colors point at CSS tokens defined in src/style.css.
export const SCORE_TIERS = [
  { min: 90, label: 'Masterpiece', color: 'var(--score-masterpiece)' },
  { min: 75, label: 'Great', color: 'var(--score-great)' },
  { min: 50, label: 'Decent', color: 'var(--score-average)' },
  { min: 25, label: 'Mediocre', color: 'var(--score-mediocre)' },
  { min: 0, label: 'Flawed', color: 'var(--score-bad)' }
]

export function scoreTier(score) {
  const s = Number(score) || 0
  return SCORE_TIERS.find(t => s >= t.min) || SCORE_TIERS[SCORE_TIERS.length - 1]
}

export const scoreColor = (score) => scoreTier(score).color
export const scoreLabel = (score) => scoreTier(score).label

export const UNRATED_LABEL = 'Sin calificar'

// A score of 0 (or missing) means the game has not been rated yet.
export const isRated = (score) => Number(score) > 0
