import express from 'express';

import { env } from '@config';

const app = express();

app.get('/test', (req, res) => {
  res.status(200).send('Hello world');
});

app.listen(env.port, () => {
  console.log(
    `Server running on Port: ${env.port}\n🚀 http://localhost:${env.port}`
  );
});
