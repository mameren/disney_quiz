import { createAuthClient } from 'better-auth/react';

// baseURL を省略するとブラウザでは window.location.origin を自動使用
// Vercel デプロイ時も /api/auth/* に自動ルーティングされる
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
