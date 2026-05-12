import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Zap, Target, Activity, ShieldCheck } from 'lucide-react';

export const OnboardingGuide = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('funnel_lens_onboarding');
    if (!hasSeenOnboarding) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeGuide = () => {
    localStorage.setItem('funnel_lens_onboarding', 'true');
    setIsVisible(false);
  };

  const guides = [
    {
      title: "Welcome to FunnelLens",
      description: "We help you find exactly where your marketing budget is being wasted. Think of your marketing like a pipe—we find the leaks.",
      icon: <Activity className="text-blue-500" size={32} />,
      color: "bg-blue-50"
    },
    {
      title: "The Step-by-Step Logic",
      description: "We check your funnel from top to bottom. If the top (Targeting) is broken, we tell you to fix that first before worrying about the bottom (Sales).",
      icon: <Zap className="text-emerald-500" size={32} />,
      color: "bg-emerald-50"
    },
    {
      title: "Smart Benchmarks",
      description: "We compare your performance against what's normal for your industry. You'll see instantly if your costs are 'Good' or 'Warning'.",
      icon: <Target className="text-purple-500" size={32} />,
      color: "bg-purple-50"
    },
    {
      title: "Ready to Explore?",
      description: "Use the 'Test Scenarios' (the pulsing blue button) at the top to see a live demo of how we catch bottlenecks.",
      icon: <ShieldCheck className="text-blue-500" size={32} />,
      color: "bg-blue-50"
    }
  ];

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl w-full max-w-[500px] shadow-2xl overflow-hidden relative"
        >
          <button 
            onClick={closeGuide}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          >
            <X size={20} className="text-gray-400" />
          </button>

          <div className="p-10 flex flex-col items-center text-center">
            <motion.div 
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6", guides[step].color)}
            >
              {guides[step].icon}
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-[22px] font-bold text-gray-900 mb-3 tracking-tight">
                  {guides[step].title}
                </h2>
                <p className="text-[16px] text-gray-500 leading-relaxed mb-8 px-4">
                  {guides[step].description}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-2 mb-8">
              {guides.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all",
                    i === step ? "bg-blue-600 w-6" : "bg-gray-200"
                  )}
                />
              ))}
            </div>

            {step < guides.length - 1 ? (
              <button 
                onClick={() => setStep(step + 1)}
                className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-[0.98]"
              >
                Next Step
                <ArrowRight size={18} />
              </button>
            ) : (
              <button 
                onClick={closeGuide}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-500 transition-all active:scale-[0.98]"
              >
                Start Diagnostic
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
