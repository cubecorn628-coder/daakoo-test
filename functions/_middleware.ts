import { verifyToken } from './_shared/auth';

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  
  // Only protect specific API routes
  const protectedRoutes = ['/api/comments', '/api/media'];
  const isProtected = protectedRoutes.some(route => url.pathname.startsWith(route));
  
  // Allow GET /api/comments without auth
  if (url.pathname === '/api/comments' && context.request.method === 'GET') {
    return context.next();
  }
  
  // Allow GET /api/comments/[id]/reactions without auth
  if (url.pathname.match(/^\/api\/comments\/\d+\/reactions$/) && context.request.method === 'GET') {
    return context.next();
  }

  if (isProtected) {
    const authHeader = context.request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const user = await verifyToken(token);

    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    }

    // Attach user to context data
    context.data = { ...context.data, user };
  }

  return context.next();
};
