import { useState, useEffect } from 'react';
import { Splash } from './components/Splash';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Dashboard } from './components/Dashboard';
import { LessonComplete } from './components/LessonComplete';
import { AvatarSelect } from './components/AvatarSelect';
import { ShapesLesson } from './components/ShapesLesson';
import { NumbersLesson } from './components/NumbersLesson';
import { CountingLesson } from './components/CountingLesson';
import { ParentDashboard } from './components/ParentDashboard';
import { Leaderboard } from './components/Leaderboard';
import { Settings } from './components/Settings';
import { ThemeProvider, useTheme, themes } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { startBackgroundMusic, stopBackgroundMusic } from './utils/sounds';
import { projectId, publicAnonKey } from './utils/supabase/info';

export type Screen = 'splash' | 'login' | 'signup' | 'avatar' | 'dashboard' | 'parent-dashboard' | 'lesson-complete' | 'shapes' | 'numbers' | 'counting' | 'leaderboard' | 'settings';

export interface UserData {
  parentName: string;
  childName: string;
  childAge: string;
  avatar: number;
}

export interface LessonProgress {
  shapes: number;
  numbers: number;
  counting: number;
}

export interface DifficultyProgress {
  easy: number;
  medium: number;
  hard: number;
}

export interface LessonDifficultyProgress {
  shapes: DifficultyProgress;
  numbers: DifficultyProgress;
  counting: DifficultyProgress;
}

export interface CurrentDifficulty {
  shapes: Difficulty;
  numbers: Difficulty;
  counting: Difficulty;
}

export interface Activity {
  lessonId: string;
  lessonName: string;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  difficulty: string;
  timestamp: Date;
}

export interface ProgressData {
  lessonsCompleted: number;
  streak: number;
  averageScore: number;
  totalCorrectAnswers: number;
  totalWrongAnswers: number;
  answerStats: {
    shapes: { correct: number; wrong: number };
    numbers: { correct: number; wrong: number };
    counting: { correct: number; wrong: number };
  };
  lessonProgress: LessonProgress;
  difficultyProgress: LessonDifficultyProgress;
  currentDifficulty: CurrentDifficulty;
  activities: Activity[];
  screenTime: { day: string; time: number }[];
}

const getInitialProgress = (): ProgressData => ({
  lessonsCompleted: 0,
  streak: 0,
  averageScore: 0,
  totalCorrectAnswers: 0,
  totalWrongAnswers: 0,
  answerStats: {
    shapes: { correct: 0, wrong: 0 },
    numbers: { correct: 0, wrong: 0 },
    counting: { correct: 0, wrong: 0 },
  },
  lessonProgress: {
    shapes: 0,
    numbers: 0,
    counting: 0,
  },
  difficultyProgress: {
    shapes: { easy: 0, medium: 0, hard: 0 },
    numbers: { easy: 0, medium: 0, hard: 0 },
    counting: { easy: 0, medium: 0, hard: 0 },
  },
  currentDifficulty: {
    shapes: 'easy',
    numbers: 'easy',
    counting: 'easy',
  },
  activities: [],
  screenTime: [
    { day: 'Sun', time: 0 },
    { day: 'Mon', time: 0 },
    { day: 'Tue', time: 0 },
    { day: 'Wed', time: 0 },
    { day: 'Thu', time: 0 },
    { day: 'Fri', time: 0 },
    { day: 'Sat', time: 0 },
  ],
});

export type Difficulty = 'easy' | 'medium' | 'hard';

