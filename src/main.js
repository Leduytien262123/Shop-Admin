import { createApp } from "vue";
import App from "./App.vue";
import { setupDirectives } from "./directives";
import { setupNaiveUI } from "./plugins/naive-ui";
import { setupGlobalComponents } from "./plugins/global-components";

import { setupRouter } from "./router";
import { setupStore } from "./store";
import { setupNaiveDiscreteApi } from "./utils";
import "@/styles/reset.css";
import "@/styles/global.css";
import "uno.css";

async function bootstrap() {
  const app = createApp(App);
  setupStore(app);

  // Setup Naive UI components toàn cục
  setupNaiveUI(app);

  // Đăng ký các component toàn cục
  setupGlobalComponents(app);

  // Load token từ cookie ngay sau khi setup store
  const { useAuthStore } = await import("./store");
  const authStore = useAuthStore();

  // Tự động load token từ cookie và kiểm tra tính hợp lệ
  const tokenLoaded = authStore.loadTokenFromCookie();

  setupDirectives(app);
  await setupRouter(app);
  app.mount("#app");
  setupNaiveDiscreteApi();
}

bootstrap();
