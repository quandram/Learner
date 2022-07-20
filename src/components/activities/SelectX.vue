<script setup lang="ts">
import { onBeforeMount, ref, computed } from "vue";
import DocumentationIcon from "../icons/IconDocumentation.vue";

const props = defineProps<{
  userName: string;
  name: string;
  x: number;
  from: Array<string>;
}>();

let selectedWords = ref([{ word: "", ok: false }]);

const allCorrect = computed(() => {
  return selectedWords.value.every((x) => x.ok);
});

onBeforeMount(() => {
  const shuffledFrom = [...props.from].sort(() => 0.5 - Math.random());
  selectedWords.value = shuffledFrom.slice(0, props.x).map((x) => {
    return { word: x, ok: false };
  });
});
</script>

<template>
  <div>
    <h3><DocumentationIcon /> Select X from... {{ props.name }}</h3>
    <div class="selected">
      <div
        v-for="x in selectedWords"
        :key="x.word"
        :class="`x ${x.ok ? 'x-done' : ''}`"
        @click="x.ok = !x.ok"
      >
        {{ x.word }}
      </div>
    </div>
    <div v-show="allCorrect" class="congratulations">
      Well done {{ props.userName }}
    </div>
  </div>
</template>

<style scoped scss>
.selected {
  display: flex;
}
.x {
  border: 1px dashed;
  font-size: 2rem;
  margin: 0.5rem;
  padding: 0.5rem;
}
.x-done {
  border: 1px solid;
}
.congratulations {
  font-size: 4rem;
}
</style>
