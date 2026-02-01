'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Notification from '../../components/Notification';

export default function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('http://localhost:8000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, full_name: fullName, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Registration_Process_Abort: Error');

            setMessage(data.message);
            setIsRegistered(true);
            setNotification({ message: 'Identity node created. Awaiting verification.', type: 'info' });
        } catch (err: any) {
            setError(err.message);
            setNotification({ message: err.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:8000/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: verificationCode }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Activation_Protocol_Failed: Error');

            setNotification({ message: 'Node Activated: Identity link established.', type: 'success' });
            setTimeout(() => router.push('/login'), 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/resend-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (res.ok) {
                setNotification({ message: 'New code transmitted to endpoint email.', type: 'info' });
            } else {
                setNotification({ message: data.detail || 'Failed to resend code.', type: 'error' });
            }
        } catch (err) {
            setNotification({ message: 'Network connection refused.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center font-inter bg-grid p-6 relative">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

            <div className="max-w-xl w-full animate-fade-in relative z-10">
                {!isRegistered ? (
                    <>
                        <div className="text-center mb-10">
                            <h2 className="text-3xl text-white font-outfit font-bold tracking-tight uppercase">Register_New_Node</h2>
                            <p className="font-mono text-[0.65rem] text-secondary mt-3 tracking-[0.2em] uppercase">Join_Identity_Protocol: V1.0</p>
                        </div>

                        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-12 backdrop-blur-md shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-0.5 bg-primary/40"></div>

                            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 text-[0.7rem] font-mono text-center tracking-tight">[ ERROR_LOG: {error} ]</div>}

                            <form onSubmit={handleRegister} className="space-y-8">
                                <div>
                                    <label className="block text-[0.6rem] font-mono font-bold text-primary uppercase tracking-[0.2em] mb-3 px-1">Subject_Name</label>
                                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full h-14 bg-white/[0.02] border border-white/10 rounded-xl px-5 text-white outline-none focus:border-primary transition-all font-mono text-sm" placeholder="John Doe" required />
                                </div>
                                <div>
                                    <label className="block text-[0.6rem] font-mono font-bold text-primary uppercase tracking-[0.2em] mb-3 px-1">Endpoint_Email</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-14 bg-white/[0.02] border border-white/10 rounded-xl px-5 text-white outline-none focus:border-primary transition-all font-mono text-sm" placeholder="john@endpoint.node" required />
                                </div>
                                <div>
                                    <label className="block text-[0.6rem] font-mono font-bold text-primary uppercase tracking-[0.2em] mb-3 px-1">Infrastructure_Password</label>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-14 bg-white/[0.02] border border-white/10 rounded-xl px-5 text-white outline-none focus:border-primary transition-all font-mono text-sm" placeholder="••••••••" required />
                                </div>
                                <button disabled={loading} className="w-full h-14 bg-primary hover:bg-primary-hover text-white font-mono font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                                    {loading ? 'REGISTERING...' : 'INITIALIZE_NODE_CREATE'}
                                </button>
                            </form>
                            <p className="text-center mt-10 text-[0.7rem] font-mono tracking-widest text-secondary uppercase hover:text-white transition-colors cursor-pointer">
                                PRE_EXISTING_NODE? <Link href="/login" className="text-primary font-bold no-underline hover:underline">ACCESS_LOGIN</Link>
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-center mb-10">
                            <div className="w-20 h-20 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                                <span className="text-4xl">✉️</span>
                            </div>
                            <h2 className="text-2xl text-white font-outfit font-bold uppercase">Verification_Link_Pending</h2>
                            <p className="font-mono text-[0.7rem] text-secondary mt-4 tracking-widest leading-loose uppercase bg-white/[0.02] border border-white/5 p-4 rounded-xl">{message}</p>
                        </div>

                        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-12 backdrop-blur-md shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-0.5 bg-primary/40"></div>

                            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-[0.7rem] font-mono text-center tracking-tight">[ ERROR_LOG: {error} ]</div>}

                            <form onSubmit={handleVerify} className="space-y-10">
                                <div>
                                    <label className="block text-[0.6rem] font-mono font-bold text-primary uppercase tracking-[0.2em] mb-6 text-center">INPUT_ACTIVATION_HEX_CODE</label>
                                    <input
                                        type="text"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        placeholder="123456"
                                        maxLength={6}
                                        className="w-full h-24 bg-white/[0.02] border border-white/20 rounded-2xl outline-none focus:border-primary text-4xl text-center tracking-[0.5em] font-mono font-bold text-white uppercase"
                                        required
                                    />
                                </div>
                                <button disabled={loading} className="w-full h-14 bg-primary hover:bg-primary-hover text-white font-mono font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                                    {loading ? 'VERIFYING...' : 'FINALIZE_AUTHENTICATION'}
                                </button>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={handleResendVerification}
                                        className="text-primary text-[0.65rem] font-mono font-bold uppercase tracking-widest hover:text-white transition-colors disabled:opacity-50"
                                        disabled={loading}
                                    >
                                        [ RESEND_ACTIVATION_CODE ]
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                )}

                <div className="mt-12 text-center">
                    <Link href="/" className="text-[0.6rem] font-mono text-secondary hover:text-primary no-underline uppercase tracking-[0.3em]">
                        &lt;&lt; BACK_TO_ROOT
                    </Link>
                </div>
            </div>
        </div>
    );
}
