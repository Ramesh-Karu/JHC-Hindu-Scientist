import { motion } from 'motion/react';
import { QrCode } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative py-20 border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-lg z-10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
        
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-serif text-white mb-2">Jaffna Hindu College</h3>
          <p className="text-cyan-400 tracking-widest uppercase text-sm mb-4">Science Union</p>
          <p className="text-slate-500 font-light text-sm max-w-sm">
            Empowering the next generation of scientists, thinkers, and innovators through the power of words.
          </p>
        </div>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="relative group flex flex-col items-center"
        >
          <div className="absolute inset-0 bg-cyan-500/20 rounded-2xl blur-xl group-hover:bg-cyan-400/30 transition-colors" />
          <div className="relative bg-slate-900 border border-slate-700 p-4 rounded-2xl mb-4">
            {/* Placeholder for actual QR code */}
            <QrCode className="w-24 h-24 text-cyan-400" strokeWidth={1} />
          </div>
          <p className="text-sm text-slate-400 tracking-wide">Scan & submit instantly</p>
        </motion.div>

      </div>
      
      <div className="mt-20 text-center text-slate-600 text-xs tracking-widest uppercase">
        &copy; {new Date().getFullYear()} JHC Science Union. All rights reserved.
      </div>
    </footer>
  );
}
