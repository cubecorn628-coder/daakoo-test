export const onRequestPost: PagesFunction<{ BUCKET: R2Bucket }, any, { user: any }> = async (context) => {
  try {
    const user = context.data.user;
    const request = context.request;
    
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Magic bytes validation
    let isValid = false;
    let mimeType = '';

    // JPEG: FF D8 FF
    if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
      isValid = true;
      mimeType = 'image/jpeg';
    }
    // PNG: 89 50 4E 47 0D 0A 1A 0A
    else if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47 &&
             bytes[4] === 0x0D && bytes[5] === 0x0A && bytes[6] === 0x1A && bytes[7] === 0x0A) {
      isValid = true;
      mimeType = 'image/png';
    }
    // GIF: 47 49 46 38
    else if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
      isValid = true;
      mimeType = 'image/gif';
    }
    // WEBP: 52 49 46 46 (RIFF) ... 57 45 42 50 (WEBP)
    else if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
             bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
      isValid = true;
      mimeType = 'image/webp';
    }

    // Executable checks
    if (bytes[0] === 0x4D && bytes[1] === 0x5A) { // MZ
      return new Response(JSON.stringify({ error: 'Executable files are not allowed' }), { status: 400 });
    }
    if (bytes[0] === 0x7F && bytes[1] === 0x45 && bytes[2] === 0x4C && bytes[3] === 0x46) { // ELF
      return new Response(JSON.stringify({ error: 'Executable files are not allowed' }), { status: 400 });
    }

    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid file format' }), { status: 400 });
    }

    const key = `comments/${user.id}/${Date.now()}-${file.name}`;
    
    await context.env.BUCKET.put(key, buffer, {
      httpMetadata: { contentType: mimeType }
    });

    return new Response(JSON.stringify({ success: true, key, mimeType }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
