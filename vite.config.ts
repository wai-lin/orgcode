import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    dts: {
      tsgo: true,
    },
    exports: {
      customExports: (pkg) => {
        pkg["."] = { import: "./dist/index.mjs", types: "./dist/index.d.mts" };
        pkg["./server"] = { import: "./dist/index.mjs", types: "./dist/index.d.mts" };
        pkg["./tui"] = { import: "./dist/index.mjs", types: "./dist/index.d.mts" };
        pkg["./package.json"] = "./package.json";
        return pkg;
      },
    },
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {},
});
