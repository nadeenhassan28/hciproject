import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { Difficulty } from '../App';
import confetti from 'canvas-confetti';
import { playCorrectSound, playWrongSound } from '../utils/sounds';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { AdventurePath } from './AdventurePath';

interface CountingLessonProps {
  onComplete: (score: number, correct: number, wrong: number, total: number) => void;
  onBack: () => void;
  difficulty: Difficulty;
  progressData: {
    easy: number;
    medium: number;
    hard: number;
  };
  onDifficultySelect: (difficulty: Difficulty) => void;
}

// Helper function to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const easyQuestions = [
  {
    question: 'How many Apples can you see?',
    items: ['🍎', '🍎', '🍎'],
    options: ['2', '3', '4', '5'],
    correct: 1,
  },
  {
    question: 'How many Stars can you see?',
    items: ['⭐', '⭐', '⭐', '⭐'],
    options: ['2', '3', '4', '5'],
    correct: 2,
  },
  {
    question: 'How many Hearts can you see?',
    items: ['❤️', '❤️'],
    options: ['1', '2', '3', '4'],
    correct: 1,
  },
  {
    question: 'How many Bananas can you see?',
    items: ['🍌', '🍌', '🍌', '🍌', '🍌'],
    options: ['3', '4', '5', '6'],
    correct: 2,
  },
  {
    question: 'How many Flowers can you see?',
    items: ['🌸'],
    options: ['1', '2', '3', '4'],
    correct: 0,
  },
];

const mediumQuestions = [
  {
    question: 'How many Apples can you see?',
    items: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎'],
    options: ['5', '6', '7', '8'],
    correct: 2,
  },
  {
    question: 'How many Cows can you see?',
    items: ['🐮', '🐮', '🐮', '🐮', '🐮', '🐮'],
    options: ['4', '5', '6', '7'],
    correct: 2,
  },
  {
    question: 'How many Carrots can you see?',
    items: ['🥕', '🥕', '🥕', '🥕', '🥕', '🥕', '🥕', '🥕', '🥕'],
    options: ['7', '8', '9', '10'],
    correct: 2,
  },
  {
    question: 'How many Butterflies can you see?',
    items: ['🦋', '🦋', '🦋', '🦋', '🦋', '🦋', '🦋', '🦋'],
    options: ['6', '7', '8', '9'],
    correct: 2,
  },
  {
    question: 'How many Cookies can you see?',
    items: ['🍪', '🍪', '🍪', '🍪', '🍪', '🍪', '🍪', '🍪', '🍪', '🍪'],
    options: ['8', '9', '10', '11'],
    correct: 2,
  },
  {
    question: 'How many Balloons can you see?',
    items: ['🎈', '🎈', '🎈', '🎈', '🎈'],
    options: ['3', '4', '5', '6'],
    correct: 2,
  },
  {
    question: 'How many Fish can you see?',
    items: ['🐟', '🐟', '🐟', '🐟', '🐟', '🐟', '🐟'],
    options: ['5', '6', '7', '8'],
    correct: 2,
  },
  {
    question: 'How many Cats can you see?',
    items: ['🐱', '🐱', '🐱', '🐱', '🐱', '🐱', '🐱', '🐱', '🐱'],
    options: ['7', '8', '9', '10'],
    correct: 2,
  },
];

