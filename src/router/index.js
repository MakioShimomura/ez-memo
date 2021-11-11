import { createRouter, createWebHistory } from 'vue-router'
import Top from "@/pages/Top/Top";
import LaunchLayout from "@/layouts/LaunchLayout/LaunchLayout";
import DefaultLayout from "@/layouts/DefaultLayout/DefaultLayout";
import Elements from "../pages/Elements";

const routes = [
  {
    path: '/',
    component: LaunchLayout,
    children: [
      {
        path: '',
        name: 'Top',
        component: Top,
      }
    ]
  },
  {
    path: '/elements',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Elements',
        component: Elements,
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router