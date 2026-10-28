import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import algorithmRoutes from './routes/algorithmRoutes.js';
import topologyRoutes from './routes/topologyRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();
  app.use(
    cors({
      origin: env.frontendOrigin,
    }),
  );
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (req, res) => {
    res.json({
      success: true,
      data: {
        status: 'ok',
        service: 'network-routing-simulator',
      },
    });
  });

  app.use('/api/algorithms', algorithmRoutes);
  app.use('/api/topologies', topologyRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
