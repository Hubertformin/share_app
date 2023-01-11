import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import 'file-icons-js/css/style.css'
import bottomNavigationVue from "bottom-navigation-vue";
import "bottom-navigation-vue/dist/style.css";
import router from './router'
import {OhVueIcon} from "oh-vue-icons";
import registerIcons from "./icons";


export function registerModules(app: any) {
    registerIcons();
    app.use(Antd);
    app.use(router);
    app.component("v-icon", OhVueIcon);
    app.use(bottomNavigationVue)
}