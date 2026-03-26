export const onRequestGet: PagesFunction<{ BUCKET: R2Bucket }> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const key = url.pathname.replace('/api/media/', '');

    if (!key) {
      return new Response('Not found', { status: 404 });
    }

    const object = await context.env.BUCKET.get(key);

    if (!object) {
      return new Response('Not found', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);

    return new Response(object.body, { headers });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
};
