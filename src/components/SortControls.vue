<template>
  <div class="controls-bar">
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

    <div class="controls-right">
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
  }
})

defineEmits(['update:searchQuery', 'update:sortBy'])
</script>

<style scoped>
.controls-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 12px 18px;
  margin-bottom: 24px;
}

.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1 1 280px;
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

.controls-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.sort-selector-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-label {
  font-size: 0.82rem;
  color: var(--text-secondary);
  font-weight: 500;
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
  font-size: 0.86rem;
  font-weight: 500;
  padding: 8px 34px 8px 14px;
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
  right: 12px;
  color: var(--text-muted);
  pointer-events: none;
}
</style>