const hardQuestions = [
  {
    question: 'How many Gems can you see?',
    items: ['💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎'],
    options: ['13', '14', '15', '16'],
    correct: 2,
  },
  {
    question: 'How many Coins can you see?',
    items: ['🪙', '🪙', '🪙', '🪙', '🪙', '🪙', '🪙', '🪙', '🪙', '🪙', '🪙', '🪙'],
    options: ['10', '11', '12', '13'],
    correct: 2,
  },
  {
    question: 'How many Grapes can you see?',
    items: ['🍇', '🍇', '🍇', '🍇', '🍇', '🍇', '🍇', '🍇', '🍇', '🍇', '🍇', '🍇', '🍇', '🍇', '🍇', '🍇', '🍇', '🍇'],
    options: ['16', '17', '18', '19'],
    correct: 2,
  },
  {
    question: 'How many Rockets can you see?',
    items: ['🚀', '🚀', '🚀', '🚀', '🚀', '🚀', '🚀', '🚀', '🚀', '🚀', '🚀', '🚀', '🚀', '🚀'],
    options: ['12', '13', '14', '15'],
    correct: 2,
  },
  {
    question: 'How many Books can you see?',
    items: ['📚', '📚', '📚', '📚', '📚', '📚', '📚', '📚', '📚', '📚', '📚', '📚', '📚', '📚', '📚', '📚', '📚', '📚', '📚', '📚'],
    options: ['18', '19', '20', '21'],
    correct: 2,
  },
  {
    question: 'How many Pizzas can you see?',
    items: ['🍕', '🍕', '🍕', '🍕', '🍕', '🍕', '🍕', '🍕', '🍕', '🍕', '🍕'],
    options: ['9', '10', '11', '12'],
    correct: 2,
  },
  {
    question: 'How many Trees can you see?',
    items: ['🌳', '🌳', '🌳', '🌳', '🌳', '🌳', '🌳', '🌳', '🌳', '🌳', '🌳', '🌳', '🌳', '🌳', '🌳', '🌳'],
    options: ['14', '15', '16', '17'],
    correct: 2,
  },
  {
    question: 'How many Cupcakes can you see?',
    items: ['🧁', '🧁', '🧁', '🧁', '🧁', '🧁', '🧁', '🧁', '🧁', '🧁', '🧁', '🧁', '🧁'],
    options: ['11', '12', '13', '14'],
    correct: 2,
  },
  {
    question: 'How many Lightning Bolts can you see?',
    items: ['⚡', '⚡', '⚡', '⚡', '⚡', '⚡', '⚡', '⚡', '⚡', '⚡', '⚡', '⚡', '⚡', '⚡', '⚡', '⚡', '⚡'],
    options: ['15', '16', '17', '18'],
    correct: 2,
  },
  {
    question: 'How many Strawberries can you see?',
    items: ['🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓', '🍓'],
    options: ['17', '18', '19', '20'],
    correct: 2,
  },
  {
    question: 'How many Lollipops can you see?',
    items: ['🍭', '🍭', '🍭', '🍭', '🍭', '🍭', '🍭', '🍭', '🍭', '🍭'],
    options: ['8', '9', '10', '11'],
    correct: 2,
  },
  {
    question: 'How many Ice Creams can you see?',
    items: ['🍦', '🍦', '🍦', '🍦', '🍦', '🍦', '🍦', '🍦', '🍦', '🍦', '🍦', '🍦', '🍦', '🍦', '🍦'],
    options: ['13', '14', '15', '16'],
    correct: 2,
  },
];

