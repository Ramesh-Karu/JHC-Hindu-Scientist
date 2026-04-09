import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, PenTool, Lightbulb, FileText, ChevronRight, CheckCircle2, Loader2, Link as LinkIcon, User, Mail } from 'lucide-react';

const steps = [
  { id: 'category', title: 'Choose Category' },
  { id: 'work', title: 'Submit Your Work' },
  { id: 'author', title: 'Author Info' },
  { id: 'submit', title: 'Finalize' },
];

export default function SubmissionFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({ category: '', language: '', link: '', name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  return (
    <section id="submit-section" className="py-32 relative z-10 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full px-6">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-12 bg-slate-900/50 backdrop-blur-2xl border border-slate-800 rounded-3xl"
            >
              <CheckCircle2 className="w-24 h-24 text-cyan-400 mx-auto mb-6" />
              <h3 className="text-3xl text-white font-serif mb-4">Submission Received</h3>
              <p className="text-slate-400">Your idea is now part of Volume 14.</p>
            </motion.div>
          ) : (
            <motion.div
              key={steps[currentStep].id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-slate-900/50 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl"
            >
              <h2 className="text-2xl md:text-3xl font-light text-white mb-8">{steps[currentStep].title}</h2>

              {currentStep === 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'article', icon: FileText, label: 'Articles' },
                    { id: 'story', icon: PenTool, label: 'Short Stories' },
                    { id: 'poem', icon: BookOpen, label: 'Poems' },
                    { id: 'other', icon: Lightbulb, label: 'Other Works' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setFormData({...formData, category: cat.id}); nextStep(); }}
                      className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-cyan-500 transition-all flex flex-col items-center gap-4 group"
                    >
                      <cat.icon className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
                      <span className="text-slate-200">{cat.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
                    <input
                      type="url"
                      placeholder="Paste your Google Drive / PDF / Notion link"
                      className="w-full pl-12 pr-4 py-4 bg-slate-950 rounded-xl border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500"
                      onChange={(e) => setFormData({...formData, link: e.target.value})}
                    />
                  </div>
                  <button onClick={nextStep} className="w-full py-4 bg-cyan-600 rounded-xl text-white font-medium hover:bg-cyan-500">Next</button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
                    <input type="text" placeholder="Name" className="w-full pl-12 pr-4 py-4 bg-slate-950 rounded-xl border border-slate-700 text-white" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
                    <input type="email" placeholder="Email" className="w-full pl-12 pr-4 py-4 bg-slate-950 rounded-xl border border-slate-700 text-white" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <button onClick={nextStep} className="w-full py-4 bg-cyan-600 rounded-xl text-white font-medium hover:bg-cyan-500">Next</button>
                </div>
              )}

              {currentStep === 3 && (
                <button
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="w-full py-6 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl text-white text-xl font-medium hover:from-cyan-500 hover:to-blue-500 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : 'Publish to Science Union'}
                </button>
              )}

              {currentStep > 0 && (
                <button onClick={prevStep} className="mt-6 text-slate-500 hover:text-white transition-colors">Back</button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
