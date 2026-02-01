'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MockBank() {
    const [isUpdating, setIsUpdating] = useState(false);
    const [profileData, setProfileData] = useState<any>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
        // Fetch user's current data from company's system
        const sessionToken = localStorage.getItem('usnow_session_token');

        if (sessionToken) {
            fetch(`http://localhost:8000/api/session-result/${sessionToken}`, {
                headers: {
                    'X-UsNow-API-Key': 'sb_test_67890'
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'completed' && data.data) {
                        setProfileData(data.data);
                    }
                    setLoadingProfile(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoadingProfile(false);
                });
        } else {
            setLoadingProfile(false);
        }
    }, []);

    const handleUpdateClick = async () => {
        setIsUpdating(true);
        // Step 1: Request update url from UsNow backend
        try {
            const res = await fetch('http://localhost:8000/api/request-update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-UsNow-API-Key': 'sb_test_67890'
                },
                body: JSON.stringify({
                    company_id: "safebank-uuid-123456",
                    fields: ["name", "email", "phone"]
                })
            });
            const data = await res.json();

            // Extract token from update_url
            const token = data.update_url.split('/').pop();
            // Store token so company can retrieve data later
            localStorage.setItem('usnow_session_token', token);

            // Step 2: Redirect user to UsNow secure update page
            window.location.href = data.update_url;
        } catch (err) {
            alert("Failed to connect to UsNow_Node_01");
            setIsUpdating(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-inter bg-grid relative flex flex-col">

            {/* Mock Header */}
            <header className="bg-background/80 border-b border-white/5 backdrop-blur-xl px-4 sm:px-12 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-cyan-600 rounded flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(8,145,178,0.4)]">S</div>
                    <div>
                        <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-none uppercase font-outfit">SafeBank <span className="text-cyan-500 font-medium">// Core_Client</span></h1>
                        <p className="font-mono text-[0.5rem] sm:text-[0.55rem] text-secondary tracking-widest uppercase mt-1">SESSION_STABLE: 0xA4F29...7E</p>
                    </div>
                </div>
                <div className="flex gap-4 w-full sm:w-auto justify-center">
                    <Link href="/" className="font-mono text-[0.6rem] text-secondary border border-white/5 no-underline py-2 px-4 rounded hover:bg-white/5 transition-colors uppercase tracking-widest whitespace-nowrap">EXIT_PORTAL</Link>
                </div>
            </header>

            <main className="container-custom flex-1 py-16 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Security Info Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
                            <h3 className="font-mono text-[0.6rem] font-bold text-cyan-500 uppercase tracking-widest mb-6 px-1">VAULT_RESERVES</h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="font-mono text-[0.6rem] text-secondary uppercase tracking-widest mb-1">Checking_Node_01</p>
                                    <p className="text-3xl font-bold text-white tracking-tighter">$24,500.00</p>
                                </div>
                                <div className="pt-6 border-t border-white/5">
                                    <p className="font-mono text-[0.6rem] text-secondary uppercase tracking-widest mb-1">Secure_Escrow_Savings</p>
                                    <p className="text-2xl font-bold text-cyan-100/70 tracking-tighter cursor-not-allowed filter blur-[2px] transition-all hover:blur-none">$102,150.32</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-cyan-950 to-indigo-950 p-8 rounded-3xl text-white border border-white/10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/10 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>
                            <h4 className="font-outfit font-bold flex items-center gap-3 mb-4 uppercase tracking-tight">
                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,1)]"></span>
                                Infrastructure_Sync
                            </h4>
                            <p className="text-cyan-200/50 text-xs leading-loose font-mono uppercase tracking-widest">
                                NODE_LINK: <span className="text-white font-bold">UsNow_ENABLED</span> //
                                ENCRYPTION: ACTIVE //
                                IDENTITY_HODE: VERIFIED
                            </p>
                        </div>
                    </div>

                    {/* Dashboard Main */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/[0.03] p-6 sm:p-12 rounded-3xl border border-white/10 backdrop-blur-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

                            <div className="mb-12">
                                <h2 className="text-2xl sm:text-4xl text-white font-outfit font-bold tracking-tight uppercase">Terminal_Config</h2>
                                <p className="text-secondary font-mono text-[0.6rem] sm:text-[0.65rem] tracking-[0.2em] mt-3 uppercase">Manage system identifiers and contact endpoints.</p>
                            </div>

                            <div className="bg-white/5 p-6 sm:p-10 rounded-2xl border border-white/10 mb-10 group transition-all hover:border-cyan-500/30">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                                    <div className="max-w-sm text-center md:text-left">
                                        <h4 className="text-lg font-bold text-white mb-2 uppercase font-outfit">Verified_Identity_Link</h4>
                                        <p className="text-sm text-secondary leading-relaxed font-light">System metadata including Full Name, Contact Email, and Cellular Link monitored by UsNow.</p>
                                    </div>
                                    <button
                                        onClick={handleUpdateClick}
                                        disabled={isUpdating}
                                        className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold py-4 sm:py-5 px-6 sm:px-10 rounded-xl shadow-[0_0_30px_rgba(8,145,178,0.3)] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 tracking-tighter text-sm uppercase"
                                    >
                                        {isUpdating ? 'INITIALIZING_BRIDGE...' : 'RUN_USNOW_SYNC'}
                                        <svg className={`${isUpdating ? 'animate-spin' : 'motion-safe:group-hover:translate-x-1'} transition-transform`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 11l5 5 5-5M7 7l5 5 5-5" /></svg>
                                    </button>
                                </div>
                            </div>


                            {/* Profile Data Section */}
                            <div className="mt-10">
                                <div className="flex justify-between items-center mb-6 px-1">
                                    <h3 className="font-mono text-[0.7rem] font-bold text-cyan-500 uppercase tracking-widest">CURRENT_PROFILE_DATA</h3>
                                    {profileData && (
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="font-mono text-[0.6rem] text-cyan-400 hover:text-cyan-300 border border-cyan-800 hover:border-cyan-600 px-3 py-1 rounded transition-all uppercase tracking-widest flex items-center gap-2"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                            </svg>
                                            REFRESH
                                        </button>
                                    )}
                                </div>

                                {loadingProfile ? (
                                    <div className="text-center py-10">
                                        <p className="font-mono text-primary text-xs tracking-[0.5em] animate-pulse uppercase">LOADING_RECORDS...</p>
                                    </div>
                                ) : profileData ? (
                                    <div className="space-y-6 px-6">
                                        {profileData.name && (
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/5 pb-6">
                                                <span className="font-mono text-[0.65rem] text-secondary tracking-widest uppercase mb-2 sm:mb-0">Full_Name</span>
                                                <span className="font-mono text-lg text-white font-bold tracking-tight">{profileData.name}</span>
                                            </div>
                                        )}

                                        {profileData.email && (
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/5 pb-6">
                                                <span className="font-mono text-[0.65rem] text-secondary tracking-widest uppercase mb-2 sm:mb-0">Email_Address</span>
                                                <span className="font-mono text-sm text-cyan-400 font-bold tracking-tight">{profileData.email}</span>
                                            </div>
                                        )}

                                        {profileData.phone && (
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/5 pb-6">
                                                <span className="font-mono text-[0.65rem] text-secondary tracking-widest uppercase mb-2 sm:mb-0">Phone_Number</span>
                                                <span className="font-mono text-sm text-white font-bold tracking-tight">{profileData.phone}</span>
                                            </div>
                                        )}

                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                            <span className="font-mono text-[0.65rem] text-secondary tracking-widest uppercase mb-2 sm:mb-0">Data_Source</span>
                                            <span className="font-mono text-[0.6rem] bg-cyan-900/50 text-cyan-400 border border-cyan-800 px-3 py-1 rounded font-bold tracking-widest">USNOW_VERIFIED</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-10 px-6">
                                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                                            <p className="text-secondary font-mono text-xs uppercase tracking-widest mb-4">NO_PROFILE_DATA_AVAILABLE</p>
                                            <p className="text-white/50 text-xs leading-relaxed">
                                                Click "RUN_USNOW_SYNC" above to update your identity information via the secure UsNow protocol.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer Console decor */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 font-mono text-[0.5rem] tracking-[0.8em] text-white/5 pointer-events-none uppercase text-center w-full">
                SafeBank_Client_Portal_V4.2.0 // SYSTEM_STATUS: SECURE // HANDSHAKE: SUCCESS
            </div>
        </div>
    );
}
