export default async function handler(req, res) {
  res.status(200).json({
    ok: true,
    time: new Date().toISOString(),
    env: {
      hasTursoUrl: !!process.env.TURSO_DATABASE_URL,
      hasTursoToken: !!process.env.TURSO_AUTH_TOKEN,
      hasBetterAuthSecret: !!process.env.BETTER_AUTH_SECRET,
      hasBetterAuthUrl: !!process.env.BETTER_AUTH_URL,
      betterAuthUrl: process.env.BETTER_AUTH_URL || '(not set)',
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    },
  });
}
