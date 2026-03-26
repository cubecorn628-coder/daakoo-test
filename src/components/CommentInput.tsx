import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Send, X } from 'lucide-react';
import { postComment, uploadMedia } from '../lib/api';

export default function CommentInput({ user, parentId = null, onCommentAdded, onCancel }: any) {
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateMagicBytes = async (file: File) => {
    const buffer = await file.slice(0, 12).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // JPEG: FF D8 FF
    if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return true;
    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47 &&
        bytes[4] === 0x0D && bytes[5] === 0x0A && bytes[6] === 0x1A && bytes[7] === 0x0A) return true;
    // GIF: 47 49 46 38
    if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return true;
    // WEBP: 52 49 46 46 (RIFF) ... 57 45 42 50 (WEBP)
    if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
        bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return true;

    // Executable checks
    if (bytes[0] === 0x4D && bytes[1] === 0x5A) throw new Error('Executable files are not allowed');
    if (bytes[0] === 0x7F && bytes[1] === 0x45 && bytes[2] === 0x4C && bytes[3] === 0x46) throw new Error('Executable files are not allowed');

    throw new Error('Invalid file format. Only JPG, PNG, GIF, WEBP allowed.');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      setError('');
      await validateMagicBytes(selectedFile);
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    } catch (err: any) {
      setError(err.message);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !file) return;

    setLoading(true);
    setError('');

    try {
      let mediaKey = null;
      let mimeType = null;

      if (file) {
        const uploadRes = await uploadMedia(file) as any;
        mediaKey = uploadRes.key;
        mimeType = uploadRes.mimeType;
      }

      await postComment({
        content,
        parent_id: parentId,
        media_key: mediaKey,
        mime_type: mimeType
      });

      setContent('');
      setFile(null);
      setPreview(null);
      if (onCommentAdded) onCommentAdded();
      if (onCancel) onCancel();
    } catch (err: any) {
      setError(err.message || 'Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-4">
      <img 
        src={`https://www.gravatar.com/avatar/${user.emailHash}?s=40&d=identicon`} 
        alt={user.username}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextElementSibling?.classList.remove('hidden');
        }}
        className="w-10 h-10 rounded-full border border-m3-outline/20 flex-shrink-0"
      />
      <div className="w-10 h-10 rounded-full border border-m3-outline/20 flex-shrink-0 flex items-center justify-center bg-m3-primary/10 text-m3-primary font-bold hidden">
        {user.username.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={parentId ? "Write a reply..." : "What are your thoughts?"}
            className="w-full min-h-[100px] p-4 pb-12 rounded-2xl bg-m3-surface border border-m3-outline/20 focus:border-m3-primary focus:ring-1 focus:ring-m3-primary transition-colors resize-none"
            disabled={loading}
          />
          
          {preview && (
            <div className="relative inline-block mt-2 mb-4 ml-4">
              <img src={preview} alt="Preview" className="h-32 rounded-lg border border-m3-outline/20 object-cover" />
              <button 
                type="button"
                onClick={() => { setFile(null); setPreview(null); }}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.gif,.webp"
                className="hidden" 
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-m3-on-surface-variant hover:text-m3-primary hover:bg-m3-primary/10 rounded-full transition-colors"
                disabled={loading}
              >
                <ImageIcon size={20} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {onCancel && (
                <button 
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-1.5 text-sm font-medium text-m3-on-surface-variant hover:bg-m3-on-surface/5 rounded-full transition-colors"
                >
                  Cancel
                </button>
              )}
              <button 
                type="submit"
                disabled={loading || (!content.trim() && !file)}
                className="flex items-center gap-2 px-4 py-1.5 bg-m3-primary text-m3-on-primary rounded-full font-medium hover:shadow-md transition-all disabled:opacity-50 disabled:hover:shadow-none"
              >
                {loading ? 'Posting...' : 'Post'}
                <Send size={16} />
              </button>
            </div>
          </div>
        </form>
        {error && <div className="text-red-500 text-sm mt-2 ml-2">{error}</div>}
      </div>
    </div>
  );
}
