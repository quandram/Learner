<script setup lang="ts">
import { ref, watch } from "vue";
import type { CellValue } from "../types/CellValueType";
const props = defineProps<{
  value: CellValue;
  isValueShown: boolean;
}>();

let userValue = ref("");
watch(
  userValue,
  (userValue: string) => {
    if (props.isValueShown) {
      emit("isCorrect", true);
    } else {
      emit("isCorrect", userValue === props.value);
    }
  },
  { immediate: true }
);

const emit = defineEmits(["isCorrect"]);
</script>

<template>
  <input
    v-if="!props.isValueShown"
    v-model="userValue"
    class="cell-input"
    maxlength="1"
    oninput="this.value=this.value.replace(/[^\-0-9]/g,'');"
  />
  <span v-else>{{ props.value }}</span>
</template>

<style scoped scss>
.cell-input {
  background-color: transparent;
  border: 0;
  color: white;
  font-size: inherit;
  height: 100%;
  width: 100%;
  text-align: center;
}
</style>
