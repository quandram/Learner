<script setup lang="ts">
import { onBeforeMount, ref, computed } from "vue";
import DocumentationIcon from "../icons/IconDocumentation.vue";
import RefreshIcon from "../icons/IconRefresh.vue";

const props = defineProps<{
  userName: string;
  name: string;
  x: number;
  from: Array<string>;
}>();

let selectedWords = ref([{ word: "", ok: false }]);

onBeforeMount(() => {
  setWordList();
});

const setWordList = function () {
  console.log("woot");
  selectedWords.value = shuffleWords()
    .slice(0, props.x)
    .map((x) => {
      return { word: x, ok: false };
    });
};

const shuffleWords = function () {
  return [...props.from].sort(() => 0.5 - Math.random());
};

const allCorrect = computed(() => {
  return selectedWords.value.every((x) => x.ok);
});
</script>

<template>
  <div>
    <div
      style="display: flex; flex-direction: row; justify-content: space-between"
    >
      <h3><DocumentationIcon /> Select X from... {{ props.name }}</h3>
      <RefreshIcon @icon-clicked="this.setWordList" />
    </div>
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
