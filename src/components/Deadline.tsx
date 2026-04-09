import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export default function Deadline() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Target date: August 10, 2026
    const targetDate = new Date('2026-08-10T00:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <section className="py-32 relative z-10">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-light text-white mb-12 tracking-wide">
            The Clock is Ticking
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
            {timeUnits.map((unit, i) => (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl"
              >
                <span className="text-3xl md:text-5xl font-mono text-cyan-400 font-light">
                  {unit.value.toString().padStart(2, '0')}
                </span>
                <span className="text-xs md:text-sm text-slate-500 uppercase tracking-widest mt-2">
                  {unit.label}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="inline-block relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full" />
            <p className="relative text-xl md:text-2xl font-serif text-slate-300 px-8 py-4 border border-cyan-500/30 rounded-full bg-slate-950/50 backdrop-blur-sm">
              Deadline: <span className="text-cyan-400 font-medium">10.08.2026</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
