
// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
import * as Pinia from 'pinia'
import pify from 'pify';

export function createApp() {
  const app = createSSRApp(App)
  app.use(Pinia.createPinia())
  return {
    app,
	Pinia
  }
}
// #endif