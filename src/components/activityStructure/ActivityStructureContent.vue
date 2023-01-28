<script setup lang="ts">
import ActivitySelectX from "../activities/ActivitySelectX.vue";
import ActivitySums from "../activities/ActivitySums.vue";
import type { ActivitySection } from "../../types/ActivitySectionType";

const props = defineProps<{
  name: string;
  section: ActivitySection;
  isRefreshing: boolean;
}>();
</script>

<template>
  <div v-if="props.section.type === 'SelectX'">
    <ActivitySelectX
      :userName="props.name"
      :name="props.section.name"
      :x="props.section.data.x"
      :from="props.section.data.from"
      :refresh="props.isRefreshing"
      v-bind="$attrs"
    />
  </div>
  <div v-else-if="props.section.type === 'Sums'">
    <ActivitySums
      :userName="props.name"
      :x="props.section.data.x"
      :type="props.section.data.type"
      :config="props.section.data.config"
      :refresh="props.isRefreshing"
      v-bind="$attrs"
    />
  </div>
</template>
