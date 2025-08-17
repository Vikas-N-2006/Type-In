import './globals.css'
import { BlogCard } from '@/components/BlogCard';
import { Blog } from '@/types';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { TerminalWindow } from '@/components/ui/TerminalWindow';

async function fetchBlogs(): Promise<{ blogs: Blog[] | null, error: string | null }> {
  try {
    const res = await fetch('http://localhost:8000/api/blogs', { cache: 'no-store' });
    if (!res.ok) {
      return { blogs: null, error: `HTTP error! Status: ${res.status}` };
    }
    console.log(res);
    const data: Blog[] = await res.json();
    return { blogs: data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), error: null };
  } catch (error: any) {
    console.error("Fetch error:", error);
    return { blogs: null, error: "Could not fetch blogs. This is likely a CORS issue or the backend server is not running." };
  }
}

export default async function HomePage() {
  const { blogs, error } = await fetchBlogs();

  if (error) return <ErrorState message={error} />;
  if (!blogs) return <LoadingState text="Fetching latest commits..." />;

  return (
    <div>
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold font-mono text-slate-100 mb-4">./run blogify</h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto font-sans">A decentralized hub for developers, thinkers, and innovators. Push your thoughts to the main branch.</p>
      </div>
      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
        </div>
      ) : (
        <TerminalWindow title="status.log">
          <p className="font-mono text-yellow-400">WARN: No articles found in repository. Be the first to commit.</p>
        </TerminalWindow>
      )}
    </div>
  );
}
