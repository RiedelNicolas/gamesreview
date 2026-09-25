<template>
  <section class="hero">
    <div class="hero-media">
      <img
        v-if="!imageFailed"
        :src="imageUrl"
        :alt="game.title"
        :class="{ 'is-cover': !game.artwork }"
        @error="imageFailed = true"
      />
    </div>
    <div class="hero-text">
      <div>
        <p class="kicker">Latest played</p>
        <h2 class="hero-title">{{ game.title }}</h2>
        <p class="hero-byline">
          {{ formatNumber(game.hoursToFinish) }} h · {{ game.platform }}<template v-if="game.dateCompleted"> · {{ formatDate(game.dateCompleted, { year: 'numeric', month: 'long', day: 'numeric' }) }}</template>
        </p>
      </div>
      <p v-if="isRated(game.score)" class="hero-score" :style="{ color: scoreColor(game.score) }">
        {{ game.score }}
      </p>
      <p v-else class="hero-unrated">{{ UNRATED_LABEL }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { isRated, scoreColor, UNRATED_LABEL } from '../utils/score.js'
import { formatDate, formatNumber } from '../utils/format.js'

const props = defineProps({
  game: {
    type: Object,
    required: true
  }
})

const imageFailed = ref(false)
const imageUrl = computed(() => props.game.artwork || props.game.coverUrl)
watch(imageUrl, () => { imageFailed.value = false })
</script>

<style scoped>
.hero {
  padding: var(--space-6) 0 var(--space-7);
}

.hero-media {
  aspect-ratio: 21 / 9;
  background: var(--rule);
  overflow: hidden;
}

.hero-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
  display: block;
}

/* Portrait cover as fallback: show it whole, centered on a flat field */
.hero-media img.is-cover {
  object-fit: contain;
}

.hero-text {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-6);
  margin-top: var(--space-5);
}

.kicker {
  font-size: var(--text-sm);
  color: var(--accent);
  font-weight: 500;
}

.hero-title {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 600;
  font-variation-settings: 'opsz' 144;
  line-height: 1.05;
  letter-spacing: -0.015em;
  margin-top: var(--space-2);
}

.hero-byline {
  margin-top: var(--space-3);
  font-size: var(--text-sm);
  color: var(--ink-soft);
}

.hero-score {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: 600;
  font-variation-settings: 'opsz' 144;
  line-height: 0.85;
  font-variant-numeric: lining-nums;
}

.hero-unrated {
  font-family: var(--font-display);
  font-style: italic;
  font-size: var(--text-xl);
  color: var(--ink-muted);
  white-space: nowrap;
}

@media (max-width: 640px) {
  .hero {
    padding-top: var(--space-5);
  }

  .hero-media {
    aspect-ratio: 16 / 9;
  }

  .hero-text {
    gap: var(--space-4);
  }
}
</style>
