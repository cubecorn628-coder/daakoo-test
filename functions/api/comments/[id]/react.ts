export const onRequestPost: PagesFunction<{ DB: D1Database }, 'id', { user: any }> = async (context) => {
  try {
    const comment_id = context.params.id;
    const { emoji } = await context.request.json() as any;
    const user = context.data.user;

    const db = context.env.DB;

    const comment = await db.prepare('SELECT is_deleted FROM comments WHERE id = ?').bind(comment_id).first() as any;
    if (!comment || comment.is_deleted) {
      return new Response(JSON.stringify({ error: 'Comment not found or deleted' }), { status: 404 });
    }

    if (!emoji) {
      // Delete reaction
      await db.prepare('DELETE FROM reactions WHERE comment_id = ? AND user_id = ?')
        .bind(comment_id, user.id)
        .run();
    } else {
      // Upsert reaction
      await db.prepare(`
        INSERT INTO reactions (comment_id, user_id, emoji) 
        VALUES (?, ?, ?) 
        ON CONFLICT(comment_id, user_id) DO UPDATE SET emoji = excluded.emoji
      `)
        .bind(comment_id, user.id, emoji)
        .run();
    }

    return new Response(JSON.stringify({ success: true }));
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
