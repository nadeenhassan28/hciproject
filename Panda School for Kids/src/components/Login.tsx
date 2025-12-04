import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useLanguage } from '../context/LanguageContext';

interface LoginProps {
  onLogin: (accessToken: string) => void;
  onSignup: () => void;
}

export function Login({ onLogin, onSignup }: LoginProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7534bb61/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store access token in localStorage
      localStorage.setItem('accessToken', data.accessToken);
      
      onLogin(data.accessToken);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🐼</div>
          <h2 className="text-gray-700 mb-2">{t('welcomeBack')}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-600 mb-2 text-sm">{t('email')}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
                placeholder={t('email')}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-2 text-sm">{t('password')}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
                placeholder={t('password')}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-4 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : t('signIn')}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
        </form>

        <div className="text-center mt-6">
          <button
            onClick={onSignup}
            className="text-gray-600 hover:text-gray-800 underline"
          >
            {t('dontHaveAccount')} {t('signUpHere')}
          </button>
        </div>
      </div>
    </div>
  );
}