function AppContent() {
  const { theme, musicEnabled } = useTheme();
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData>({
    parentName: '',
    childName: '',
    childAge: '',
    avatar: 0,
  });
  const [progressData, setProgressData] = useState<ProgressData>(getInitialProgress());
  const [currentLessonScore, setCurrentLessonScore] = useState<number>(0);
  const [currentLessonCorrect, setCurrentLessonCorrect] = useState<number>(0);
  const [currentLessonTotal, setCurrentLessonTotal] = useState<number>(0);
  const [currentLesson, setCurrentLesson] = useState<string>('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  // Check for existing session and load user data on mount
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        try {
          // Fetch user data from backend
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-7534bb61/user-data`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const { data } = await response.json();
            
            // If user has complete profile, load data and go to dashboard
            if (data.profile && data.child) {
              setAccessToken(token);
              setUserData({
                parentName: data.profile.parentName,
                childName: data.child.childName,
                childAge: data.child.childAge,
                avatar: data.child.avatar,
              });
              
              // Load progress data if it exists
              if (data.progress) {
                setProgressData(data.progress);
              }
              
              setCurrentScreen('dashboard');
            } else {
              // User exists but hasn't completed profile setup
              if (data.profile) {
                setAccessToken(token);
                setUserData(prev => ({ ...prev, parentName: data.profile.parentName }));
                setCurrentScreen('avatar');
              } else {
                // Token invalid or user doesn't exist
                localStorage.removeItem('accessToken');
                setCurrentScreen('login');
              }
            }
          } else {
            // Token invalid
            localStorage.removeItem('accessToken');
            setCurrentScreen('login');
          }
        } catch (error) {
          console.error('Session check error:', error);
          localStorage.removeItem('accessToken');
          setCurrentScreen('login');
        }
      }
      
      setLoading(false);
    };

    checkSession();
  }, []);

  // Auto-save progress data whenever it changes
  useEffect(() => {
    const saveProgress = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token || loading) return;

      try {
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-7534bb61/progress`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(progressData),
          }
        );
        console.log('Progress saved successfully');
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    };

    // Debounce saves - only save after 2 seconds of no changes
    const timeoutId = setTimeout(saveProgress, 2000);
    return () => clearTimeout(timeoutId);
  }, [progressData, loading]);

  // Handle global background music
  useEffect(() => {
    if (musicEnabled) {
      startBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }
    
    return () => {
      stopBackgroundMusic();
    };
  }, [musicEnabled]);

  const updateProgress = (lessonId: string, score: number, correctAnswers: number, wrongAnswers: number) => {
    setProgressData(prev => {
      const newLessonsCompleted = prev.lessonsCompleted + 1;
      const totalScore = prev.averageScore * prev.lessonsCompleted + score;
      const newAverageScore = newLessonsCompleted > 0 ? Math.round(totalScore / newLessonsCompleted) : 0;

      // Update lesson progress (increment by 10% per completion, max 100%)
      const lessonKey = lessonId as keyof LessonProgress;
      const currentProgress = prev.lessonProgress[lessonKey] || 0;
      const newProgress = Math.min(currentProgress + 10, 100);

      // Add activity
      const lessonNames: { [key: string]: string } = {
        shapes: 'Shapes',
        numbers: 'Numbers',
        counting: 'Counting',
      };

      const newActivity: Activity = {
        lessonId,
        lessonName: lessonNames[lessonId] || lessonId,
        score,
        correctAnswers,
        wrongAnswers,
        difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
        timestamp: new Date(),
      };

      // Update screen time for today (add time based on difficulty)
      const timeToAdd = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 8;
      const today = new Date().getDay();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const updatedScreenTime = prev.screenTime.map(st => 
        st.day === days[today] ? { ...st, time: st.time + timeToAdd } : st
      );

      // Simple streak logic: increment if completing lessons
      const newStreak = prev.streak + 1;

      // Update difficulty progress - store the best score percentage for this difficulty
      const currentDifficultyScore = prev.difficultyProgress[lessonKey][difficulty];
      const newDifficultyScore = Math.max(currentDifficultyScore, score);

      // Auto-advance difficulty if score > 50%
      let newCurrentDifficulty = prev.currentDifficulty[lessonKey];
      if (score > 50) {
        if (difficulty === 'easy') {
          newCurrentDifficulty = 'medium';
        } else if (difficulty === 'medium') {
          newCurrentDifficulty = 'hard';
        }
      }

      return {
        lessonsCompleted: newLessonsCompleted,
        streak: newStreak,
        averageScore: newAverageScore,
        totalCorrectAnswers: prev.totalCorrectAnswers + correctAnswers,
        totalWrongAnswers: prev.totalWrongAnswers + wrongAnswers,
        answerStats: {
          ...prev.answerStats,
          [lessonKey]: {
            correct: prev.answerStats[lessonKey].correct + correctAnswers,
            wrong: prev.answerStats[lessonKey].wrong + wrongAnswers,
          },
        },
        lessonProgress: {
          ...prev.lessonProgress,
          [lessonKey]: newProgress,
        },
        difficultyProgress: {
          ...prev.difficultyProgress,
          [lessonKey]: {
            ...prev.difficultyProgress[lessonKey],
            [difficulty]: newDifficultyScore,
          },
        },
        currentDifficulty: {
          ...prev.currentDifficulty,
          [lessonKey]: newCurrentDifficulty,
        },
        activities: [newActivity, ...prev.activities.slice(0, 9)], // Keep last 10 activities
        screenTime: updatedScreenTime,
      };
    });
  };

  const renderScreen = () => {
    // Show loading state while checking session
    if (loading && currentScreen === 'splash') {
      return <Splash onContinue={() => {}} />;
    }

    switch (currentScreen) {
      case 'splash':
        return <Splash onContinue={() => setCurrentScreen('login')} />;
      case 'login':
        return <Login onLogin={async (token) => {
          setAccessToken(token);
          // Fetch user data
          try {
            const response = await fetch(
              `https://${projectId}.supabase.co/functions/v1/make-server-7534bb61/user-data`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              }
            );

            if (response.ok) {
              const { data } = await response.json();
              
              if (data.profile && data.child) {
                setUserData({
                  parentName: data.profile.parentName,
                  childName: data.child.childName,
                  childAge: data.child.childAge,
                  avatar: data.child.avatar,
                });
                
                if (data.progress) {
                  setProgressData(data.progress);
                }
                
                setCurrentScreen('dashboard');
              } else if (data.profile) {
                setUserData(prev => ({ ...prev, parentName: data.profile.parentName }));
                setCurrentScreen('avatar');
              }
            }
          } catch (error) {
            console.error('Failed to fetch user data:', error);
            setCurrentScreen('dashboard');
          }
        }} onSignup={() => setCurrentScreen('signup')} />;
      case 'signup':
        return <Signup onSignup={(parentName, token) => { 
          setAccessToken(token);
          setUserData(prev => ({ ...prev, parentName })); 
          setProgressData(getInitialProgress()); // Reset progress on new signup
          localStorage.removeItem('avatarSelection'); // Clear any previous avatar selection
          setCurrentScreen('avatar'); 
        }} onLogin={() => setCurrentScreen('login')} />;
      case 'avatar':
        return <AvatarSelect 
          onSelect={async (childName, childAge, avatar) => { 
            setUserData(prev => ({ ...prev, childName, childAge, avatar }));
            
            // Save child profile to backend
            const token = localStorage.getItem('accessToken');
            if (token) {
              try {
                await fetch(
                  `https://${projectId}.supabase.co/functions/v1/make-server-7534bb61/child-profile`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ childName, childAge, avatar }),
                  }
                );
              } catch (error) {
                console.error('Failed to save child profile:', error);
              }
            }
            
            setCurrentScreen('dashboard'); 
          }} 
          onBack={() => {
            localStorage.removeItem('avatarSelection'); // Clear avatar selection when going back
            setCurrentScreen('signup');
          }}
        />;
      case 'lesson-complete':
        return <LessonComplete 
          score={currentLessonScore} 
          correctAnswers={currentLessonCorrect}
          totalQuestions={currentLessonTotal}
          onContinue={() => setCurrentScreen('dashboard')} 
        />;
      case 'dashboard':
        return <Dashboard 
          onSelectLesson={(lesson) => {
            setCurrentLesson(lesson);
            setCurrentScreen(lesson as Screen);
          }} 
          onParentDashboard={() => setCurrentScreen('parent-dashboard')} 
          progressData={progressData}
        />;
      case 'parent-dashboard':
        return <ParentDashboard 
          onBack={() => setCurrentScreen('dashboard')} 
          userData={userData} 
          progressData={progressData}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
        />;
      case 'shapes':
        return <ShapesLesson 
          onComplete={(score, correct, wrong, total) => {
            updateProgress('shapes', score, correct, wrong);
            setCurrentLessonScore(score);
            setCurrentLessonCorrect(correct);
            setCurrentLessonTotal(total);
            setCurrentScreen('lesson-complete');
          }} 
          onBack={() => setCurrentScreen('dashboard')}
          difficulty={progressData.currentDifficulty.shapes}
          progressData={progressData.difficultyProgress.shapes}
          onDifficultySelect={setDifficulty}
        />;
      case 'numbers':
        return <NumbersLesson 
          onComplete={(score, correct, wrong, total) => {
            updateProgress('numbers', score, correct, wrong);
            setCurrentLessonScore(score);
            setCurrentLessonCorrect(correct);
            setCurrentLessonTotal(total);
            setCurrentScreen('lesson-complete');
          }} 
          onBack={() => setCurrentScreen('dashboard')}
          difficulty={progressData.currentDifficulty.numbers}
          progressData={progressData.difficultyProgress.numbers}
          onDifficultySelect={setDifficulty}
        />;
      case 'counting':
        return <CountingLesson 
          onComplete={(score, correct, wrong, total) => {
            updateProgress('counting', score, correct, wrong);
            setCurrentLessonScore(score);
            setCurrentLessonCorrect(correct);
            setCurrentLessonTotal(total);
            setCurrentScreen('lesson-complete');
          }} 
          onBack={() => setCurrentScreen('dashboard')}
          difficulty={progressData.currentDifficulty.counting}
          progressData={progressData.difficultyProgress.counting}
          onDifficultySelect={setDifficulty}
        />;
      case 'leaderboard':
        return <Leaderboard onBack={() => setCurrentScreen('dashboard')} />;
      case 'settings':
        return <Settings 
          onBack={() => setCurrentScreen('dashboard')} 
          userData={userData}
          onUpdateProfile={(updatedData) => setUserData(updatedData)}
          onLogout={() => {
            // Clear access token from localStorage
            localStorage.removeItem('accessToken');
            // Clear avatar selection
            localStorage.removeItem('avatarSelection');
            // Reset all state
            setAccessToken(null);
            setUserData({
              parentName: '',
              childName: '',
              childAge: '',
              avatar: 0,
            });
            setProgressData(getInitialProgress());
            // Go back to splash screen
            setCurrentScreen('splash');
          }}
        />;
      default:
        return <Splash onContinue={() => setCurrentScreen('login')} />;
    }
  };

  const currentTheme = themes[theme];

  return (
    <div className={`min-h-screen ${currentTheme.gradient}`}>
      {renderScreen()}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}