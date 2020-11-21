import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "font-awesome/css/font-awesome.min.css";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import VueDraggableResizable from "vue-draggable-resizable";

// optionally import default styles
import "vue-draggable-resizable/dist/VueDraggableResizable.css";

Vue.component("vue-draggable-resizable", VueDraggableResizable);
Vue.config.productionTip = false;
Vue.use(ElementUI);
export default new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
