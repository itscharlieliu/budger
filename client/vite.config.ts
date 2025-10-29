import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    root: ".",
    publicDir: "public",
    plugins: [
        react(),
        svgr({
            include: "**/*.svg",
            svgrOptions: {
                exportType: "default",
            },
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./app/src"),
        },
    },
    base: process.env.NODE_ENV === "production" ? "/budger" : "/",
    build: {
        outDir: "dist",
        sourcemap: true,
    },
    server: {
        port: 3000,
        open: true,
    },
});
