<script setup lang="ts">
import { onBeforeMount, ref, computed, watch } from "vue";
import DocumentationIcon from "../icons/IconDocumentation.vue";

const props = defineProps<{
  userName: string;
  name: string;
  x: number;
  from: Array<string>;
  refresh: boolean;
}>();
const emit = defineEmits(["activityCompleted", "refreshCompleted"]);
let selectedWords = ref([{ word: "", ok: false }]);

onBeforeMount(() => {
  setWordList();
});

watch(
  () => props.refresh,
  (isRefreshing: boolean) => {
    if (!isRefreshing) {
      return;
    }
    setWordList();
    emit("refreshCompleted");
  }
);

const setWordList = function () {
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
  let isAllCorrect = false;
  try {
    isAllCorrect = selectedWords.value.every((x) => x.ok);
  } catch {
    return isAllCorrect;
  }
  return isAllCorrect;
});
watch(allCorrect, (allCorrect: boolean) => {
  if (!allCorrect) {
    return;
  }
  emit("activityCompleted");
});
</script>

<template>
  <div>
    <div>
      <h3><DocumentationIcon /> Select X from... {{ props.name }}</h3>
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
</style>
