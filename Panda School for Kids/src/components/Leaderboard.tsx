import { ArrowLeft, Trophy, Medal, Award, Crown, Star } from 'lucide-react';
import { useTheme, themes } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface LeaderboardProps {
  onBack: () => void;
}

export function Leaderboard({ onBack }: LeaderboardProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const currentTheme = themes[theme];
  // Mock leaderboard data - in real app this would come from backend
  const topPlayers = [
    { rank: 1, name: 'Lily Chen', avatar: '🐱', score: 2450, streak: 15 },
    { rank: 2, name: 'Max Wilson', avatar: '🐻', score: 2380, streak: 12 },
    { rank: 3, name: 'Emma Davis', avatar: '🐰', score: 2290, streak: 10 },
    { rank: 4, name: 'Noah Kim', avatar: '🐼', score: 2150, streak: 8 },
    { rank: 5, name: 'Sophia Lee', avatar: '🐨', score: 2100, streak: 7 },
    { rank: 6, name: 'Oliver Brown', avatar: '🐣', score: 1980, streak: 6 },
    { rank: 7, name: 'Ava Martinez', avatar: '🦊', score: 1850, streak: 5 },
    { rank: 8, name: 'Lucas Taylor', avatar: '🐶', score: 1720, streak: 4 },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-8 h-8 text-yellow-400" />;
      case 2:
        return <Medal className="w-7 h-7 text-gray-400" />;
      case 3:
        return <Award className="w-7 h-7 text-amber-600" />;
      default:
        return <Star className="w-6 h-6 text-blue-400" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-500';
      case 2:
        return 'from-gray-300 to-gray-400';
      case 3:
        return 'from-amber-500 to-amber-600';
      default:
        return 'from-blue-400 to-blue-500';
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-white/80 transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
            {t('back')}
          </button>
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h1 className="text-white text-3xl">{t('leaderboard')}</h1>
          </div>
          <div className="w-20"></div>
        </div>

        {/* Top 3 Podium */}
        <div className="mb-12 flex items-end justify-center gap-4">
          {/* 2nd Place */}
          <div className="flex-1 max-w-[150px]">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center mb-4">
              <div className="text-4xl mb-2">{topPlayers[1].avatar}</div>
              <div className="text-gray-800 mb-1">{topPlayers[1].name}</div>
              <div className="text-gray-600 text-sm">{topPlayers[1].score} pts</div>
            </div>
            <div className="bg-gradient-to-t from-gray-300 to-gray-400 rounded-t-2xl p-4 text-center">
              <Medal className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-white text-2xl">2nd</div>
            </div>
          </div>

          {/* 1st Place */}
          <div className="flex-1 max-w-[170px]">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center mb-4 border-4 border-yellow-400 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 rounded-full p-2">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="text-5xl mb-2">{topPlayers[0].avatar}</div>
              <div className="text-gray-800 mb-1">{topPlayers[0].name}</div>
              <div className="text-gray-600 text-sm">{topPlayers[0].score} pts</div>
            </div>
            <div className="bg-gradient-to-t from-yellow-400 to-yellow-500 rounded-t-2xl p-6 text-center">
              <Trophy className="w-10 h-10 text-white mx-auto mb-2" />
              <div className="text-white text-3xl">1st</div>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex-1 max-w-[150px]">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center mb-4">
              <div className="text-4xl mb-2">{topPlayers[2].avatar}</div>
              <div className="text-gray-800 mb-1">{topPlayers[2].name}</div>
              <div className="text-gray-600 text-sm">{topPlayers[2].score} pts</div>
            </div>
            <div className="bg-gradient-to-t from-amber-500 to-amber-600 rounded-t-2xl p-4 text-center">
              <Award className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-white text-2xl">3rd</div>
            </div>
          </div>
        </div>

        {/* Rest of Leaderboard */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
          <h3 className="text-gray-800 mb-4">{t('topPlayers')}</h3>
          <div className="space-y-3">
            {topPlayers.map((player) => (
              <div
                key={player.rank}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                  player.rank <= 3
                    ? 'bg-gradient-to-r ' + getRankColor(player.rank) + ' text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center justify-center w-12 h-12">
                  {getRankIcon(player.rank)}
                </div>
                <div className="text-3xl">{player.avatar}</div>
                <div className="flex-1">
                  <div className={player.rank <= 3 ? 'text-white' : 'text-gray-800'}>
                    {player.name}
                  </div>
                  <div className={`text-sm ${player.rank <= 3 ? 'text-white/80' : 'text-gray-600'}`}>
                    🔥 {player.streak} {t('dayStreak')}
                  </div>
                </div>
                <div className={`text-xl ${player.rank <= 3 ? 'text-white' : 'text-gray-700'}`}>
                  {player.score} {t('pts')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Your Rank */}
        <div className="mt-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full">
              <span className="text-xl">#12</span>
            </div>
            <div className="text-3xl">🐼</div>
            <div className="flex-1">
              <div className="text-white">{t('you')}</div>
              <div className="text-white/80 text-sm">{t('keepLearningClimb')}</div>
            </div>
            <div className="text-xl">1420 {t('pts')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}