import { createRouter, createWebHistory } from 'vue-router';
// import CoacheDetials from './pages/coaches/CoacheDetials.vue';
// import CoacheRegistration from './pages/coaches/CoacheRegistration.vue';
import CoachesList from './pages/coaches/CoachesList.vue';
// import ContactCoache from './pages/requests/ContactCoache.vue';
// import RequestsReceive from './pages/requests/RequestsReceive.vue';
import NotFound from './pages/NotFound.vue';
// import UserAuth from './pages/auth/UserAuth.vue';
import store from './store/index.js';

// Creates an async component that will be loaded only when it's necessary.
const CoacheDetials = () => import('./pages/coaches/CoacheDetials.vue');

const CoacheRegistration = () =>
  import('./pages/coaches/CoacheRegistration.vue');
const ContactCoache = () => import('./pages/requests/ContactCoache.vue');
const RequestsReceive = () => import('./pages/requests/RequestsReceive.vue');
const UserAuth = () => import('./pages/auth/UserAuth.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/coaches' },
    { path: '/coaches', component: CoachesList },
    {
      path: '/coaches/:id',
      component: CoacheDetials,
      props: true,
      children: [
        {
          path: 'contact', // childern route path must be without slash
          component: ContactCoache,
        }, //  /coaches/c1/contact
      ],
    },
    {
      path: '/register',
      component: CoacheRegistration,
      meta: { requiresAuth: true },
    },
    {
      path: '/requests',
      component: RequestsReceive,
      meta: { requiresAuth: true },
    },
    { path: '/auth', component: UserAuth, meta: { requiresUnAuth: true } },
    { path: '/:notFound(.*)', component: NotFound },
  ],
});

router.beforeEach((to, _, next) => {
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    next('/auth');
  } else if (to.meta.requiresUnAuth && store.getters.isAuthenticated) {
    next('/coaches');
  } else {
    next();
  }
});

export default router;
