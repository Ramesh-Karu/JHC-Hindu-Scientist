import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { BookOpen, PenTool, Lightbulb, GraduationCap, Users, HeartHandshake, FileText } from 'lucide-react';

export default function Narrative() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity1 = useTransform(scrollYProgress, [0.1, 0.2, 0.3], [0, 1, 1]);
  const opacity2 = useTransform(scrollYProgress, [0.3, 0.4, 0.5], [0, 1, 1]);
  const opacity3 = useTransform(scrollYProgress, [0.5, 0.6, 0.7], [0, 1, 1]);

  const y1 = useTransform(scrollYProgress, [0.1, 0.2], [50, 0]);
  const y2 = useTransform(scrollYProgress, [0.3, 0.4], [50, 0]);
  const y3 = useTransform(scrollYProgress, [0.5, 0.6], [50, 0]);

  const whoCanSubmit = [
    { icon: GraduationCap, title: 'Students', desc: 'Current scholars of JHC' },
    { icon: Users, title: 'Teachers', desc: 'Educators and mentors' },
    { icon: BookOpen, title: 'OBA', desc: 'Old Boys Association members' },
    { icon: HeartHandshake, title: 'Well-wishers', desc: 'Supporters of science' },
  ];

  const whatToSubmit = [
    { icon: FileText, title: 'Articles', desc: 'Deep dives into scientific phenomena' },
    { icon: BookOpen, title: 'Short Stories', desc: 'Sci-fi and imaginative tales' },
    { icon: PenTool, title: 'Poems', desc: 'Rhythmic expressions of nature' },
    { icon: Lightbulb, title: 'Literary Works', desc: 'Essays and thought pieces' },
  ];

  return (
    <section ref={containerRef} className="py-32 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* 1. The Call */}
        <div className="min-h-[60vh] flex flex-col justify-center items-center text-center mb-32">
          <motion.div style={{ opacity: opacity1, y: y1 }} className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-light text-white tracking-wide">
              We are calling for <span className="font-serif italic text-cyan-400">thinkers...</span>
            </h2>
          </motion.div>
          <motion.div style={{ opacity: opacity2, y: y2 }} className="mt-8 space-y-8">
            <h2 className="text-4xl md:text-6xl font-light text-white tracking-wide">
              <span className="font-serif italic text-cyan-400">Writers...</span>
            </h2>
          </motion.div>
          <motion.div style={{ opacity: opacity3, y: y3 }} className="mt-8 space-y-8">
            <h2 className="text-4xl md:text-6xl font-light text-white tracking-wide">
              <span className="font-serif italic text-cyan-400">Innovators...</span>
            </h2>
          </motion.div>
        </div>

        {/* 2. Who Can Submit */}
        <div className="mb-40">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-4xl font-light text-center mb-16 text-slate-200 tracking-wide"
          >
            Who Can Submit
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whoCanSubmit.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl hover:bg-slate-800/50 hover:border-cyan-500/30 transition-all group"
              >
                <item.icon className="w-10 h-10 text-cyan-500/70 mb-6 group-hover:text-cyan-400 transition-colors" strokeWidth={1.5} />
                <h4 className="text-xl font-medium text-slate-200 mb-2">{item.title}</h4>
                <p className="text-slate-500 font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 3. What You Can Submit */}
        <div>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-4xl font-light text-center mb-16 text-slate-200 tracking-wide"
          >
            What You Can Submit
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {whatToSubmit.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="relative overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-colors" />
                <item.icon className="w-8 h-8 text-cyan-400 mb-4" strokeWidth={1.5} />
                <h4 className="text-2xl font-serif text-slate-200 mb-2">{item.title}</h4>
                <p className="text-slate-400 font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
