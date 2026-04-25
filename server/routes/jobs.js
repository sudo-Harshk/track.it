import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

function toNumber(value) {
  return Number.parseInt(value, 10);
}

async function getJobById(id) {
  const result = await db.execute({
    sql: 'SELECT * FROM jobs WHERE id = ?',
    args: [id],
  });
  return result.rows[0] || null;
}

router.get('/', async (_req, res) => {
  try {
    const result = await db.execute('SELECT * FROM jobs ORDER BY date_applied DESC, created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Could not load jobs.' });
  }
});

router.post('/', async (req, res) => {
  const { company, role, url, date_applied, status = 'Applied' } = req.body || {};

  if (!company || !role || !url || !date_applied) {
    return res.status(400).json({ error: 'company, role, url, and date_applied are required.' });
  }

  try {
    const result = await db.execute({
      sql: 'INSERT INTO jobs (company, role, url, date_applied, status) VALUES (?, ?, ?, ?, ?)',
      args: [company, role, url, date_applied, status],
    });
    const created = await getJobById(result.lastInsertRowid);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: 'Could not add job.' });
  }
});

router.patch('/:id', async (req, res) => {
  const id = toNumber(req.params.id);
  const fields = ['company', 'role', 'url', 'date_applied', 'status'].filter((key) => req.body?.[key] !== undefined);

  if (!fields.length) {
    return res.status(400).json({ error: 'At least one field is required.' });
  }

  try {
    const current = await getJobById(id);
    if (!current) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    const next = {
      company: req.body.company ?? current.company,
      role: req.body.role ?? current.role,
      url: req.body.url ?? current.url,
      date_applied: req.body.date_applied ?? current.date_applied,
      status: req.body.status ?? current.status,
    };

    await db.execute({
      sql: 'UPDATE jobs SET company = ?, role = ?, url = ?, date_applied = ?, status = ? WHERE id = ?',
      args: [next.company, next.role, next.url, next.date_applied, next.status, id],
    });

    const updated = await getJobById(id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Could not update job.' });
  }
});

router.delete('/:id', async (req, res) => {
  const id = toNumber(req.params.id);

  try {
    await db.execute({
      sql: 'DELETE FROM jobs WHERE id = ?',
      args: [id],
    });
    res.json({ deleted: true });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete job.' });
  }
});

export default router;

