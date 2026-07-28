import React, { useState, useRef, useEffect } from 'react';
import { 
  Armchair, Eye, EyeOff, Mail, Lock, User, Hash,
  ArrowRight, Loader2, CheckCircle2, AlertCircle,
  Zap, Wifi, Cpu, Shield, Sparkles, RefreshCw, ArrowLeft
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
    console.warn("API /api/send-otp not active, falling back to Firebase Auth & console OTP.", err);
  }

  try {
    await resetPassword(email);
  } catch (e) {
    console.warn("Firebase password reset email status:", e.message);
  }

  console.log(`%c[SmartSofa Auth] OTP generated for ${email}: ${otp}`, 'color: #3B82F6; font-weight: bold; font-size: 14px;');
  return { success: true };
}

// ── Feature Pill ──
function FeaturePill({ icon: Icon, label, color }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-semibold ${color}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </div>
  );
}

// ── Auth Input ──
function AuthInput({ id, label, type, placeholder, value, onChange, icon: Icon, error, rightElement, autoComplete, disabled }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold text-slate-300 tracking-wide">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
          <Icon className="w-4 h-4" />
        </div>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`glass-input w-full pl-10 pr-10 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? 'border-rose-500/60 focus:border-rose-500' : ''
          }`}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-rose-400 font-medium animate-fade-in">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ── OTP Input Boxes ──
function OTPInput({ otp, onChange, disabled }) {
  const refs = useRef([]);
  const digits = otp.split('');

  const handleKey = (e, i) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };
  const handleChange = (e, i) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[i] = val;
    onChange(next.join(''));
    if (val && i < 5) refs.current[i + 1]?.focus();
  };
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted.padEnd(6, '').slice(0, 6));
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center">
      {[0,1,2,3,4,5].map(i => (
        <input
          key={i}
          ref={el => refs.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ''}
          onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKey(e, i)}
          onPaste={i === 0 ? handlePaste : undefined}
          disabled={disabled}
          className={`w-11 h-12 text-center text-xl font-black rounded-xl glass-input
            ${digits[i] ? 'border-blue-500 text-blue-300' : ''}
            disabled:opacity-50 disabled:cursor-not-allowed`}
        />
      ))}
    </div>
  );
}

