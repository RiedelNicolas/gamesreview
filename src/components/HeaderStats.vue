<template>
  <header class="header-container">
    <div class="header-branding">
      <div class="header-icon-wrap">
        <span class="header-icon">🎮</span>
      </div>
      <div>
        <h1 class="header-title">
          Personal <span class="gradient-text">Game Tracker</span>
        </h1>
        <p class="header-subtitle">
          Nicolás Riedel
        </p>
      </div>
    </div>

    <div v-if="games && games.length" class="stats-summary">
      <div class="stat-box">
        <span class="stat-number">{{ games.length }}</span>
        <span class="stat-label">Juegos</span>
      </div>
      <div class="stat-box">
        <span class="stat-number">{{ totalHours }}h</span>
        <span class="stat-label">Horas Totales</span>
      </div>
      <div class="stat-box">
        <span class="stat-number score-accent">{{ avgScore }}</span>
        <span class="stat-label">Puntaje Promedio</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  games: {
    type: Array,
    default: () => []
  }
})

const totalHours = computed(() => {
  return props.games.reduce((acc, g) => acc + (Number(g.hoursToFinish) || 0), 0)
})

const avgScore = computed(() => {
  if (!props.games.length) return 0
  const total = props.games.reduce((acc, g) => acc + (Number(g.score) || 0), 0)
  return Math.round(total / props.games.length)
})
</script>

<style scoped>
.header-container {
  padding: 40px 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.header-branding {
  display: flex;
  align-items: center;
  gap: 18px;
}

.header-icon-wrap {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.18), rgba(168, 85, 247, 0.18));
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  flex-shrink: 0;
}

.header-icon {
  font-size: 2rem;
}

.header-title {
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #fff;
  line-height: 1.15;
}

.gradient-text {
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-subtitle {
  color: var(--text-secondary);
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  margin-top: 4px;
}

.stats-summary {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-box {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 10px 18px;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 105px;
}

.stat-number {
  font-family: var(--font-mono);
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
}

.score-accent {
  color: var(--accent-cyan);
}

.stat-label {
  font-size: 0.72rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  margin-top: 2px;
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats-summary {
    width: 100%;
    justify-content: space-between;
  }

  .stat-box {
    flex: 1;
    min-width: 0;
    padding: 8px 10px;
  }

  .stat-number {
    font-size: 1.2rem;
  }
}
</style>
