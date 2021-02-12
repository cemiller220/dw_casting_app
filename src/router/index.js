import { createRouter, createWebHistory } from 'vue-router'
import HomePage from "../views/HomePage";

const routes = [
  {path: '/', name: 'Home', component: HomePage},
  {path: '/prefs/choreographer', name: 'ChoreographerPrefs',
    component: () => import('../views/ChoreographerPrefs.vue')},
  {path: '/prefs/dancer', name: 'DancerPrefs',
    component: () => import('../views/DancerPrefs.vue')},
  {path: '/run_casting', name: 'RunCasting',
    component: () => import('../views/RunCasting.vue')},
  {path: '/show_order', name: 'ShowOrder',
    component: () => import('../views/ViewShowOrder.vue')},
  {path: '/cast_list', name: 'ViewCastList',
    component: () => import('../views/ViewCastList.vue')},
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router
