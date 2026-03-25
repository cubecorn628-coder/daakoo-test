import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';
import AuthForm from '../components/AuthForm';
import CommentList from '../components/CommentList';
import CommentInput from '../components/CommentInput';
import { getComments, getUser, logout, getGravatarHash } from '../lib/api';

export default function CommentPage() {
  const [user, setUser] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');

  useEffect(() => {
    const currentUser = getUser();
    if (currentUser) setUser(currentUser);

    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const data = await getComments() as any[];
      const dataWithHash = data.map((c: any) => ({
        ...c,
        user: {
          ...c.user,
          emailHash: getGravatarHash(c.user.email)
        }
      }));
      setComments(dataWithHash);
    } catch (error) {
      console.error('Failed to fetch comments', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (sortBy === 'popular') {
      const aReacts = Object.values(a.reactions || {}).flat().length;
      const bReacts = Object.values(b.reactions || {}).flat().length;
      return bReacts - aReacts;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-m3-surface text-m3-on-surface transition-colors duration-300">
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 font-bold text-xl">
            <MessageSquare className="text-m3-primary" />
            <span>Discussions</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="font-medium hidden sm:block">{user.username}</span>
                <img 
                  src={`https://www.gravatar.com/avatar/${user.emailHash}?s=40&d=identicon`} 
                  alt={user.username}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                  className="w-8 h-8 rounded-full border border-m3-outline/20"
                />
                <div className="w-8 h-8 rounded-full border border-m3-outline/20 flex items-center justify-center bg-m3-primary/10 text-m3-primary font-bold hidden">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">Logout</button>
              </div>
            ) : (
              <div className="text-sm font-medium text-m3-on-surface-variant">Not logged in</div>
            )}
          </div>
        </div>

        {!user ? (
          <div className="mb-8 p-6 bg-m3-surface-variant/30 rounded-2xl border border-m3-outline/10">
            <h2 className="text-2xl font-bold mb-4 text-center">Join the conversation</h2>
            <AuthForm onAuthSuccess={(u) => setUser(u)} />
          </div>
        ) : (
          <div className="mb-8">
            <CommentInput 
              user={user} 
              onCommentAdded={fetchComments} 
            />
          </div>
        )}

        <div className="flex items-center justify-between mb-6 border-b border-m3-outline/10 pb-4">
          <h3 className="font-bold text-lg">{comments.length} Comments</h3>
          <div className="flex gap-2 text-sm">
            <button 
              onClick={() => setSortBy('newest')}
              className={cn("px-3 py-1 rounded-full transition-colors", sortBy === 'newest' ? "bg-m3-primary text-m3-on-primary" : "hover:bg-m3-on-surface/5")}
            >
              Newest
            </button>
            <button 
              onClick={() => setSortBy('oldest')}
              className={cn("px-3 py-1 rounded-full transition-colors", sortBy === 'oldest' ? "bg-m3-primary text-m3-on-primary" : "hover:bg-m3-on-surface/5")}
            >
              Oldest
            </button>
            <button 
              onClick={() => setSortBy('popular')}
              className={cn("px-3 py-1 rounded-full transition-colors", sortBy === 'popular' ? "bg-m3-primary text-m3-on-primary" : "hover:bg-m3-on-surface/5")}
            >
              Popular
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-m3-on-surface-variant">Loading comments...</div>
        ) : (
          <CommentList 
            comments={sortedComments} 
            user={user} 
            onUpdate={fetchComments} 
          />
        )}
      </main>
    </div>
  );
}
