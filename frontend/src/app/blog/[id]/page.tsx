// --- /app/blog/[id]/page.tsx ---
'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '@/hooks/useAuth';
import { Blog, Comment } from '@/types';
import { api, getBlogById, getCommentsByBlogId, getImageUrl } from '@/lib/api';
import { Send } from 'lucide-react';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { GlitchButton } from '@/components/ui/GlitchButton';
import { useApiMutation } from '@/hooks/useApiMutation';

export default function BlogPage() {
    const params = useParams();
    const id = params.id as string;
    const { user, token } = useAuth();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const fetchBlogAndComments = async () => {
            try {
                setLoading(true);
                setError(null);
                const [blogData, commentsData] = await Promise.all([
                    getBlogById(id),
                    getCommentsByBlogId(id)
                ]);
                setBlog(blogData);
                setComments(commentsData);
            } catch (err: any) {
                setError(err.message || "Failed to load blog post.");
            } finally {
                setLoading(false);
            }
        };
        fetchBlogAndComments();
    }, [id]);

    const { mutate: submitComment, isLoading: isCommenting } = useApiMutation({
        mutationFn: api.postComment,
        onSuccess: (postedComment) => {
            setComments(prev => [...prev, postedComment]);
            setNewComment('');
        },
    });

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !token) return;
        submitComment({ blogId: id, content: newComment, token });
    };

    if (loading) return <LoadingState text="Cloning repository..." />;
    if (error) return <ErrorState message={error} />;
    if (!blog) return <ErrorState message="404: Blog not found." />;

    const authorImageUrl = blog.createdBy?.profileImageURL
        ? getImageUrl(blog.createdBy.profileImageURL)
        : `https://placehold.co/40x40/1e293b/94a3b8?text=${blog.createdBy?.fullName?.[0] || 'A'}`;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="relative w-full h-64 md:h-80">
                <Image src={getImageUrl(blog.coverImageURL)} alt={blog.title} fill className="rounded-xl shadow-lg shadow-indigo-500/20 mb-8 object-cover" />
            </div>
            <article className="bg-[#162133] p-6 md:p-8 rounded-lg border border-slate-700 mt-8">
                <h1 className="text-4xl md:text-5xl font-bold font-mono text-slate-100 mb-4 leading-tight">{blog.title}</h1>
                <div className="flex items-center gap-6 text-sm text-slate-400 mb-8 font-mono">
                    <div className="flex items-center gap-2">
                        <Image src={authorImageUrl} alt={blog.createdBy?.fullName || 'Author'} width={32} height={32} className="rounded-full border-2 border-slate-600"/>
                        <span>{blog.createdBy?.fullName}</span>
                    </div>
                    <span className="text-slate-600">//</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString('en-CA')}</span>
                </div>
                <div className="prose prose-invert prose-lg max-w-none font-sans text-slate-300 prose-p:leading-relaxed prose-headings:font-mono prose-headings:text-indigo-400 prose-a:text-teal-400 hover:prose-a:text-teal-300 prose-strong:text-slate-100 prose-code:bg-slate-800 prose-code:p-1 prose-code:rounded prose-pre:bg-slate-900/70 prose-pre:border prose-pre:border-slate-700">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{blog.body}</ReactMarkdown>
                </div>
            </article>

            <section className="mt-12">
                <h2 className="text-2xl font-mono font-bold text-slate-200 mb-6">Discussion ({comments.length})</h2>
                <div className="space-y-6">
                    {comments.map(comment => {
                        const commenterImageUrl = comment.createdBy?.profileImageURL
                        ? getImageUrl(comment.createdBy.profileImageURL)
                        : `https://placehold.co/40x40/1e293b/94a3b8?text=${comment.createdBy?.fullName?.[0] || 'A'}`;

                        return (
                            <div key={comment._id} className="flex gap-4">
                                <Image src={commenterImageUrl} alt={comment.createdBy.fullName} width={40} height={40} className="w-10 h-10 rounded-full mt-1 flex-shrink-0" />
                                <div className="bg-slate-800/50 p-4 rounded-lg w-full border border-slate-700">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-bold font-mono text-indigo-400">{comment.createdBy.fullName}</p>
                                        <p className="text-xs text-slate-500 font-mono">{new Date(comment.createdAt).toLocaleString()}</p>
                                    </div>
                                    <p className="text-slate-300 font-sans">{comment.content}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                {token && (
                    <form onSubmit={handleCommentSubmit} className="mt-8">
                        <div className="bg-slate-800/50 p-4 rounded-lg w-full border border-slate-700 focus-within:border-indigo-500 transition-colors">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add to the discussion..."
                                className="w-full bg-transparent text-slate-300 placeholder-slate-500 focus:outline-none font-sans"
                                rows={3}
                            ></textarea>
                            <div className="text-right mt-2">
                                <GlitchButton type="submit" disabled={!newComment.trim() || isCommenting}><Send size={16}/> Post Comment</GlitchButton>
                            </div>
                        </div>
                    </form>
                )}
            </section>
        </div>
    );
}