import { createRouter, createWebHistory } from 'vue-router'
import Top from "@/pages/Top/Top";
import LaunchLayout from "@/layouts/LaunchLayout/LaunchLayout";


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

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
