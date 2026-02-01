import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UsNow | Identity Infrastructure',
  description: 'The quiet protocol for verified identity updates. Securely transmit data between systems with zero leakage.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-inter bg-grid">

      {/* Infrastructure Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>

      {/* Navigation */}
      <nav className="px-4 md:px-16 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 bg-primary rounded shadow-[0_0_20px_rgba(99,102,241,0.5)] flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white/20 rounded-sm"></div>
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tighter uppercase font-outfit text-white whitespace-nowrap">UsNow <span className="text-primary font-mono text-xs opacity-50 ml-1">v1.0</span></h1>
        </div>
        <div className="flex gap-4 md:gap-8 items-center font-mono text-[10px] sm:text-xs tracking-widest text-secondary overflow-x-auto w-full sm:w-auto justify-center">
          <Link href="/mock-bank" className="hover:text-primary transition-colors no-underline whitespace-nowrap">NETWORK_DEMO</Link>
          <Link href="/profile" className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-3 sm:px-4 py-2 rounded transition-all no-underline whitespace-nowrap">MY_IDENTITY</Link>
        </div>
      </nav>

      <main className="container-custom relative z-10">

        {/* Schematic Hero */}
        <section className="pt-32 pb-24 text-center">
          <div className="animate-fade-in max-w-[1000px] mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-sm mb-8">
              <span className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full"></span>
              <span className="text-[0.7rem] font-mono font-bold text-primary uppercase tracking-[0.2em]">
                System_Status: Operational
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight md:leading-[1.05] text-white mb-8 tracking-tight font-outfit">
              Secure Protocol for <br className="hidden sm:block" />
              <span className="text-primary shadow-indigo-500/20">Data Ingress & Egress</span>
            </h2>

            <p className="text-lg md:text-xl text-secondary max-w-[750px] mx-auto mb-16 leading-relaxed font-light">
              UsNow is a zero-trust infrastructure layer that facilitates secure identity updates between users and companies.
              <span className="text-white"> We don't own data. We route it.</span>
            </p>

            {/* Visual Schematic Component */}
            <div className="relative max-w-4xl mx-auto mb-20 p-8 border border-border/50 bg-white/[0.02] rounded-3xl backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
              <div className="flex flex-col md:flex-row justify-between items-center gap-12 relative z-10 py-10">

                {/* User Node */}
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-2 border-primary/50 flex items-center justify-center bg-primary/10 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                    <span className="text-2xl italic">U</span>
                  </div>
                  <span className="font-mono text-[0.6rem] text-secondary tracking-widest uppercase">Verified_User</span>
                </div>

                {/* Bridge */}
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full h-px bg-gradient-to-r from-primary/0 via-primary to-primary/0 relative">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full animate-[ping_2s_infinite]"></div>
                  </div>
                  <div className="bg-primary/20 px-4 py-1 rounded-full border border-primary/30">
                    <span className="text-[0.6rem] font-mono text-primary font-bold tracking-tighter">UsNow_Secure_Tunnel</span>
                  </div>
                </div>

                {/* Partner Node */}
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl border-2 border-white/20 flex items-center justify-center bg-white/5">
                    <span className="text-2xl font-bold text-white/50">B</span>
                  </div>
                  <span className="font-mono text-[0.6rem] text-secondary tracking-widest uppercase">Target_Endpoint</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/mock-bank" className="btn-primary px-12 py-5 text-lg rounded-full no-underline shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:scale-105 active:scale-95">
                Initialize System Demo
              </Link>
              <Link href="/register" className="text-white border border-white/10 px-12 py-5 text-lg rounded-full no-underline font-medium hover:bg-white/5 transition-all">
                System Registration
              </Link>
            </div>
          </div>
        </section>

        {/* Infrastructure Specs */}
        <section className="py-24 border-t border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "AUTH_VERIFICATION", desc: "Dual-layer OTP and biological session matching for system entry.", icon: "01" },
              { label: "DATA_ENCRYPTION", desc: "Military-grade AES-256 field-level encryption at rest.", icon: "02" },
              { label: "AUDIT_TRANSPARENCY", desc: "Immutable cryptographic ledger of every data transmission.", icon: "03" },
              { label: "ZERO_TRUST_BRIDGE", desc: "Platform never stores raw data payloads beyond the session.", icon: "04" }
            ].map((spec, i) => (
              <div key={i} className="group p-8 border border-white/5 hover:border-primary/50 transition-all rounded-xl hover:bg-white/[0.02]">
                <div className="font-mono text-primary text-[0.7rem] font-bold mb-4 tracking-tighter opacity-50 group-hover:opacity-100">SPEC_{spec.icon}</div>
                <h3 className="text-white text-lg mb-4 font-outfit uppercase tracking-tight">{spec.label}</h3>
                <p className="text-secondary text-sm leading-relaxed">{spec.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Summary */}
        <section className="py-32 bg-white/[0.02] -mx-8 px-8 md:-mx-16 md:px-16 border-y border-border/50">
          <div className="max-w-4xl">
            <h4 className="text-primary font-mono text-sm mb-6 tracking-widest uppercase font-bold">Protocol_Statement</h4>
            <p className="text-3xl md:text-5xl font-outfit text-white/90 leading-tight mb-12">
              "UsNow is infrastructure. It earns trust by being <span className="text-primary italic">invisible</span>, precise, and conservative. We resolve the fragmentation of personal data."
            </p>
            <div className="flex gap-4">
              <div className="w-12 h-1 bg-primary"></div>
              <div className="w-12 h-1 bg-white/10"></div>
              <div className="w-12 h-1 bg-white/10"></div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer / Terminal Info */}
      <footer className="py-20 border-t border-border/50 mt-20">
        <div className="container-custom flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-5 h-5 bg-primary rounded-sm"></div>
              <span className="font-bold text-white uppercase tracking-tighter">UsNow Protocol</span>
            </div>
            <p className="text-secondary text-xs leading-loose font-mono uppercase tracking-wider">
              ESTABLISHED_2026 //
              REGION: GLOBAL_NODE //
              ENCRYPTION_STATUS: ACTIVE
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-20 w-full md:w-auto">
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[0.6rem] text-primary tracking-widest font-bold">RESOURCES</span>
              <Link href="/register" className="text-secondary text-xs no-underline hover:text-white transition-colors">ACCESS_REGISTRY</Link>
              <Link href="/login" className="text-secondary text-xs no-underline hover:text-white transition-colors">CLIENT_GATEWAY</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[0.6rem] text-primary tracking-widest font-bold">NETWORK</span>
              <Link href="/mock-bank" className="text-secondary text-xs no-underline hover:text-white transition-colors">PARTNER_PORTAL</Link>
              <Link href="/profile" className="text-secondary text-xs no-underline hover:text-white transition-colors">IDENTITY_HODE</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
