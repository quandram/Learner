<script setup lang="ts">
import { computed, ref } from "vue";
import RefreshIcon from "../components/icons/IconRefresh.vue";
import ActivityTitle from "../components/activities/ActivityTitle.vue";
import ActivityProgress from "../components/activities/ActivityProgress.vue";
import ActivityContent from "./ActivityContent.vue";
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
let activityTitle = ref("");
const refreshActivity = function () {
  activityProgress.value = 0;
  isRefreshing.value = true;
};
</script>

<template>
  <main>
    <div v-if="section === undefined">Loading...</div>
    <div v-else>
      <ActivityTitle :title="activityTitle">
        <ActivityProgress
          :name="props.name"
          :progress="activityProgress"
        ></ActivityProgress>
      </ActivityTitle>
      <ActivityContent
        :name="props.name"
        :section="section"
        :is-refreshing="isRefreshing"
        @setTitle="activityTitle = $event"
        @refreshCompleted="isRefreshing = false"
        @progress="activityProgress = $event"
      >
      </ActivityContent>
      <div style="display: flex; justify-content: space-around">
        <RefreshIcon @icon-clicked="refreshActivity" />
      </div>
    </div>
  </main>
</template>
