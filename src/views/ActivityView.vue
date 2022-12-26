<script setup lang="ts">
import { computed, ref } from "vue";
import RefreshIcon from "../components/icons/IconRefresh.vue";
import ActivityProgress from "../components/activities/ActivityProgress.vue";
import SelectX from "../components/activities/SelectX.vue";
import Sums from "../components/activities/Sums.vue";
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
let activityProgress = ref(0);
const refreshActivity = function () {
  activityProgress.value = 0;
  isRefreshing.value = true;
};
</script>

<template>
  <main>
    <div v-if="section === undefined">Loading...</div>
    <div v-else>
      <ActivityProgress
        :name="props.name"
        :progress="activityProgress"
      ></ActivityProgress>
      <div v-if="section.type === 'SelectX'">
        <SelectX
          :userName="props.name"
          :name="section.name"
          :x="section.data.x"
          :from="section.data.from"
          :refresh="isRefreshing"
          @refreshCompleted="isRefreshing = false"
          @progress="activityProgress = $event"
        />
      </div>
      <div v-else-if="section.type === 'Sums'">
        <Sums
          :userName="props.name"
          :x="section.data.x"
          :sumConfig="section.sumConfig"
          :refresh="isRefreshing"
          @refreshCompleted="isRefreshing = false"
          @progress="activityProgress = $event"
        />
      </div>
      <div style="display: flex; justify-content: space-around">
        <RefreshIcon @icon-clicked="refreshActivity" />
      </div>
    </div>
  </main>
</template>
