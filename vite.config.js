import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    // Relative base so the build works under a GitHub Pages project path
    // (e.g. https://<user>.github.io/geocomp/) without hardcoding the repo name.
    base: './',
    plugins: [react()],
});
