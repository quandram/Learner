<script setup lang="ts">
import ActivityList from "@/components/ActivityList.vue";
defineProps<{
  name: string;
}>();
</script>

<template>
  <main>
    <ActivityList :name="name" />
  </main>
</template>
