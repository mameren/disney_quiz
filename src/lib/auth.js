import { betterAuth } from 'better-auth';
import { createClient } from '@libsql/client';
import { LibsqlDialect } from '@libsql/kysely-libsql';

const tursoClient = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const auth = betterAuth({
  // Kysely の LibsqlDialect を使って Turso に接続 (type:'libsql' は未対応)
  database: new LibsqlDialect({ client: tursoClient }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:5173',
});
