import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, PenTool, BookOpen, Lightbulb, Link as LinkIcon, Loader2, CheckCircle2, ArrowLeft, Info, Facebook } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import InfoPage from './InfoPage';

const variants = {
  initial: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 1.05, filter: 'blur(10px)' },
};

export default function FullscreenFlow() {
  const [step, setStep] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [formData, setFormData] = useState({ 
    category: '', 
    language: '', 
    theme: '', 
    link: '', 
    name: '', 
    email: '', 
    school: '', 
    contact: '', 
    photo: null as File | null, 
    file: null as File | null 
  });
  const [fileUrl, setFileUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Attempt anonymous sign-in to help with storage permissions
    // We catch silently to avoid the 'admin-restricted-operation' error if not enabled
    signInAnonymously(auth).catch(() => {
      console.warn("Anonymous auth not enabled. Public uploads may fail depending on Storage rules.");
    });

    // Countdown timer
    const targetDate = new Date('2026-08-10T00:00:00').getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = targetDate - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-advance logic for interstitials
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if ([1, 3, 5].includes(step)) {
      timer = setTimeout(() => setStep((s) => s + 1), 2000);
    }
    return () => clearTimeout(timer);
  }, [step]);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary configuration missing. Please check your environment variables.');
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url);
        } else {
          const error = JSON.parse(xhr.responseText);
          reject(new Error(error.error?.message || 'Upload failed'));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload'));

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      xhr.send(formData);
    });
  };

  const handleSubmissionDetailsNext = async () => {
    if (formData.link) {
      setIsValidating(true);
      setTimeout(() => {
        setIsValidating(false);
        setStep(8);
      }, 1000);
    } else if (formData.file) {
      setIsValidating(true);
      setUploadProgress(0);
      
      try {
        const url = await uploadToCloudinary(formData.file);
        setFileUrl(url);
        setIsValidating(false);
        setStep(8);
      } catch (error: any) {
        console.error('Cloudinary Upload Error:', error);
        alert(`Upload failed: ${error.message}. Please check your Cloudinary settings.`);
        setIsValidating(false);
        setUploadProgress(0);
      }
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      let photoUrl = '';

      if (formData.photo) {
        photoUrl = await uploadToCloudinary(formData.photo);
      }

      await addDoc(collection(db, 'submissions'), {
        category: formData.category,
        language: formData.language,
        theme: formData.theme,
        link: formData.link,
        name: formData.name,
        email: formData.email,
        school: formData.school,
        contact: formData.contact,
        photoUrl,
        fileUrl,
        createdAt: serverTimestamp(),
      });

      setStep(10);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step === 2) setStep(0);
    else if (step === 4) setStep(2);
    else if (step === 6) setStep(4);
    else if (step === 7) setStep(6);
    else if (step === 8) setStep(7);
    else if (step === 9) setStep(8);
  };

  const progress = Math.min((step / 9) * 100, 100);

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center px-4 md:px-6 pointer-events-none pt-12 pb-20 md:py-0">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 h-1 bg-cyan-500/10 w-full z-50">
        <motion.div 
          className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
          animate={{ width: `${progress}%` }} 
          transition={{ duration: 0.5 }} 
        />
      </div>

      {/* Back Button */}
      {step > 0 && step < 10 && ![1, 3, 5].includes(step) && (
        <motion.button 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          onClick={handleBack} 
          className="fixed top-4 left-4 md:top-6 md:left-6 text-slate-500 hover:text-cyan-400 z-50 flex items-center gap-2 bg-slate-900/30 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-slate-800/50 transition-all pointer-events-auto"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" /> 
          <span className="hidden md:inline text-sm font-medium">Back</span>
        </motion.button>
      )}

      {/* Info Button */}
      {step === 0 && (
        <motion.button 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          onClick={() => setShowInfo(true)} 
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 text-cyan-400 hover:text-white z-50 flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-4 py-2 md:px-5 md:py-3 rounded-full border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all pointer-events-auto"
        >
          <span className="text-sm font-bold tracking-wide">INFO</span>
          <Info className="w-5 h-5" /> 
        </motion.button>
      )}

      {showInfo && <InfoPage onClose={() => setShowInfo(false)} />}

      <div className="w-full max-w-5xl flex justify-center pointer-events-auto max-h-full overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          
          {/* Step 0: Entry */}
          {step === 0 && (
            <motion.div key="step-0" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 1 }} className="text-center py-10">
              <div className="flex flex-col items-center mb-8">
                <img 
                  src="https://image2url.com/r2/default/images/1775755589644-db9f92b3-3b43-47b4-b69e-51312b4e1022.png" 
                  alt="Science Union Logo" 
                  className="w-24 h-24 md:w-32 md:h-32 object-contain mb-4"
                  referrerPolicy="no-referrer"
                />
                <h2 className="text-xl md:text-2xl font-bold text-slate-300 tracking-widest uppercase">SCIENCE UNION</h2>
                <h3 className="text-lg md:text-xl font-medium text-slate-400 tracking-wider uppercase">JAFFNA HINDU COLLEGE</h3>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-light text-white mb-4 md:mb-6 tracking-tight drop-shadow-2xl">
                The Hindu Scientist
              </h1>
              <p className="text-cyan-400 tracking-[0.2em] md:tracking-[0.3em] uppercase mb-12 md:mb-16 text-sm md:text-xl font-light">Volume 14</p>
              <button 
                onClick={() => setStep(1)}
                className="group relative px-8 py-4 md:px-10 md:py-5 bg-cyan-500/10 border border-cyan-500/30 rounded-full backdrop-blur-md overflow-hidden transition-all hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.3)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative text-cyan-300 text-base md:text-lg tracking-wide font-medium">Begin Submission</span>
              </button>
              <p className="mt-4 text-slate-500 text-sm">Deadline in: <span className="text-cyan-400 font-mono">{timeLeft}</span></p>
            </motion.div>
          )}

          {/* Step 1: Interstitial 1 */}
          {step === 1 && (
            <motion.div key="step-1" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.8 }} className="text-center">
              <h2 className="text-3xl md:text-6xl font-light text-slate-300 italic tracking-wide">"We are calling thinkers..."</h2>
            </motion.div>
          )}

          {/* Step 2: Category */}
          {step === 2 && (
            <motion.div key="step-2" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.8 }} className="w-full max-w-4xl py-4">
              <h2 className="text-2xl md:text-3xl text-center text-slate-300 mb-8 md:mb-12 font-light tracking-wide">Choose Category</h2>
              <div className="grid grid-cols-2 gap-3 md:gap-6">
                {[
                  { id: 'article', icon: FileText, label: 'Articles' },
                  { id: 'story', icon: PenTool, label: 'Short Stories' },
                  { id: 'poem', icon: BookOpen, label: 'Poems' },
                  { id: 'other', icon: Lightbulb, label: 'Other Works' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setFormData({ ...formData, category: cat.id }); setStep(3); }}
                    className="p-4 md:p-8 bg-slate-900/40 backdrop-blur-2xl border border-slate-800 rounded-2xl md:rounded-3xl hover:bg-slate-800/60 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all flex flex-col items-center gap-3 md:gap-6 group"
                  >
                    <cat.icon className="w-8 h-8 md:w-12 md:h-12 text-cyan-500/70 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-500" strokeWidth={1.5} />
                    <span className="text-base md:text-2xl text-slate-200 font-serif">{cat.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Interstitial 2 */}
          {step === 3 && (
            <motion.div key="step-3" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.8 }} className="text-center">
              <h2 className="text-3xl md:text-6xl font-light text-slate-300 italic tracking-wide">"Writers..."</h2>
            </motion.div>
          )}

          {/* Step 4: Language */}
          {step === 4 && (
            <motion.div key="step-4" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.8 }} className="w-full max-w-2xl py-4">
              <h2 className="text-2xl md:text-3xl text-center text-slate-300 mb-8 md:mb-12 font-light tracking-wide">Select Language</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {['English', 'Tamil'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setFormData({ ...formData, language: lang }); setStep(5); }}
                    className="p-6 md:p-12 bg-slate-900/40 backdrop-blur-2xl border border-slate-800 rounded-2xl md:rounded-3xl hover:bg-slate-800/60 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all text-xl md:text-3xl text-slate-200 font-serif"
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 5: Interstitial 3 */}
          {step === 5 && (
            <motion.div key="step-5" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.8 }} className="text-center">
              <h2 className="text-3xl md:text-6xl font-light text-slate-300 italic tracking-wide">"Innovators..."</h2>
            </motion.div>
          )}

          {/* Step 6: Theme Selection */}
          {step === 6 && (
            <motion.div key="step-6" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.8 }} className="w-full max-w-4xl py-4">
              <h2 className="text-2xl md:text-3xl text-center text-slate-300 mb-8 md:mb-12 font-light tracking-wide">Select a Theme</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
                {['AI & Future Tech', 'Climate & Earth', 'Space & Cosmos', 'Health & Medicine', 'Others'].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => { setFormData({ ...formData, theme }); setStep(7); }}
                    className={`p-6 md:p-10 bg-slate-900/40 backdrop-blur-2xl border border-slate-800 rounded-2xl md:rounded-3xl hover:bg-slate-800/60 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all text-lg md:text-2xl text-slate-200 font-serif ${theme === 'Others' ? 'sm:col-span-2' : ''}`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 7: Link & File Upload */}
          {step === 7 && (
            <motion.div key="step-7" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.8 }} className="w-full max-w-2xl bg-slate-900/50 backdrop-blur-3xl border border-slate-800 p-6 md:p-16 rounded-3xl md:rounded-[2.5rem] shadow-2xl my-4">
              <h2 className="text-2xl md:text-3xl text-center text-white mb-8 md:mb-10 font-light">Submission Details</h2>
              <div className="space-y-6 md:space-y-8">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 md:pl-6 flex items-center pointer-events-none">
                    <LinkIcon className="h-5 w-5 md:h-6 md:w-6 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  </div>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value, file: null })}
                    placeholder="Paste Google Drive / PDF / Docs link"
                    className="block w-full pl-12 md:pl-16 pr-4 md:pr-6 py-4 md:py-6 bg-slate-950/50 border border-slate-700 rounded-xl md:rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-base md:text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-slate-400">Or Upload File Directly</label>
                  <input type="file" onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null, link: '' })} className="w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-800 file:text-white hover:file:bg-slate-700" />
                  {uploadProgress > 0 && (
                    <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
                      <div className="bg-cyan-500 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleSubmissionDetailsNext}
                  disabled={(!formData.link && !formData.file) || isValidating}
                  className="w-full py-4 md:py-6 bg-cyan-600 rounded-xl md:rounded-2xl text-white text-base md:text-lg font-medium hover:bg-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
                >
                  {isValidating ? <><Loader2 className="animate-spin w-5 h-5 md:w-6 md:h-6" /> {formData.file ? `Uploading ${Math.round(uploadProgress)}%` : 'Validating...'}</> : 'Continue'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 8: Author Info */}
          {step === 8 && (
            <motion.div key="step-8" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.8 }} className="w-full max-w-2xl bg-slate-900/50 backdrop-blur-3xl border border-slate-800 p-6 md:p-16 rounded-3xl md:rounded-[2.5rem] shadow-2xl my-4">
              <h2 className="text-2xl md:text-3xl text-center text-white mb-8 md:mb-12 font-light">Author Info</h2>
              <div className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Full Name" className="w-full bg-slate-950/50 border border-slate-700 p-4 rounded-xl text-white" />
                  <input type="text" value={formData.school} onChange={(e) => setFormData({ ...formData, school: e.target.value })} placeholder="School/Organization" className="w-full bg-slate-950/50 border border-slate-700 p-4 rounded-xl text-white" />
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email Address" className="w-full bg-slate-950/50 border border-slate-700 p-4 rounded-xl text-white" />
                  <input type="tel" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} placeholder="Contact Number" className="w-full bg-slate-950/50 border border-slate-700 p-4 rounded-xl text-white" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-slate-400">Author Photo</label>
                  <input type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, photo: e.target.files?.[0] || null })} className="w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-800 file:text-white hover:file:bg-slate-700" />
                </div>
                <button 
                  onClick={() => setStep(9)}
                  disabled={!formData.name || !formData.email}
                  className="w-full py-4 md:py-6 mt-4 md:mt-8 bg-cyan-600 rounded-xl md:rounded-2xl text-white text-base md:text-lg font-medium hover:bg-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review & Submit
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 9: Final Submit */}
          {step === 9 && (
            <motion.div key="step-9" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.8 }} className="text-center py-10">
              <button 
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="group relative px-8 py-4 md:px-12 md:py-6 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(8,145,178,0.6)] disabled:opacity-50 disabled:hover:scale-100"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                <span className="relative text-white text-lg md:text-2xl font-medium tracking-wide flex items-center gap-2 md:gap-3">
                  {isSubmitting ? <><Loader2 className="animate-spin w-6 h-6 md:w-8 md:h-8" /> Publishing...</> : 'Submit to Volume 14'}
                </span>
              </button>
            </motion.div>
          )}

          {/* Step 10: Success */}
          {step === 10 && (
            <motion.div key="step-10" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 1 }} className="text-center bg-slate-900/40 backdrop-blur-3xl border border-slate-800 p-8 md:p-16 rounded-3xl md:rounded-[3rem] shadow-2xl my-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
              >
                <CheckCircle2 className="w-16 h-16 md:w-24 md:h-24 text-cyan-400 mx-auto mb-6 md:mb-8 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
              </motion.div>
              <h2 className="text-2xl md:text-4xl font-serif text-white mb-3 md:mb-4">Submission Successful</h2>
              <p className="text-base md:text-xl text-slate-400 font-light mb-8">Your idea is now part of The Hindu Scientist.</p>
              
              <div className="flex flex-col items-center gap-4">
                <p className="text-slate-500 text-sm mb-2">Share your achievement:</p>
                <div className="flex gap-4">
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-slate-800 hover:bg-blue-600 rounded-full transition-all text-white"
                  >
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a 
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("I just submitted my work to The Hindu Scientist Annual Magazine! Check it out.")}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-slate-800 hover:bg-sky-500 rounded-full transition-all text-white"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a 
                    href={`https://wa.me/?text=${encodeURIComponent("I just submitted my work to The Hindu Scientist Annual Magazine! Check it out: " + window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-slate-800 hover:bg-green-500 rounded-full transition-all text-white"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c5.555 0 9.89-5.335 9.893-11.892a11.8 11.8 0 00-3.468-8.397z"/></svg>
                  </a>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

