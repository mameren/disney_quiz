import { createClient } from '@libsql/client';

function getClient() {
  return createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}

export default async function handler(req, res) {
  const client = getClient();

  try {
    // テーブルが存在しない場合は作成
    await client.execute(`
      CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        score INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    if (req.method === 'GET') {
      const limitCount = Number(req.query.limit) || 10;
      const result = await client.execute({
        sql: 'SELECT id, name, score, created_at FROM scores ORDER BY score DESC LIMIT ?',
        args: [limitCount],
      });
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      const { name, score } = req.body;
      if (!name || score == null) {
        return res.status(400).json({ error: 'name and score are required' });
      }
      await client.execute({
        sql: 'INSERT INTO scores (name, score) VALUES (?, ?)',
        args: [String(name), Number(score)],
      });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Turso error:', error);
    return res.status(500).json({ error: 'Database error', details: error.message });
  }
}
