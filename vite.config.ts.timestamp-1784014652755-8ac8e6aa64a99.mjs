// vite.config.ts
import { defineConfig } from "file:///C:/Users/Anskory/Documents/Trae%20AI/mengch-it-tools/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/Anskory/Documents/Trae%20AI/mengch-it-tools/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import Inspector from "file:///C:/Users/Anskory/Documents/Trae%20AI/mengch-it-tools/node_modules/unplugin-vue-dev-locator/dist/vite.mjs";
var __vite_injected_original_dirname = "C:\\Users\\Anskory\\Documents\\Trae AI\\mengch-it-tools";
var vite_config_default = defineConfig({
  // 部署路径：使用自定义域名时设为 '/'，使用 GitHub Pages 默认域名时设为 '/mengch-it-tools/'
  base: "/",
  build: {
    sourcemap: "hidden"
  },
  plugins: [
    vue(),
    Inspector()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
      // ✅ 定义 @ = src
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxBbnNrb3J5XFxcXERvY3VtZW50c1xcXFxUcmFlIEFJXFxcXG1lbmdjaC1pdC10b29sc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQW5za29yeVxcXFxEb2N1bWVudHNcXFxcVHJhZSBBSVxcXFxtZW5nY2gtaXQtdG9vbHNcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0Fuc2tvcnkvRG9jdW1lbnRzL1RyYWUlMjBBSS9tZW5nY2gtaXQtdG9vbHMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IEluc3BlY3RvciBmcm9tICd1bnBsdWdpbi12dWUtZGV2LWxvY2F0b3Ivdml0ZSdcblxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAvLyBcdTkwRThcdTdGNzJcdThERUZcdTVGODRcdUZGMUFcdTRGN0ZcdTc1MjhcdTgxRUFcdTVCOUFcdTRFNDlcdTU3REZcdTU0MERcdTY1RjZcdThCQkVcdTRFM0EgJy8nXHVGRjBDXHU0RjdGXHU3NTI4IEdpdEh1YiBQYWdlcyBcdTlFRDhcdThCQTRcdTU3REZcdTU0MERcdTY1RjZcdThCQkVcdTRFM0EgJy9tZW5nY2gtaXQtdG9vbHMvJ1xuICBiYXNlOiAnLycsXG4gIGJ1aWxkOiB7XG4gICAgc291cmNlbWFwOiAnaGlkZGVuJyxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHZ1ZSgpLFxuICAgIEluc3BlY3RvcigpLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksIC8vIFx1MjcwNSBcdTVCOUFcdTRFNDkgQCA9IHNyY1xuICAgIH0sXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzVixTQUFTLG9CQUFvQjtBQUNuWCxPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sZUFBZTtBQUh0QixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWE7QUFBQTtBQUFBLEVBRTFCLE1BQU07QUFBQSxFQUNOLE9BQU87QUFBQSxJQUNMLFdBQVc7QUFBQSxFQUNiO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixVQUFVO0FBQUEsRUFDWjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
