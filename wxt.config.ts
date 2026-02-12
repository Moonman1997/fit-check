import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Fit Check',
    description: 'Understand how garments will fit your body using published measurements',
    version: '0.1.0',
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
