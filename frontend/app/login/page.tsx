'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('user@example.com');
    const [password, setPassword] = useState('password123');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) throw new Error('System_Auth_Failed: Invalid Credentials');

            const data = await res.json();
            localStorage.setItem('usnow_token', data.access_token);

            const returnUrl = localStorage.getItem('usnow_return_to');
            if (returnUrl) {
                localStorage.removeItem('usnow_return_to');
                router.push(returnUrl);
            } else {
                router.push('/profile');
            }
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center font-inter bg-grid relative p-6">

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] opacity-10 pointer-events-none"></div>

            <div className="max-w-md w-full animate-fade-in relative z-10">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-primary rounded-xl mx-auto mb-8 shadow-[0_0_30px_rgba(99,102,241,0.4)] flex items-center justify-center group motion-safe:hover:scale-110 transition-transform">
                        <div className="w-8 h-8 border-2 border-white/20 rounded-md"></div>
                    </div>
                    <h2 className="text-3xl text-white font-outfit font-bold tracking-tight uppercase">System_Access</h2>
                    <p className="font-mono text-[0.65rem] text-secondary mt-3 tracking-[0.2em] uppercase">Auth_Gateway: Secure_Protocol_V1.0</p>
                </div>

                <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-10 backdrop-blur-md shadow-2xl relative overflow-hidden group">
                    {/* Diagnostic line */}
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-primary/40"></div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 text-[0.7rem] font-mono text-center tracking-tight">
                            [ ERROR_LOG: {error} ]
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div>
                            <label className="block text-[0.6rem] font-mono font-bold text-primary uppercase tracking-[0.2em] mb-3 px-1">Identity_Endpoint</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-xl px-5 text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-mono text-sm"
                                placeholder="name@domain.node"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[0.6rem] font-mono font-bold text-primary uppercase tracking-[0.2em] mb-3 px-1">Access_Keyphrase</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-xl px-5 text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-mono text-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button disabled={loading} className="w-full h-14 bg-primary hover:bg-primary-hover text-white font-mono font-bold rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                            {loading ? 'AUTHENTICATING...' : 'INITIALIZE_AUTH'}
                        </button>
                    </form>

                    <p className="text-center mt-10 text-[0.7rem] font-mono tracking-widest text-secondary hover:text-white transition-colors cursor-pointer">
                        NEW_USER? <Link href="/register" className="text-primary font-bold no-underline hover:underline">REGISTER_NODE</Link>
                    </p>
                </div>

                <div className="mt-12 text-center">
                    <div className="inline-block p-4 border border-white/5 bg-white/[0.01] rounded-2xl">
                        <p className="text-[0.6rem] font-mono text-white/20 uppercase tracking-[0.2em] mb-2 leading-tight">Mock_Identity_Credentials</p>
                        <p className="text-[0.65rem] font-mono text-secondary">
                            USER: user@example.com <br />
                            KEY: password123
                        </p>
                    </div>
                    <div className="mt-8">
                        <Link href="/" className="text-[0.6rem] font-mono text-secondary hover:text-primary no-underline uppercase tracking-[0.3em]">
                            &lt;&lt; BACK_TO_ROOT
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
