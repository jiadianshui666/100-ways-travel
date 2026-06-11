"use client";

import { useState, useEffect, useCallback } from "react";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string; avatar: string | null };
}

interface CommentSectionProps {
  slug: string;
}

export function CommentSection({ slug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(() => {
    fetch(`/api/experiences/${slug}/comments`)
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setComments(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const submit = async () => {
    if (!text.trim()) return;
    const auth = localStorage.getItem("auth") || localStorage.getItem("admin-auth");
    if (!auth) { alert("请先登录后再评论"); return; }
    setSubmitting(true);
    try {
      const { token } = JSON.parse(auth);
      const res = await fetch(`/api/experiences/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: text }),
      });
      if (res.ok) {
        setText("");
        fetchComments();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
        <span className="w-1 h-8 rounded-full bg-neon-gradient" />
        评论 ({comments.length})
      </h2>

      {/* Comment input */}
      <div className="flex gap-3 mb-8">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="写下你的想法..."
          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-dark-500 focus:border-neon-purple/50 focus:outline-none"
        />
        <button
          onClick={submit}
          disabled={submitting || !text.trim()}
          className="px-5 py-3 rounded-xl bg-neon-purple/15 border border-neon-purple/30 text-neon-purple text-sm font-medium hover:bg-neon-purple/25 disabled:opacity-30 transition-all"
        >
          {submitting ? "..." : "发送"}
        </button>
      </div>

      {/* Comments list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <div key={i} className="skeleton h-16 w-full rounded-xl" />)}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-dark-500 text-sm text-center py-8">暂无评论，来说两句吧</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="glass-subtle p-4 rounded-xl flex gap-3">
              <div className="w-9 h-9 rounded-full bg-neon-purple/20 flex items-center justify-center text-xs font-bold text-neon-purple flex-shrink-0">
                {c.user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white">{c.user.name}</span>
                  <span className="text-xs text-dark-500">
                    {new Date(c.createdAt).toLocaleDateString("zh-CN")}
                  </span>
                </div>
                <p className="text-sm text-dark-300">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
