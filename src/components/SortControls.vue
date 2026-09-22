<template>
  <div class="controls-bar">
    <!-- Top row: Search + Platform Filter + Add Game button -->
    <div class="controls-row-top">
      <!-- Search Bar -->
      <div class="search-wrap">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          type="text" 
          :value="searchQuery" 
          @input="$emit('update:searchQuery', $event.target.value)"
          placeholder="Buscar por título, plataforma o género..."
          class="search-input"
        />
        <button 
          v-if="searchQuery" 
          class="search-clear" 
          @click="$emit('update:searchQuery', '')"
          aria-label="Limpiar filtro"
        >
          ✕
        </button>
      </div>

      <!-- Add game button -->
      <button class="add-game-btn" @click="$emit('open-add')">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Cargar Juego</span>
      </button>
    </div>

    <!-- Bottom row: Platform pills + Sort selector -->
    <div class="controls-row-bottom">
      <!-- Platform Pills Filter -->
      <div class="platform-filter-wrap">
        <span class="filter-label">Plataforma:</span>
        <div class="platform-pills">
          <button 
            class="platform-pill-btn" 
            :class="{ active: !selectedPlatform }"
            @click="$emit('update:selectedPlatform', '')"
          >
            Todas
          </button>
          <button 
            v-for="plat in platforms" 
            :key="plat"
            class="platform-pill-btn"
            :class="{ active: selectedPlatform === plat }"
            @click="$emit('update:selectedPlatform', plat)"
          >
            {{ plat }}
          </button>
        </div>
      </div>

      <!-- Sort Selector -->
      <div class="sort-selector-wrap">
        <label for="sort-select" class="sort-label">Ordenar por:</label>
        <div class="select-container">
          <select 
            id="sort-select"
            :value="sortBy" 
            @change="$emit('update:sortBy', $event.target.value)"
            class="sort-select"
          >
            <option value="date-desc">Fecha (más reciente)</option>
            <option value="date-asc">Fecha (más antigua)</option>
            <option value="score-desc">Puntaje (mayor a menor)</option>
            <option value="score-asc">Puntaje (menor a mayor)</option>
            <option value="hours-desc">Horas (más jugadas)</option>
            <option value="hours-asc">Horas (menos jugadas)</option>
            <option value="title-asc">Título (A → Z)</option>
          </select>
          <svg class="select-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  searchQuery: {
    type: String,
    default: ''
  },
  sortBy: {
    type: String,
    default: 'date-desc'
  },
  platforms: {
    type: Array,
    default: () => []
  },
  selectedPlatform: {
    type: String,
    default: ''
  }
})

defineEmits(['update:searchQuery', 'update:sortBy', 'update:selectedPlatform', 'open-add'])
</script>

<style scoped>
.controls-bar {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 14px 18px;
  margin-bottom: 24px;
}

.controls-row-top {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
}

.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 9px 36px 9px 36px;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.88rem;
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: var(--accent-cyan);
  box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-clear {
  position: absolute;
  right: 10px;
  color: var(--text-muted);
  font-size: 0.8rem;
  padding: 4px;
}

.search-clear:hover {
  color: var(--text-primary);
}

.add-game-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, var(--accent-cyan), #38bdf8);
  color: #0b0d13;
  padding: 9px 16px;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 0.86rem;
  white-space: nowrap;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(56, 189, 248, 0.25);
}

.add-game-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(56, 189, 248, 0.4);
}

.controls-row-bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.platform-filter-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 600;
  white-space: nowrap;
}

.platform-pills {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.platform-pill-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  transition: all 0.15s ease;
}

.platform-pill-btn:hover {
  border-color: rgba(255, 255, 255, 0.25);
  color: #fff;
}

.platform-pill-btn.active {
  background: rgba(56, 189, 248, 0.15);
  border-color: var(--accent-cyan);
  color: var(--accent-cyan);
}

.sort-selector-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 600;
  white-space: nowrap;
}

.select-container {
  position: relative;
  display: flex;
  align-items: center;
}

.sort-select {
  appearance: none;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.84rem;
  font-weight: 500;
  padding: 7px 32px 7px 12px;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
}

.sort-select:hover {
  border-color: rgba(255, 255, 255, 0.2);
}

.sort-select:focus {
  border-color: var(--accent-cyan);
}

.select-chevron {
  position: absolute;
  right: 10px;
  color: var(--text-muted);
  pointer-events: none;
}

@media (max-width: 640px) {
  .controls-row-top {
    flex-direction: column;
    align-items: stretch;
  }

  .add-game-btn {
    justify-content: center;
  }

  .controls-row-bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