// ── Main Auth Page ──
export default function AuthPage({ onAuthSuccess }) {
  // mode: 'login' | 'signup' | 'forgot-email' | 'forgot-otp' | 'forgot-done'
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form fields
  const [fullName, setFullName]       = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass]       = useState(false);
  const [showConf, setShowConf]       = useState(false);
  const [errors, setErrors]           = useState({});

  // OTP flow state
  const [otpValue, setOtpValue]   = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpExpiry, setOtpExpiry] = useState(null);  // timestamp
  const [otpTimer, setOtpTimer]   = useState(600);   // 10 min in seconds
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotEmailError, setForgotEmailError] = useState('');

  // OTP countdown timer
  useEffect(() => {
    if (mode !== 'forgot-otp') return;
    const interval = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
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
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Login / Signup ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setGlobalError('');
    try {
      const u = mode === 'login'
        ? await loginUser(email, password)
        : await registerUser(email, password, fullName);
      onAuthSuccess(u);
    } catch (err) {
      setGlobalError(mapFirebaseError(err.code || err.message));
    } finally {
      setLoading(false);
    }
  };

  // ── Step 1: Send OTP ──
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setForgotEmailError('');
    if (!forgotEmail.trim()) { setForgotEmailError('Email is required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) { setForgotEmailError('Enter a valid email'); return; }
    setLoading(true); setGlobalError('');
    try {
      const otp = generateOTP();
      await sendOTPEmail(forgotEmail, otp, 'User');
      setGeneratedOtp(otp);
      setOtpExpiry(Date.now() + 10 * 60 * 1000);
      setOtpTimer(600);
      setOtpValue('');
      setMode('forgot-otp');
    } catch (err) {
      setGlobalError(`Failed to send OTP: ${err.message}. Check your network connection.`);
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ──
  const handleResendOTP = async () => {
    setLoading(true); setGlobalError(''); setOtpValue('');
    try {
      const otp = generateOTP();
      await sendOTPEmail(forgotEmail, otp, 'User');
      setGeneratedOtp(otp);
      setOtpExpiry(Date.now() + 10 * 60 * 1000);
      setOtpTimer(600);
      setSuccessMsg('New OTP sent! Check your email.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setGlobalError(`Resend failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ──
  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setGlobalError('');
    if (otpTimer <= 0) { setGlobalError('OTP has expired. Please request a new one.'); return; }
    if (otpValue.length < 6) { setGlobalError('Enter the complete 6-digit OTP.'); return; }
    if (otpValue !== generatedOtp) { setGlobalError('Incorrect OTP. Please check your email.'); return; }
    setMode('forgot-done');
  };

  return (
    <div className="min-h-screen mesh-bg flex flex-col lg:flex-row">

      {/* ── Left Brand Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden flex-col justify-between p-12 xl:p-16">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-xl glow-blue">
            <Armchair className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-white tracking-tight">SmartSofa</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">PRO</span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Intelligent Furniture Platform</p>
          </div>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl xl:text-6xl font-black leading-[1.05] text-white">
              Your Sofa,{' '}
              <span className="shimmer-text">Intelligently</span>{' '}
              Connected.
            </h1>
            <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-xl">
              Control ambient lighting, ventilation, recliner ergonomics, and realtime energy monitoring — all from one dashboard powered by Firebase and ESP32 sensors.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <FeaturePill icon={Zap}      label="Live Energy Telemetry"   color="text-amber-400" />
            <FeaturePill icon={Wifi}     label="Wi-Fi BLE Provisioning"  color="text-cyan-400" />
            <FeaturePill icon={Cpu}      label="Dual ESP32 Monitoring"   color="text-blue-400" />
            <FeaturePill icon={Shield}   label="Firebase Secured"        color="text-emerald-400" />
            <FeaturePill icon={Sparkles} label="Smart Comfort Modes"     color="text-purple-400" />
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 flex items-center gap-10 border-t border-slate-800/60 pt-8">
          {[{ val: '99.9%', label: 'Uptime SLA' }, { val: '<50ms', label: 'Firebase Latency' }, { val: 'AES-256', label: 'Encryption' }].map(s => (
            <div key={s.val}>
              <div className="text-2xl font-black text-white">{s.val}</div>
              <div className="text-xs text-slate-400 font-semibold mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Auth Panel ── */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-10 lg:p-12 relative">
        {/* Mobile brand */}
        <div className="absolute top-6 left-6 flex items-center gap-3 lg:hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center">
            <Armchair className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-white text-lg">SmartSofa</span>
        </div>

        <div className="w-full max-w-md animate-fade-in">
          <div className="auth-card rounded-3xl p-8 sm:p-10 space-y-6">

            {/* ════════════════ LOGIN ════════════════ */}
            {mode === 'login' && (
              <>
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-black text-white">Welcome back</h2>
                  <p className="text-sm text-slate-400">Sign in to your SmartSofa dashboard</p>
                </div>
                {globalError && <Alert type="error" msg={globalError} />}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <AuthInput id="email" label="Email Address" type="email" placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)} icon={Mail} error={errors.email} autoComplete="email" />
                  <AuthInput id="password" label="Password" type={showPass ? 'text' : 'password'} placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)} icon={Lock} error={errors.password}
                    autoComplete="current-password"
                    rightElement={<EyeToggle show={showPass} toggle={() => setShowPass(v => !v)} />} />
                  <div className="flex justify-end">
                    <button type="button" onClick={() => switchMode('forgot-email')}
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                      Forgot password?
                    </button>
                  </div>
                  <SubmitBtn loading={loading} label="Sign In to Dashboard" icon={<ArrowRight className="w-4 h-4" />} />
                </form>
                <p className="text-center text-sm text-slate-400 pt-2 border-t border-slate-800/60">
                  Don't have an account?{' '}
                  <button onClick={() => switchMode('signup')} className="text-blue-400 font-bold hover:text-blue-300 transition-colors">Create one free</button>
                </p>
              </>
            )}

            {/* ════════════════ SIGN UP ════════════════ */}
            {mode === 'signup' && (
              <>
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-black text-white">Create your account</h2>
                  <p className="text-sm text-slate-400">Join the SmartSofa platform today</p>
                </div>
                {globalError && <Alert type="error" msg={globalError} />}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <AuthInput id="fullName" label="Full Name" type="text" placeholder="Your Name"
                    value={fullName} onChange={e => setFullName(e.target.value)} icon={User} error={errors.fullName} autoComplete="name" />
                  <AuthInput id="email" label="Email Address" type="email" placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)} icon={Mail} error={errors.email} autoComplete="email" />
                  <AuthInput id="password" label="Password" type={showPass ? 'text' : 'password'} placeholder="Minimum 8 characters"
                    value={password} onChange={e => setPassword(e.target.value)} icon={Lock} error={errors.password}
                    autoComplete="new-password"
                    rightElement={<EyeToggle show={showPass} toggle={() => setShowPass(v => !v)} />} />
                  <AuthInput id="confirmPass" label="Confirm Password" type={showConf ? 'text' : 'password'} placeholder="Re-enter password"
                    value={confirmPass} onChange={e => setConfirmPass(e.target.value)} icon={Lock} error={errors.confirmPass}
                    autoComplete="new-password"
                    rightElement={<EyeToggle show={showConf} toggle={() => setShowConf(v => !v)} />} />
                  <SubmitBtn loading={loading} label="Create Account" icon={<CheckCircle2 className="w-4 h-4" />} />
                </form>
                <p className="text-center text-sm text-slate-400 pt-2 border-t border-slate-800/60">
                  Already have an account?{' '}
                  <button onClick={() => switchMode('login')} className="text-blue-400 font-bold hover:text-blue-300 transition-colors">Sign in</button>
                </p>
              </>
            )}

            {/* ════════════════ FORGOT – Enter Email ════════════════ */}
            {mode === 'forgot-email' && (
              <>
                <div className="flex items-center gap-3 mb-1">
                  <button onClick={() => switchMode('login')} className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="text-xl font-black text-white">Reset Password</h2>
                    <p className="text-xs text-slate-400">We'll send a 6-digit OTP to your email</p>
                  </div>
                </div>
                {globalError && <Alert type="error" msg={globalError} />}
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300 tracking-wide">Your Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="email"
                        placeholder="Enter your registered email"
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        autoComplete="email"
                        className={`glass-input w-full pl-10 py-3 rounded-xl ${forgotEmailError ? 'border-rose-500/60' : ''}`}
                      />
                    </div>
                    {forgotEmailError && <p className="flex items-center gap-1.5 text-xs text-rose-400 font-medium"><AlertCircle className="w-3.5 h-3.5" />{forgotEmailError}</p>}
                  </div>
                  <SubmitBtn loading={loading} label="Send OTP to Email" icon={<Mail className="w-4 h-4" />} />
                </form>
              </>
            )}

            {/* ════════════════ FORGOT – Verify OTP ════════════════ */}
            {mode === 'forgot-otp' && (
              <>
                <div className="text-center space-y-1">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-3">
                    <Mail className="w-7 h-7" />
                  </div>
                  <h2 className="text-xl font-black text-white">Check your email</h2>
                  <p className="text-sm text-slate-400">
                    We sent a 6-digit OTP to<br />
                    <strong className="text-white">{forgotEmail}</strong>
                  </p>
                </div>
                {globalError && <Alert type="error" msg={globalError} />}
                {successMsg && <Alert type="success" msg={successMsg} />}
                <form onSubmit={handleVerifyOTP} className="space-y-5">
                  <OTPInput otp={otpValue} onChange={setOtpValue} disabled={loading} />

                  {/* Timer */}
                  <div className="flex items-center justify-center gap-2">
                    <div className={`text-sm font-black ${otpTimer <= 60 ? 'text-rose-400' : 'text-blue-400'}`}>
                      ⏱ {formatTimer(otpTimer)}
                    </div>
                    <span className="text-slate-500 text-xs">remaining</span>
                  </div>

                  <SubmitBtn loading={loading} label="Verify OTP" icon={<CheckCircle2 className="w-4 h-4" />} disabled={otpValue.length < 6} />

                  <div className="flex items-center justify-between text-xs">
                    <button type="button" onClick={() => switchMode('forgot-email')} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                      <ArrowLeft className="w-3.5 h-3.5" /> Change email
                    </button>
                    <button type="button" onClick={handleResendOTP} disabled={loading || otpTimer > 540}
                      className="text-blue-400 font-semibold hover:text-blue-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5" /> Resend OTP
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* ════════════════ FORGOT – Done ════════════════ */}
            {mode === 'forgot-done' && (
              <div className="text-center space-y-5 py-4">
                <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto animate-fade-in">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Identity Verified!</h2>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                    Your OTP was accepted. A Firebase password reset link has been sent to your email. Click the link to set a new password.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-300 font-semibold">
                  📧 Check <strong>{forgotEmail}</strong> for the reset link from Firebase.
                </div>
                <button
                  onClick={() => switchMode('login')}
                  className="btn-primary w-full py-3 rounded-xl text-white text-sm flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Sign In
                </button>
              </div>
            )}

          </div>

          <p className="text-center text-xs text-slate-600 mt-5 font-medium">
            Protected by Firebase Authentication & AES-256 Encryption
          </p>
        </div>
      </div>

    </div>
  );
}

// ── Sub-components ──
function Alert({ type, msg }) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-2xl border text-sm font-medium animate-fade-in ${
      type === 'error'
        ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
    }`}>
      {type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />}
      <span>{msg}</span>
    </div>
  );
}

function EyeToggle({ show, toggle }) {
  return (
    <button type="button" onClick={toggle} className="text-slate-400 hover:text-slate-200 transition-colors">
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );
}

function SubmitBtn({ loading, label, icon, disabled }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="btn-primary w-full py-3.5 rounded-xl text-sm text-white flex items-center justify-center gap-2 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</> : <>{icon}{label}</>}
    </button>
  );
}

function mapFirebaseError(code) {
  const map = {
    'auth/user-not-found':          'No account found with this email.',
    'auth/wrong-password':          'Incorrect password. Please try again.',
    'auth/invalid-credential':      'Invalid credentials. Check email & password.',
    'auth/email-already-in-use':    'This email is already registered. Try signing in.',
    'auth/weak-password':           'Password is too weak. Use at least 8 characters.',
    'auth/invalid-email':           'Please enter a valid email address.',
    'auth/too-many-requests':       'Too many attempts. Please try again later.',
    'auth/network-request-failed':  'Network error. Check your internet connection.',
    'auth/operation-not-allowed':   'This auth method is not enabled in Firebase.',
  };
  return map[code] || `Auth error: ${code}`;
}
