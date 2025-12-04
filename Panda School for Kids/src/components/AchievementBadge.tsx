import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, Zap, Target, Award, Crown } from 'lucide-react';

interface AchievementBadgeProps {
  type: 'first_lesson' | 'perfect_score' | 'streak_5' | 'fast_learner' | 'master' | 'champion';
  onClose: () => void;
}

const achievements = {
  first_lesson: {
    icon: Star,
    title: 'First Steps!',
    description: 'Completed your first lesson',
    color: 'from-yellow-400 to-orange-400',
  },
  perfect_score: {
    icon: Trophy,
    title: 'Perfect Score!',
    description: 'Got 100% on a lesson',
    color: 'from-purple-400 to-pink-400',
  },
  streak_5: {
    icon: Zap,
    title: '5 Day Streak!',
    description: 'Learned for 5 days in a row',
    color: 'from-orange-400 to-red-400',
  },
  fast_learner: {
    icon: Target,
    title: 'Fast Learner!',
    description: 'Completed 10 lessons',
    color: 'from-blue-400 to-cyan-400',
  },
  master: {
    icon: Award,
    title: 'Subject Master!',
    description: 'Reached 100% in a subject',
    color: 'from-green-400 to-emerald-400',
  },
  champion: {
    icon: Crown,
    title: 'Champion!',
    description: 'Reached top 10 on leaderboard',
    color: 'from-yellow-500 to-yellow-600',
  },
};

export function AchievementBadge({ type, onClose }: AchievementBadgeProps) {
  const [show, setShow] = useState(true);
  const achievement = achievements[type];
  const Icon = achievement.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 500);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', duration: 0.8 }}
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
    >
      <div className="relative">
        {/* Glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${achievement.color} blur-3xl opacity-50 animate-pulse`} />
        
        {/* Badge */}
        <motion.div
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className={`relative bg-gradient-to-br ${achievement.color} rounded-3xl p-8 shadow-2xl pointer-events-auto`}
        >
          <div className="text-center text-white">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="mb-4"
            >
              <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                <Icon className="w-12 h-12" />
              </div>
            </motion.div>
            
            <h2 className="text-3xl mb-2">{achievement.title}</h2>
            <p className="text-white/90 mb-4">{achievement.description}</p>
            
            <div className="flex justify-center gap-2">
              <Star className="w-6 h-6 fill-current" />
              <Star className="w-6 h-6 fill-current" />
              <Star className="w-6 h-6 fill-current" />
            </div>
          </div>
        </motion.div>

        {/* Sparkles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, x: 0, y: 0 }}
            animate={{
              scale: [0, 1, 0],
              x: Math.cos((i * Math.PI * 2) / 8) * 100,
              y: Math.sin((i * Math.PI * 2) / 8) * 100,
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.1,
              repeat: Infinity,
            }}
            className="absolute top-1/2 left-1/2 text-2xl"
            style={{ marginLeft: -12, marginTop: -12 }}
          >
            ✨
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
