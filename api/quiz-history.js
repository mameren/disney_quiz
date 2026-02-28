import { createClient } from '@libsql/client';

function getClient() {
  return createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}

export default async function handler(req, res) {
  const client = getClient();

  await client.execute(`
    CREATE TABLE IF NOT EXISTS quiz_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      genre TEXT NOT NULL,
      difficulty INTEGER NOT NULL,
      correct INTEGER NOT NULL,
      total INTEGER NOT NULL,
      played_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  if (req.method === 'POST') {
    const { userId, genre, difficulty, correct, total } = req.body;
    if (!userId || !genre || difficulty == null || correct == null || total == null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    await client.execute({
      sql: 'INSERT INTO quiz_history (user_id, genre, difficulty, correct, total) VALUES (?, ?, ?, ?, ?)',
      args: [String(userId), String(genre), Number(difficulty), Number(correct), Number(total)],
    });
    return res.status(200).json({ success: true });
  }

  if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const result = await client.execute({
      sql: `
        SELECT genre,
               COUNT(*) as plays,
               SUM(correct) as total_correct,
               SUM(total) as total_questions
        FROM quiz_history
        WHERE user_id = ?
        GROUP BY genre
        ORDER BY plays DESC
      `,
      args: [String(userId)],
    });
    return res.status(200).json(result.rows);
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
