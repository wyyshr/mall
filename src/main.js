import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { components, plugins } from "./config";

const app = createApp(App)
components.forEach(cps => { app.component(cps.name, cps) })
plugins.forEach(plugin => { app.use(plugin) })
app.use(store)
app.use(router)
app.mount('#app')