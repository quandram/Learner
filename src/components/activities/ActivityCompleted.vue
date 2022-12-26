<script setup lang="ts">
const props = defineProps<{
  name: string;
}>();
</script>
<template>
  <div class="congratulations">Well done {{ props.name }}!</div>
</template>

<style scoped scss>
.congratulations {
  font-size: 4rem;
  text-align: center;
}
</style>
