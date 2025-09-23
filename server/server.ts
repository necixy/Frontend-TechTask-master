import { createProxyMiddleware } from 'http-proxy-middleware';
import express, { Application } from 'express';
import apicache from 'apicache';

const app: Application = express();
const cache = apicache.middleware;

const proxy = createProxyMiddleware({
  target: 'https://www.home24.de',
  changeOrigin: true,
  logLevel: 'debug',
});

// Disabled caching to make load more work.
// app.post('/graphql', cache('5 minutes'), proxy);
app.post('/graphql', proxy);
app.listen(3001);
