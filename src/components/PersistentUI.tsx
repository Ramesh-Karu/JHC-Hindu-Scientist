import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, ArrowRight, X, Info } from 'lucide-react';

export default function PersistentUI() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Top Right Deadline Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="fixed top-4 right-4 md:top-6 md:right-6 z-50"
      >
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 text-cyan-300 px-3 py-1.5 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium tracking-wide shadow-[0_0_20px_rgba(8,145,178,0.15)] flex items-center gap-2">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="hidden md:inline">Deadline: </span>10.08.2026
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="fixed bottom-0 left-0 right-0 p-4 md:p-8 flex justify-between items-end bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent z-40 pointer-events-none"
      >
        <button 
          onClick={() => setIsModalOpen(true)}
          className="pointer-events-auto group flex items-center gap-2 md:gap-3 text-slate-400 hover:text-cyan-300 transition-colors bg-slate-900/30 backdrop-blur-md px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl border border-slate-800/50 hover:border-cyan-500/30"
        >
          <Info className="w-4 h-4 md:hidden" />
          <span className="text-xs md:text-sm tracking-wide hidden md:inline">More About Science Union</span>
          <span className="text-xs tracking-wide md:hidden">About</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform hidden md:block" />
        </button>

        <div className="pointer-events-auto hidden md:flex flex-col items-center gap-2 group cursor-pointer">
          <div className="bg-slate-900/50 backdrop-blur-md p-3 rounded-2xl border border-slate-800/50 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_20px_rgba(8,145,178,0.2)] transition-all">
            <QrCode className="w-6 h-6 text-cyan-400" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 group-hover:text-cyan-400 transition-colors">Scan for full site</span>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-[#020617]/80 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-slate-900 border border-slate-800 p-6 md:p-12 rounded-2xl md:rounded-3xl max-w-2xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-slate-500 hover:text-white transition-colors bg-slate-800/50 p-2 rounded-full md:bg-transparent md:p-0"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <h2 className="text-2xl md:text-3xl font-serif text-white mb-4 pr-8">Jaffna Hindu College Science Union</h2>
              <p className="text-sm md:text-base text-slate-400 leading-relaxed mb-6">
                Empowering the next generation of scientists, thinkers, and innovators through the power of words. The Hindu Scientist is our premier publication, showcasing the brilliant minds of our institution.
              </p>
              <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                Volume 14 focuses on "Present Day Society Towards Science", exploring the intersection of modern life and scientific advancement.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

