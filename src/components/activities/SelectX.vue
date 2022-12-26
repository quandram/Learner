<script setup lang="ts">
import { onBeforeMount, ref, computed, watch } from "vue";
import ActivityWrap from "./ActivityWrap.vue";

const props = defineProps<{
  userName: string;
  name: string;
  x: number;
  from: Array<string>;
  refresh: boolean;
}>();
const emit = defineEmits(["progress", "refreshCompleted", "setTitle"]);
let selectedWords = ref([{ word: "", ok: false }]);

onBeforeMount(() => {
  setWordList();
  emit("setTitle", `Select X from... ${props.name}`);
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

const correctEntries = computed(() => {
  return selectedWords.value.filter((x) => x.ok).length;
});
watch(correctEntries, (correctEntries: number) => {
  emit("progress", correctEntries / props.x);
});
</script>

<template>
  <div>
    <ActivityWrap>
      <div
        v-for="x in selectedWords"
        :key="x.word"
        :class="`x ${x.ok ? 'x-done' : ''}`"
        @click="x.ok = !x.ok"
      >
        {{ x.word }}
      </div>
    </ActivityWrap>
  </div>
</template>

<style scoped scss>
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
