'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [logs, setLogs] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('usnow_token');
        if (!token) {
            router.push('/login');
            return;
        }

        // Fetch User Info
        fetch('http://localhost:8000/api/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(data => {
                setUser(data);
                setLoading(false);
            })
            .catch(err => {
                if (err.status === 401) {
                    localStorage.removeItem('usnow_token');
                    router.push('/login');
                }
            });

        // Fetch Audit Logs
        fetch('http://localhost:8000/api/audit-logs', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setLogs(data))
            .catch(err => console.error("Logs fetch failed", err));

    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('usnow_token');
        router.push('/');
    };

    const handleSelfUpdate = async () => {
        const token = localStorage.getItem('usnow_token');
        if (!token) {
            router.push('/login');
            return;
        }

        setUpdateLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/request-update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-UsNow-API-Key': 'un_test_12345',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    company_id: "usnow-uuid-789012", // UsNow Official
                    fields: ["name", "email", "phone"]
                })
            });

            if (res.status === 401) {
                localStorage.removeItem('usnow_token');
                router.push('/login');
                return;
            }

            const data = await res.json();
            window.location.href = data.update_url;
        } catch (err) {
            alert("Failed to initiate self-update");
            setUpdateLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center font-mono text-primary animate-pulse tracking-widest text-xs">
            INITIALIZING_SECURE_SESSION...
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-inter bg-grid">

            {/* Infrastructure Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

            {/* Navigation */}
            <nav className="px-4 md:px-16 py-5 bg-background/80 backdrop-blur-xl flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-white/5 sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-3 no-underline shadow-none group">
                    <div className="w-8 h-8 bg-primary rounded shadow-[0_0_15px_rgba(99,102,241,0.4)] flex items-center justify-center transition-transform group-hover:scale-110">
                        <div className="w-4 h-4 border-2 border-white/30 rounded-sm"></div>
                    </div>
                    <span className="text-xl font-bold tracking-tighter text-white font-outfit uppercase">UsNow</span>
                </Link>
                <div className="flex gap-4 sm:gap-8 items-center font-mono text-[10px] sm:text-[0.65rem] tracking-[0.1em] sm:tracking-[0.2em] w-full sm:w-auto justify-center">
                    <button
                        onClick={handleLogout}
                        className="bg-transparent border-none text-secondary hover:text-red-400 transition-colors uppercase font-bold cursor-pointer whitespace-nowrap"
                    >
                        [ TERMINATE_SESSION ]
                    </button>
                    <Link href="/" className="no-underline text-white hover:text-primary transition-colors border border-white/10 px-3 sm:px-4 py-2 rounded whitespace-nowrap">BACK_TO_HOME</Link>
                </div>
            </nav>

            <main className="container-custom py-16 relative z-10">
                <div className="max-w-4xl mx-auto">

                    {/* Header */}
                    <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-center md:text-left">
                        <div className="w-full md:w-auto">
                            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[0.5rem] sm:text-[0.6rem] font-mono text-primary mb-3 tracking-widest uppercase">
                                Node_Identity_Hode: ACTIVE
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl text-white font-outfit font-bold tracking-tight">Personal Infrastructure</h2>
                            <p className="text-secondary text-base sm:text-lg mt-2 font-light">
                                Verified data records within the UsNow secure protocol.
                            </p>
                        </div>
                        <button
                            onClick={handleSelfUpdate}
                            disabled={updateLoading}
                            className="w-full md:w-auto bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center justify-center gap-3 group active:scale-95"
                        >
                            <span className="font-mono text-xs tracking-tighter">UPDATE_VIA_USNOW</span>
                            <svg className="transition-transform group-hover:rotate-12" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                                <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                            </svg>
                        </button>
                    </div>

                    {/* Data Display Card */}
                    <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-sm mb-16 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-center md:text-left">
                            <div className="space-y-8">
                                <div className="border-l-0 md:border-l-2 border-primary/30 pl-0 md:pl-6 py-1">
                                    <label className="block text-[0.65rem] font-mono font-bold text-primary uppercase tracking-[0.2em] mb-2">Subject_Full_Name</label>
                                    <p className="text-xl sm:text-2xl text-white font-medium break-words">{user?.full_name}</p>
                                </div>
                                <div className="border-l-0 md:border-l-2 border-primary/30 pl-0 md:pl-6 py-1">
                                    <label className="block text-[0.65rem] font-mono font-bold text-primary uppercase tracking-[0.2em] mb-2">Primary_Network_Endpoint</label>
                                    <div className="flex flex-col md:flex-row items-center gap-3">
                                        <p className="text-xl sm:text-2xl text-white font-medium break-all">{user?.email}</p>
                                        <span className="text-[0.6rem] font-mono bg-success/10 text-success border border-success/20 px-2 py-0.5 rounded font-bold tracking-widest whitespace-nowrap">VERIFIED</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div className="border-l-0 md:border-l-2 border-primary/30 pl-0 md:pl-6 py-1">
                                    <label className="block text-[0.65rem] font-mono font-bold text-primary uppercase tracking-[0.2em] mb-2">Biological_Contact_Link</label>
                                    <p className="text-xl sm:text-2xl text-white font-medium">{user?.phone_number || '[ NULL_FIELD ]'}</p>
                                </div>
                                <div className="border-l-0 md:border-l-2 border-white/5 pl-0 md:pl-6 py-1 bg-white/[0.01] rounded-r-xl">
                                    <label className="block text-[0.65rem] font-mono font-bold text-secondary uppercase tracking-[0.2em] mb-2">Encryption_Method</label>
                                    <p className="text-sm text-secondary tracking-widest uppercase">AES-256_F_LEVEL</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Audit Logs Section */}
                    <div className="mb-10 flex items-center gap-4">
                        <h3 className="text-2xl text-white font-outfit font-bold tracking-tight">Audit_Trail</h3>
                        <div className="h-px flex-1 bg-white/5"></div>
                        <span className="font-mono text-[0.6rem] text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest font-bold">Encrypted_Logs_Active</span>
                    </div>

                    <div className="space-y-4 mb-20">
                        {logs.length === 0 ? (
                            <div className="p-16 text-center bg-white/[0.02] border border-white/5 border-dashed rounded-2xl text-secondary font-mono text-xs tracking-widest">
                                [ NO_TRANSMISSION_HISTORY_FOUND_IN_NODE ]
                            </div>
                        ) : (
                            logs.map(log => (
                                <div key={log.id} className="bg-white/[0.01] hover:bg-white/[0.03] p-8 rounded-2xl border border-white/5 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                                            <span className="text-white/30 group-hover:text-primary transition-colors text-xs font-mono">0x{log.id.substring(0, 2)}</span>
                                        </div>
                                        <div>
                                            <p className="text-lg text-white font-medium group-hover:text-primary transition-colors">Data_Egress: {log.company_name}</p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {Object.keys(log.shared_data).map(key => (
                                                    <span key={key} className="text-[0.6rem] font-mono bg-white/5 text-secondary px-2 py-0.5 rounded border border-white/5 uppercase">{key}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:text-right md:border-l border-white/5 md:pl-8 w-full md:w-auto">
                                        <p className="text-white font-mono text-sm tracking-tighter">{new Date(log.timestamp).toLocaleDateString()} // {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
                                        <p className="text-[0.6rem] text-secondary font-mono tracking-widest uppercase mt-1">Status: TRANSMISSION_VERIFIED</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            {/* Side Labels decor - Hidden on mobile */}
            <div className="fixed left-6 top-1/2 -translate-y-1/2 rotate-180 [writing-mode:vertical-lr] text-[0.6rem] font-mono text-white/10 tracking-[0.5em] pointer-events-none uppercase hidden xl:block">
                Secure_Identity_Protocol_Active // Node_V1.0
            </div>
            <div className="fixed right-6 top-1/2 -translate-y-1/2 [writing-mode:vertical-lr] text-[0.6rem] font-mono text-white/10 tracking-[0.5em] pointer-events-none uppercase hidden xl:block">
                Privacy_Bridge_Infrastructure // USNOW_NODE
            </div>
        </div>
    );
}
