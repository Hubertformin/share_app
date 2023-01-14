import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.dark.css';
import 'file-icons-js/css/style.css'
import bottomNavigationVue from "bottom-navigation-vue";
import "bottom-navigation-vue/dist/style.css";
import router from './router'
import {OhVueIcon} from "oh-vue-icons";
import registerIcons from "./icons";
import store from "./store";
import Store from 'electron-store';
import mitt from 'mitt';
const emitter = mitt();


export function registerModules(app: any) {
    registerIcons();
    app.use(store);
    app.use(Antd);
    app.use(router);
    app.component("v-icon", OhVueIcon);
    app.use(bottomNavigationVue);
    /**
     * GLOBAL VARIABLES
     */
    app.config.globalProperties.$settings = new Store();
    app.config.globalProperties.$emitter = emitter;
}