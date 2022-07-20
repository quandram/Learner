import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ActivityView from "../views/ActivityView.vue";
import settings from "../appsettings.json";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/user/:name",
      name: "user",
      component: HomeView,
      props: true,
      beforeEnter: (to) => {
        const user = settings.users.find((u) => u.name === to.params.name);
        if (user === undefined) {
          return false;
        }
      },
    },
    {
      path: "/activity/:name/:id",
      name: "activity",
      component: ActivityView,
      props: (route) => ({
        name: route.params.name,
        id: Number(route.params.id),
      }),
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
