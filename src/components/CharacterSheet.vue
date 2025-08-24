<template>
  <div class="sheet" v-if="char">
    <header class="sheet-header">
      <h1 class="name">{{ char.name || '(Unnamed)' }}</h1>
      <div class="meta">
        <span>Level {{ char.level ?? '?' }}</span>
        <span>{{ char.race || '?' }} {{ char.class || '?' }}</span>
        <span>Player: {{ char.player || '?' }}</span>
        <span>Alignment: {{ char.alignment || '?' }}</span>
        <span>Background: {{ char.background || '?' }}</span>
      </div>
    </header>

    <section class="top-stats">
      <div class="stat">
        <div class="label">Armor Class</div>
        <div class="value">{{ char.armor_class ?? '—' }}</div>
      </div>
      <div class="stat">
        <div class="label">Initiative</div>
        <div class="value">{{ withSign(char.initiative ?? mod(attr('dex'))) }}</div>
      </div>
      <div class="stat">
        <div class="label">Speed</div>
        <div class="value">{{ char.speed ?? '—' }}</div>
      </div>
      <div class="stat">
        <div class="label">HP</div>
        <div class="value">{{ char.hit_points ?? '—' }}</div>
      </div>
      <div class="stat">
        <div class="label">Proficiency</div>
        <div class="value">{{ withSign(char.proficiency_bonus ?? 0) }}</div>
      </div>
      <div class="stat">
        <div class="label">XP</div>
        <div class="value">{{ char.experience_points ?? 0 }}</div>
      </div>
      <div class="stat">
        <div class="label">Hit Dice</div>
        <div class="value">
          <span v-if="char.hit_dice">{{ char.hit_dice.number }} × {{ char.hit_dice.type }}</span>
          <span v-else>—</span>
        </div>
      </div>
    </section>

    <section class="abilities">
      <div v-for="(score, key) in char.attributes || {}" :key="key" class="ability">
        <div class="abbr">{{ key.toUpperCase() }}</div>
        <div class="score">{{ score }}</div>
        <div class="mod">{{ withSign(mod(score)) }}</div>
      </div>
    </section>

    <section class="skills">
      <h3>Skills</h3>
      <table>
        <thead>
          <tr>
            <th>Skill</th>
            <th>Attr</th>
            <th>Prof</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, name) in char.skills || {}" :key="name">
            <td class="skill-name">{{ pretty(name) }}</td>
            <td class="skill-attr">{{ entry.attribute?.toUpperCase() || '?' }}</td>
            <td class="skill-prof">
              <span v-if="entry.proficient">●</span>
              <span v-else>○</span>
            </td>
            <td class="skill-total">
              {{ withSign(skillTotal(entry)) }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>

  <div v-else class="empty">
    <p>Select a character to view details.</p>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { readCharacter } from '@/utils/characterLoader';

const route = useRoute();
const char = ref(null);

// load when route param changes
async function load() {
  const file = route.params.file ? decodeURIComponent(route.params.file) : null;
  if (!file) { char.value = null; return; }
  try {
    char.value = await readCharacter(file);
  } catch (e) {
    console.error('Failed to load character:', e);
    char.value = null;
  }
}

onMounted(load);
watch(() => route.params.file, load);

// helpers
function mod(score) {
  const n = Number(score);
  if (Number.isNaN(n)) return 0;
  return Math.floor((n - 10) / 2);
}
function attr(key) {
  return (char.value?.attributes && char.value.attributes[key]) || 10;
}
function withSign(n) {
  const v = Number(n) || 0;
  return v >= 0 ? `+${v}` : `${v}`;
}
function skillTotal(entry) {
  if (!entry) return 0;
  const ability = (entry.attribute || '').toLowerCase();
  const abilityMod = mod(attr(ability));
  const prof = entry.proficient ? (char.value?.proficiency_bonus || 0) : 0;
  return abilityMod + prof;
}
function pretty(s) {
  return String(s).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
</script>

<style scoped>
.sheet { display: grid; gap: 1rem; }
.sheet-header .name { margin: 0; font-size: 1.8rem; line-height: 1.2; }
.sheet-header .meta { display: flex; flex-wrap: wrap; gap: 0.75rem 1rem; color: #475569; }

.top-stats { display: grid; gap: 0.5rem; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
.stat { border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 0.5rem; text-align: center; }
.stat .label { font-size: 0.75rem; color: #64748b; }
.stat .value { font-weight: 700; font-size: 1.1rem; }

.abilities { display: grid; gap: 0.5rem; grid-template-columns: repeat(6, minmax(80px, 1fr)); }
.ability { border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 0.5rem; text-align: center; }
.ability .abbr { font-weight: 800; letter-spacing: 0.03em; }
.ability .score { font-size: 1.2rem; }
.ability .mod { font-size: 0.95rem; color: #334155; }

.skills h3 { margin: 0.5rem 0; }
.skills table { width: 100%; border-collapse: collapse; }
.skills th, .skills td { padding: 0.5rem 0.6rem; border-bottom: 1px solid #e2e8f0; text-align: left; }
.skill-name { font-weight: 600; }
.skill-attr, .skill-prof, .skill-total { width: 80px; text-align: center; }

.empty { color: #64748b; }
</style>