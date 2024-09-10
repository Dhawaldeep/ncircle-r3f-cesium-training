# 3D Web Development and GeoSpatial Visualization with THREE.JS, R3F & Cesium.

**CLI Requrements**

- [node](https://nodejs.org/en)
- [yarn](https://classic.yarnpkg.com/en/docs/getting-started)
- [vite](https://vitejs.dev/guide/)

## Cesium

### Setup React TS App using Vite

```shell
yarn create vite cesium-intro-app --template react-ts
cd cesium-intro-app
yarn
yarn dev
```

### Clean up following files

- App.css
- index.css
- App.tsx
- index.html

### Setup Cesium on the app

#### Add Cesium & related dependencies

```shell
yarn add cesium vite-plugin-cesium-build
```

#### Modify `vite.config.ts` by including cesium plugin from `vite-plugin-cesium-build`

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cesium from "vite-plugin-cesium-build";

export default defineConfig({
  plugins: [react(), cesium()],
});
```
