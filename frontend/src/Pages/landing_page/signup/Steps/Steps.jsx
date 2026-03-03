import React from "react";
import { ClipboardList, ShieldCheck, Rocket, ArrowRight } from "lucide-react";

const steps = [
    {
        number: '01',
        icon: ClipboardList,
        title: 'Enter your details',
        desc: 'Fill in your personal info — name, email, PAN, and Aadhaar. Takes less than 5 minutes.',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10 border-blue-500/25',
        glow: 'shadow-blue-500/20',
        connector: 'from-blue-500/40 to-purple-500/40',
    },
    {
        number: '02',
        icon: ShieldCheck,
        title: 'e-Sign & verification',
        desc: 'Verify your identity with Aadhaar OTP and complete the DigiLocker e-sign in seconds.',
        color: 'text-purple-400',
        bg: 'bg-purple-500/10 border-purple-500/25',
        glow: 'shadow-purple-500/20',
        connector: 'from-purple-500/40 to-emerald-500/40',
    },
    {
        number: '03',
        icon: Rocket,
        title: 'Start investing!',
        desc: 'Your account is activated. Add funds and start trading stocks, mutual funds & more.',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/25',
        glow: 'shadow-emerald-500/20',
        connector: null,
    },
];

function Steps() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-5xl transition-colors duration-300">

            {/* Section header */}
            <div className="text-center mb-14">
                <h2 className="text-3xl md:text-[36px] font-bold text-[var(--text-primary)] tracking-tight leading-tight transition-colors duration-300">
                    Open your account in{' '}
                    <span className="bg-gradient-to-r from-[var(--accent-primary)] to-purple-400 bg-clip-text text-transparent">
                        3 simple steps
                    </span>
                </h2>
                <p className="text-[var(--text-muted)] text-[15px] mt-3">
                    With MoneyDock — completely online, 100% paperless
                </p>
            </div>

            {/* Steps — horizontal on desktop, vertical on mobile */}
            <div className="flex flex-col md:flex-row items-start justify-center gap-0 md:gap-0">
                {steps.map((step, i) => (
                    <React.Fragment key={i}>
                        {/* Step Card */}
                        <div className="flex flex-col items-center text-center w-full md:w-1/3 px-4 group">
                            {/* Number badge + icon */}
                            <div className="relative mb-5">
                                <div className={`w-20 h-20 rounded-2xl border flex items-center justify-center shadow-lg ${step.bg} ${step.glow} group-hover:scale-110 transition-transform duration-200`}>
                                    <step.icon size={32} className={step.color} />
                                </div>
                                <span className={`absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center border ${step.bg} ${step.color}`}>
                                    {i + 1}
                                </span>
                            </div>

                            {/* Text */}
                            <h3 className={`text-[17px] font-bold mb-2 ${step.color}`}>{step.title}</h3>
                            <p className="text-[13.5px] text-[var(--text-muted)] leading-relaxed max-w-[200px]">{step.desc}</p>
                        </div>

                        {/* Connector arrow between steps */}
                        {step.connector && (
                            <div className="hidden md:flex items-center self-center mb-12 flex-shrink-0">
                                <div className={`h-px w-10 bg-gradient-to-r ${step.connector}`} />
                                <ArrowRight size={16} className="text-[var(--text-muted)] -ml-1" />
                            </div>
                        )}

                        {/* Mobile vertical connector */}
                        {step.connector && (
                            <div className="md:hidden flex flex-col items-center my-1">
                                <div className={`w-px h-8 bg-gradient-to-b ${step.connector}`} />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* CTA note */}
            <p className="text-center text-[13px] text-[var(--text-muted)] mt-10">
                ✅ Zero fees · 100% online · Instant activation once verified
            </p>
        </div>
    );
}

export default Steps;
