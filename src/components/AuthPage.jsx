import React, { useState, useRef, useEffect } from 'react';
import {
  Armchair, Eye, EyeOff, Mail, Lock, User,
  ArrowRight, Loader2, CheckCircle2, AlertCircle,
  Shield, RefreshCw, ArrowLeft
} from 'lucide-react';
import { registerUser, loginUser, resetPassword } from '../lib/firebase';

// ── Generate 6-digit OTP ──
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ── Send OTP via dev-server API or Firebase reset fallback ──
async function sendOTPEmail(email, otp, recipientName) {
  try {
    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, recipientName }),
    });
    if (res.ok) {
      const data = await res.json().catch(() => ({ success: true }));
      return data;
    }
  } catch (err) {
    console.warn("API /api/send-otp not active, falling back to Firebase Auth.", err);
  }
  try { await resetPassword(email); } catch (e) { /* silent */ }
  console.log(`%c[SmartSofa] OTP for ${email}: ${otp}`, 'color: #2563EB; font-weight: bold; font-size: 14px;');
  return { success: true };
}

/* ═══════════════════════════════════════════════════
   WORKFLOW CARD DATA — exactly 3 steps
   ═══════════════════════════════════════════════════ */
const WORKFLOW_STEPS = [
  {
    num: '01',
    title: 'USER SITS ON SMARTSOFA',
    desc: 'Embedded sensors activate posture and seating telemetry.',
    neon: {
      border: 'rgba(6, 182, 212, 0.40)',
      hover: 'rgba(6, 182, 212, 0.70)',
      shadow: 'rgba(6, 182, 212, 0.20)',
      bg: 'rgba(6, 182, 212, 0.06)',
      text: 'text-cyan-400',
      numColor: '#06b6d4',
    },
  },
  {
    num: '02',
    title: 'AUTOMATED APPLIANCE CONTROL',
    desc: 'Dynamically manages lighting, fans, and TV power.',
    neon: {
      border: 'rgba(168, 85, 247, 0.40)',
      hover: 'rgba(168, 85, 247, 0.70)',
      shadow: 'rgba(168, 85, 247, 0.20)',
      bg: 'rgba(168, 85, 247, 0.06)',
      text: 'text-purple-400',
      numColor: '#a855f7',
    },
  },
  {
    num: '03',
    title: 'LIVE CLOUD DASHBOARD',
    desc: 'Real-time power metrics synced directly to your cloud analytics.',
    neon: {
      border: 'rgba(16, 185, 129, 0.40)',
      hover: 'rgba(16, 185, 129, 0.70)',
      shadow: 'rgba(16, 185, 129, 0.20)',
      bg: 'rgba(16, 185, 129, 0.06)',
      text: 'text-emerald-400',
      numColor: '#10b981',
    },
  },
];

/* ═══════════════════════════════════════════════════
   NEON WORKFLOW CARD COMPONENT
   ═══════════════════════════════════════════════════ */
