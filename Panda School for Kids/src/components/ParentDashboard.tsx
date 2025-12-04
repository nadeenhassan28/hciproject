import {
  ArrowLeft,
  User,
  Flame,
  Trophy,
  Target,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { UserData, ProgressData, Difficulty } from "../App";
import { useTheme, themes } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface ParentDashboardProps {
  onBack: () => void;
  userData: UserData;
  progressData: ProgressData;
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

export function ParentDashboard({
  onBack,
  userData,
  progressData,
  difficulty,
  onDifficultyChange,
}: ParentDashboardProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const currentTheme = themes[theme];
  const avatars = ["🐣", "🐼", "🐰", "🐱", "🐻", "🐨"];

  // Calculate overall progress for each lesson based on completed difficulties (same as Dashboard)
  const calculateProgress = (difficultyProgress: { easy: number, medium: number, hard: number }) => {
    let progress = 0;
    if (difficultyProgress.easy > 50) progress += 33.3;
    if (difficultyProgress.medium > 50) progress += 33.3;
    if (difficultyProgress.hard > 50) progress += 33.4; // 33.4 to make it exactly 100%
    return Math.round(progress);
  };

  const shapesProgress = calculateProgress(progressData.difficultyProgress.shapes);
  const numbersProgress = calculateProgress(progressData.difficultyProgress.numbers);
  const countingProgress = calculateProgress(progressData.difficultyProgress.counting);

  // Areas needing focus (sorted by progress) - using the same calculation as Dashboard
  const areasNeedingFocus = [
    {
      subject: "Counting",
      score: countingProgress,
      color: "bg-green-400",
      difficultyProgress: progressData.difficultyProgress.counting,
    },
    {
      subject: "Shapes",
      score: shapesProgress,
      color: "bg-purple-400",
      difficultyProgress: progressData.difficultyProgress.shapes,
    },
    {
      subject: "Numbers",
      score: numbersProgress,
      color: "bg-blue-400",
      difficultyProgress: progressData.difficultyProgress.numbers,
    },
  ].sort((a, b) => a.score - b.score);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-white/80 transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
            {t('backToDashboard')}
          </button>
          <div className="flex items-center gap-3">
            <div className="text-2xl">🐼</div>
            <h1 className="text-white text-3xl">
              {t('parentDashboard')}
            </h1>
          </div>
          <div className="w-32"></div>
        </div>

        {/* Parent & Child Info */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <h3 className="text-gray-800 mb-4">
            {t('profile')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-3xl">
                👨‍👩‍👧
              </div>
              <div>
                <div className="text-gray-500 text-sm">
                  {t('parentName')}
                </div>
                <div className="text-gray-800">
                  {userData.parentName || t('notSet')}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-3xl">
                {avatars[userData.avatar] || "👧"}
              </div>
              <div>
                <div className="text-gray-500 text-sm">
                  {t('childName')}
                </div>
                <div className="text-gray-800">
                  {userData.childName || t('notSet')} (
                  {userData.childAge
                    ? `${userData.childAge} ${t('yearsOld')}`
                    : t('notSet')}
                  )
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Answer Statistics */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <h3 className="text-gray-800 mb-4">{t('answerStatistics')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Shapes Stats */}
            <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🔷</span>
                <span className="text-gray-800">{t('shapes')}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <span className="text-green-600">✓</span> {t('correct')}
                  </span>
                  <span className="text-gray-800">{progressData.answerStats.shapes.correct}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <span className="text-red-600">✗</span> {t('tryAgain')}
                  </span>
                  <span className="text-gray-800">{progressData.answerStats.shapes.wrong}</span>
                </div>
              </div>
            </div>

            {/* Numbers Stats */}
            <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🔢</span>
                <span className="text-gray-800">{t('numbers')}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <span className="text-green-600">✓</span> {t('correct')}
                  </span>
                  <span className="text-gray-800">{progressData.answerStats.numbers.correct}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <span className="text-red-600">✗</span> {t('tryAgain')}
                  </span>
                  <span className="text-gray-800">{progressData.answerStats.numbers.wrong}</span>
                </div>
              </div>
            </div>

            {/* Counting Stats */}
            <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🧮</span>
                <span className="text-gray-800">{t('counting')}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <span className="text-green-600">✓</span> {t('correct')}
                  </span>
                  <span className="text-gray-800">{progressData.answerStats.counting.correct}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <span className="text-red-600">✗</span> {t('tryAgain')}
                  </span>
                  <span className="text-gray-800">{progressData.answerStats.counting.wrong}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-gray-500 text-sm">
                {t('streak')}
              </span>
            </div>
            <div className="text-gray-800 text-2xl">
              {progressData.streak}{" "}
              {progressData.streak === 1 ? t('day') : t('days')}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-500 text-sm">
                {t('completed')}
              </span>
            </div>
            <div className="text-gray-800 text-2xl">
              {progressData.lessonsCompleted}{" "}
              {progressData.lessonsCompleted === 1
                ? t('lesson')
                : t('lessons')}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-green-500" />
              <span className="text-gray-500 text-sm">
                {t('avgScore')}
              </span>
            </div>
            <div className="text-gray-800 text-2xl">
              {progressData.averageScore}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Screen Time Chart */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="mb-6">
              <h3 className="text-gray-800 mb-1">
                {t('screenTime')}
              </h3>
              <p className="text-gray-500 text-sm">
                {t('thisWeek')} →
              </p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={progressData.screenTime}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e0e0e0"
                />
                <XAxis dataKey="day" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [
                    `${value} ${t('minutes')}`,
                    t('time'),
                  ]}
                />
                <Bar
                  dataKey="time"
                  fill="#8b5cf6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Lesson Progress Chart */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="mb-6">
              <h3 className="text-gray-800 mb-1">
                {t('lessonProgress')}
              </h3>
              <p className="text-gray-500 text-sm">
                {t('overallCompletion')} →
              </p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={[
                  {
                    name: t('shapes'),
                    progress: shapesProgress,
                  },
                  {
                    name: t('numbers'),
                    progress: numbersProgress,
                  },
                  {
                    name: t('counting'),
                    progress: countingProgress,
                  },
                ]}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e0e0e0"
                />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [
                    `${value}%`,
                    t('progress'),
                  ]}
                />
                <Bar
                  dataKey="progress"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Game Level & Focus Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Learning Levels */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h3 className="text-gray-800 mb-6">{t('currentLearningLevels')}</h3>
            <div className="space-y-4">
              {/* Shapes Level */}
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🔷</div>
                  <div>
                    <div className="text-gray-800">{t('shapes')}</div>
                    <div className="text-sm text-gray-500">{t('overallProgress')}: {shapesProgress}%</div>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-lg font-medium ${
                  progressData.currentDifficulty.shapes === 'easy' 
                    ? 'bg-green-100 text-green-700'
                    : progressData.currentDifficulty.shapes === 'medium'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {progressData.currentDifficulty.shapes === 'easy' && `🌱 ${t('easy')}`}
                  {progressData.currentDifficulty.shapes === 'medium' && `⛰️ ${t('medium')}`}
                  {progressData.currentDifficulty.shapes === 'hard' && `🏔️ ${t('hard')}`}
                </div>
              </div>

              {/* Numbers Level */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🔢</div>
                  <div>
                    <div className="text-gray-800">{t('numbers')}</div>
                    <div className="text-sm text-gray-500">{t('overallProgress')}: {numbersProgress}%</div>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-lg font-medium ${
                  progressData.currentDifficulty.numbers === 'easy' 
                    ? 'bg-green-100 text-green-700'
                    : progressData.currentDifficulty.numbers === 'medium'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {progressData.currentDifficulty.numbers === 'easy' && `🌱 ${t('easy')}`}
                  {progressData.currentDifficulty.numbers === 'medium' && `⛰️ ${t('medium')}`}
                  {progressData.currentDifficulty.numbers === 'hard' && `🏔️ ${t('hard')}`}
                </div>
              </div>

              {/* Counting Level */}
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🧮</div>
                  <div>
                    <div className="text-gray-800">{t('counting')}</div>
                    <div className="text-sm text-gray-500">{t('overallProgress')}: {countingProgress}%</div>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-lg font-medium ${
                  progressData.currentDifficulty.counting === 'easy' 
                    ? 'bg-green-100 text-green-700'
                    : progressData.currentDifficulty.counting === 'medium'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {progressData.currentDifficulty.counting === 'easy' && `🌱 ${t('easy')}`}
                  {progressData.currentDifficulty.counting === 'medium' && `⛰️ ${t('medium')}`}
                  {progressData.currentDifficulty.counting === 'hard' && `🏔️ ${t('hard')}`}
                </div>
              </div>
            </div>
          </div>

          {/* Areas Needing Focus */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h3 className="text-gray-800 mb-6">
              {t('areasNeedingFocus')}
            </h3>
            <div className="space-y-4">
              {areasNeedingFocus.map((area) => (
                <div key={area.subject}>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{area.subject === 'Shapes' ? t('shapes') : area.subject === 'Numbers' ? t('numbers') : t('counting')}</span>
                    <span>{area.score}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${area.color} transition-all`}
                      style={{ width: `${area.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <h3 className="text-gray-800 mb-6">
            {t('recentActivity')}
          </h3>
          {progressData.activities.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {t('noActivitiesYet')}
            </p>
          ) : (
            <div className="space-y-4">
              {progressData.activities.map(
                (activity, index) => {
                  const icons: { [key: string]: string } = {
                    shapes: "🔷",
                    numbers: "🔢",
                    counting: "🧮",
                  };
                  const getTimeAgo = (date: Date) => {
                    const minutes = Math.floor(
                      (new Date().getTime() -
                        new Date(date).getTime()) /
                        60000,
                    );
                    if (minutes < 1) return t('justNow');
                    if (minutes < 60)
                      return `${minutes} ${minutes === 1 ? t('minute') : t('minutes')} ${t('ago')}`;
                    const hours = Math.floor(minutes / 60);
                    if (hours < 24)
                      return `${hours} ${hours === 1 ? t('hour') : t('hours')} ${t('ago')}`;
                    const days = Math.floor(hours / 24);
                    return `${days} ${days === 1 ? t('day') : t('days')} ${t('ago')}`;
                  };
                  const scoreColor =
                    activity.score >= 80
                      ? "text-green-600"
                      : activity.score >= 60
                        ? "text-yellow-600"
                        : "text-red-600";

                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between py-3 ${index < progressData.activities.length - 1 ? "border-b border-gray-200" : ""}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">
                          {icons[activity.lessonId] || "📚"}
                        </div>
                        <div>
                          <div className="text-gray-800">
                            {t('completed')} {activity.lessonName}{" "}
                            {t('lesson')}
                            <span className="text-xs ml-2 px-2 py-1 rounded-full bg-gray-200 text-gray-600">
                              {t(activity.difficulty)}
                            </span>
                          </div>
                          <div className="text-gray-500 text-sm">
                            {getTimeAgo(activity.timestamp)} • {" "}
                            <span className="text-green-600">✓ {activity.correctAnswers}</span>
                            {" "}/{" "}
                            <span className="text-red-600">✗ {activity.wrongAnswers}</span>
                          </div>
                        </div>
                      </div>
                      <div className={scoreColor}>
                        {activity.score}%
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}