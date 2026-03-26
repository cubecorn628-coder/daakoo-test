import { hashPassword, signToken } from '../../_shared/auth';

export const onRequestPost: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { username, email, password } = await context.request.json() as any;

    if (!username || !email || !password) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    const db = context.env.DB;

    // Check existing
    const existing = await db.prepare('SELECT id FROM users WHERE username = ? OR email = ?')
      .bind(username, email)
      .first();

    if (existing) {
      return new Response(JSON.stringify({ error: 'Username or email already exists' }), { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const result = await db.prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?) RETURNING id, username, email')
      .bind(username, email, passwordHash)
      .first();

    if (!result) {
      throw new Error('Failed to create user');
    }

    const token = await signToken({ id: result.id, username: result.username, email: result.email });

    return new Response(JSON.stringify({ token, user: result }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
