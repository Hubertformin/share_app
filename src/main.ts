import { createApp } from 'vue'
import "./style.css"
import App from './App.vue'
import './samples/node-api'
import {registerModules} from "./modules";

const app = createApp(App);
registerModules(app);

// Mount app
app.mount('#app')
    .$nextTick(() => {
        postMessage({ payload: 'removeLoading' }, '*')
    })
