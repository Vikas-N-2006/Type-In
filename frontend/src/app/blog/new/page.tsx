// --- /app/blog/new/page.tsx ---
'use client';
import '../../globals.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useApiMutation } from '@/hooks/useApiMutation';
import { api } from '@/lib/api';
import { GitBranch, ImageIcon, Loader2 } from 'lucide-react';
import { TerminalWindow } from '@/components/ui/TerminalWindow';
import { GlitchButton } from '@/components/ui/GlitchButton';

export default function NewBlogPage() {
    const { token } = useAuth();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [coverImage, setCoverImage] = useState<File | null>(null);

    const { mutate, isLoading, error } = useApiMutation({
        mutationFn: api.createBlog,
        onSuccess: (data) => {
            router.push(`/blog/${data._id}`);
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !coverImage || !title || !body) {
            return;
        }
        const formData = new FormData();
        formData.append('title', title);
        formData.append('body', body);
        formData.append('coverImage', coverImage);

        mutate({ formData, token });
    };

    return (
        <div className="max-w-3xl mx-auto">
            <TerminalWindow title="git commit -m 'new blog post'">
                <h2 className="text-2xl font-bold font-mono text-slate-200 mb-6">New Commit</h2>
                {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-md mb-4 font-mono text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-mono text-slate-400 mb-2" htmlFor="title">Commit Message (Title)</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200 font-mono" />
                    </div>
                    <div>
                        <label className="block text-sm font-mono text-slate-400 mb-2" htmlFor="coverImage">Cover Image</label>
                        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <ImageIcon className="mx-auto h-12 w-12 text-slate-500" />
                                <div className="flex text-sm text-slate-500 font-mono">
                                    <label htmlFor="coverImage" className="relative cursor-pointer bg-slate-800 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none p-1">
                                        <span>Upload a file</span>
                                        <input id="coverImage" name="coverImage" type="file" className="sr-only" onChange={e => setCoverImage(e.target.files ? e.target.files[0] : null)} required />
                                    </label>
                                </div>
                                <p className="text-xs text-slate-600">{coverImage ? coverImage.name : 'PNG, JPG, GIF up to 10MB'}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-mono text-slate-400 mb-2" htmlFor="body">Content (Body - Markdown supported)</label>
                        <textarea id="body" value={body} onChange={e => setBody(e.target.value)} rows={12} required className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200 font-sans leading-relaxed"></textarea>
                    </div>
                    <GlitchButton type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? <Loader2 className="animate-spin" /> : <><GitBranch size={16} /> Push to Main</>}
                    </GlitchButton>
                </form>
            </TerminalWindow>
        </div>
    );
};