import { createRouter, createWebHistory } from "vue-router";
import CustomerList from "@/views/CustomerList.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "customer_list",
      component: CustomerList,
    },
    {
      path: "/add",
      name: "customer_add",
      component: () => import("../views/Add.vue"),
    },
    {
      path: "/edit/:id",
      name: "customer_edit",
      component: () => import("../views/Edit.vue"),
    },
    {
      path: "/detail/:id",
      name: "customer_detail",
      component: () => import("../views/CustomerDetail.vue"),
    },
  ],
});

export default router;
