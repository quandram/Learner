<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, RouterView } from "vue-router";
import settings from "./appsettings.json";

let colour = ref("white");

const setMainColour = function (x: string) {
  colour.value = x;
};
</script>

<template>
  <header>
    <div class="wrapper">
      <nav id="personNav">
        <RouterLink
          v-for="user in settings.users"
          :key="user.name"
          :to="`/user/${user.name}`"
          @click="setMainColour(user.colour)"
          :style="`color: ${user.colour}`"
          >{{ user.name }}</RouterLink
        >
        <RouterLink to="/about" @click="setMainColour('white')"
          >About</RouterLink
        >
      </nav>
    </div>
  </header>

  <div class="main-wrapper">
    <RouterView />
  </div>
</template>

<style>
@import "@/assets/base.css";

#app {
  color: v-bind(colour);
  font-weight: normal;
  margin: 0 auto;
  max-width: 1280px;
  padding: 2rem;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.main-wrapper,
.main-wrapper a {
  color: v-bind(colour);
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

a {
  text-decoration: none;
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

nav {
  display: flex;
  justify-content: center;
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  nav {
    flex-direction: column;
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }

  nav a {
    padding: 1rem 0;
    border-top: 1px solid var(--color-border);
    border-left: 0;
  }
}
</style>
