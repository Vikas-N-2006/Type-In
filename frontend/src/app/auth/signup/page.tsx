// --- /app/auth/signup/page.tsx ---
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApiMutation } from '@/hooks/useApiMutation';
import { api } from '@/lib/api';
import { UserPlus, Loader2 } from 'lucide-react';
import { TerminalWindow } from '@/components/ui/TerminalWindow';
import { GlitchButton } from '@/components/ui/GlitchButton';

export default function SignupPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { mutate, isLoading, error } = useApiMutation({
        mutationFn: api.signup,
        onSuccess: () => {
            router.push('/auth/login');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate({ fullName, email, password });
    };

    return (
        <div className="max-w-md mx-auto">
            <TerminalWindow title="create_user">
                <h2 className="text-2xl font-bold font-mono text-slate-200 mb-6">$ adduser</h2>
                {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-md mb-4 font-mono text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-mono text-slate-400 mb-2" htmlFor="fullName">fullName</label>
                        <input type="text" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} required className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200 font-mono"/>
                    </div>
                    <div>
                        <label className="block text-sm font-mono text-slate-400 mb-2" htmlFor="email">email</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200 font-mono"/>
                    </div>
                    <div>
                        <label className="block text-sm font-mono text-slate-400 mb-2" htmlFor="password">password</label>
                        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200 font-mono"/>
                    </div>
                    <GlitchButton type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? <Loader2 className="animate-spin" /> : <><UserPlus size={16}/> Register</>}
                    </GlitchButton>
                </form>
            </TerminalWindow>
        </div>
    );
};