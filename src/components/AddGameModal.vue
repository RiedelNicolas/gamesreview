<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-card" role="dialog" aria-modal="true">
          <div class="modal-header">
            <h2 class="modal-title">Add a game</h2>
            <button class="modal-close" @click="$emit('close')" aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="add-game-form">
            <!-- Title -->
            <div class="form-group">
              <label for="title" class="form-label">Title <span class="req">*</span></label>
              <input 
                id="title"
                v-model="form.title" 
                type="text" 
                required 
                placeholder="e.g. Metroid Prime 4, Elden Ring, Hades II" 
                class="form-input"
              />
            </div>

            <!-- Platform -->
            <div class="form-group">
              <label class="form-label">Platform <span class="req">*</span></label>
              <div class="presets">
                <button 
                  type="button" 
                  v-for="p in presetPlatforms" 
                  :key="p"
                  class="preset"
                  :class="{ active: form.platform === p }"
                  @click="form.platform = p"
                >
                  {{ p }}
                </button>
              </div>
              <input 
                id="platform"
                v-model="form.platform" 
                type="text" 
                required 
                placeholder="Or type another platform" 
                class="form-input platform-input"
              />
            </div>

            <!-- Hours & Score row -->
            <div class="form-row">
              <div class="form-group flex-1">
                <label for="hours" class="form-label">Hours played <span class="req">*</span></label>
                <div class="input-with-suffix">
                  <input 
                    id="hours"
                    v-model.number="form.hoursToFinish" 
                    type="number" 
                    min="0" 
                    step="0.5"
                    required 
                    placeholder="e.g. 35" 
                    class="form-input"
                  />
                  <span class="input-suffix">h</span>
                </div>
              </div>

              <div class="form-group flex-1">
                <label for="score" class="form-label">
                  Score (1–100) <span class="req">*</span>
                  <span v-if="form.score" class="score-preview" :style="{ color: scoreColor }">
                    {{ form.score }}
                  </span>
                </label>
                <input 
                  id="score"
                  v-model.number="form.score" 
                  type="number" 
                  min="0" 
                  max="100" 
                  required 
                  placeholder="e.g. 92" 
                  class="form-input"
                />
              </div>
            </div>

            <!-- Genre & Date -->
            <div class="form-row">
              <div class="form-group flex-1">
                <label for="genre" class="form-label">Genre</label>
                <input 
                  id="genre"
                  v-model="form.genre" 
                  type="text" 
                  placeholder="e.g. Action RPG, Platformer" 
                  class="form-input"
                />
              </div>

              <div class="form-group flex-1">
                <label for="date" class="form-label">Date completed</label>
                <input 
                  id="date"
                  v-model="form.dateCompleted" 
                  type="date" 
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="cover" class="form-label">Cover URL (optional)</label>
              <input 
                id="cover"
                v-model="form.coverUrl" 
                type="url" 
                placeholder="https://images.igdb.com/... or any direct image link" 
                class="form-input"
              />
            </div>

            <!-- Actions -->
            <div class="form-actions">
              <button type="button" class="btn-cancel" @click="$emit('close')">
                Cancel
              </button>
              <button type="submit" class="btn-submit">
                Save game
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { scoreColor as getScoreColor } from '../utils/score.js'
import { todayLocal } from '../utils/format.js'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'add'])

const presetPlatforms = ['Nintendo Switch 2', 'Nintendo Switch', 'PC', 'PS5', 'Xbox Series X']

const form = ref({
  title: '',
  platform: 'Nintendo Switch 2',
  hoursToFinish: null,
  score: null,
  genre: 'General',
  dateCompleted: todayLocal(),
  coverUrl: ''
})

watch(() => props.show, (isShown) => {
  if (isShown) {
    form.value = {
      title: '',
      platform: 'Nintendo Switch 2',
      hoursToFinish: null,
      score: null,
      genre: '',
      dateCompleted: todayLocal(),
      coverUrl: ''
    }
  }
})

const scoreColor = computed(() => getScoreColor(form.value.score))

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

function handleSubmit() {
  const newGame = {
    id: slugify(form.value.title) + '-' + Date.now().toString().slice(-4),
    title: form.value.title.trim(),
    platform: form.value.platform.trim() || 'PC',
    genre: form.value.genre.trim() || 'General',
    coverUrl: form.value.coverUrl.trim() || 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/nocover.webp',
    hoursToFinish: Number(form.value.hoursToFinish) || 0,
    score: Number(form.value.score) || 0,
    status: 'completed',
    dateCompleted: form.value.dateCompleted || todayLocal()
  }

  emit('add', newGame)
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, var(--ink) 45%, transparent);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.modal-card {
  background: var(--paper);
  border-top: 3px solid var(--ink);
  max-width: 540px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: var(--space-6);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-5);
}

.modal-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  letter-spacing: -0.01em;
}

.modal-close {
  color: var(--ink-soft);
  display: flex;
}

.modal-close:hover {
  color: var(--ink);
}

.add-game-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-row {
  display: flex;
  gap: var(--space-5);
}

.flex-1 {
  flex: 1;
  min-width: 0;
}

.platform-input {
  margin-top: var(--space-1);
}

.form-label {
  font-size: var(--text-sm);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.req {
  color: var(--accent);
}

.score-preview {
  margin-left: auto;
  font-family: var(--font-display);
  font-weight: 600;
}

.presets {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.preset {
  font-size: var(--text-sm);
  color: var(--ink-soft);
  border-bottom: 2px solid transparent;
  padding-bottom: 2px;
}

.preset:hover {
  color: var(--ink);
}

.preset.active {
  color: var(--ink);
  border-bottom-color: var(--accent);
}

.form-input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--rule);
  border-radius: 0;
  padding: var(--space-2) 0;
  font-size: var(--text-base);
}

.form-input::placeholder {
  color: var(--ink-muted);
}

.form-input:focus {
  outline: none;
  border-bottom-color: var(--ink);
}

.input-with-suffix {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-suffix .form-input {
  padding-right: 36px;
}

.input-suffix {
  position: absolute;
  right: 0;
  font-size: var(--text-sm);
  color: var(--ink-muted);
  pointer-events: none;
}

.form-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-5);
  padding-top: var(--space-3);
}

.btn-cancel {
  font-size: var(--text-sm);
  color: var(--ink-soft);
}

.btn-cancel:hover {
  color: var(--ink);
}

.btn-submit {
  font-size: var(--text-sm);
  font-weight: 500;
  background: var(--ink);
  color: var(--paper);
  padding: var(--space-2) var(--space-5);
}

.btn-submit:hover {
  background: var(--accent);
}

@media (max-width: 640px) {
  .modal-card {
    padding: var(--space-5);
  }

  .form-row {
    flex-direction: column;
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
