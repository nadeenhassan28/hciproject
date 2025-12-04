import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playSuccessSound } from '../utils/sounds';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface LessonCompleteProps {
  onContinue: () => void;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
}

export function LessonComplete({ onContinue, score, correctAnswers, totalQuestions }: LessonCompleteProps) {
  const { soundEnabled } = useTheme();
  const { t } = useLanguage();
  const isPassing = score > 50;
  
  useEffect(() => {
    // Celebration effects only when passing (score > 50%)
    if (isPassing) {
      playSuccessSound(soundEnabled);
      
      // Multiple confetti bursts
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isPassing, soundEnabled]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background elements - only show celebration for passing */}
      {isPassing && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 text-6xl animate-bounce">⭐</div>
          <div className="absolute top-20 right-20 text-5xl animate-pulse">🎉</div>
          <div className="absolute bottom-20 left-20 text-6xl animate-bounce" style={{ animationDelay: '0.5s' }}>🌟</div>
          <div className="absolute bottom-10 right-10 text-5xl animate-pulse" style={{ animationDelay: '0.3s' }}>✨</div>
          <div className="absolute top-1/2 left-1/4 text-4xl animate-bounce" style={{ animationDelay: '0.7s' }}>🎈</div>
          <div className="absolute top-1/3 right-1/4 text-4xl animate-pulse" style={{ animationDelay: '0.4s' }}>🏆</div>
        </div>
      )}
      
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 w-full max-w-2xl text-center">
        {isPassing ? (
          <>
            {/* Passing Message */}
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-gray-800 mb-4">{t('lessonComplete')}</h2>
            <p className="text-gray-600 mb-8 text-xl">
              {t('greatJobProgress')}
            </p>

            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-8 mb-8">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-4xl text-purple-600 mb-2">{score}%</div>
                  <div className="text-gray-600">{t('score')}</div>
                </div>
                <div>
                  <div className="text-4xl text-blue-600 mb-2">{correctAnswers}/{totalQuestions}</div>
                  <div className="text-gray-600">{t('correctAnswers')}</div>
                </div>
                <div>
                  <div className="text-4xl text-green-600 mb-2">+{correctAnswers * 10}</div>
                  <div className="text-gray-600">{t('points')}</div>
                </div>
              </div>
            </div>

            <button
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-4 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg"
            >
              {t('continueLearning')}
            </button>
          </>
        ) : (
          <>
            {/* Motivational Message for < 50% */}
            <div className="text-8xl mb-6">💪</div>
            <h2 className="text-gray-800 mb-4">{t('keepGoingTitle')}</h2>
            <p className="text-gray-600 mb-8 text-xl">
              {t('learningPractice')}
            </p>

            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-8 mb-8">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-4xl text-blue-600 mb-2">{score}%</div>
                  <div className="text-gray-600">{t('score')}</div>
                </div>
                <div>
                  <div className="text-4xl text-indigo-600 mb-2">{correctAnswers}/{totalQuestions}</div>
                  <div className="text-gray-600">{t('correctAnswers')}</div>
                </div>
                <div>
                  <div className="text-4xl text-purple-600 mb-2">+{correctAnswers * 10}</div>
                  <div className="text-gray-600">{t('points')}</div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3 justify-center mb-3">
                <span className="text-3xl">🌟</span>
                <h3 className="text-gray-800">{t('remember')}</h3>
              </div>
              <p className="text-gray-700">
                {t('everyMistakeLearn')}
              </p>
            </div>

            <button
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-blue-400 to-indigo-500 text-white py-4 rounded-xl hover:from-blue-500 hover:to-indigo-600 transition-all shadow-lg"
            >
              {t('tryAgainButton')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}