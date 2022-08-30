import express from 'express';

import { env } from '@config';
import loaders from '@loaders';

async function init() {
  const app = express();

  await loaders(app);

  app.get('/test', (req, res) => {
    res.status(200).send('Hello world');
  });

  app.listen(env.port, () => {
    console.log(
      `\n🌟 Server running on Port: ${env.port}\n🚀 http://localhost:${env.port}`
    );
    console.log(`Node Version: ${process.version}`);
  });
}

init();
