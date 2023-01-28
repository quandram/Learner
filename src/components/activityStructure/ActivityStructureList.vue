<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import DocumentationIcon from "../icons/IconDocumentation.vue";
import ToolingIcon from "../icons/IconTooling.vue";
import SupportIcon from "../icons/IconSupport.vue";
import ActivityStructureListEntry from "./ActivityStructureListEntry.vue";

import settings from "../../appsettings.json";

const props = defineProps<{
  name: string;
}>();
const user = computed(() => settings.users.find((u) => u.name === props.name));
</script>

<template>
  <div v-if="user === undefined">Can't find any settings for that person</div>
  <div v-else>
    <div class="title">
      <div class="title-icon-name">
        <span class="icon"><SupportIcon /></span>
        <h3>{{ user.name }}</h3>
      </div>
      <p>Hello! What would you like to do today?</p>
    </div>

    <div
      v-for="section in user.sections"
      :key="section.id"
      class="activityCards"
    >
      <RouterLink :to="`/activity/${user.name}/${section.id}`">
        <div v-if="section.type === 'SelectX'">
          <ActivityStructureListEntry>
            <template #icon>
              <DocumentationIcon />
            </template>
            <template #heading>{{ section.name }}</template>
            {{ section.data?.x }} to get right!
          </ActivityStructureListEntry>
        </div>
        <div v-else-if="section.type === 'Sums'">
          <ActivityStructureListEntry>
            <template #icon>
              <DocumentationIcon />
            </template>
            <template #heading>{{ section.name }}</template>
            {{ section.data?.x }} to get right!
          </ActivityStructureListEntry>
        </div>
        <div v-else>
          <ActivityStructureListEntry>
            <template #icon>
              <ToolingIcon />
            </template>
            <template #heading>Oops</template>
            So, I haven't implemented {{ section.type }} yet
          </ActivityStructureListEntry>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
h3 {
  color: var(--color-heading);
  display: inline-block;
}
.icon {
  padding: 1rem;
}
.title {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 1rem 0;
}
.activityCards {
  border-top: 1px solid;
  padding: 0.5rem 0;
}
</style>
