import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { Atom } from 'lucide-react';

export default function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 2000); // Show logo
    const timer2 = setTimeout(() => setStage(2), 5000); // Show text
    const timer3 = setTimeout(() => onComplete(), 8000); // End intro

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, filter: 'blur(10px)' }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020617] overflow-hidden"
      >
        {/* Deep blue gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.15)_0%,rgba(2,6,23,1)_100%)]" />

        <AnimatePresence mode="wait">
          {stage === 0 && (
            <motion.div
              key="dna"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: 360 }}
              exit={{ scale: 1.2, opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              className="relative"
            >
              <Atom className="w-32 h-32 text-cyan-400 opacity-80" strokeWidth={1} />
              <div className="absolute inset-0 bg-cyan-400 blur-3xl opacity-20 rounded-full" />
            </motion.div>
          )}

          {stage === 1 && (
            <motion.div
              key="logo"
              initial={{ y: 20, opacity: 0, filter: 'blur(10px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: -20, opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="text-center z-10"
            >
              <h1 className="text-4xl md:text-6xl font-light tracking-widest text-white mb-4 font-serif">
                Jaffna Hindu College
              </h1>
              <h2 className="text-xl md:text-3xl tracking-[0.3em] text-cyan-400 uppercase font-sans">
                Science Union
              </h2>
            </motion.div>
          )}

          {stage === 2 && (
            <motion.div
              key="text"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="text-center z-10 px-6"
            >
              <p className="text-2xl md:text-4xl font-light text-slate-300 italic tracking-wide">
                "Ideas shape the future of science..."
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
