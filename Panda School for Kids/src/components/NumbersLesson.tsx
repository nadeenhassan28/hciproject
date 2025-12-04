import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { Difficulty } from '../App';
import confetti from 'canvas-confetti';
import { playCorrectSound, playWrongSound } from '../utils/sounds';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { AdventurePath } from './AdventurePath';

interface NumbersLessonProps {
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
    question: 'What is the sum?',
    problem: '2 + 3',
    options: ['4', '5', '6', '7'],
    correct: 1,
  },
  {
    question: 'What is the difference?',
    problem: '5 - 2',
    options: ['2', '3', '4', '5'],
    correct: 1,
  },
  {
    question: 'What is the sum?',
    problem: '1 + 1',
    options: ['1', '2', '3', '4'],
    correct: 1,
  },
  {
    question: 'What is the sum?',
    problem: '4 + 2',
    options: ['5', '6', '7', '8'],
    correct: 1,
  },
  {
    question: 'What is the difference?',
    problem: '10 - 5',
    options: ['3', '4', '5', '6'],
    correct: 2,
  },
];

const mediumQuestions = [
  {
    question: 'What is the sum?',
    problem: '12 + 8',
    options: ['18', '19', '20', '21'],
    correct: 2,
  },
  {
    question: 'What is the product?',
    problem: '3 × 4',
    options: ['10', '11', '12', '13'],
    correct: 2,
  },
  {
    question: 'What is the difference?',
    problem: '25 - 13',
    options: ['10', '11', '12', '13'],
    correct: 2,
  },
  {
    question: 'What is the sum?',
    problem: '15 + 17',
    options: ['30', '31', '32', '33'],
    correct: 2,
  },
  {
    question: 'What is the product?',
    problem: '5 × 6',
    options: ['28', '29', '30', '31'],
    correct: 2,
  },
  {
    question: 'What is the quotient?',
    problem: '20 ÷ 4',
    options: ['4', '5', '6', '7'],
    correct: 1,
  },
  {
    question: 'What is the sum?',
    problem: '23 + 19',
    options: ['40', '41', '42', '43'],
    correct: 2,
  },
  {
    question: 'What is the difference?',
    problem: '50 - 28',
    options: ['20', '21', '22', '23'],
    correct: 2,
  },
];

const hardQuestions = [
  {
    question: 'What is the sum?',
    problem: '34 + 28',
    options: ['60', '61', '62', '63'],
    correct: 2,
  },
  {
    question: 'What is the product?',
    problem: '9 × 7',
    options: ['61', '62', '63', '64'],
    correct: 2,
  },
  {
    question: 'What is the difference?',
    problem: '75 - 48',
    options: ['25', '26', '27', '28'],
    correct: 2,
  },
  {
    question: 'What is the quotient?',
    problem: '72 ÷ 9',
    options: ['6', '7', '8', '9'],
    correct: 2,
  },
  {
    question: 'What is the product?',
    problem: '8 × 6',
    options: ['46', '47', '48', '49'],
    correct: 2,
  },
  {
    question: 'What is the sum?',
    problem: '56 + 37',
    options: ['91', '92', '93', '94'],
    correct: 2,
  },
  {
    question: 'What is the difference?',
    problem: '100 - 43',
    options: ['55', '56', '57', '58'],
    correct: 2,
  },
  {
    question: 'What is the product?',
    problem: '12 × 5',
    options: ['58', '59', '60', '61'],
    correct: 2,
  },
  {
    question: 'What is the quotient?',
    problem: '54 ÷ 6',
    options: ['7', '8', '9', '10'],
    correct: 2,
  },
  {
    question: 'What is the sum?',
    problem: '68 + 45',
    options: ['111', '112', '113', '114'],
    correct: 2,
  },
];

export function NumbersLesson({ onComplete, onBack, difficulty, progressData, onDifficultySelect }: NumbersLessonProps) {
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
        lessonName={t('numbers')}
        lessonIcon="🔢"
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
            <h2 className="text-white">{t('numbers').toUpperCase()}</h2>
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
                <div className="text-6xl mb-8 text-gray-800">{question.problem}</div>
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
                    💡 <strong>Hint:</strong> Break the problem into smaller steps and solve it carefully!
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`py-6 px-8 rounded-2xl transition-all text-xl border-2 ${
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