<template>
  <div class="character-list">
    <!-- ... header/search ... -->

    <div v-if="filteredFiles.length === 0" class="cl-empty">
      <p>No characters found.</p>
      <small>Put JSON files in <code>src/character/</code></small>
    </div>

    <ul v-else class="cl-list">
      <li
        v-for="file in filteredFiles"
        :key="file"
        :class="['cl-item', { selected: file === selected }]"
      >
        <RouterLink
          class="cl-link"
          :to="{ name: 'character', params: { file } }"
          @click.native="selected = file"
        >
          <span class="cl-name">{{ displayName(file) }}</span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { listCharacterFiles } from '@/utils/characterLoader';

const route = useRoute();
const files = ref([]);
const selected = ref(null);
const query = ref('');

onMounted(() => {
  files.value = listCharacterFiles();
  const current = route.params.file;
  if (current) selected.value = current;
});

const filteredFiles = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return files.value;
  return files.value.filter((f) => displayName(f).toLowerCase().includes(q));
});

function displayName(file) {
  return file.replace(/\.json$/i, '');
}
</script>

<style scoped>
.cl-link { display: block; width: 100%; text-decoration: none; color: inherit; }
</style>