import { useState, useEffect } from "react";
import { User, Cake, ArrowLeft, AlertCircle } from "lucide-react";
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useLanguage } from '../context/LanguageContext';

interface AvatarSelectProps {
  onSelect: (
    childName: string,
    childAge: string,
    avatar: number,
  ) => void;
  onBack?: () => void;
}

const avatars = ["🐣", "🐼", "🐰", "🐱", "🐻", "🐨"];

export function AvatarSelect({ onSelect, onBack }: AvatarSelectProps) {
  const { t } = useLanguage();
  // Start with empty form - no localStorage loading
  const [selected, setSelected] = useState<number | null>(null);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [ageError, setAgeError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Save to localStorage whenever values change (for back navigation within session)
  useEffect(() => {
    localStorage.setItem('avatarSelection', JSON.stringify({
      childName,
      childAge,
      avatar: selected
    }));
  }, [childName, childAge, selected]);

  const handleSelect = (index: number) => {
    setSelected(index);
  };

  const handleAgeChange = (value: string) => {
    setChildAge(value);
    
    // Validate age
    if (value === '') {
      setAgeError('');
      return;
    }
    
    const age = parseInt(value);
    if (isNaN(age)) {
      setAgeError('Please enter a valid number');
    } else if (age < 5) {
      setAgeError('Age must be at least 5 years old');
    } else {
      setAgeError('');
    }
  };

  const handleContinue = () => {
    // Validate all fields
    if (selected === null || !childName || !childAge) {
      return;
    }

    const age = parseInt(childAge);
    if (isNaN(age) || age < 5) {
      setAgeError('Age must be at least 5 years old');
      return;
    }

    // Clear localStorage after successful submission
    localStorage.removeItem('avatarSelection');
    onSelect(childName, childAge, selected);
  };

  const isFormValid = selected !== null && childName.trim() !== '' && childAge !== '' && !ageError && parseInt(childAge) >= 5;

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 w-full max-w-2xl relative">
        {/* Back Button at Top */}
        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-8 left-8 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        )}

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🐼</div>
          <h2 className="text-gray-700 mb-2">
            Set up Child Profile
          </h2>
          <p className="text-gray-500">
            {t('chooseAvatar')}
          </p>
        </div>

        {/* Child Info Inputs */}
        <div className="mb-8 space-y-4">
          <div>
            <label className="block text-gray-600 mb-2 text-sm">
              {t('childName')}
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
                placeholder={t('childName')}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-2 text-sm">
              {t('childAge')}
            </label>
            <div className="relative">
              <Cake className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                value={childAge}
                onChange={(e) => handleAgeChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
                placeholder={t('childAge')}
                min="5"
                required
              />
            </div>
            {ageError && (
              <div className="text-red-500 text-sm mt-1">
                <AlertCircle className="inline-block w-4 h-4 mr-1" />
                {t('ageError')}
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 mb-4 text-sm">
            {t('chooseAvatar')}
          </label>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {avatars.map((avatar, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className={`aspect-square rounded-2xl border-4 flex items-center justify-center text-6xl transition-all hover:scale-105 ${
                selected === index
                  ? "border-blue-500 bg-blue-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-blue-300"
              }`}
            >
              {avatar}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleContinue}
            disabled={!isFormValid}
            className={`w-full py-4 rounded-xl transition-all shadow-lg ${
              isFormValid
                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}