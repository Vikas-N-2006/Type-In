// --- /components/Navbar.tsx ---
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Code, Home, FilePlus, LogIn, LogOut, UserPlus } from 'lucide-react';
import { GlitchButton } from './ui/GlitchButton';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <nav className="bg-[#0f172a]/50 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold font-mono text-slate-200 hover:text-indigo-400 transition-colors">
            <Code className="h-7 w-7 text-indigo-500" />
            <span>Blogify.dev</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" className="font-mono text-slate-400 hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"><Home size={16}/> Home</Link>
            {user ? (
              <>
                <Link href="/blog/new" className="font-mono text-slate-400 hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"><FilePlus size={16}/> New Post</Link>
                <GlitchButton onClick={handleLogout}><LogOut size={16}/> Logout</GlitchButton>
              </>
            ) : (
              <>
                <GlitchButton onClick={() => router.push('/auth/login')}><LogIn size={16}/> Login</GlitchButton>
                <GlitchButton onClick={() => router.push('/auth/signup')}><UserPlus size={16}/> Sign Up</GlitchButton>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};