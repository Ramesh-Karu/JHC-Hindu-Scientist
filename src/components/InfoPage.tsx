import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Phone, Facebook, ChevronLeft, ChevronRight } from 'lucide-react';

export default function InfoPage({ onClose }: { onClose: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "About The Hindu Scientist",
      content: (
        <p className="text-slate-300 leading-relaxed text-lg">
          The Hindu Scientist is the Annual Magazine of the Science Union, Jaffna Hindu College. 
          We provide a space for young minds to showcase their articles, poems, stories, and ideas.
        </p>
      )
    },
    {
      title: "Theme",
      content: (
        <div className="space-y-4">
          <p className="text-cyan-400 font-semibold text-xl">SCIENCE FOR A SUSTAINABLE FUTURE</p>
          <p className="text-slate-400 leading-relaxed">
            Exploring how scientific innovation and technological advancements can address global challenges, 
            promote environmental stewardship, and build a resilient, sustainable world for generations to come.
          </p>
        </div>
      )
    },
    {
      title: "Who Can Contribute",
      content: (
        <div className="space-y-4">
          <p className="text-slate-300 text-lg">We welcome submissions from:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-2 ml-2">
            <li>Teachers</li>
            <li>Students</li>
            <li>OBA Members</li>
            <li>Other School's Science Stream Students</li>
            <li>Other Well Wishers</li>
          </ul>
        </div>
      )
    },
    {
      title: "Contact Information",
      content: (
        <div className="space-y-8">
          <div className="flex items-start gap-4 text-slate-200 text-lg w-full">
            <div className="p-3 bg-slate-800 rounded-full flex-shrink-0"><Mail size={24} /></div> 
            <div className="flex flex-col">
              <span className="text-sm text-slate-500">Email</span>
              <a href="mailto:scienceunionjhc@gmail.com" className="hover:text-cyan-400 transition-colors">scienceunionjhc@gmail.com</a>
            </div>
          </div>
          <div className="flex items-start gap-4 text-slate-200 text-lg w-full">
            <div className="p-3 bg-slate-800 rounded-full flex-shrink-0"><Phone size={24} /></div> 
            <div className="flex flex-col">
              <a href="tel:+94778096825" className="hover:text-cyan-400 transition-colors">+94778096825</a>
              <a href="tel:+94706992725" className="hover:text-cyan-400 transition-colors">+94706992725</a>
            </div>
          </div>
          <div className="flex items-start gap-4 text-slate-200 text-lg w-full">
            <div className="p-3 bg-slate-800 rounded-full flex-shrink-0"><Facebook size={24} /></div> 
            <div className="flex flex-col">
              <span className="text-sm text-slate-500">Facebook</span>
              <a href="https://www.facebook.com/share/1EEobC6wYd/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Science Union Facebook</a>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[100] bg-[#020617]/95 backdrop-blur-xl flex items-center justify-center p-6 pointer-events-auto"
    >
      <button 
        onClick={onClose}
        className="fixed top-6 left-6 z-[120] p-3 bg-slate-800 hover:bg-cyan-500 text-white rounded-full shadow-lg transition-all border border-slate-700 hover:border-cyan-400"
      >
        <X className="w-8 h-8" /> 
      </button>

      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-slate-900/80 p-10 rounded-3xl border border-slate-700 shadow-2xl min-h-[450px] flex flex-col justify-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
            <h2 className="text-4xl font-serif font-light text-white mb-8 tracking-tight">{slides[currentSlide].title}</h2>
            <div className="text-slate-300">
              {slides[currentSlide].content}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between items-center mt-8">
          <button 
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className="p-4 bg-slate-800 text-white rounded-full disabled:opacity-50 hover:bg-cyan-500 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <p className="text-slate-500 font-mono">
            {currentSlide + 1} / {slides.length}
          </p>
          <button 
            onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
            disabled={currentSlide === slides.length - 1}
            className="p-4 bg-slate-800 text-white rounded-full disabled:opacity-50 hover:bg-cyan-500 transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
