import Home from '@views/Home.vue'
import SpendingForm from '@views/SpendingForm.vue'

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
          name: 'new-spending',
          component: SpendingForm,
        },
        {
          path: 'edit/:id',
          name: 'edit-spending',
          component: SpendingForm,
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
