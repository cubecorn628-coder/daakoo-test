export const onRequestGet: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const db = context.env.DB;
    
    // Get all comments with user info and media
    const { results } = await db.prepare(`
      SELECT 
        c.id, c.parent_id, c.user_id, c.content, c.edited_at, c.is_deleted, c.created_at,
        u.username, u.email,
        m.r2_key, m.mime_type
      FROM comments c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN media m ON c.id = m.comment_id
      ORDER BY c.created_at DESC
    `).all();

    // Group reactions
    const { results: reactions } = await db.prepare(`
      SELECT r.comment_id, r.emoji, u.username
      FROM reactions r
      JOIN users u ON r.user_id = u.id
    `).all();

    const comments = results.map((c: any) => {
      const commentReactions = reactions.filter((r: any) => r.comment_id === c.id);
      const groupedReactions = commentReactions.reduce((acc: any, r: any) => {
        if (!acc[r.emoji]) acc[r.emoji] = [];
        acc[r.emoji].push(r.username);
        return acc;
      }, {});

      return {
        id: c.id,
        parent_id: c.parent_id,
        user_id: c.user_id,
        content: c.is_deleted ? '[Komentar dihapus]' : c.content,
        edited_at: c.edited_at,
        is_deleted: !!c.is_deleted,
        created_at: c.created_at,
        user: {
          id: c.user_id,
          username: c.username,
          email: c.email
        },
        media: c.r2_key && !c.is_deleted ? {
          r2_key: c.r2_key,
          mime_type: c.mime_type
        } : null,
        reactions: groupedReactions
      };
    });

    return new Response(JSON.stringify(comments), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const onRequestPost: PagesFunction<{ DB: D1Database }, any, { user: any }> = async (context) => {
  try {
    const { content, parent_id, media_key, mime_type } = await context.request.json() as any;
    const user = context.data.user;

    if (!content) {
      return new Response(JSON.stringify({ error: 'Content is required' }), { status: 400 });
    }

    const db = context.env.DB;

    if (parent_id) {
      const parentComment = await db.prepare('SELECT is_deleted FROM comments WHERE id = ?').bind(parent_id).first() as any;
      if (!parentComment || parentComment.is_deleted) {
        return new Response(JSON.stringify({ error: 'Parent comment not found or deleted' }), { status: 404 });
      }
    }

    // Insert comment
    const result = await db.prepare('INSERT INTO comments (user_id, content, parent_id) VALUES (?, ?, ?) RETURNING id')
      .bind(user.id, content, parent_id || null)
      .first();

    if (!result) throw new Error('Failed to insert comment');

    // Insert media if exists
    if (media_key && mime_type) {
      await db.prepare('INSERT INTO media (comment_id, r2_key, mime_type) VALUES (?, ?, ?)')
        .bind(result.id, media_key, mime_type)
        .run();
    }

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
