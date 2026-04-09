import { motion } from 'motion/react';

export default function ThemeReveal() {
  return (
    <section className="relative py-40 flex items-center justify-center overflow-hidden z-10">
      {/* Background glow pulse effect */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"
      />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-cyan-400 tracking-[0.3em] uppercase text-sm mb-6 font-medium"
        >
          Theme for Volume 14
        </motion.p>
        
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif font-light text-white leading-tight"
        >
          Present Day Society <br/>
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">
            Towards Science
          </span>
        </motion.h2>
      </div>
    </section>
  );
}
