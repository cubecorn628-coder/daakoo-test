import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Edit2, Trash2, Reply, MoreHorizontal, Smile } from 'lucide-react';
import { cn } from '../lib/utils';
import { editComment, deleteComment, reactComment } from '../lib/api';
import CommentInput from './CommentInput';
import EmojiPicker from './EmojiPicker';

export default function CommentItem({ comment, user, onUpdate, depth }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [imgError, setImgError] = useState(false);

  React.useEffect(() => {
    if (!isEditing) {
      setEditContent(comment.content);
    }
  }, [comment.content, isEditing]);

  const isOwner = user?.id === comment.user.id;

  const handleEdit = async () => {
    try {
      await editComment(comment.id, editContent);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(comment.id);
        onUpdate();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleReact = async (emoji: string) => {
    try {
      // If user already reacted with this emoji, remove it
      const isRemoving = comment.reactions?.[emoji]?.includes(user?.username);
      await reactComment(comment.id, isRemoving ? null : emoji);
      setShowReactions(false);
      onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex gap-4 p-4 bg-m3-surface rounded-2xl shadow-sm border border-m3-outline/10 hover:shadow-md transition-shadow">
      {imgError ? (
        <div className="w-10 h-10 rounded-full border border-m3-outline/20 flex-shrink-0 flex items-center justify-center bg-m3-primary/10 text-m3-primary font-bold">
          {comment.user.username.charAt(0).toUpperCase()}
        </div>
      ) : (
        <img 
          src={`https://www.gravatar.com/avatar/${comment.user.emailHash}?s=40&d=identicon`} 
          alt={comment.user.username}
          onError={() => setImgError(true)}
          className="w-10 h-10 rounded-full border border-m3-outline/20 flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="font-bold">{comment.user.username}</span>
            <span className="text-xs text-m3-on-surface-variant">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
            {comment.edited_at && <span className="text-xs text-m3-on-surface-variant italic">(edited)</span>}
          </div>
          
          {isOwner && !comment.is_deleted && (
            <div className="relative">
              <button 
                onClick={() => setShowOptions(!showOptions)}
                className="p-1 hover:bg-m3-on-surface/5 rounded-full transition-colors"
              >
                <MoreHorizontal size={16} />
              </button>
              {showOptions && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-m3-surface border border-m3-outline/10 rounded-xl shadow-lg z-10 overflow-hidden">
                  <button 
                    onClick={() => { setIsEditing(true); setShowOptions(false); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-m3-on-surface/5 flex items-center gap-2"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => { handleDelete(); setShowOptions(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full min-h-[80px] p-3 rounded-xl bg-m3-surface-variant/30 border border-m3-outline/20 focus:border-m3-primary focus:ring-1 focus:ring-m3-primary resize-none"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => { setIsEditing(false); setEditContent(comment.content); }} className="px-3 py-1 text-sm font-medium hover:bg-m3-on-surface/5 rounded-full">Cancel</button>
              <button onClick={handleEdit} className="px-3 py-1 text-sm font-medium bg-m3-primary text-m3-on-primary rounded-full">Save</button>
            </div>
          </div>
        ) : (
          <div className="mt-1">
            <p className={cn("whitespace-pre-wrap break-words", comment.is_deleted && "italic text-m3-on-surface-variant")}>
              {comment.content}
            </p>
            {comment.media && !comment.is_deleted && (
              <img 
                src={`/api/media/${comment.media.r2_key}`} 
                alt="Attachment" 
                className="mt-3 max-h-64 rounded-xl border border-m3-outline/10 object-cover"
              />
            )}
          </div>
        )}

        {!comment.is_deleted && (
          <div className="flex items-center gap-4 mt-3">
            <div className="relative">
              <button 
                onClick={() => setShowReactions(!showReactions)}
                className="flex items-center gap-1 text-sm text-m3-on-surface-variant hover:text-m3-primary transition-colors"
              >
                <Smile size={16} /> React
              </button>
              {showReactions && (
                <EmojiPicker onSelect={handleReact} onClose={() => setShowReactions(false)} />
              )}
            </div>
            
            <button 
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1 text-sm text-m3-on-surface-variant hover:text-m3-primary transition-colors"
            >
              <Reply size={16} /> Reply
            </button>
          </div>
        )}

        {/* Reactions Display */}
        {!comment.is_deleted && Object.keys(comment.reactions || {}).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {Object.entries(comment.reactions).map(([emoji, users]: any) => (
              <div key={emoji} className="relative group">
                <button 
                  onClick={() => handleReact(emoji)}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-sm border transition-colors",
                    users.includes(user?.username) 
                      ? "bg-m3-primary/10 border-m3-primary/30 text-m3-primary" 
                      : "bg-m3-surface-variant/30 border-m3-outline/10 hover:bg-m3-surface-variant/50"
                  )}
                >
                  <span>{emoji}</span>
                  <span className="font-medium">{users.length}</span>
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-m3-on-surface text-m3-surface text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-10 pointer-events-none">
                  {users.join(', ')}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-m3-on-surface" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isReplying && (
          <div className="mt-4">
            <CommentInput 
              user={user} 
              parentId={depth >= 5 ? comment.parent_id : comment.id} 
              onCommentAdded={() => { setIsReplying(false); onUpdate(); }} 
              onCancel={() => setIsReplying(false)} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
