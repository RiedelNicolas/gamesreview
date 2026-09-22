<template>
  <header class="header-container">
    <div class="header-branding">
      <div class="header-icon-wrap">
        <span class="header-icon">🎮</span>
      </div>
      <div>
        <h1 class="header-title">
          Personal <span class="gradient-text">Game Review</span>
        </h1>
        <p class="header-subtitle">
          Nicolás Riedel
        </p>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  games: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.header-container {
  padding: 40px 0 24px;
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
</style>
