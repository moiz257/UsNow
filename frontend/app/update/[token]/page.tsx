'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Notification from '../../../components/Notification';

export default function UpdatePage() {
    const params = useParams();
    const router = useRouter();
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [otpSent, setOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    useEffect(() => {
        fetch(`http://localhost:8000/api/session/${params.token}`)
            .then(res => res.json())
            .then(data => {
                setSession(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, [params.token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('usnow_token');

        if (!token) {
            localStorage.setItem('usnow_return_to', window.location.pathname);
            router.push('/login');
            return;
        }

        setIsSubmitting(true);

        if (!otpSent) {
            // Step 1: Request OTP
            try {
                const res = await fetch(`http://localhost:8000/api/confirm-update/${params.token}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ data: formData }),
                });

                if (res.status === 401) {
                    localStorage.removeItem('usnow_token');
                    localStorage.setItem('usnow_return_to', window.location.pathname);
                    router.push('/login');
                    return;
                }

                if (res.ok) {
                    setOtpSent(true);
                } else {
                    const error = await res.json();
                    setNotification({ message: error.detail || "Request_Failed: Error", type: 'error' });
                }
            } catch (err) {
                setNotification({ message: "Connection_Refused: UsNow Node Offline", type: 'error' });
            } finally {
                setIsSubmitting(false);
            }
        } else {
            // Step 2: Verify OTP
            try {
                const res = await fetch(`http://localhost:8000/api/verify-update-otp/${params.token}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ code: otpCode }),
                });

                if (res.ok) {
                    router.push('/mock-success');
                } else {
                    const error = await res.json();
                    setNotification({ message: error.detail || "Verification_Failed: Invalid OTP", type: 'error' });
                    setIsSubmitting(false);
                }
            } catch (err) {
                setNotification({ message: "Verification_Process_Abort: Error", type: 'error' });
                setIsSubmitting(false);
            }
        }
    };

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center font-mono text-primary text-xs tracking-[0.5em] animate-pulse">VERIFYING_TRUST_LINK...</div>;

    const handleResendOtp = async () => {
        setIsSubmitting(true);
        const token = localStorage.getItem('usnow_token');

        try {
            const res = await fetch(`http://localhost:8000/api/confirm-update/${params.token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ data: formData }),
            });

            if (res.ok) {
                setNotification({ message: "New OTP sent to your email!", type: 'info' });
            } else {
                setNotification({ message: "Failed to resend OTP", type: 'error' });
            }
        } catch (err) {
            setNotification({ message: "Network Error", type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center font-inter bg-grid relative p-6">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

            <div className="max-w-2xl w-full animate-fade-in relative z-10">
                <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>

                    {/* Header Bridge Visual */}
                    <div className="text-center mb-10">
                        <div className="flex justify-center items-center gap-4 sm:gap-10 mb-8">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
                                    <img src={session.company_logo} alt="Logo" className="w-full opacity-70" />
                                </div>
                                <span className="text-[0.45rem] sm:text-[0.5rem] font-mono text-secondary tracking-widest uppercase">Target</span>
                            </div>

                            <div className="flex-1 flex flex-col items-center gap-2 max-w-[100px] sm:max-w-[150px]">
                                <div className="w-full h-px bg-primary/30 relative">
                                    <div className="absolute top-0 h-px bg-primary w-1/3 animate-[scan_2s_infinite]"></div>
                                </div>
                                <span className="text-[0.4rem] sm:text-[0.45rem] font-mono text-primary font-bold uppercase tracking-tighter">SECURE_TUNNEL</span>
                            </div>

                            <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-xl border border-primary/40 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                                    <div className="w-4 h-4 bg-primary rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.4)]"></div>
                                </div>
                                <span className="text-[0.45rem] sm:text-[0.5rem] font-mono text-primary tracking-widest uppercase">UsNow</span>
                            </div>
                        </div>

                        <h2 className="text-2xl sm:text-3xl text-white font-outfit font-bold tracking-tight uppercase">
                            {otpSent ? 'Data_Verification' : 'Scoped_Transmission'}
                        </h2>
                        <p className="text-secondary mt-3 text-xs leading-relaxed max-w-sm mx-auto font-mono tracking-widest uppercase opacity-70 italic">
                            {otpSent
                                ? 'Transmission on hold. Enter verification code to finalize the ingress process.'
                                : `Target [${session.company_name}] requests access to the following identity nodes.`}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        {!otpSent ? (
                            <div className="space-y-8">
                                {session.fields.map((field: string) => (
                                    <div key={field}>
                                        <label className="block text-[0.6rem] font-mono font-bold text-primary uppercase tracking-[0.2em] mb-3 px-1">
                                            Payload: Requested_{field}
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            placeholder={`Input your ${field} record`}
                                            className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-xl px-5 text-white outline-none focus:border-primary transition-all font-mono text-sm"
                                            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-2">
                                <label className="block text-[0.6rem] font-mono font-bold text-primary uppercase tracking-[0.3em] mb-6 text-center">
                                    VERIFICATION_OTP_INPUT
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    className="w-full h-24 bg-white/[0.02] border-2 border-primary rounded-2xl outline-none text-4xl text-center font-mono font-bold text-white tracking-[0.5em] shadow-[inset_0_0_30px_rgba(99,102,241,0.1)]"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                />
                                <p className="text-center text-[0.5rem] font-mono text-white/30 mt-6 tracking-[0.3em] uppercase">Check your email for verification code</p>

                                <div className="text-center mt-4">
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        className="text-primary text-xs font-mono uppercase tracking-widest hover:text-white transition-colors disabled:opacity-50"
                                        disabled={isSubmitting}
                                    >
                                        [ RESEND_VERIFICATION_CODE ]
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 border-l-4 border-l-primary/50 group">
                            <p className="text-[0.7rem] text-secondary leading-relaxed font-mono uppercase tracking-widest group-hover:text-white transition-colors uppercase">
                                <strong className="text-primary tracking-tighter mr-2">PROTOCOL_NOTE:</strong> This transmission is ephemeral. UsNow will not store the raw payload after success.
                            </p>
                        </div>

                        <button
                            disabled={isSubmitting}
                            className="bg-primary hover:bg-primary-hover w-full h-16 text-white font-mono font-bold rounded-2xl shadow-[0_10px_40px_-5px_rgba(99,102,241,0.5)] transition-all active:scale-95 text-sm uppercase tracking-widest"
                        >
                            {isSubmitting ? 'PROCESSING_BITSTREAM...' : (otpSent ? 'TRANSMIT_DATA' : 'INITIALIZE_PAYLOAD')}
                        </button>
                    </form>

                    <p className="text-center text-[0.6rem] font-mono text-white/5 mt-10 tracking-[0.5em] uppercase">
                        Privacy_Bridge_Infrastructure // USNOW_GATEWAY_V1
                    </p>
                </div>
            </div>
        </div>
    );
}
