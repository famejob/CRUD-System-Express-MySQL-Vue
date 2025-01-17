import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
const app = createApp(App);
app.use(router);
app.mount("#app");
