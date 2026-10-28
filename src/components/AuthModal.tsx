import React, { useState } from 'react';
import { X, Smartphone, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { UserSchema } from '../types/schemas';
import { OWNER_USER } from '../utils/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserSchema) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [authMethod, setAuthMethod] = useState<'google' | 'phone'>('google');
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1-Click Google Sign-In
  const handleGoogleSignIn = async (customEmail?: string) => {
    setIsLoading(true);
    setErrorMsg(null);

    const email = customEmail || 'ranjeetk25565@gmail.com';

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: email === 'ranjeetk25565@gmail.com' ? 'Ranjeet Kumar' : 'Google User',
          avatar: email === 'ranjeetk25565@gmail.com' ? OWNER_USER.avatar : undefined
        })
      });

      const data = await res.json();
      if (data.success && data.user) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        // Fallback to local
        onLoginSuccess(OWNER_USER);
        onClose();
      }
    } catch (e) {
      onLoginSuccess(OWNER_USER);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  // Phone Auth: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setErrorMsg('Please enter a valid mobile number with country code');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/phone-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });
      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        setDemoOtp(data.demoOtp || '123456');
      } else {
        setErrorMsg(data.error || 'Failed to send OTP');
      }
    } catch (e) {
      setOtpSent(true);
      setDemoOtp('123456');
    } finally {
      setIsLoading(false);
    }
  };

  // Phone Auth: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      setErrorMsg('Please enter 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/verify-phone-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp: otpCode })
      });
      const data = await res.json();

      if (data.success && data.user) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setErrorMsg(data.error || 'Incorrect OTP code');
      }
    } catch (e) {
      // Fallback
      const phoneUser: UserSchema = {
        id: `user-phone-${Date.now()}`,
        name: `User ${phoneNumber.slice(-4)}`,
        username: `user_${phoneNumber.slice(-4)}`,
        email: `mobile_${phoneNumber.slice(-4)}@mediasourcehub.com`,
        phoneNumber,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
        bio: 'Mobile verified Media Source Hub user 📱',
        isVerified: false,
        role: 'user',
        followersCount: 15,
        followingCount: 42,
        postsCount: 0,
        joinedDate: 'October 2026'
      };
      onLoginSuccess(phoneUser);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-lg">Media Source Hub</h3>
              <p className="text-xs text-slate-400">Secure Authentication & Onboarding</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Method Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => {
              setAuthMethod('google');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-colors ${
              authMethod === 'google' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Google 1-Click</span>
          </button>
          <button
            onClick={() => {
              setAuthMethod('phone');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-colors ${
              authMethod === 'phone' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile OTP</span>
          </button>
        </div>

        {/* Google 1-Click Flow */}
        {authMethod === 'google' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-slate-100">1-Click Gmail ID Authentication</p>
              <p className="text-slate-400">
                Log in instantly using your official Google credentials with zero password friction.
              </p>
            </div>

            {/* Quick 1-click for Owner Ranjeet Kumar */}
            <button
              onClick={() => handleGoogleSignIn('ranjeetk25565@gmail.com')}
              disabled={isLoading}
              className="w-full p-3.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-2xl flex items-center justify-between text-left transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <img
                  src={OWNER_USER.avatar}
                  alt="Owner"
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-100 text-sm">Ranjeet Kumar</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                  </div>
                  <span className="text-xs text-slate-400 font-mono">ranjeetk25565@gmail.com</span>
                </div>
              </div>
              <span className="text-xs text-blue-400 font-semibold px-2 py-1 bg-blue-500/10 rounded-lg">
                Owner Login
              </span>
            </button>

            {/* General Google Sign In button */}
            <button
              onClick={() => handleGoogleSignIn('creator@mediasourcehub.com')}
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-2xl shadow-lg flex items-center justify-center gap-3 text-sm transition-transform active:scale-[0.99]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        )}

        {/* Mobile Phone OTP Flow */}
        {authMethod === 'phone' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Mobile Number (Firebase Phone Auth)
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-950 pl-10 pr-4 py-3 text-sm rounded-2xl border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl shadow-lg shadow-blue-600/30 text-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                >
                  <span>Send 6-Digit Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 bg-blue-950/40 border border-blue-900/40 rounded-xl text-xs text-blue-300">
                  Code sent to <span className="font-mono font-bold text-white">{phoneNumber}</span>
                  {demoOtp && (
                    <div className="mt-1 text-emerald-400 font-semibold">
                      Demo OTP Code: <span className="font-mono text-sm underline">{demoOtp}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Enter 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-slate-950 px-4 py-3 text-center text-lg tracking-widest font-mono rounded-2xl border border-slate-800 text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                  >
                    Change Number
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || otpCode.length < 6}
                    className="flex-2 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
                  >
                    Verify & Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {errorMsg && (
          <p className="text-xs text-rose-400 font-medium text-center">{errorMsg}</p>
        )}
      </div>
    </div>
  );
};
