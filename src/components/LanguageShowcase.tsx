import { motion } from 'motion/react';
import { BookOpen } from 'lucide-react';

export default function LanguageShowcase() {
  const languages = ['English', 'Tamil', 'Sinhala'];

  return (
    <section className="py-20 relative z-10">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-light text-white mb-12">Explore Languages</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {languages.map((lang, i) => (
            <motion.div
              key={lang}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl hover:border-cyan-500 transition-all"
            >
              <BookOpen className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl text-white">{lang}</h3>
            </motion.div>
          ))}
        </div>
        <button 
          onClick={() => document.getElementById('submit-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-8 py-3 bg-cyan-600 rounded-full text-white hover:bg-cyan-500 transition-all"
        >
          View more
        </button>
      </div>
    </section>
  );
}
