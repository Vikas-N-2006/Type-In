// --- /components/BlogCard.tsx ---
import Link from 'next/link';
import Image from 'next/image';
import { Blog } from '@/types';
import { getImageUrl } from '@/lib/api';
import { GitBranch } from 'lucide-react';

interface BlogCardProps {
  blog: Blog;
}

export const BlogCard = ({ blog }: BlogCardProps) => {
  const createSnippet = (text: string, maxLength: number): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, text.lastIndexOf(' ', maxLength)) + '...';
  };

  const authorImageUrl = blog.createdBy?.profileImageURL
    ? getImageUrl(blog.createdBy.profileImageURL)
    : `https://placehold.co/32x32/1e293b/94a3b8?text=${blog.createdBy?.fullName?.[0] || 'A'}`;

  return (
    <Link href={`/blog/${blog._id}`} className="block bg-[#1e293b]/60 border border-slate-700 rounded-lg shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 group hover:border-indigo-600 transform hover:-translate-y-1">
      <div className="relative w-full h-40">
        <Image src={getImageUrl(blog.coverImageURL)} alt={blog.title} fill className="rounded-t-lg object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-5">
        <h2 className="text-xl font-bold font-mono text-slate-200 mb-2 group-hover:text-indigo-400 transition-colors">{blog.title}</h2>
        <p className="text-slate-400 text-sm mb-4 h-16 font-sans">{createSnippet(blog.body, 100)}</p>
        <div className="flex justify-between items-center">
            <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
                <Image src={authorImageUrl} alt={blog.createdBy?.fullName || 'Author'} width={24} height={24} className="rounded-full border-2 border-slate-600"/>
                <span>{blog.createdBy?.fullName || 'Anonymous'}</span>
            </div>
            <div className="font-mono text-indigo-400 text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                <span className="text-indigo-400/50 group-hover:text-indigo-400">$</span> read_post <GitBranch size={16}/>
            </div>
        </div>
      </div>
    </Link>
  );
};