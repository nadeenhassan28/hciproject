import { BookOpen, Trophy, Settings, Users } from 'lucide-react';
import { ProgressData } from '../App';
import { useTheme, themes } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface DashboardProps {
  onSelectLesson: (lesson: string) => void;
  onParentDashboard: () => void;
  progressData: ProgressData;
}

export function Dashboard({ onSelectLesson, onParentDashboard, progressData }: DashboardProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const currentTheme = themes[theme];
  
  // Calculate overall progress for each lesson based on completed difficulties
  const calculateProgress = (difficultyProgress: { easy: number, medium: number, hard: number }) => {
    let progress = 0;
    if (difficultyProgress.easy > 50) progress += 33.3;
    if (difficultyProgress.medium > 50) progress += 33.3;
    if (difficultyProgress.hard > 50) progress += 33.4; // 33.4 to make it exactly 100%
    return Math.round(progress);
  };
  
  const lessons = [
    { 
      id: 'shapes', 
      title: t('shapes'), 
      icon: '🔷', 
      color: currentTheme.primaryColor, 
      progress: calculateProgress(progressData.difficultyProgress.shapes),
      difficultyProgress: progressData.difficultyProgress.shapes,
    },
    { 
      id: 'numbers', 
      title: t('numbers'), 
      icon: '🔢', 
      color: currentTheme.secondaryColor, 
      progress: calculateProgress(progressData.difficultyProgress.numbers),
      difficultyProgress: progressData.difficultyProgress.numbers,
    },
    { 
      id: 'counting', 
      title: t('counting'), 
      icon: '🧮', 
      color: currentTheme.primaryColor, 
      progress: calculateProgress(progressData.difficultyProgress.counting),
      difficultyProgress: progressData.difficultyProgress.counting,
    },
  ];

  return (
    <div className="min-h-screen p-8 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 text-6xl opacity-20 animate-bounce">⭐</div>
      <div className="absolute top-40 right-20 text-5xl opacity-20 animate-pulse">🎈</div>
      <div className="absolute bottom-20 left-20 text-5xl opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}>🌟</div>
      <div className="absolute bottom-40 right-10 text-6xl opacity-20 animate-pulse" style={{ animationDelay: '0.3s' }}>✨</div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🐼</div>
            <div>
              <h1 className="text-white text-4xl">{t('pandaSchool')}</h1>
              <p className="text-white/80">{t('letsLearnTogether')}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => onSelectLesson('leaderboard')}
              className="p-4 bg-white/20 rounded-xl hover:bg-white/30 transition-all hover:scale-110"
              title={t('leaderboard')}
            >
              <Trophy className="w-6 h-6 text-yellow-300" />
            </button>
            <button 
              onClick={onParentDashboard}
              className="p-4 bg-white/20 rounded-xl hover:bg-white/30 transition-all hover:scale-110"
              title={t('parentDashboard')}
            >
              <Users className="w-6 h-6 text-white" />
            </button>
            <button 
              onClick={() => onSelectLesson('settings')}
              className="p-4 bg-white/20 rounded-xl hover:bg-white/30 transition-all hover:scale-110"
              title={t('settings')}
            >
              <Settings className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => onSelectLesson(lesson.id)}
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-105"
            >
              <div className="text-center mb-6">
                <div className="text-7xl mb-4">{lesson.icon}</div>
                <h3 className="text-gray-800 mb-2">{lesson.title}</h3>
              </div>

              {/* Single Progress Bar divided into 3 segments */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{lesson.progress}%</span>
                </div>
                
                {/* Progress bar with 3 segments */}
                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                  {/* Segment dividers */}
                  <div className="absolute top-0 left-1/3 w-0.5 h-full bg-white z-10"></div>
                  <div className="absolute top-0 left-2/3 w-0.5 h-full bg-white z-10"></div>
                  
                  {/* Progress fill with gradient based on which segment is active */}
                  <div
                    className={`h-full transition-all ${
                      lesson.difficultyProgress.hard > 50 
                        ? 'bg-gradient-to-r from-green-400 via-blue-400 to-purple-500'
                        : lesson.difficultyProgress.medium > 50
                        ? 'bg-gradient-to-r from-green-400 to-blue-500'
                        : 'bg-gradient-to-r from-green-400 to-green-500'
                    }`}
                    style={{ width: `${lesson.progress}%` }}
                  />
                </div>
                
                {/* Level indicators below progress bar */}
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span className={lesson.difficultyProgress.easy > 50 ? 'text-green-600' : ''}>
                    🌱 Easy {lesson.difficultyProgress.easy > 50 ? '✓' : ''}
                  </span>
                  <span className={lesson.difficultyProgress.medium > 50 ? 'text-blue-600' : ''}>
                    ⛰️ Medium {lesson.difficultyProgress.medium > 50 ? '✓' : ''}
                  </span>
                  <span className={lesson.difficultyProgress.hard > 50 ? 'text-purple-600' : ''}>
                    🏔️ Hard {lesson.difficultyProgress.hard > 50 ? '✓' : ''}
                  </span>
                </div>
              </div>

              <button className={`w-full bg-gradient-to-r ${lesson.color} text-white py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2`}>
                <BookOpen className="w-5 h-5" />
                {t('startLearning')}
              </button>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-4xl text-gray-800 mb-2">{progressData.lessonsCompleted}</div>
            <div className="text-gray-600">{t('lessonsCompleted')}</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-4xl text-gray-800 mb-2">{progressData.streak}</div>
            <div className="text-gray-600">{t('dayStreak')}</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-4xl text-gray-800 mb-2">{progressData.averageScore}%</div>
            <div className="text-gray-600">{t('averageScore')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}