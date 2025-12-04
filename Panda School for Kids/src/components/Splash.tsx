import { useEffect } from "react";

interface SplashProps {
  onContinue: () => void;
}

export function Splash({ onContinue }: SplashProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-300">
      <div className="text-center">
        <div className="text-7xl mb-6">🐼</div>
        <h1 className="text-white text-6xl tracking-wider">
          Panda School
        </h1>
      </div>
    </div>
  );
}