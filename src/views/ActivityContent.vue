<script setup lang="ts">
import SelectX from "../components/activities/SelectX.vue";
import Sums from "../components/activities/Sums.vue";

const props = defineProps<{
  name: string;
  section: object;
  isRefreshing: boolean;
}>();
</script>

<template>
  <div v-if="props.section.type === 'SelectX'">
    <SelectX
      :userName="props.name"
      :name="props.section.name"
      :x="props.section.data.x"
      :from="props.section.data.from"
      :refresh="props.isRefreshing"
      v-bind="$attrs"
    />
  </div>
  <div v-else-if="props.section.type === 'Sums'">
    <Sums
      :userName="props.name"
      :x="props.section.data.x"
      :type="props.section.data.type"
      :sumConfig="props.section.sumConfig"
      :refresh="props.isRefreshing"
      v-bind="$attrs"
    />
  </div>
</template>