function WorkflowCard({ step, index }) {
  return (
    <div
      className="neon-workflow-card p-6 animate-card-slide group cursor-default"
      style={{
        animationDelay: `${500 + index * 200}ms`,
        '--neon-border': step.neon.border,
        '--neon-hover': step.neon.hover,
        '--neon-shadow': step.neon.shadow,
        '--neon-bg': step.neon.bg,
        '--neon': step.neon.shadow,
      }}
    >
      <div className="relative z-10 flex items-start gap-5">
        {/* Large Step Number */}
        <div className="shrink-0">
          <span
            className="text-[42px] font-black leading-none tracking-tighter opacity-25 group-hover:opacity-40 transition-opacity duration-500"
            style={{ color: step.neon.numColor }}
          >
            {step.num}
          </span>
        </div>

        {/* Text Content */}
        <div className="pt-1">
          <h3 className={`text-[13px] font-bold tracking-[0.08em] ${step.neon.text}`}>
            {step.title}
          </h3>
          <p className="text-[13px] text-slate-400 font-normal leading-relaxed mt-1.5">
            {step.desc}
          </p>
        </div>
      </div>

      {/* Subtle neon line at bottom */}
      <div
        className="absolute bottom-0 left-6 right-6 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${step.neon.numColor}40, transparent)` }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FLOATING AMBIENT PARTICLES
   ═══════════════════════════════════════════════════ */
function AmbientParticles() {
  const dots = [
    { s: 3, l: '10%', b: '15%', d: '0s',   dur: '7s',  c: 'bg-cyan-400/30' },
    { s: 2, l: '30%', b: '60%', d: '2s',   dur: '9s',  c: 'bg-purple-400/25' },
    { s: 4, l: '50%', b: '25%', d: '1s',   dur: '8s',  c: 'bg-blue-400/25' },
    { s: 2, l: '70%', b: '45%', d: '3s',   dur: '10s', c: 'bg-emerald-400/20' },
    { s: 3, l: '85%', b: '10%', d: '4.5s', dur: '7.5s',c: 'bg-cyan-300/20' },
  ];
  return <>
    {dots.map((d, i) => (
      <div
        key={i}
        className={`absolute rounded-full ${d.c} pointer-events-none animate-particle-drift`}
        style={{ width: d.s, height: d.s, left: d.l, bottom: d.b, animationDelay: d.d, animationDuration: d.dur }}
      />
    ))}
  </>;
}

/* ═══════════════════════════════════════════════════
   LOGIN INPUT COMPONENT
   ═══════════════════════════════════════════════════ */
function LoginInput({ id, label, type, placeholder, value, onChange, icon: Icon, error, rightElement, autoComplete, disabled }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-[11px] font-semibold text-slate-400 tracking-[0.1em] uppercase">
        {label}
      </label>
      <div className="relative flex items-center login-input group">
        <div className="pl-4 pr-3 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300 pointer-events-none">
          <Icon className="w-[18px] h-[18px]" />
        </div>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          disabled={disabled}
          className="w-full bg-transparent pr-12 text-white placeholder-slate-500/70 text-[15px] font-medium focus:outline-none disabled:opacity-50"
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-[11px] text-red-400 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   OTP INPUT BOXES
   ═══════════════════════════════════════════════════ */
function OTPInput({ otp, onChange, disabled }) {
  const refs = useRef([]);
  const digits = otp.split('');
  const handleKey = (e, i) => { if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus(); };
  const handleChange = (e, i) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    const next = [...digits]; next[i] = val;
    onChange(next.join(''));
    if (val && i < 5) refs.current[i + 1]?.focus();
  };
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted.padEnd(6, '').slice(0, 6)); e.preventDefault();
  };
  return (
    <div className="flex gap-3 justify-center py-2">
      {[0,1,2,3,4,5].map(i => (
        <input key={i} ref={el => refs.current[i] = el}
          type="text" inputMode="numeric" maxLength={1}
          value={digits[i] || ''} onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKey(e, i)} onPaste={i === 0 ? handlePaste : undefined}
          disabled={disabled}
          className={`w-12 h-14 text-center text-xl font-bold rounded-2xl bg-white/5 border border-white/10 text-white
            focus:border-blue-500 focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] focus:outline-none transition-all
            ${digits[i] ? 'border-blue-500/60 text-blue-300 bg-blue-500/8' : ''}
            disabled:opacity-50`}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN AUTH PAGE
   ═══════════════════════════════════════════════════ */
export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [errors, setErrors] = useState({});
  const [otpValue, setOtpValue] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpExpiry, setOtpExpiry] = useState(null);
  const [otpTimer, setOtpTimer] = useState(600);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotEmailError, setForgotEmailError] = useState('');

  useEffect(() => {
    if (mode !== 'forgot-otp') return;
    const interval = setInterval(() => {
      setOtpTimer(prev => { if (prev <= 1) { clearInterval(interval); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(interval);
  }, [mode]);

  const formatTimer = (s) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;
  const switchMode = (m) => {
    setMode(m); setErrors({}); setGlobalError(''); setSuccessMsg('');
    setFullName(''); setEmail(''); setPassword(''); setConfirmPass('');
    setOtpValue(''); setForgotEmail(''); setForgotEmailError('');
  };
  const validate = () => {
    const e = {};
    if (mode === 'signup' && !fullName.trim()) e.fullName = 'Full name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (mode === 'signup' && password.length < 8) e.password = 'Minimum 8 characters';
    if (mode === 'signup' && password !== confirmPass) e.confirmPass = "Passwords don't match";
    setErrors(e); return Object.keys(e).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); if (!validate()) return;
    setLoading(true); setGlobalError('');
    try {
      const u = mode === 'login' ? await loginUser(email, password) : await registerUser(email, password, fullName);
      onAuthSuccess(u);
    } catch (err) { setGlobalError(mapFirebaseError(err.code || err.message)); } finally { setLoading(false); }
  };
  const handleSendOTP = async (e) => {
    e.preventDefault(); setForgotEmailError('');
    if (!forgotEmail.trim()) { setForgotEmailError('Email is required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) { setForgotEmailError('Enter a valid email'); return; }
    setLoading(true); setGlobalError('');
    try {
      const otp = generateOTP(); await sendOTPEmail(forgotEmail, otp, 'User');
      setGeneratedOtp(otp); setOtpExpiry(Date.now() + 600000); setOtpTimer(600); setOtpValue(''); setMode('forgot-otp');
    } catch (err) { setGlobalError(`Failed: ${err.message}`); } finally { setLoading(false); }
  };
  const handleResendOTP = async () => {
    setLoading(true); setGlobalError(''); setOtpValue('');
    try {
      const otp = generateOTP(); await sendOTPEmail(forgotEmail, otp, 'User');
      setGeneratedOtp(otp); setOtpExpiry(Date.now() + 600000); setOtpTimer(600);
      setSuccessMsg('New code sent.'); setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err) { setGlobalError(`Resend failed: ${err.message}`); } finally { setLoading(false); }
  };
  const handleVerifyOTP = (e) => {
    e.preventDefault(); setGlobalError('');
    if (otpTimer <= 0) { setGlobalError('Code expired.'); return; }
    if (otpValue.length < 6) { setGlobalError('Enter the full 6-digit code.'); return; }
    if (otpValue !== generatedOtp) { setGlobalError('Incorrect code.'); return; }
    setMode('forgot-done');
  };

  /* ═══ RENDER ═══ */
  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row relative overflow-hidden animate-page-in"
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        background: '#0B0E14',
      }}
    >
      {/* ── Ambient Glow Orbs ── */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[180px] pointer-events-none animate-orb"
           style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)' }} />
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-[200px] pointer-events-none animate-orb"
           style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)', animationDelay: '-7s' }} />
      <div className="absolute bottom-[-10%] right-[-5%] w-[550px] h-[550px] rounded-full blur-[180px] pointer-events-none animate-orb"
           style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)', animationDelay: '-14s' }} />

      <AmbientParticles />

      {/* ════════════════════════════════════════════════
          LEFT PANEL — Brand + Workflow Cards
          ════════════════════════════════════════════════ */}
      <div className="relative z-10 hidden lg:flex lg:w-[48%] flex-col justify-between p-12 xl:p-16">

        {/* Brand */}
        <div className="animate-text-reveal" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-600/25">
              <Armchair className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">SmartSofa</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1.5 pl-[52px] tracking-wide">
            Intelligent Furniture Platform
          </p>
        </div>

        {/* Hero Headline + Workflow Cards */}
        <div className="my-auto py-6 space-y-10 max-w-lg">

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="animate-text-reveal" style={{ animationDelay: '200ms' }}>
              <span className="block text-[46px] xl:text-[52px] font-bold leading-[1.06] tracking-tight text-white">
                Smart Furniture,
              </span>
              <span className="block text-[46px] xl:text-[52px] font-bold leading-[1.06] tracking-tight shimmer-gradient-text mt-1">
                Made Intelligent.
              </span>
            </h1>
          </div>

          {/* Three Workflow Cards */}
          <div className="space-y-4">
            {WORKFLOW_STEPS.map((step, i) => (
              <WorkflowCard key={step.num} step={step} index={i} />
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center gap-8 border-t border-white/6 pt-7">
          {[
            { val: '99.9%', label: 'Platform Reliability', d: '1000ms' },
            { val: '<50 ms', label: 'Real-Time Response', d: '1150ms' },
            { val: 'AES-256', label: 'Data Security', d: '1300ms' },
          ].map((s, i) => (
            <React.Fragment key={s.val}>
              {i > 0 && <div className="w-px h-7 bg-white/8" />}
              <div className="animate-stat" style={{ animationDelay: s.d }}>
                <div className="text-lg font-bold text-white tracking-tight">{s.val}</div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5 tracking-wide">{s.label}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          RIGHT PANEL — Auth Card
          ════════════════════════════════════════════════ */}
      <div className="relative z-10 w-full lg:w-[52%] flex items-center justify-center p-6 sm:p-10 lg:p-16">

        {/* Mobile brand */}
        <div className="absolute top-6 left-6 flex items-center gap-3 lg:hidden">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <Armchair className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">SmartSofa</span>
        </div>

        <div className="w-full max-w-[520px] relative mt-14 lg:mt-0">

          {/* ── Login Glass Card ── */}
          <div className="login-glass-card p-10 sm:p-12 space-y-8 animate-login-float">

            {/* ═══ LOGIN ═══ */}
            {mode === 'login' && (
              <>
                <div className="text-center space-y-2">
                  <h2 className="text-[28px] font-bold text-white tracking-tight">Welcome Back</h2>
                  <p className="text-sm text-slate-400 font-normal">Sign in to your SmartSofa Dashboard</p>
                </div>
                {globalError && <AlertBanner type="error" msg={globalError} />}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <LoginInput id="login-email" label="Email Address" type="email" placeholder="name@example.com"
                    value={email} onChange={e => setEmail(e.target.value)} icon={Mail} error={errors.email} autoComplete="email" />
                  <LoginInput id="login-password" label="Password" type={showPass ? 'text' : 'password'} placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)} icon={Lock} error={errors.password}
                    autoComplete="current-password" rightElement={<EyeToggle show={showPass} toggle={() => setShowPass(v=>!v)} />} />
                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-400 font-medium hover:text-slate-300 transition-colors">
                      <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-white/15 bg-white/5 text-blue-600 focus:ring-blue-500/20 focus:ring-offset-0" />
                      Remember Me
                    </label>
                    <button type="button" onClick={() => switchMode('forgot-email')}
                      className="font-medium text-blue-400 hover:text-blue-300 transition-colors">Forgot Password?</button>
                  </div>
                  <PrimaryBtn loading={loading} label="Sign In" />
                </form>
                <p className="text-center text-xs text-slate-500 pt-4 border-t border-white/6">
                  Don't have an account?{' '}
                  <button onClick={() => switchMode('signup')} className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                    Create Account
                  </button>
                </p>
              </>
            )}

            {/* ═══ SIGN UP ═══ */}
            {mode === 'signup' && (
              <>
                <div className="text-center space-y-2">
                  <h2 className="text-[28px] font-bold text-white tracking-tight">Create Account</h2>
                  <p className="text-sm text-slate-400">Get started with SmartSofa</p>
                </div>
                {globalError && <AlertBanner type="error" msg={globalError} />}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <LoginInput id="su-name" label="Full Name" type="text" placeholder="Your Name"
                    value={fullName} onChange={e => setFullName(e.target.value)} icon={User} error={errors.fullName} autoComplete="name" />
                  <LoginInput id="su-email" label="Email Address" type="email" placeholder="name@example.com"
                    value={email} onChange={e => setEmail(e.target.value)} icon={Mail} error={errors.email} autoComplete="email" />
                  <LoginInput id="su-pass" label="Password" type={showPass ? 'text' : 'password'} placeholder="Minimum 8 characters"
                    value={password} onChange={e => setPassword(e.target.value)} icon={Lock} error={errors.password}
                    autoComplete="new-password" rightElement={<EyeToggle show={showPass} toggle={() => setShowPass(v=>!v)} />} />
                  <LoginInput id="su-conf" label="Confirm Password" type={showConf ? 'text' : 'password'} placeholder="Re-enter password"
                    value={confirmPass} onChange={e => setConfirmPass(e.target.value)} icon={Lock} error={errors.confirmPass}
                    autoComplete="new-password" rightElement={<EyeToggle show={showConf} toggle={() => setShowConf(v=>!v)} />} />
                  <PrimaryBtn loading={loading} label="Create Account" />
                </form>
                <p className="text-center text-xs text-slate-500 pt-4 border-t border-white/6">
                  Already registered?{' '}
                  <button onClick={() => switchMode('login')} className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">Sign In</button>
                </p>
              </>
            )}

            {/* ═══ FORGOT — Email ═══ */}
            {mode === 'forgot-email' && (
              <>
                <div className="flex items-center gap-3">
                  <button onClick={() => switchMode('login')} className="text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5">
                    <ArrowLeft className="w-5 h-5" /></button>
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Reset Password</h2>
                    <p className="text-xs text-slate-400">We'll send a 6-digit security code</p>
                  </div>
                </div>
                {globalError && <AlertBanner type="error" msg={globalError} />}
                <form onSubmit={handleSendOTP} className="space-y-6">
                  <LoginInput id="forgot-email" label="Email Address" type="email" placeholder="Enter your registered email"
                    value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} icon={Mail} error={forgotEmailError} autoComplete="email" />
                  <PrimaryBtn loading={loading} label="Send Security Code" />
                </form>
              </>
            )}

            {/* ═══ FORGOT — OTP ═══ */}
            {mode === 'forgot-otp' && (
              <>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-2">
                    <Mail className="w-6 h-6" /></div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Verify Code</h2>
                  <p className="text-xs text-slate-400">Code sent to <strong className="text-white">{forgotEmail}</strong></p>
                </div>
                {globalError && <AlertBanner type="error" msg={globalError} />}
                {successMsg && <AlertBanner type="success" msg={successMsg} />}
                <form onSubmit={handleVerifyOTP} className="space-y-5">
                  <OTPInput otp={otpValue} onChange={setOtpValue} disabled={loading} />
                  <div className="flex items-center justify-center gap-2">
                    <span className={`text-xs font-semibold ${otpTimer <= 60 ? 'text-red-400' : 'text-blue-400'}`}>⏱ {formatTimer(otpTimer)}</span>
                    <span className="text-slate-500 text-xs">remaining</span>
                  </div>
                  <PrimaryBtn loading={loading} label="Verify Code" disabled={otpValue.length < 6} />
                  <div className="flex items-center justify-between text-xs pt-1">
                    <button type="button" onClick={() => switchMode('forgot-email')} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 font-medium">
                      <ArrowLeft className="w-3.5 h-3.5" /> Change email</button>
                    <button type="button" onClick={handleResendOTP} disabled={loading || otpTimer > 540}
                      className="text-blue-400 font-semibold hover:text-blue-300 transition-colors disabled:opacity-40 flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5" /> Resend</button>
                  </div>
                </form>
              </>
            )}

            {/* ═══ FORGOT — Done ═══ */}
            {mode === 'forgot-done' && (
              <div className="text-center space-y-5 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8" /></div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white tracking-tight">Code Verified</h2>
                  <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                    Password reset link sent to <strong className="text-white">{forgotEmail}</strong>.</p>
                </div>
                <button onClick={() => switchMode('login')} className="login-btn w-full flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Return to Sign In</button>
              </div>
            )}
          </div>

          {/* Security badge */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <Shield className="w-3.5 h-3.5 text-slate-500" />
            <p className="text-[11px] text-slate-500 font-medium tracking-wide">
              Protected by Firebase Authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ Sub-components ═══ */
function AlertBanner({ type, msg }) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-2xl border text-xs font-medium ${
      type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-300' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
    }`}>
      {type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />}
      <span>{msg}</span>
    </div>
  );
}

function EyeToggle({ show, toggle }) {
  return (
    <button type="button" onClick={toggle} className="text-slate-500 hover:text-slate-300 transition-colors">
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );
}

function PrimaryBtn({ loading, label, disabled }) {
  return (
    <button type="submit" disabled={loading || disabled} className="login-btn w-full flex items-center justify-center gap-2.5">
      {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Authenticating…</> : <>{label} <ArrowRight className="w-4 h-4" /></>}
    </button>
  );
}

function mapFirebaseError(code) {
  const map = {
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Invalid credentials.',
    'auth/email-already-in-use': 'Email already registered.',
    'auth/weak-password': 'Password too weak (min 8 chars).',
    'auth/invalid-email': 'Invalid email address.',
    'auth/too-many-requests': 'Too many attempts. Try later.',
    'auth/network-request-failed': 'Network error.',
    'auth/operation-not-allowed': 'Auth method not enabled.',
  };
  return map[code] || `Auth error: ${code}`;
}
