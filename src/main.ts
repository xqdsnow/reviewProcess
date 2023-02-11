import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import $ from 'jquery'
// import * as $ from 'juery'
// const $ = require('jquery');
window.$ = $;

createApp(App).mount('#app')
