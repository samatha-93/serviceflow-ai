import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle, Loader2, ArrowRight, Lock, Mail, Building, User } from 'lucide-react';
import { UserProfile } from '../../types';
import { registerUser, loginUser } from '../../services/auth.api';
import { ApiError } from '../../services/enquiry.api';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export function AuthModal({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setError(null);
  }, [initialMode, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!name.trim() || !businessName.trim() || !email.trim() || !password) {
          setError('All fields are required.');
          setLoading(false);
          return;
        }
        if (password.length < 8) {
          setError('Password must be at least 8 characters long.');
          setLoading(false);
          return;
        }

        const user = await registerUser({
          name: name.trim(),
          businessName: businessName.trim(),
          email: email.trim(),
          password,
        });
        onSuccess(user);
        onClose();
      } else {
        if (!email.trim() || !password) {
          setError('Email and password are required.');
          setLoading(false);
          return;
        }

        const user = await loginUser({
          email: email.trim(),
          password,
        });
        onSuccess(user);
        onClose();
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.serverMessage);
      } else {
        setError(err instanceof Error ? err.message : 'Authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative w-full max-w-md bg-[#0D1126] rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white">
                ServiceFlow <span className="text-violet-400">AI</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-[#070913] p-1 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-violet-600/30 text-violet-300 border border-violet-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-violet-600/30 text-violet-300 border border-violet-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="space-y-1">
            <h3 id="auth-modal-title" className="text-xl font-extrabold text-white">
              {mode === 'login' ? 'Sign in to your business' : 'Register your service business'}
            </h3>
            <p className="text-xs text-slate-400">
              {mode === 'login'
                ? 'Access your isolated enquiry inbox and operational triage.'
                : 'Each business receives an isolated, secure workspace.'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start space-x-2 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
            {mode === 'register' && (
              <>
                <div>
                  <label htmlFor="auth-name" className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      id="auth-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-white/10 bg-[#070913] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="auth-business-name" className="block text-xs font-semibold text-slate-300 mb-1">
                    Business Name
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      id="auth-business-name"
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Apex Electrical Services"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-white/10 bg-[#070913] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-xs font-semibold text-slate-300 mb-1">
                Business Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@business.com"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-white/10 bg-[#070913] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-xs font-semibold text-slate-300 mb-1">
                Password {mode === 'register' && <span className="text-slate-500">(min 8 chars)</span>}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  id="auth-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-white/10 bg-[#070913] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-violet-600/30 transition-all disabled:opacity-50 mt-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Create Business Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="px-6 py-3 bg-[#070913]/90 border-t border-white/10 text-center text-xs text-slate-400">
          Protected with HttpOnly session cookies & tenant data isolation.
        </div>
      </div>
    </div>
  );
}
