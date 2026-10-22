import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BANGLADESH_DISTRICTS } from '../../data/mockData';

interface CustomerAuthModalProps {
  onSuccess?: () => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({ onSuccess }) => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalTab, 
    authModalReason, 
    login, 
    register, 
    forgotPassword, 
    resetPassword,
    redirectIntent,
    setRedirectIntent
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot' | 'reset'>(authModalTab);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regAddress, setRegAddress] = useState('');
  const [regDistrict, setRegDistrict] = useState('Dhaka');

  // Password Recovery state
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [simulatedCode, setSimulatedCode] = useState<string | null>(null);

  // Status & Error
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync tab with context if opened with specific tab
  React.useEffect(() => {
    if (isAuthModalOpen) {
      setActiveTab(authModalTab);
      setError(null);
      setSuccessMsg(null);
    }
  }, [isAuthModalOpen, authModalTab]);

  if (!isAuthModalOpen) return null;

  // Quick fill helper for testing
  const handleQuickFillDemo = () => {
    setLoginEmail('nusrat.jahan@gmail.com');
    setLoginPassword('password123');
    setError(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await login(loginEmail.trim(), loginPassword);
    setIsLoading(false);

    if (res.success) {
      closeAuthModal();
      if (onSuccess) onSuccess();
      if (redirectIntent) {
        setRedirectIntent(null);
      }
    } else {
      setError(res.error || 'Invalid credentials. Please try again.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Bangladeshi phone validation
    const cleanPhone = regPhone.replace(/[^0-9]/g, '');
    if (cleanPhone && (cleanPhone.length !== 11 || !cleanPhone.startsWith('01'))) {
      setError('Please provide a valid 11-digit Bangladeshi mobile number starting with 01 (e.g. 01711223344).');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    const selectedDist = BANGLADESH_DISTRICTS.find(d => d.name === regDistrict);

    const res = await register({
      fullName: regFullName.trim(),
      email: regEmail.trim(),
      phone: cleanPhone,
      password: regPassword,
      address: regAddress.trim(),
      district: regDistrict,
      division: selectedDist?.division || 'Dhaka',
    });
    setIsLoading(false);

    if (res.success) {
      closeAuthModal();
      if (onSuccess) onSuccess();
      if (redirectIntent) {
        setRedirectIntent(null);
      }
    } else {
      setError(res.error || 'Registration failed. Please check your details.');
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    const res = await forgotPassword(recoveryEmail.trim());
    setIsLoading(false);

    if (res.success) {
      setSimulatedCode(res.verificationCode || null);
      if (res.verificationCode) {
        setRecoveryCode(res.verificationCode);
      }
      setSuccessMsg(res.message || 'Verification code generated! Please enter your new password.');
      setActiveTab('reset');
    } else {
      setError(res.error || 'Unable to process reset request.');
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    const res = await resetPassword(recoveryEmail.trim(), recoveryCode.trim(), newPassword);
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg(res.message || 'Password successfully updated! Please log in.');
      setTimeout(() => {
        setLoginEmail(recoveryEmail.trim());
        setLoginPassword('');
        setActiveTab('login');
        setSuccessMsg(null);
      }, 1500);
    } else {
      setError(res.error || 'Failed to reset password. Please check your code.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-md bg-[#0e0e0e] border border-[#D4AF66]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto animate-fadeIn">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-[#0a0a0a] border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1a1610] border border-[#D4AF66]/40 flex items-center justify-center text-[#D4AF66]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-cinzel font-bold text-white tracking-wide block">
                ZENVY<span className="text-[#D4AF66]">WEAR</span> ATELIER
              </span>
              <span className="text-[10px] uppercase tracking-widest text-neutral-400">
                Customer Account & Sovereign Access
              </span>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition min-h-[36px]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reason Banner (e.g. Checkout Redirection) */}
        {authModalReason && (
          <div className="bg-[#1f190e] border-b border-[#D4AF66]/30 px-4 py-2.5 text-xs text-[#D4AF66] flex items-center space-x-2">
            <ShoppingBag className="w-4 h-4 shrink-0 text-[#D4AF66]" />
            <span>{authModalReason}</span>
          </div>
        )}

        {/* Tab Switcher for Sign In vs Register */}
        {(activeTab === 'login' || activeTab === 'register') && (
          <div className="grid grid-cols-2 bg-[#121212] border-b border-neutral-800 text-xs">
            <button
              onClick={() => { setActiveTab('login'); setError(null); }}
              className={`py-3 font-semibold transition border-b-2 min-h-[44px] ${
                activeTab === 'login'
                  ? 'border-[#D4AF66] text-[#D4AF66] bg-[#161410]'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('register'); setError(null); }}
              className={`py-3 font-semibold transition border-b-2 min-h-[44px] ${
                activeTab === 'register'
                  ? 'border-[#D4AF66] text-[#D4AF66] bg-[#161410]'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Body Container */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Error / Success Alerts */}
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-500/80 rounded-xl text-red-200 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/80 rounded-xl text-emerald-200 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: SIGN IN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-neutral-300 block font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. nusrat.jahan@gmail.com"
                    className="w-full bg-[#161616] border border-neutral-700 focus:border-[#D4AF66] text-white text-xs rounded-xl pl-9 pr-3 py-3 outline-none min-h-[44px]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-neutral-300 font-medium">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryEmail(loginEmail);
                      setActiveTab('forgot');
                      setError(null);
                    }}
                    className="text-[11px] text-[#D4AF66] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-[#161616] border border-neutral-700 focus:border-[#D4AF66] text-white text-xs rounded-xl pl-9 pr-10 py-3 outline-none min-h-[44px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-3 text-neutral-400 hover:text-white p-1"
                    aria-label="Toggle password visibility"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gold-gradient text-black font-semibold text-xs uppercase tracking-wider rounded-xl shadow-md hover:brightness-110 transition disabled:opacity-50 min-h-[44px] flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to ZenvyWear</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Demo Account Quick-Fill Card */}
              <div className="bg-[#141414] border border-neutral-800 rounded-xl p-3 text-[11px] text-neutral-400 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#D4AF66] font-semibold flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Quick Test Customer:</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleQuickFillDemo}
                    className="text-[10px] text-white bg-neutral-800 hover:bg-neutral-700 px-2 py-0.5 rounded border border-neutral-700"
                  >
                    1-Click Auto Fill
                  </button>
                </div>
                <div className="font-mono text-[10px] text-neutral-300">
                  Email: nusrat.jahan@gmail.com • Pass: password123
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER ACCOUNT */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-neutral-300 block font-medium">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Nusrat Jahan"
                    className="w-full bg-[#161616] border border-neutral-700 focus:border-[#D4AF66] text-white text-xs rounded-xl pl-9 pr-3 py-2.5 outline-none min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 block font-medium">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. nusrat@gmail.com"
                      className="w-full bg-[#161616] border border-neutral-700 focus:border-[#D4AF66] text-white text-xs rounded-xl pl-9 pr-3 py-2.5 outline-none min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 block font-medium">Mobile (11 Digits) *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full bg-[#161616] border border-neutral-700 focus:border-[#D4AF66] text-white text-xs rounded-xl pl-9 pr-3 py-2.5 outline-none font-mono min-h-[44px]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-300 block font-medium">Password (Min 6 Characters) *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="w-full bg-[#161616] border border-neutral-700 focus:border-[#D4AF66] text-white text-xs rounded-xl pl-9 pr-10 py-2.5 outline-none min-h-[44px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-2.5 text-neutral-400 hover:text-white p-1"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-300 block font-medium">Default Delivery Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="House, Road, Area (e.g. Sector 3, Uttara)"
                    className="w-full bg-[#161616] border border-neutral-700 focus:border-[#D4AF66] text-white text-xs rounded-xl pl-9 pr-3 py-2.5 outline-none min-h-[44px]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-300 block font-medium">District</label>
                <select
                  value={regDistrict}
                  onChange={(e) => setRegDistrict(e.target.value)}
                  className="w-full bg-[#161616] border border-neutral-700 focus:border-[#D4AF66] text-white text-xs rounded-xl px-3 py-2.5 outline-none min-h-[44px]"
                >
                  {BANGLADESH_DISTRICTS.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name} ({d.division})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 mt-2 bg-gold-gradient text-black font-semibold text-xs uppercase tracking-wider rounded-xl shadow-md hover:brightness-110 transition disabled:opacity-50 min-h-[44px] flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Register & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD REQUEST */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-cinzel font-bold text-white">Reset Account Password</h4>
                <p className="text-xs text-neutral-400">
                  Enter your registered email address. We will verify your account and provide a 6-digit recovery code.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-300 block font-medium">Registered Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full bg-[#161616] border border-neutral-700 focus:border-[#D4AF66] text-white text-xs rounded-xl pl-9 pr-3 py-3 outline-none min-h-[44px]"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setError(null); }}
                  className="w-1/3 py-3 border border-neutral-700 rounded-xl text-xs text-neutral-300 hover:text-white min-h-[44px]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-2/3 py-3 bg-gold-gradient text-black font-semibold text-xs uppercase tracking-wider rounded-xl shadow hover:brightness-110 transition disabled:opacity-50 min-h-[44px]"
                >
                  {isLoading ? 'Generating Code...' : 'Send Recovery Code'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: RESET PASSWORD VERIFICATION */}
          {activeTab === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-cinzel font-bold text-white">Enter Verification Code</h4>
                <p className="text-xs text-neutral-400">
                  Enter the 6-digit code and choose your new password.
                </p>
              </div>

              {simulatedCode && (
                <div className="bg-[#1b170e] border border-[#D4AF66]/50 rounded-xl p-3 text-xs text-[#D4AF66] flex items-center justify-between">
                  <span>Your Reset Code: <strong className="font-mono text-white text-sm">{simulatedCode}</strong></span>
                  <span className="text-[10px] text-neutral-400 bg-black/50 px-2 py-0.5 rounded">Auto-Filled</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs text-neutral-300 block font-medium">6-Digit Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                  placeholder="e.g. 123456"
                  className="w-full bg-[#161616] border border-neutral-700 focus:border-[#D4AF66] text-white text-xs rounded-xl px-4 py-3 outline-none text-center font-mono tracking-widest text-sm min-h-[44px]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-300 block font-medium">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter at least 6 characters"
                    className="w-full bg-[#161616] border border-neutral-700 focus:border-[#D4AF66] text-white text-xs rounded-xl pl-9 pr-10 py-3 outline-none min-h-[44px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-neutral-400 hover:text-white p-1"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setError(null); }}
                  className="w-1/3 py-3 border border-neutral-700 rounded-xl text-xs text-neutral-300 hover:text-white min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-2/3 py-3 bg-gold-gradient text-black font-semibold text-xs uppercase tracking-wider rounded-xl shadow hover:brightness-110 transition disabled:opacity-50 min-h-[44px]"
                >
                  {isLoading ? 'Resetting...' : 'Save New Password'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
