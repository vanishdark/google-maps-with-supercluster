import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    name: "googleMaps",
    path: "/maps",
    component: () =>
      import(/* webpackChunkName' */ "../views/google-maps/google-maps.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
