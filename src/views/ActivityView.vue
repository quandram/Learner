<script setup lang="ts">
import { computed, ref } from "vue";
import RefreshIcon from "../components/icons/IconRefresh.vue";
import ActivityStructureTitle from "../components/activityStructure/ActivityStructureTitle.vue";
import ActivityStructureProgress from "../components/activityStructure/ActivityStructureProgress.vue";
import ActivityStructureContent from "../components/activityStructure/ActivityStructureContent.vue";
import { ConfigTypes } from "../types/ConfigTypes";
import settings from "../appsettings.json";
const props = defineProps<{
  name: string;
  id: number;
}>();

const user = computed(() => settings.users.find((x) => x.name === props.name));
const section = computed(() => {
  if (user.value === undefined) {
    return {
      id: 0,
      name: "",
      type: "",
      data: {
        x: 0,
        from: [],
        type: "SelectX",
        config: {},
      },
    };
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
      <ActivityStructureTitle :title="activityTitle">
        <ActivityStructureProgress
          :name="props.name"
          :progress="activityProgress"
        ></ActivityStructureProgress>
      </ActivityStructureTitle>
      <ActivityStructureContent
        :name="props.name"
        :section="section"
        :is-refreshing="isRefreshing"
        @setTitle="activityTitle = $event"
        @refreshCompleted="isRefreshing = false"
        @progress="activityProgress = $event"
      >
      </ActivityStructureContent>
      <div style="display: flex; justify-content: space-around">
        <RefreshIcon @icon-clicked="refreshActivity" />
      </div>
    </div>
  </main>
</template>
