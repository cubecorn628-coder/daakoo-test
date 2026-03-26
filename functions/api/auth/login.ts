import { hashPassword, signToken } from '../../_shared/auth';

export const onRequestPost: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { email, password } = await context.request.json() as any;

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    const db = context.env.DB;
    const passwordHash = await hashPassword(password);

    const user = await db.prepare('SELECT id, username, email FROM users WHERE email = ? AND password_hash = ?')
      .bind(email, passwordHash)
      .first();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
    }

    const token = await signToken({ id: user.id, username: user.username, email: user.email });

    return new Response(JSON.stringify({ token, user }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
