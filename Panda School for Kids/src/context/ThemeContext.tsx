import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeType = 'default' | 'ocean' | 'forest' | 'sunset';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  musicEnabled: boolean;
  setMusicEnabled: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>('default');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    const savedSound = localStorage.getItem('soundEnabled');
    const savedMusic = localStorage.getItem('musicEnabled');

    if (savedTheme) setTheme(savedTheme);
    if (savedSound !== null) setSoundEnabled(savedSound === 'true');
    if (savedMusic !== null) setMusicEnabled(savedMusic === 'true');
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('soundEnabled', String(soundEnabled));
    localStorage.setItem('musicEnabled', String(musicEnabled));
  }, [theme, soundEnabled, musicEnabled]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        soundEnabled,
        setSoundEnabled,
        musicEnabled,
        setMusicEnabled,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export const themes = {
  default: {
    name: 'Panda Theme',
    colors: '🐼 Blue & Purple',
    gradient: 'bg-gradient-to-br from-blue-300 via-purple-200 to-blue-200',
    primaryColor: 'from-purple-400 to-purple-500',
    secondaryColor: 'from-blue-400 to-blue-500',
  },
  ocean: {
    name: 'Ocean Theme',
    colors: '🌊 Blue & Teal',
    gradient: 'bg-gradient-to-br from-blue-400 via-cyan-300 to-teal-300',
    primaryColor: 'from-cyan-400 to-cyan-500',
    secondaryColor: 'from-blue-500 to-blue-600',
  },
  forest: {
    name: 'Forest Theme',
    colors: '🌳 Green & Brown',
    gradient: 'bg-gradient-to-br from-green-400 via-lime-300 to-emerald-300',
    primaryColor: 'from-green-500 to-green-600',
    secondaryColor: 'from-lime-400 to-lime-500',
  },
  sunset: {
    name: 'Sunset Theme',
    colors: '🌅 Orange & Pink',
    gradient: 'bg-gradient-to-br from-orange-400 via-pink-300 to-rose-300',
    primaryColor: 'from-pink-400 to-pink-500',
    secondaryColor: 'from-orange-400 to-orange-500',
  },
};
