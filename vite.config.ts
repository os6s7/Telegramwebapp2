import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, './client'),
  publicDir: path.resolve(__dirname, './client/public'),

  plugins: [
    react({
      jsxRuntime: 'automatic',
      babel: {
        plugins: [
          ['babel-plugin-import', {
            libraryName: '@twa-dev/sdk',
            camel2DashComponentName: false
          }]
        ]
      }
    })
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './client/src/shared'),
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      '@twa-dev/sdk': path.resolve(__dirname, './node_modules/@twa-dev/sdk/dist/index.js'),
      '~styles': path.resolve(__dirname, './client/src/styles') // مسار جديد للأنماط
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.css', '.scss']
  },

  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    sourcemap: true,
    cssTarget: 'es2020',
    assetsInlineLimit: 0, // تغيير من 4096 إلى 0 لإجبار فصل ملفات CSS
    minify: 'terser',

    rollupOptions: {
      input: path.resolve(__dirname, 'client/index.html'),
      external: ['@twa-dev/sdk'],

      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          styles: ['~styles/main.css'] // فصل ملفات الأنماط
        },
        assetFileNames: 'assets/[name].[hash].[ext]', // تغيير لنمط التسمية
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    }
  },

  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
      overlay: false // تعطيل overlay لتجنب المشاكل البصرية
    },
    fs: {
      strict: false,
      allow: ['..', './client/src/styles'] // السماح بقراءة ملفات الأنماط
    },
    middlewareMode: true
  },

  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[local]___[hash:base64:5]'
    },
    postcss: {
      plugins: [
        require('postcss-import')(),
        require('postcss-preset-env')({
          stage: 3,
          features: {
            'nesting-rules': true
          }
        }),
        require('tailwindcss')('./tailwind.config.js'),
        require('autoprefixer')()
      ]
    },
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `@import "~styles/variables.scss";`
      }
    }
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      '@twa-dev/sdk',
      '~styles/main.css' // تضمين ملف الأنماط الرئيسي
    ],
    exclude: ['js-big-decimal'],
    esbuildOptions: {
      target: 'es2020',
      supported: {
        'top-level-await': true
      },
      loader: {
        '.css': 'css',
        '.scss': 'css'
      }
    }
  },

  esbuild: {
    target: 'es2020',
    legalComments: 'none',
    css: true // تمكين معالجة CSS من خلال esbuild
  }
});