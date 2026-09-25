<template>
  <div class="toolbar">
    <nav class="tabs" aria-label="Plataforma">
      <button
        class="tab"
        :class="{ active: !selectedPlatform }"
        @click="$emit('update:selectedPlatform', '')"
      >
        Todas
      </button>
      <button
        v-for="plat in platforms"
        :key="plat"
        class="tab"
        :class="{ active: selectedPlatform === plat }"
        @click="$emit('update:selectedPlatform', plat)"
      >
        {{ plat }}
      </button>
    </nav>

    <div class="tools">
      <input
        type="search"
        :value="searchQuery"
        @input="$emit('update:searchQuery', $event.target.value)"
        placeholder="Buscar por título, plataforma o género..."
        aria-label="Buscar"
        class="search"
      />
      <select
        :value="sortBy"
        @change="$emit('update:sortBy', $event.target.value)"
        aria-label="Ordenar por"
        class="sort"
      >
        <option value="date-desc">Fecha (más reciente)</option>
        <option value="date-asc">Fecha (más antigua)</option>
        <option value="score-desc">Puntaje (mayor a menor)</option>
        <option value="score-asc">Puntaje (menor a mayor)</option>
        <option value="hours-desc">Horas (más jugadas)</option>
        <option value="hours-asc">Horas (menos jugadas)</option>
        <option value="title-asc">Título (A → Z)</option>
      </select>
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

defineEmits(['update:searchQuery', 'update:sortBy', 'update:selectedPlatform'])
</script>

<style scoped>
.toolbar {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--paper);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-5);
  border-top: 1px solid var(--ink);
  border-bottom: 1px solid var(--rule);
  margin-bottom: var(--space-6);
}

.tabs {
  display: flex;
  gap: var(--space-5);
  overflow-x: auto;
  scrollbar-width: none;
}

.tab {
  padding: var(--space-3) 0;
  font-size: var(--text-sm);
  color: var(--ink-soft);
  white-space: nowrap;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}

.tab:hover {
  color: var(--ink);
}

.tab.active {
  color: var(--ink);
  font-weight: 500;
  border-bottom-color: var(--accent);
}

.tools {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.search,
.sort {
  font-size: var(--text-sm);
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--rule);
  padding: var(--space-1) 0;
  border-radius: 0;
}

.search {
  width: 240px;
}

.search::placeholder {
  color: var(--ink-muted);
}

.search:focus,
.sort:focus {
  outline: none;
  border-bottom-color: var(--ink);
}

.sort {
  cursor: pointer;
}

@media (max-width: 820px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }

  .tools {
    padding: var(--space-2) 0 var(--space-3);
  }

  .search {
    flex: 1;
    width: auto;
    min-width: 0;
  }
}
</style>
