import ModuleView from "./module.vue";

export default {
  id: "delete-manager",
  name: "Delete Manager",
  icon: "delete",
  routes: [
    {
      path: "",
      component: ModuleView,
    },
  ],
};
