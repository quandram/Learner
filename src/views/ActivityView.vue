<script setup lang="ts">
import { computed, ref } from "vue";
import RefreshIcon from "../components/icons/IconRefresh.vue";
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
let activityCompleted = ref(false);
const refreshActivity = function () {
  console.log("here");
  activityCompleted.value = false;
  isRefreshing.value = true;
};
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
        @activityCompleted="activityCompleted = true"
      />
    </div>
    <div v-else-if="section.type === 'Sums'">
      <Sums
        :userName="props.name"
        :x="section.data.x"
        :sumConfig="section.sumConfig"
        :refresh="isRefreshing"
        @refreshCompleted="isRefreshing = false"
        @activityCompleted="activityCompleted = true"
      />
    </div>
    <div style="display: flex; justify-content: space-around">
      <RefreshIcon @icon-clicked="refreshActivity" />
    </div>
    <div v-show="activityCompleted" class="congratulations">
      Well done {{ props.name }}!
    </div>
  </main>
</template>

<style scoped scss>
.congratulations {
  font-size: 4rem;
  text-align: center;
}
</style>
