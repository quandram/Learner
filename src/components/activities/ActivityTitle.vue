<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();
</script>
<template>
  <div
    style="display: flex; justify-content: space-between; align-items: center"
  >
    <h3>{{ props.title }}</h3>
    <slot></slot>
  </div>
</template>
