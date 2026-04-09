import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const scrollToSubmit = () => {
    document.getElementById('submit-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Ambient glowing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-6 drop-shadow-sm">
            The Hindu Scientist
            <span className="block text-2xl md:text-4xl lg:text-5xl mt-4 text-cyan-400 font-sans tracking-widest uppercase font-light">
              Volume 14
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-lg md:text-2xl text-slate-400 font-light max-w-2xl mx-auto mb-12"
        >
          A platform for young minds to express science through words.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToSubmit}
          className="relative group overflow-hidden rounded-full bg-cyan-500/10 border border-cyan-500/30 px-8 py-4 backdrop-blur-md transition-all hover:bg-cyan-500/20 hover:border-cyan-400"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <span className="relative flex items-center gap-2 text-cyan-300 font-medium tracking-wide">
            Submit Your Story
            <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </span>
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
      >
        <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-slate-500 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
