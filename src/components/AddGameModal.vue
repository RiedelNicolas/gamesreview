<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-card" role="dialog" aria-modal="true">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <span class="modal-badge-icon">➕</span>
              <h2 class="modal-title">Cargar Nuevo Juego</h2>
            </div>
            <button class="modal-close" @click="$emit('close')" aria-label="Cerrar modal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="add-game-form">
            <!-- Title -->
            <div class="form-group">
              <label for="title" class="form-label">Título del Juego <span class="req">*</span></label>
              <input 
                id="title"
                v-model="form.title" 
                type="text" 
                required 
                placeholder="Ej. Metroid Prime 4, Elden Ring, Hades 2..." 
                class="form-input"
              />
            </div>

            <!-- Platform Field (Switch 2, PC, etc.) -->
            <div class="form-group">
              <label class="form-label">Plataforma <span class="req">*</span></label>
              <div class="platform-chips-row">
                <button 
                  type="button" 
                  v-for="p in presetPlatforms" 
                  :key="p"
                  class="preset-chip"
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
                placeholder="O escribe una plataforma personalizada (ej. Switch 2, PC, PS5...)" 
                class="form-input mt-2"
              />
            </div>

            <!-- Hours & Score row -->
            <div class="form-row">
              <div class="form-group flex-1">
                <label for="hours" class="form-label">Horas jugadas <span class="req">*</span></label>
                <div class="input-with-suffix">
                  <input 
                    id="hours"
                    v-model.number="form.hoursToFinish" 
                    type="number" 
                    min="0" 
                    step="0.5"
                    required 
                    placeholder="Ej. 35" 
                    class="form-input"
                  />
                  <span class="input-suffix">hrs</span>
                </div>
              </div>

              <div class="form-group flex-1">
                <label for="score" class="form-label">
                  Puntaje (1-100) <span class="req">*</span>
                  <span class="score-preview-badge" :style="{ backgroundColor: scoreColor }">
                    {{ form.score || 0 }}
                  </span>
                </label>
                <input 
                  id="score"
                  v-model.number="form.score" 
                  type="number" 
                  min="0" 
                  max="100" 
                  required 
                  placeholder="Ej. 92" 
                  class="form-input"
                />
              </div>
            </div>

            <!-- Optional Cover URL & Genre -->
            <div class="form-row">
              <div class="form-group flex-1">
                <label for="genre" class="form-label">Género</label>
                <input 
                  id="genre"
                  v-model="form.genre" 
                  type="text" 
                  placeholder="Ej. Action RPG, Plataformas..." 
                  class="form-input"
                />
              </div>

              <div class="form-group flex-1">
                <label for="date" class="form-label">Fecha completado</label>
                <input 
                  id="date"
                  v-model="form.dateCompleted" 
                  type="date" 
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="cover" class="form-label">URL de portada (opcional)</label>
              <input 
                id="cover"
                v-model="form.coverUrl" 
                type="url" 
                placeholder="https://images.igdb.com/... o enlace directo a imagen" 
                class="form-input"
              />
            </div>

            <!-- Actions -->
            <div class="form-actions">
              <button type="button" class="btn-cancel" @click="$emit('close')">
                Cancelar
              </button>
              <button type="submit" class="btn-submit">
                Guardar Juego
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

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'add'])

const presetPlatforms = ['Switch 2', 'PC', 'Nintendo Switch', 'PS5', 'Xbox Series X']

const form = ref({
  title: '',
  platform: 'Switch 2',
  hoursToFinish: null,
  score: null,
  genre: 'General',
  dateCompleted: new Date().toISOString().split('T')[0],
  coverUrl: ''
})

watch(() => props.show, (isShown) => {
  if (isShown) {
    form.value = {
      title: '',
      platform: 'Switch 2',
      hoursToFinish: null,
      score: null,
      genre: '',
      dateCompleted: new Date().toISOString().split('T')[0],
      coverUrl: ''
    }
  }
})

const scoreColor = computed(() => {
  const s = Number(form.value.score) || 0
  if (s >= 90) return '#10b981'
  if (s >= 75) return '#06b6d4'
  if (s >= 50) return '#eab308'
  if (s >= 25) return '#f97316'
  return '#ef4444'
})

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
    coverUrl: form.value.coverUrl.trim() || 'https://images.igdb.com/igdb/image/upload/t_cover_big/nocover.webp',
    hoursToFinish: Number(form.value.hoursToFinish) || 0,
    score: Number(form.value.score) || 0,
    status: 'completed',
    dateCompleted: form.value.dateCompleted || new Date().toISOString().split('T')[0]
  }

  emit('add', newGame)
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 6, 10, 0.82);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  max-width: 540px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.85);
  animation: modalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 28px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 16px;
}

.modal-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-badge-icon {
  font-size: 1.4rem;
}

.modal-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
}

.modal-close {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
}

.add-game-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-row {
  display: flex;
  gap: 14px;
}

.flex-1 {
  flex: 1;
}

.mt-2 {
  margin-top: 8px;
}

.form-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.req {
  color: #f87171;
}

.score-preview-badge {
  font-family: var(--font-mono);
  font-size: 0.76rem;
  font-weight: 700;
  color: #0b0d13;
  padding: 2px 7px;
  border-radius: 4px;
}

.platform-chips-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.preset-chip {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 5px 10px;
  border-radius: var(--radius-sm);
  font-size: 0.78rem;
  font-weight: 600;
  transition: all 0.15s ease;
}

.preset-chip:hover {
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

.preset-chip.active {
  background: rgba(56, 189, 248, 0.15);
  border-color: var(--accent-cyan);
  color: var(--accent-cyan);
}

.form-input {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.88rem;
  outline: none;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: var(--accent-cyan);
  box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
}

.input-with-suffix {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-suffix .form-input {
  width: 100%;
  padding-right: 44px;
}

.input-suffix {
  position: absolute;
  right: 12px;
  font-size: 0.8rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
  pointer-events: none;
}

.form-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
  padding-top: 14px;
  border-top: 1px solid var(--border-color);
}

.btn-cancel {
  padding: 9px 18px;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.88rem;
  transition: all 0.15s ease;
}

.btn-cancel:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
}

.btn-submit {
  padding: 9px 20px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--accent-cyan), #38bdf8);
  color: #0b0d13;
  font-weight: 700;
  font-size: 0.88rem;
  box-shadow: 0 4px 15px rgba(56, 189, 248, 0.3);
  transition: all 0.2s ease;
}

.btn-submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(56, 189, 248, 0.45);
}

/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
