import { useState } from 'react';
import { ArrowLeft, Volume2, VolumeX, Music, Bell, Palette, Moon, Sun, Globe, User, Cake, Edit2, Save, X, AlertCircle, LogOut, ChevronRight, Info, Settings as SettingsIcon } from 'lucide-react';
import { useTheme, themes as themeOptions } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { UserData } from '../App';

interface SettingsProps {
  onBack: () => void;
  userData?: UserData;
  onUpdateProfile?: (userData: UserData) => void;
  onLogout?: () => void;
}

type SettingsPage = 'menu' | 'profile' | 'audio' | 'appearance' | 'notifications' | 'language';

export function Settings({ onBack, userData, onUpdateProfile, onLogout }: SettingsProps) {
  const { theme, setTheme, soundEnabled, setSoundEnabled, musicEnabled, setMusicEnabled } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [currentPage, setCurrentPage] = useState<SettingsPage>('menu');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [parentName, setParentName] = useState(userData?.parentName || '');
  const [childName, setChildName] = useState(userData?.childName || '');
  const [childAge, setChildAge] = useState(userData?.childAge || '');
  const [selectedAvatar, setSelectedAvatar] = useState(userData?.avatar || 0);
  const [ageError, setAgeError] = useState('');

  const avatars = ["🐣", "🐼", "🐰", "🐱", "🐻", "🐨"];

  const handleAgeChange = (value: string) => {
    setChildAge(value);
    
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

  const handleSaveProfile = () => {
    const age = parseInt(childAge);
    if (isNaN(age) || age < 5) {
      setAgeError('Age must be at least 5 years old');
      return;
    }

    if (onUpdateProfile && userData) {
      onUpdateProfile({ 
        ...userData,
        parentName,
        childName, 
        childAge, 
        avatar: selectedAvatar 
      });
    }
    setAgeError('');
    setIsEditingProfile(false);
  };

  const handleMusicToggle = () => {
    setMusicEnabled(!musicEnabled);
  };

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
  };

  const themesArray = [
    { id: 'default' as const, ...themeOptions.default },
    { id: 'ocean' as const, ...themeOptions.ocean },
    { id: 'forest' as const, ...themeOptions.forest },
    { id: 'sunset' as const, ...themeOptions.sunset },
  ];

  // Settings Menu Items
  const menuItems = [
    {
      id: 'profile' as const,
      title: t('profile'),
      description: t('manageParentChild'),
      icon: User,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'audio' as const,
      title: t('soundAudio'),
      description: t('musicSoundEffects'),
      icon: Volume2,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      id: 'appearance' as const,
      title: t('appearance'),
      description: t('themesVisual'),
      icon: Palette,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
    },
    {
      id: 'notifications' as const,
      title: t('notifications'),
      description: t('dailyReminders'),
      icon: Bell,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      id: 'language' as const,
      title: t('language'),
      description: t('chooseLanguage'),
      icon: Globe,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];

  // Render Main Menu
  const renderMenu = () => (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-white/80 transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
            Back
          </button>
          <h1 className="text-white text-3xl">Settings</h1>
          <div className="w-20"></div>
        </div>

        {/* Settings Categories */}
        <div className="space-y-3">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className="w-full bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all flex items-center gap-4 group hover:bg-white"
              >
                <div className={`${item.bgColor} p-3 rounded-xl`}>
                  <IconComponent className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
            );
          })}
        </div>

        {/* Logout Section */}
        <div className="mt-8">
          {!showLogoutConfirm ? (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all rounded-2xl p-4 shadow-lg flex items-center justify-center gap-3 border-2 border-red-200 hover:border-red-300 group"
            >
              <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-600 transition-colors" />
              <span className="text-red-600 group-hover:text-red-700 transition-colors">Logout</span>
            </button>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-orange-200">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">⚠️</div>
                <h3 className="text-gray-800 mb-1">Are you sure?</h3>
                <p className="text-gray-600 text-sm">You will be logged out and returned to the login screen.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
                <button
                  onClick={onLogout}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* About Section */}
        <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
          <div className="text-4xl mb-3">🐼</div>
          <h3 className="text-gray-800 mb-1">Panda School</h3>
          <p className="text-gray-600 text-sm mb-3">Version 1.0.0</p>
          <p className="text-gray-500 text-sm">Making learning fun for everyone!</p>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm mb-1">Developed with ❤️ for children</p>
            <p className="text-gray-500 text-xs">© 2025 Panda School. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Profile Page
  const renderProfilePage = () => (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setCurrentPage('menu')}
            className="text-white hover:text-white/80 transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-3xl">Profile</h1>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
          <div className="space-y-4">
            {/* Parent Name */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-purple-500" />
                <div className="text-gray-600">Parent's Name</div>
              </div>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full p-3 bg-white rounded-xl border-2 border-purple-200 text-gray-800 focus:border-purple-400 focus:outline-none"
                  placeholder="Enter parent's name"
                />
              ) : (
                <div className="text-gray-800 ml-8">{parentName || 'Not set'}</div>
              )}
            </div>

            {/* Child Name */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-blue-500" />
                <div className="text-gray-600">Child's Name</div>
              </div>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="w-full p-3 bg-white rounded-xl border-2 border-blue-200 text-gray-800 focus:border-blue-400 focus:outline-none"
                  placeholder="Enter child's name"
                />
              ) : (
                <div className="text-gray-800 ml-8">{childName || 'Not set'}</div>
              )}
            </div>

            {/* Age */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Cake className="w-5 h-5 text-pink-500" />
                <div className="text-gray-600">Child's Age</div>
              </div>
              {isEditingProfile ? (
                <input
                  type="number"
                  value={childAge}
                  onChange={(e) => handleAgeChange(e.target.value)}
                  className="w-full p-3 bg-white rounded-xl border-2 border-pink-200 text-gray-800 focus:border-pink-400 focus:outline-none"
                  placeholder="Enter child's age (minimum 5)"
                  min="5"
                />
              ) : (
                <div className="text-gray-800 ml-8">{childAge || 'Not set'} years old</div>
              )}
              {ageError && (
                <div className="text-red-500 text-sm mt-1">{ageError}</div>
              )}
            </div>

            {/* Avatar */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-4xl">{avatars[selectedAvatar]}</div>
                <div className="text-gray-600">Child's Avatar</div>
              </div>
              {isEditingProfile && (
                <div className="grid grid-cols-6 gap-3 mt-4">
                  {avatars.map((avatar, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedAvatar(index)}
                      className={`aspect-square rounded-xl border-3 flex items-center justify-center text-3xl transition-all hover:scale-110 ${
                        selectedAvatar === index 
                          ? 'border-blue-500 bg-blue-50 shadow-lg' 
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              {isEditingProfile ? (
                <>
                  <button
                    onClick={() => {
                      setParentName(userData?.parentName || '');
                      setChildName(userData?.childName || '');
                      setChildAge(userData?.childAge || '');
                      setSelectedAvatar(userData?.avatar || 0);
                      setIsEditingProfile(false);
                      setAgeError('');
                    }}
                    className="flex-1 py-3 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Save className="w-5 h-5" />
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 text-white hover:from-yellow-500 hover:to-orange-500 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Edit2 className="w-5 h-5" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Audio Page
  const renderAudioPage = () => (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setCurrentPage('menu')}
            className="text-white hover:text-white/80 transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-3xl">Sound & Audio</h1>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl space-y-4">
          {/* Sound Effects Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-blue-500" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-400" />
              )}
              <div>
                <div className="text-gray-800">Sound Effects</div>
                <div className="text-gray-500 text-sm">Claps, feedback sounds</div>
              </div>
            </div>
            <button
              onClick={handleSoundToggle}
              className={`w-14 h-8 rounded-full transition-all ${
                soundEnabled ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all ${
                  soundEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Background Music Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Music className={`w-5 h-5 ${musicEnabled ? 'text-purple-500 animate-pulse' : 'text-gray-400'}`} />
              <div>
                <div className="text-gray-800">Background Music</div>
                <div className="text-gray-500 text-sm">Relaxing learning music</div>
              </div>
            </div>
            <button
              onClick={handleMusicToggle}
              className={`w-14 h-8 rounded-full transition-all ${
                musicEnabled ? 'bg-purple-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all ${
                  musicEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Appearance Page
  const renderAppearancePage = () => (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setCurrentPage('menu')}
            className="text-white hover:text-white/80 transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-3xl">Appearance</h1>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
          <h3 className="text-gray-800 mb-6">Choose Theme</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {themesArray.map((themeItem) => (
              <button
                key={themeItem.id}
                onClick={() => setTheme(themeItem.id)}
                className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                  theme === themeItem.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`h-16 rounded-lg ${themeItem.gradient} mb-3 shadow-md`} />
                <div className="text-gray-800">{themeItem.name}</div>
                <div className="text-gray-500 text-sm">{themeItem.colors}</div>
                {theme === themeItem.id && (
                  <div className="mt-2 text-blue-500 text-sm">✓ Active</div>
                )}
              </button>
            ))}
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="w-5 h-5 text-indigo-500" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
              )}
              <div>
                <div className="text-gray-800">Dark Mode</div>
                <div className="text-gray-500 text-sm">Coming soon!</div>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-14 h-8 rounded-full transition-all ${
                darkMode ? 'bg-indigo-500' : 'bg-gray-300'
              }`}
              disabled
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all ${
                  darkMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Notifications Page
  const renderNotificationsPage = () => (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setCurrentPage('menu')}
            className="text-white hover:text-white/80 transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-3xl">Notifications</h1>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-gray-800">Daily Reminders</div>
                <div className="text-gray-500 text-sm">Get reminded to practice</div>
              </div>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-14 h-8 rounded-full transition-all ${
                notificationsEnabled ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all ${
                  notificationsEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Language Page
  const renderLanguagePage = () => (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setCurrentPage('menu')}
            className="text-white hover:text-white/80 transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-3xl">{t('language')}</h1>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
          <h3 className="text-gray-800 mb-6">{t('selectLanguage')}</h3>
          <div className="space-y-3">
            {[
              { value: 'english', label: '🇺🇸 English', name: 'English' },
              { value: 'french', label: '🇫🇷 Français', name: 'French' },
              { value: 'spanish', label: '🇪🇸 Español', name: 'Spanish' },
            ].map((lang) => (
              <button
                key={lang.value}
                onClick={() => setLanguage(lang.value as 'english' | 'french' | 'spanish')}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                  language === lang.value
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span className="text-gray-800">{lang.label}</span>
                {language === lang.value && (
                  <span className="text-blue-500">✓ {t('active')}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Main render logic
  switch (currentPage) {
    case 'profile':
      return renderProfilePage();
    case 'audio':
      return renderAudioPage();
    case 'appearance':
      return renderAppearancePage();
    case 'notifications':
      return renderNotificationsPage();
    case 'language':
      return renderLanguagePage();
    default:
      return renderMenu();
  }
}