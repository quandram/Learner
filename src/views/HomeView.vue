<script setup lang="ts">
import ActivityStructureList from "@/components/activityStructure/ActivityStructureList.vue";
defineProps<{
  name: string;
}>();
</script>

<template>
  <main>
    <ActivityStructureList :name="name" />
  </main>
</template>
