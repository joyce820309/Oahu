const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/TripPage.vue') },
      { path: 'days', component: () => import('pages/DaysPage.vue') },
      { path: 'explore', component: () => import('pages/ExplorePage.vue') },
      { path: 'pack', component: () => import('pages/PackPage.vue') },
      { path: 'me', component: () => import('pages/MePage.vue') },
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
