<script setup lang="ts">
const props = defineProps<{
  name: string;
  progress: number;
}>();
</script>
<template>
  <div v-if="props.progress === 1" class="congratulations">
    L DEBUG NOTHINGWell done {{ props.name }}!
  </div>
  <div v-else-if="props.progress === 0">JL DEBUG NOTHING</div>
  <div v-else>
    {{
      Number(props.progress).toLocaleString(undefined, {
        style: "percent",
        minimumFractionDigits: 2,
      })
    }}
    L DEBUG NOTHINGpercent done
  </div>
</template>

<style scoped scss>
.congratulations {
  font-size: 4rem;
  text-align: center;
}
</style>
