import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './db.js';
import jobsRouter from './routes/jobs.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/jobs', jobsRouter);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

const port = process.env.PORT || 3001;

initDB()
  .then(() => {
    if (process.env.NODE_ENV !== 'production') {
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    }
  })
  .catch((error) => {
    console.error('Failed to initialize database', error);
    process.exit(1);
  });

export default app;