export function CountingLesson({ onComplete, onBack, difficulty, progressData, onDifficultySelect }: CountingLessonProps) {
  const { soundEnabled } = useTheme();
  const { t } = useLanguage();
  const [showAdventurePath, setShowAdventurePath] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(difficulty);
  const [questions, setQuestions] = useState(shuffleArray(easyQuestions));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (selectedDifficulty === 'easy') {
      setQuestions(shuffleArray(easyQuestions));
    } else if (selectedDifficulty === 'medium') {
      setQuestions(shuffleArray(mediumQuestions));
    } else {
      setQuestions(shuffleArray(hardQuestions));
    }
  }, [selectedDifficulty]);

  const handleSelectDifficulty = (diff: Difficulty) => {
    setSelectedDifficulty(diff);
    onDifficultySelect(diff); // Update the global difficulty
    setShowAdventurePath(false);
  };

  if (showAdventurePath) {
    return (
      <AdventurePath
        onSelectDifficulty={handleSelectDifficulty}
        onBack={onBack}
        lessonName={t('counting')}
        lessonIcon="🧮"
        progressData={progressData}
      />
    );
  }

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    setShowFeedback(true);
    
    const isCorrect = index === questions[currentQuestion].correct;
    
    if (isCorrect) {
      setCorrectCount(correctCount + 1);
      // Play clapping sound
      playCorrectSound(soundEnabled);
      // Trigger confetti
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF69B4', '#00FF00', '#00CED1', '#FF1493']
      });
    } else {
      setWrongCount(wrongCount + 1);
      // Play sad sound
      playWrongSound(soundEnabled);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setShowHint(false);
      } else {
        const finalScore = Math.round((correctCount + (isCorrect ? 1 : 0)) / questions.length * 100);
        const finalCorrect = correctCount + (isCorrect ? 1 : 0);
        const finalWrong = wrongCount + (isCorrect ? 0 : 1);
        onComplete(finalScore, finalCorrect, finalWrong, questions.length);
      }
    }, 2000);
  };

  const handleQuit = () => {
    setShowQuitDialog(true);
  };

  const confirmQuit = () => {
    onBack();
  };

  const cancelQuit = () => {
    setShowQuitDialog(false);
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correct;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleQuit}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/80 hover:bg-red-600/90 text-white rounded-xl transition-all"
          >
            ❌ {t('back')}
          </button>
          <div className="flex items-center gap-3">
            <div className="text-2xl">🐼</div>
            <h2 className="text-white">{t('counting').toUpperCase()}</h2>
            <span className="ml-4 px-3 py-1 bg-white/20 rounded-lg text-white text-sm">
              {t(difficulty)}
            </span>
          </div>
          <div className="px-4 py-2 bg-white/20 rounded-xl text-white">
            {t('question')} {currentQuestion + 1} / {questions.length}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex gap-2 justify-center">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentQuestion
                    ? 'w-12 bg-white'
                    : index < currentQuestion
                    ? 'w-8 bg-green-400'
                    : 'w-8 bg-white/20'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-white mt-3 text-sm">
            <span>✅ {t('correct')}: {correctCount}</span>
            <span>{t('progress')}: {Math.round(((currentQuestion) / questions.length) * 100)}%</span>
            <span>❌ {t('tryAgain')}: {wrongCount}</span>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12">
          {!showFeedback ? (
            <>
              <div className="text-center mb-8">
                <p className="text-gray-700 mb-6 text-xl">{question.question}</p>
                <div className="flex justify-center gap-4 mb-8 flex-wrap">
                  {question.items.map((item, index) => (
                    <div key={index} className="text-6xl">
                      {item}
                    </div>
                  ))}
                </div>
                <div className="text-6xl mb-4">❓</div>
              </div>

              {!showHint && (
                <div className="text-center mb-6">
                  <button
                    onClick={toggleHint}
                    className="px-6 py-2 bg-yellow-400/80 hover:bg-yellow-500/90 text-gray-800 rounded-xl transition-all"
                  >
                    💡 Need a hint?
                  </button>
                </div>
              )}

              {showHint && (
                <div className="mb-6 p-4 bg-yellow-100 border-2 border-yellow-400 rounded-xl">
                  <p className="text-gray-700">
                    💡 <strong>Hint:</strong> Count each item carefully one by one!
                  </p>
                </div>
              )}

              <div className="grid grid-cols-4 gap-4">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`py-6 px-4 rounded-2xl transition-all text-xl border-2 ${
                      selectedAnswer === null
                        ? 'bg-gradient-to-br from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 hover:scale-105 border-transparent hover:border-blue-300 cursor-pointer'
                        : 'bg-gray-200 border-gray-300 cursor-not-allowed opacity-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="text-9xl mb-6">
                {isCorrect ? '✅' : '❌'}
              </div>
              <h3 className="text-gray-800 mb-4">
                {isCorrect ? t('correct') + '!' : t('tryAgain') + '!'}
              </h3>
              <p className="text-gray-600">
                {isCorrect ? t('greatWork') + ' ' + t('keepGoing') + '!' : `${t('correctAnswers')}: ${question.options[question.correct]}`}
              </p>
            </div>
          )}
        </div>

        {showQuitDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-gray-800 mb-2">{t('areYouSure')}</h3>
                <p className="text-gray-600">
                  {t('logoutMessage')}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={cancelQuit}
                  className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all"
                >
                  ✓ {t('continueLearning')}
                </button>
                <button
                  onClick={confirmQuit}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all"
                >
                  ✗ {t('back')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}