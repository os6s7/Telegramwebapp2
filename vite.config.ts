import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import autoprefixer from 'autoprefixer';

export default defineConfig(({ mode }) => {
  // مسارات أساسية
  const rootPath = path.resolve(__dirname, 'client');
  const srcPath = path.resolve(rootPath, 'src');
  const publicPath = path.resolve(rootPath, 'public');
  const outPath = path.resolve(__dirname, 'dist');

  return {
    root: rootPath,
    publicDir: publicPath,
    base: '/',

    plugins: [
      react({
        jsxRuntime: 'automatic',
        babel: {
          plugins: []
        }
      })
    ],

    resolve: {
      alias: [
        { find: '@', replacement: srcPath },
        { find: '@shared', replacement: path.resolve(srcPath, 'shared') },
        { find: 'react', replacement: path.resolve(__dirname, 'node_modules/react') },
        { find: 'react-dom', replacement: path.resolve(__dirname, 'node_modules/react-dom') },
        { 
          find: '@twa-dev/sdk', 
          replacement: path.resolve(__dirname, 'node_modules/@twa-dev/sdk/dist/web.js')
        }
      ],
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json']
    },

    build: {
      outDir: outPath,
      emptyOutDir: true,
      sourcemap: mode !== 'production',
      minify: mode === 'production' ? 'terser' : false,
      cssCodeSplit: true,
      assetsInlineLimit: 4096,
      
      rollupOptions: {
        input: {
          main: path.resolve(rootPath, 'index.html')
        },
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]',
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          }
        }
      },
      terserOptions: {
        compress: {
          drop_console: mode === 'production'
        }
      }
    },

    css: {
      postcss: {
        plugins: [autoprefixer()]
      },
      modules: {
        localsConvention: 'camelCaseOnly'
      }
    },

    server: {
      host: '0.0.0.0',
      port: parseInt(process.env.PORT || '3000'),
      strictPort: true,
      hmr: {
        protocol: 'ws',
        host: 'localhost'
      },
      fs: {
        strict: true,
        allow: [rootPath]
      }
    },

    preview: {
      host: '0.0.0.0',
      port: parseInt(process.env.PORT || '3000'),
      strictPort: true,
      headers: {
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://telegram.org; style-src 'self' 'unsafe-inline'"
      }
    },

    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      __APP_ENV__: JSON.stringify(mode),
      __TELEGRAM_WEBAPP__: JSON.stringify(true)
    },

    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@twa-dev/sdk',
        '@tanstack/react-query'
      ],
      exclude: ['js-big-decimal']
    }
  };
});