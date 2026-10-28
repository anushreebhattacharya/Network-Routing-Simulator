import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';
import { ensureDemoPersisted } from './services/topologyService.js';

const app = createApp();

async function start() {
  try {
    await connectDatabase();
    console.log(`MongoDB connected: ${env.mongoUri}`);
    await ensureDemoPersisted();
    console.log('Campus demo topology is available in MongoDB.');
  } catch (error) {
    console.error('MongoDB connection failed. Persistence APIs will error until MongoDB is running.');
    console.error(error.message);
  }

  app.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`);
  });
}

start();
