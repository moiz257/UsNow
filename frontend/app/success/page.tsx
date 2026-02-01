import Link from 'next/link';

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center font-inter bg-grid relative p-6">

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

            <div className="max-w-md w-full animate-fade-in relative z-10">
                <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-12 text-center backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

                    <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.2)] animate-pulse">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl text-white font-outfit font-bold tracking-tight uppercase mb-4">Transmission_Verified</h2>
                        <p className="font-mono text-[0.7rem] text-secondary tracking-widest leading-loose uppercase bg-emerald-500/[0.03] border border-emerald-500/10 p-4 rounded-xl">
                            PAYLOAD_STATUS: DELIVERED <br />
                            HANDSHAKE: COMPLETE <br />
                            BRIDGE_STATE: CLOSED
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Link href="/profile" className="bg-primary hover:bg-primary-hover text-white block w-full no-underline h-14 rounded-xl flex items-center justify-center font-mono font-bold text-sm tracking-widest shadow-[0_10px_30px_-5px_rgba(99,102,241,0.4)] transition-all active:scale-95">
                            ACCESS_AUDIT_LOGS
                        </Link>
                        <Link href="/mock-bank" className="block text-[0.6rem] font-mono text-secondary hover:text-white transition-colors no-underline uppercase tracking-[0.3em] py-4">
                            &lt;&lt; RETURN_TO_CLIENT_PORTAL
                        </Link>
                    </div>
                </div>

                <p className="text-center text-[0.5rem] font-mono text-white/5 mt-12 tracking-[0.8em] uppercase select-none">
                    Identity_Transmission_Protocol // Node_Success_Record
                </p>
            </div>
        </div>
    );
}
