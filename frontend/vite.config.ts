import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    port: 3001,
    open: true,
  },
  resolve: {
    alias: {
      '@images': path.resolve(__dirname, 'src/assets/images'),
      '@icon': path.resolve(__dirname, 'src/components/Icon.tsx'),
      '@icons': path.resolve(__dirname, 'src/assets/icons'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@enums': path.resolve(__dirname, 'src/enums'),
      '@api': path.resolve(__dirname, 'src/services/api'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@contexts': path.resolve(__dirname, 'src/contexts'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@software': path.resolve(__dirname, 'src/views/software'),
      '@views': path.resolve(__dirname, 'src/views'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@routes': path.resolve(__dirname, 'src/routes'),
      '@config': path.resolve(__dirname, 'src/config'),
    },
  },
  build: {
    outDir: 'build',
  },
});
