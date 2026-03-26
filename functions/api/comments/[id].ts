export const onRequestPatch: PagesFunction<{ DB: D1Database }, 'id', { user: any }> = async (context) => {
  try {
    const id = context.params.id;
    const { content } = await context.request.json() as any;
    const user = context.data.user;

    if (!content) return new Response(JSON.stringify({ error: 'Content required' }), { status: 400 });

    const db = context.env.DB;

    // Check ownership
    const comment = await db.prepare('SELECT user_id, is_deleted FROM comments WHERE id = ?').bind(id).first();
    if (!comment) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    if (comment.is_deleted) return new Response(JSON.stringify({ error: 'Comment deleted' }), { status: 400 });
    if (comment.user_id !== user.id) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });

    await db.prepare('UPDATE comments SET content = ?, edited_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(content, id)
      .run();

    return new Response(JSON.stringify({ success: true }));
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const onRequestDelete: PagesFunction<{ DB: D1Database }, 'id', { user: any }> = async (context) => {
  try {
    const id = context.params.id;
    const user = context.data.user;
    const db = context.env.DB;

    const comment = await db.prepare('SELECT user_id FROM comments WHERE id = ?').bind(id).first();
    if (!comment) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    if (comment.user_id !== user.id) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });

    // Check if has replies
    const hasReplies = await db.prepare('SELECT id FROM comments WHERE parent_id = ?').bind(id).first();

    if (hasReplies) {
      // Soft delete
      await db.prepare('UPDATE comments SET is_deleted = 1, content = "" WHERE id = ?').bind(id).run();
    } else {
      // Hard delete
      await db.prepare('DELETE FROM media WHERE comment_id = ?').bind(id).run();
      await db.prepare('DELETE FROM reactions WHERE comment_id = ?').bind(id).run();
      await db.prepare('DELETE FROM comments WHERE id = ?').bind(id).run();
    }

    return new Response(JSON.stringify({ success: true }));
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
