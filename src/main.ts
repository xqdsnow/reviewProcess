import { createApp } from "vue";
import app from "./App.vue";
// import './style.css'
import ElementPlus from "element-plus";
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import "element-plus/dist/index.css";
import $ from "jquery";
window.$ = $;

createApp(app).use(ElementPlus).mount("#app");
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//     app.component(key, component)
//   }
