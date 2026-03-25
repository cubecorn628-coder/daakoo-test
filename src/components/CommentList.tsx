import React from 'react';
import CommentItem from './CommentItem';

export default function CommentList({ comments, user, onUpdate, parentId = null, depth = 0 }: any) {
  const replies = comments.filter((c: any) => c.parent_id === parentId);

  if (replies.length === 0) return null;

  return (
    <div className={`space-y-4 ${depth > 0 ? 'ml-4 md:ml-8 pl-4 border-l-2 border-m3-outline/10 relative' : ''}`}>
      {depth > 0 && (
        <div className="absolute -left-[2px] top-8 w-4 h-[2px] bg-m3-outline/10" />
      )}
      {replies.map((comment: any) => (
        <div key={comment.id} className="relative">
          <CommentItem 
            comment={comment} 
            user={user} 
            onUpdate={onUpdate} 
            depth={depth}
          />
          {depth < 5 && (
            <CommentList 
              comments={comments} 
              user={user} 
              onUpdate={onUpdate} 
              parentId={comment.id} 
              depth={depth + 1} 
            />
          )}
        </div>
      ))}
    </div>
  );
}
