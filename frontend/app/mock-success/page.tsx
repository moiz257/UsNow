'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function MockSuccess() {
    const searchParams = useSearchParams();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get session token from URL or localStorage
        const sessionToken = searchParams.get('session') || localStorage.getItem('usnow_session_token');
        
        if (sessionToken) {
            // Company fetches updated data from UsNow
            fetch(`http://localhost:8000/api/session-result/${sessionToken}`, {
                headers: {
                    'X-UsNow-API-Key': 'sb_test_67890'
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'completed') {
                    setUserData(data.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-background text-foreground font-inter bg-grid relative flex flex-col">
            
            {/* Mock Header */}
            <header className="bg-background/80 border-b border-white/5 backdrop-blur-xl px-4 sm:px-12 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-cyan-600 rounded flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(8,145,178,0.4)]">S</div>
                    <div>
                        <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-none uppercase font-outfit">SafeBank <span className="text-cyan-500 font-medium">// Core_Client</span></h1>
                        <p className="font-mono text-[0.5rem] sm:text-[0.55rem] text-secondary tracking-widest uppercase mt-1">DATA_SYNC: COMPLETE</p>
                    </div>
                </div>
                <div className="flex gap-4 w-full sm:w-auto justify-center">
                    <Link href="/mock-bank" className="font-mono text-[0.6rem] text-secondary border border-white/5 no-underline py-2 px-4 rounded hover:bg-white/5 transition-colors uppercase tracking-widest whitespace-nowrap">RETURN_DASHBOARD</Link>
                </div>
            </header>

            <main className="container-custom flex-1 py-16 relative z-10">
                <div className="max-w-3xl mx-auto">
                    
                    {/* Success Banner */}
                    <div className="bg-gradient-to-br from-cyan-950 to-indigo-950 p-8 sm:p-12 rounded-3xl border border-cyan-500/30 mb-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/20 blur-3xl rounded-full"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.6)]">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase font-outfit tracking-tight">Identity_Sync_Complete</h2>
                            </div>
                            <p className="text-cyan-200/70 text-sm leading-relaxed font-mono uppercase tracking-widest">
                                UsNow secure tunnel has successfully transmitted verified identity data to SafeBank systems.
                            </p>
                        </div>
                    </div>

                    {/* Updated Data Display */}
                    {loading ? (
                        <div className="bg-white/[0.02] p-12 rounded-3xl border border-white/10 text-center">
                            <p className="font-mono text-primary text-xs tracking-[0.5em] animate-pulse uppercase">FETCHING_PAYLOAD...</p>
                        </div>
                    ) : userData ? (
                        <div className="bg-white/[0.02] p-8 sm:p-12 rounded-3xl border border-white/10 backdrop-blur-sm">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                            
                            <h3 className="font-mono text-[0.7rem] font-bold text-cyan-500 uppercase tracking-widest mb-8 px-1">RECEIVED_DATA_NODES</h3>
                            
                            <div className="space-y-6">
                                {userData.name && (
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/5 pb-6">
                                        <span className="font-mono text-[0.65rem] text-secondary tracking-widest uppercase mb-2 sm:mb-0">Full_Name</span>
                                        <span className="font-mono text-lg text-white font-bold tracking-tight">{userData.name}</span>
                                    </div>
                                )}
                                
                                {userData.email && (
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/5 pb-6">
                                        <span className="font-mono text-[0.65rem] text-secondary tracking-widest uppercase mb-2 sm:mb-0">Email_Address</span>
                                        <span className="font-mono text-sm text-cyan-400 font-bold tracking-tight">{userData.email}</span>
                                    </div>
                                )}
                                
                                {userData.phone && (
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                        <span className="font-mono text-[0.65rem] text-secondary tracking-widest uppercase mb-2 sm:mb-0">Phone_Number</span>
                                        <span className="font-mono text-sm text-white font-bold tracking-tight">{userData.phone}</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-10 bg-cyan-950/30 p-6 rounded-2xl border border-cyan-800/30">
                                <p className="text-[0.7rem] text-cyan-200/50 leading-relaxed font-mono uppercase tracking-widest">
                                    <strong className="text-cyan-400 tracking-tighter mr-2">SECURITY_NOTE:</strong> 
                                    This data was transmitted via UsNow's zero-trust protocol. No intermediary storage occurred.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/[0.02] p-12 rounded-3xl border border-white/10 text-center">
                            <p className="text-secondary font-mono text-sm uppercase tracking-widest">No session data available</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            href="/mock-bank" 
                            className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold py-4 px-8 rounded-xl shadow-[0_0_30px_rgba(8,145,178,0.3)] transition-all no-underline text-center uppercase tracking-tighter text-sm"
                        >
                            Return_To_Dashboard
                        </Link>
                        <Link 
                            href="/" 
                            className="border border-white/10 hover:bg-white/5 text-white font-mono font-bold py-4 px-8 rounded-xl transition-all no-underline text-center uppercase tracking-tighter text-sm"
                        >
                            Exit_Portal
                        </Link>
                    </div>

                </div>
            </main>

            {/* Footer Console */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 font-mono text-[0.5rem] tracking-[0.8em] text-white/5 pointer-events-none uppercase text-center w-full">
                SafeBank_Identity_Sync_V1.0 // PROTOCOL: USNOW // STATUS: SUCCESS
            </div>
        </div>
    );
}
