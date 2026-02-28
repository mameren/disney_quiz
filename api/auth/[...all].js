import { toNodeHandler } from 'better-auth/node';
import { auth } from '../../src/lib/auth.js';

// toNodeHandler wraps Better Auth for Node.js-compatible request/response (Vercel serverless)
const handler = toNodeHandler(auth);

export default handler;
