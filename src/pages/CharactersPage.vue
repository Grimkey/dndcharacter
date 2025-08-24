<template>
  <div class="characters-page">
    <aside class="sidebar">
      <CharacterList />
    </aside>
    <main class="content">
      <CharacterSheet />
    </main>
  </div>
</template>

<script setup>
import CharacterList from '@/components/CharacterList.vue';
import CharacterSheet from '@/components/CharacterSheet.vue';
</script>

<style scoped>
.characters-page {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 1rem;
  min-height: 70vh;
}
.sidebar { position: sticky; top: 1rem; height: fit-content; }
.content { padding: 0.5rem; }
@media (max-width: 900px) {
  .characters-page { grid-template-columns: 1fr; }
}
</style>