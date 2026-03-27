import Home from '@views/Home.vue'
import TaskForm from '@views/TaskForm.vue'

import { createRouter, createWebHistory } from 'vue-router'

import BulkEditForm from '@/views/BulkEditForm.vue'
import Settings from '@/views/Settings.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: 'new',
          name: 'new-task',
          component: TaskForm,
        },
        {
          path: 'edit/:id',
          name: 'edit-task',
          component: TaskForm,
        },
        {
          path: 'settings',
          name: 'settings',
          component: Settings,
        },
        {
          path: 'bulkEdit/:type/:name',
          name: 'edit-bulk',
          component: BulkEditForm,
        },
      ],
    },
  ],
})

export default router
