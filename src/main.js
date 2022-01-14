import Vue from "vue";
import App from "./App.vue";
import VueQrcodeReader from "vue-qrcode-reader";
import './assets/tailwind.css'

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");

Vue.use(VueQrcodeReader);
