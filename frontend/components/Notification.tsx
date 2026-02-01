'use client';

import { useEffect, useState } from 'react';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
    message: string;
    type: NotificationType;
    onClose: () => void;
}

export default function Notification({ message, type, onClose }: NotificationProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for exit animation
        }, 4000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const colors = {
        success: 'border-cyan-500/50 bg-cyan-950/90 text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.2)]',
        error: 'border-red-500/50 bg-red-950/90 text-red-200 shadow-[0_0_30px_rgba(239,68,68,0.2)]',
        info: 'border-blue-500/50 bg-blue-950/90 text-blue-200 shadow-[0_0_30px_rgba(59,130,246,0.2)]'
    };

    const icons = {
        success: (
            <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        info: (
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    };

    return (
        <div className={`fixed top-6 right-6 z-50 transition-all duration-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <div className={`flex items-center gap-4 px-6 py-4 rounded-xl border backdrop-blur-xl ${colors[type]} min-w-[300px]`}>
                <div className="shrink-0">
                    {icons[type]}
                </div>
                <div className="flex-1">
                    <p className="font-mono text-xs font-bold uppercase tracking-widest">{type === 'error' ? 'SYSTEM_ERROR' : type === 'success' ? 'SUCCESS_LOG' : 'SYSTEM_INFO'}</p>
                    <p className="text-sm font-sans mt-1 opacity-90">{message}</p>
                </div>
                <button onClick={() => setIsVisible(false)} className="shrink-0 opacity-50 hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
