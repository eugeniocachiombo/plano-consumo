import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ToastService from 'primevue/toastservice';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import 'primeicons/primeicons.css';
import '@/assets/styles.css';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(ToastService);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: '.app-dark'
    }
  },
  ripple: true
});

app.mount('#app');