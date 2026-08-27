import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function contactApiDevPlugin() {
  return {
    name: 'contact-api-dev',
    config(config, { mode }) {
      const env = loadEnv(mode, process.cwd(), '');
      Object.assign(process.env, env);
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/send-email' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              req.body = body ? JSON.parse(body) : {};

              // Express-like mock helpers for Vercel handler
              if (!res.status) {
                res.status = (code) => {
                  res.statusCode = code;
                  return res;
                };
              }
              if (!res.json) {
                res.json = (data) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                  return res;
                };
              }

              const { default: handler } = await import('./api/send-email.js');
              await handler(req, res);
            } catch (err) {
              console.error('[contact-api-dev error]:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  error: err.message || 'Internal dev server email handler error',
                })
              );
            }
          });
          return;
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), contactApiDevPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Core React runtime — shared across all routes, rarely changes
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router')
          ) {
            return 'react-vendor';
          }
          // Animation libraries — large, cacheable separately
          if (
            id.includes('node_modules/framer-motion') ||
            id.includes('node_modules/gsap')
          ) {
            return 'animation-vendor';
          }
          // Data layer — Supabase client + TanStack Query
          if (
            id.includes('node_modules/@supabase') ||
            id.includes('node_modules/@tanstack')
          ) {
            return 'data-vendor';
          }
        },
      },
    },
  },
});
