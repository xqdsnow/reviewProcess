import { createApp } from 'vue'
import app from './App.vue'
// import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import $ from 'jquery'
window.$ = $;

createApp(app).use(ElementPlus).mount('#app')