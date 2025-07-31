import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const sslKey = fs.readFileSync(
    path.resolve(__dirname, env.VITE_SSL_KEY),
    "utf8"
  );
  const sslCert = fs.readFileSync(
    path.resolve(__dirname, env.VITE_SSL_CERT),
    "utf8"
  );

  return {
    plugins: [react()],
    server: {
      port: 80,
      host: env.VITE_HOST,
      // https: {
      //   key: sslKey,
      //   cert: sslCert,
      // },
    },
    build: {
      sourcemap: false,
    },
    // define: {
    //   global: "globalThis", // ✅ ini tempat yang benar
    // },
  };
});
