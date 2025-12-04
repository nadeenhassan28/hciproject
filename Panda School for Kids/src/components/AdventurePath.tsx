import { Difficulty } from '../App';
import { useLanguage } from '../context/LanguageContext';

interface AdventurePathProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onBack: () => void;
  lessonName: string;
  lessonIcon: string;
  progressData: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export function AdventurePath({ onSelectDifficulty, onBack, lessonName, lessonIcon, progressData }: AdventurePathProps) {
  const { t } = useLanguage();
  
  const levels = [
    {
      id: 'easy',
      title: t('easyTrail'),
      icon: '🌱',
      description: t('startAdventure'),
      color: 'from-green-400 to-emerald-500',
      progress: progressData.easy, // Score percentage (0-100)
      unlocked: true,
    },
    {
      id: 'medium',
      title: t('mediumMountain'),
      icon: '⛰️',
      description: t('challengeYourself'),
      color: 'from-blue-400 to-indigo-500',
      progress: progressData.medium, // Score percentage (0-100)
      unlocked: progressData.easy > 50, // Unlock if easy score > 50%
    },
    {
      id: 'hard',
      title: t('hardSummit'),
      icon: '🏔️',
      description: t('masterTheChallenge'),
      color: 'from-purple-400 to-pink-500',
      progress: progressData.hard, // Score percentage (0-100)
      unlocked: progressData.medium > 50, // Unlock if medium score > 50%
    },
  ];

  return (
    <div className="min-h-screen p-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-10 text-6xl opacity-20 animate-bounce">🌟</div>
      <div className="absolute top-40 right-20 text-5xl opacity-20 animate-pulse">⭐</div>
      <div className="absolute bottom-20 right-20 text-5xl opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}>✨</div>
      <div className="absolute bottom-40 left-10 text-6xl opacity-20 animate-pulse" style={{ animationDelay: '0.3s' }}>🎈</div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all"
          >
            ← {t('backToDashboard')}
          </button>
          <div className="flex items-center gap-3">
            <div className="text-5xl">{lessonIcon}</div>
            <h1 className="text-white text-4xl">{lessonName}</h1>
          </div>
          <div className="w-40"></div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-white text-2xl mb-2">{t('selectDifficulty')}</h2>
          <p className="text-white/80">{t('selectDifficultyDesc')}</p>
        </div>

        {/* Adventure Path */}
        <div className="relative mb-12 min-h-[600px]">
          {/* Winding Path SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ height: '600px' }}>
            <defs>
              <linearGradient id="adventurePath" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 0.7 }} />
                <stop offset="50%" style={{ stopColor: '#3B82F6', stopOpacity: 0.7 }} />
                <stop offset="100%" style={{ stopColor: '#A855F7', stopOpacity: 0.7 }} />
              </linearGradient>
              <linearGradient id="completedPath" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#A855F7', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            
            {/* Base path (unfilled) - full path shown faintly */}
            <path
              d="M 120 520 Q 200 450, 280 400 T 480 280 Q 580 200, 680 160 T 800 140"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="25"
              fill="none"
              strokeLinecap="round"
            />
            
            {/* Segment 1: Easy to Medium (shows when easy > 50%) */}
            {progressData.easy > 50 && (
              <path
                d="M 120 520 Q 200 450, 280 400 T 480 280"
                stroke="url(#completedPath)"
                strokeWidth="25"
                fill="none"
                strokeLinecap="round"
                className="animate-pulse"
              />
            )}
            
            {/* Segment 2: Medium to Hard (shows when medium > 50%) */}
            {progressData.medium > 50 && (
              <path
                d="M 480 280 Q 580 200, 680 160 T 800 140"
                stroke="url(#completedPath)"
                strokeWidth="25"
                fill="none"
                strokeLinecap="round"
                className="animate-pulse"
              />
            )}
          </svg>

          {/* Level Nodes on the Path */}
          <div className="relative">
            {/* Level 1: Easy (Bottom Left) */}
            <div 
              className="absolute transition-all duration-300"
              style={{ left: '5%', top: '480px' }}
            >
              <LevelNode
                level={levels[0]}
                levelNumber={1}
                onClick={() => onSelectDifficulty('easy')}
              />
            </div>

            {/* Decorative Elements for Easy */}
            <div className="absolute text-4xl animate-pulse" style={{ left: '1%', top: '550px', animationDelay: '0.2s' }}>🌳</div>
            <div className="absolute text-3xl" style={{ left: '14%', top: '520px' }}>🌸</div>
            <div className="absolute text-3xl" style={{ left: '10%', top: '440px' }}>🦋</div>

            {/* Level 2: Medium (Middle) */}
            <div 
              className="absolute transition-all duration-300"
              style={{ left: '42%', top: '240px' }}
            >
              <LevelNode
                level={levels[1]}
                levelNumber={2}
                onClick={() => levels[1].unlocked && onSelectDifficulty('medium')}
              />
            </div>

            {/* Decorative Elements for Medium */}
            <div className="absolute text-4xl animate-bounce" style={{ left: '37%', top: '180px', animationDelay: '0.4s' }}>☁️</div>
            <div className="absolute text-3xl animate-bounce" style={{ left: '52%', top: '200px', animationDelay: '0.6s' }}>☁️</div>
            <div className="absolute text-3xl" style={{ left: '35%', top: '310px' }}>🌲</div>
            <div className="absolute text-4xl" style={{ left: '48%', top: '320px' }}>🏕️</div>

            {/* Level 3: Hard (Top Right) */}
            <div 
              className="absolute transition-all duration-300"
              style={{ left: '75%', top: '60px' }}
            >
              <LevelNode
                level={levels[2]}
                levelNumber={3}
                onClick={() => levels[2].unlocked && onSelectDifficulty('hard')}
              />
            </div>

            {/* Decorative Elements for Hard */}
            <div className="absolute text-5xl animate-pulse" style={{ left: '72%', top: '10px', animationDelay: '0.3s' }}>⭐</div>
            <div className="absolute text-4xl animate-pulse" style={{ left: '88%', top: '30px', animationDelay: '0.5s' }}>✨</div>
            <div className="absolute text-3xl" style={{ left: '70%', top: '140px' }}>🦅</div>
            <div className="absolute text-3xl" style={{ left: '85%', top: '120px' }}>☁️</div>

            {/* Additional Decorative Elements */}
            <div className="absolute text-4xl" style={{ left: '20%', top: '400px' }}>🌻</div>
            <div className="absolute text-3xl" style={{ left: '30%', top: '360px' }}>🌺</div>
            <div className="absolute text-4xl" style={{ left: '60%', top: '360px' }}>🌲</div>
            <div className="absolute text-3xl" style={{ left: '65%', top: '280px' }}>🏔️</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Level Node Component
interface LevelNodeProps {
  level: {
    id: string;
    title: string;
    icon: string;
    description: string;
    color: string;
    progress: number;
    unlocked: boolean;
  };
  levelNumber: number;
  onClick: () => void;
}

function LevelNode({ level, levelNumber, onClick }: LevelNodeProps) {
  const { t } = useLanguage();
  const isComplete = level.progress > 50; // Complete when score > 50%
  const isInProgress = level.progress > 0 && level.progress <= 50;
  
  return (
    <div className="flex flex-col items-center">
      {/* Level Number Badge */}
      <div className="text-white/70 text-sm mb-2">{t('levelNumber')} {levelNumber}</div>
      
      {/* Main Node */}
      <div
        onClick={level.unlocked ? onClick : undefined}
        className={`relative group ${level.unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
      >
        {/* Glow effect for unlocked levels */}
        {level.unlocked && (
          <div className={`absolute inset-0 bg-gradient-to-r ${level.color} rounded-full blur-2xl opacity-60 group-hover:opacity-80 transition-all animate-pulse`} />
        )}
        
        {/* Node Circle */}
        <div
          className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all border-4 ${
            level.unlocked
              ? `bg-white shadow-2xl group-hover:scale-110 ${isComplete ? 'border-yellow-400' : 'border-white'}`
              : 'bg-gray-400 border-gray-500 opacity-60'
          }`}
        >
          {/* Lock icon for locked levels */}
          {!level.unlocked && (
            <div className="absolute top-3 right-3 text-3xl">🔒</div>
          )}
          
          {/* Complete crown */}
          {isComplete && (
            <div className="absolute -top-6 text-5xl animate-bounce">👑</div>
          )}
          
          {/* Icon */}
          <div className={`text-6xl mb-2 ${!level.unlocked && 'grayscale'}`}>
            {level.icon}
          </div>
          
          {/* Title */}
          <div className={`text-sm ${level.unlocked ? 'text-gray-800' : 'text-gray-600'}`}>
            {level.title}
          </div>
        </div>
        
        {/* Progress Ring */}
        {level.unlocked && level.progress > 0 && (
          <svg className="absolute inset-0 w-40 h-40 -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="76"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="5"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r="76"
              stroke="#FCD34D"
              strokeWidth="5"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 76}`}
              strokeDashoffset={`${2 * Math.PI * 76 * (1 - level.progress / 100)}`}
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
      
      {/* Description & Progress */}
      {level.unlocked && (
        <div className="mt-4 text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 min-w-[180px]">
          <div className="text-white/90 mb-1">{level.description}</div>
          <div className="text-white text-sm mb-1">{level.progress}%</div>
          {isInProgress && (
            <div className="text-yellow-300 text-xs">⚡ {t('inProgress')}</div>
          )}
          {isComplete && (
            <div className="text-green-300 text-xs">✓ {t('mastered')}</div>
          )}
          {level.progress === 0 && (
            <div className="text-blue-300 text-xs">🚀 {t('startAdventureButton')}</div>
          )}
        </div>
      )}
      
      {!level.unlocked && (
        <div className="mt-4 text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 min-w-[180px]">
          <div className="text-white/50 text-xs">
            🔒 {t('scoreAbove50')}
          </div>
        </div>
      )}
    </div>
  );
}