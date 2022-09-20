<script setup lang="ts">
import { computed, ref } from "vue";
import RefreshIcon from "../components/icons/IconRefresh.vue";
import SelectX from "../components/activities/SelectX.vue";
import settings from "../appsettings.json";
const props = defineProps<{
  name: string;
  id: number;
}>();

const user = computed(() => settings.users.find((x) => x.name === props.name));
const section = computed(() => {
  if (user.value === undefined) {
    return undefined;
  }
  return user.value.sections.find((x) => x.id === props.id);
});

let isRefreshing = ref(false);
</script>

<template>
  <main>
    <div v-if="section === undefined">Loading...</div>
    <div v-else-if="section.type === 'SelectX'">
      <SelectX
        :userName="props.name"
        :name="section.name"
        :x="section.data.x"
        :from="section.data.from"
        :refresh="isRefreshing"
        @refreshCompleted="isRefreshing = false"
      />
    </div>
    <div v-else>So, I haven't implemented {{ section.type }} yet</div>
    <div style="display: flex; justify-content: space-around">
      <RefreshIcon @icon-clicked="isRefreshing = true" />
    </div>
  </main>
</template>
