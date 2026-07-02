import React, { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, Timestamp, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Download, 
  ExternalLink, 
  Search, 
  Filter, 
  User, 
  Mail, 
  School, 
  Calendar,
  FileText,
  LogOut,
  Lock,
  ChevronRight,
  RefreshCcw,
  Shield,
  Trash2,
  Plus
} from 'lucide-react';

interface Submission {
  id: string;
  category: string;
  language: string;
  theme: string;
  link?: string;
  fileUrl?: string;
  photoUrl?: string;
  name: string;
  email: string;
  school: string;
  contact: string;
  createdAt: Timestamp;
}

export default function AdminPanel() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [adminsList, setAdminsList] = useState<any[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'submissions' | 'admins'>('submissions');
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const ADMIN_EMAIL = "rameshnathankaruvoolan10@gmail.com";

  const checkAdminStatus = async (email: string) => {
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) return true;
    try {
      const docRef = doc(db, 'admins', email.toLowerCase());
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (e) {
      console.error("Error checking admin status:", e);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email) {
        const email = currentUser.email.toLowerCase();
        const isUserAdmin = email === ADMIN_EMAIL.toLowerCase() || await checkAdminStatus(email);
        setIsAdmin(isUserAdmin);

        if (isUserAdmin) {
          // Listen to submissions
          const q = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'));
          const unsubscribeSubmissions = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Submission[];
            setSubmissions(data);
            setLoading(false);
          }, (error) => {
            console.error("Firestore submissions error:", error);
            setLoading(false);
          });

          // Listen to admins list
          const adminsQ = query(collection(db, 'admins'));
          const unsubscribeAdmins = onSnapshot(adminsQ, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
              email: doc.id,
              ...doc.data()
            })) as any[];
            setAdminsList(data);
          }, (error) => {
            console.error("Firestore admins error:", error);
          });

          return () => {
            unsubscribeSubmissions();
            unsubscribeAdmins();
          };
        } else {
          setLoading(false);
        }
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleLogout = () => signOut(auth);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailToNormalize = newAdminEmail.toLowerCase().trim();
    if (!emailToNormalize) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToNormalize)) {
      alert("Please enter a valid email address.");
      return;
    }

    setIsAddingAdmin(true);
    try {
      await setDoc(doc(db, 'admins', emailToNormalize), {
        email: emailToNormalize,
        addedAt: Timestamp.now(),
        addedBy: user?.email || 'System'
      });
      setNewAdminEmail('');
      alert(`Admin successfully added: ${emailToNormalize}`);
    } catch (error) {
      console.error("Error adding admin:", error);
      alert("Failed to add admin. Please check your permissions.");
    } finally {
      setIsAddingAdmin(false);
    }
  };

  const handleRemoveAdmin = async (adminEmail: string) => {
    const emailToNormalize = adminEmail.toLowerCase().trim();
    if (emailToNormalize === ADMIN_EMAIL.toLowerCase()) {
      alert("The root administrator cannot be removed.");
      return;
    }
    if (!window.confirm(`Are you sure you want to remove ${emailToNormalize} as an administrator?`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'admins', emailToNormalize));
      alert(`Admin removed successfully: ${emailToNormalize}`);
    } catch (error) {
      console.error("Error removing admin:", error);
      alert("Failed to remove admin.");
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.school.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'All' || sub.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading || (user && isAdmin === null)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4">
        <RefreshCcw className="animate-spin text-cyan-500" size={48} />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl text-center"
        >
          <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="text-cyan-400" size={32} />
          </div>
          <h1 className="text-2xl font-bold mb-2">Admin Access</h1>
          <p className="text-slate-400 mb-8">
            {!user 
              ? "Please sign in with an authorized admin account to view submissions." 
              : `Your account (${user.email}) is not authorized. Please log in with an authorized admin account.`}
          </p>
          <button
            onClick={handleLogin}
            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]"
          >
            {user ? "Sign in with another Google Account" : "Sign in with Google"}
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-4 text-slate-500 hover:text-slate-300 text-sm transition-colors"
          >
            Back to Public Site
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center">
              <LayoutDashboard className="text-black" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">Admin Dashboard</h1>
              <p className="text-xs text-slate-500 mt-1">Submission Management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                const headers = ['ID', 'Name', 'Email', 'School', 'Contact', 'Category', 'Language', 'Theme', 'CreatedAt', 'PhotoURL', 'FileURL', 'Link'];
                const csvRows = [
                  headers.join(','),
                  ...filteredSubmissions.map(sub => [
                    sub.id,
                    `"${sub.name.replace(/"/g, '""')}"`,
                    `"${sub.email.replace(/"/g, '""')}"`,
                    `"${sub.school.replace(/"/g, '""')}"`,
                    `"${sub.contact.replace(/"/g, '""')}"`,
                    `"${sub.category.replace(/"/g, '""')}"`,
                    `"${sub.language.replace(/"/g, '""')}"`,
                    `"${sub.theme.replace(/"/g, '""')}"`,
                    sub.createdAt?.toDate().toISOString(),
                    sub.photoUrl || '',
                    sub.fileUrl || '',
                    sub.link || ''
                  ].join(','))
                ];
                const csvString = csvRows.join('\n');
                const blob = new Blob([csvString], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `submissions_${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all text-sm font-medium"
            >
              <Download size={16} />
              Export CSV
            </button>
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium">{user.displayName}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Selection */}
        <div className="flex gap-4 border-b border-slate-800 mb-8">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-4 py-3 font-medium border-b-2 text-sm transition-all flex items-center gap-2 ${
              activeTab === 'submissions'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText size={16} />
            Submissions
          </button>
          <button
            onClick={() => setActiveTab('admins')}
            className={`px-4 py-3 font-medium border-b-2 text-sm transition-all flex items-center gap-2 ${
              activeTab === 'admins'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield size={16} />
            Administrators
          </button>
        </div>

        {activeTab === 'submissions' ? (
          <>
            {/* Stats & Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="md:col-span-3 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text"
                    placeholder="Search by name, email, or school..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative w-full md:w-64">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <select 
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all appearance-none"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    <option value="Article">Article</option>
                    <option value="Poem">Poem</option>
                    <option value="Story">Story</option>
                    <option value="Idea">Idea</option>
                  </select>
                </div>
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4 flex flex-col justify-center">
                <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">Total Submissions</p>
                <p className="text-3xl font-bold text-white">{filteredSubmissions.length}</p>
              </div>
            </div>

            {/* Submissions List */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-3xl overflow-hidden">
              {loading ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4">
                  <RefreshCcw className="animate-spin text-cyan-500" size={32} />
                  <p className="text-slate-500">Loading submissions...</p>
                </div>
              ) : filteredSubmissions.length === 0 ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-2">
                    <FileText className="text-slate-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold">No submissions found</h3>
                  <p className="text-slate-500 max-w-xs">Try adjusting your search or filter to find what you're looking for.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900/50 border-b border-slate-800">
                        <th className="p-4 font-semibold text-slate-400 text-sm">Participant</th>
                        <th className="p-4 font-semibold text-slate-400 text-sm">Category</th>
                        <th className="p-4 font-semibold text-slate-400 text-sm">Language/Theme</th>
                        <th className="p-4 font-semibold text-slate-400 text-sm">Date</th>
                        <th className="p-4 font-semibold text-slate-400 text-sm text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubmissions.map((sub) => (
                        <tr 
                          key={sub.id} 
                          className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors group cursor-pointer"
                          onClick={() => setSelectedSubmission(sub)}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-700">
                                {sub.photoUrl ? (
                                  <img src={sub.photoUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                                    <User size={20} />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-white group-hover:text-cyan-400 transition-colors">{sub.name}</p>
                                <p className="text-xs text-slate-500">{sub.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              sub.category === 'Article' ? 'bg-blue-500/10 text-blue-400' :
                              sub.category === 'Poem' ? 'bg-purple-500/10 text-purple-400' :
                              sub.category === 'Story' ? 'bg-orange-500/10 text-orange-400' :
                              'bg-cyan-500/10 text-cyan-400'
                            }`}>
                              {sub.category}
                            </span>
                          </td>
                          <td className="p-4">
                            <p className="text-sm">{sub.language}</p>
                            <p className="text-xs text-slate-500 truncate max-w-[150px]">{sub.theme}</p>
                          </td>
                          <td className="p-4 text-sm text-slate-500">
                            {sub.createdAt?.toDate().toLocaleDateString()}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {sub.photoUrl && (
                                <a 
                                  href={sub.photoUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-2 hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 rounded-lg transition-all"
                                  title="Download Photo"
                                >
                                  <User size={18} />
                                </a>
                              )}
                              {sub.fileUrl && (
                                <a 
                                  href={sub.fileUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-2 hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 rounded-lg transition-all"
                                  title="Download File"
                                >
                                  <Download size={18} />
                                </a>
                              )}
                              {sub.link && (
                                <a 
                                  href={sub.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-2 hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 rounded-lg transition-all"
                                  title="External Link"
                                >
                                  <ExternalLink size={18} />
                                </a>
                              )}
                              <ChevronRight size={18} className="text-slate-700 group-hover:text-slate-400 transition-colors" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Add Admin Form */}
            <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-3xl h-fit">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-cyan-400">
                <Plus size={20} />
                Add Administrator
              </h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Authorize additional users to access the dashboard. Authorized users will be able to sign in securely with their Google Account.
              </p>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Google Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. admin@example.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all text-white placeholder-slate-600"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isAddingAdmin}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isAddingAdmin ? <RefreshCcw className="animate-spin text-black" size={16} /> : <Plus size={16} />}
                  Add Admin Account
                </button>
              </form>
            </div>

            {/* Administrators List */}
            <div className="md:col-span-2 bg-slate-900/30 border border-slate-800 rounded-3xl p-6">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
                <Shield size={20} className="text-cyan-400" />
                Active Administrators ({adminsList.length + 1})
              </h3>
              <div className="divide-y divide-slate-800/50">
                {/* System Root Admin */}
                <div className="py-4 flex items-center justify-between first:pt-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold border border-cyan-500/20">
                      R
                    </div>
                    <div>
                      <p className="font-bold text-white">{ADMIN_EMAIL}</p>
                      <p className="text-xs text-slate-500 text-left">System Creator / Root Administrator</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-cyan-500/15 text-cyan-400 rounded-full text-xs font-bold border border-cyan-500/10">
                    System Root
                  </span>
                </div>

                {/* Sub-Admins */}
                {adminsList.map((admin) => (
                  <div key={admin.email} className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-slate-700">
                        {admin.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-white">{admin.email}</p>
                        <p className="text-xs text-slate-500">
                          Added {admin.addedAt ? admin.addedAt.toDate().toLocaleDateString() : 'N/A'} {admin.addedBy ? `by ${admin.addedBy}` : ''}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveAdmin(admin.email)}
                      className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition-all"
                      title="Revoke access"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSubmission(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="h-32 bg-gradient-to-r from-cyan-600 to-blue-600 relative">
                <button 
                  onClick={() => setSelectedSubmission(null)}
                  className="absolute top-6 right-6 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center transition-all"
                >
                  <RefreshCcw className="rotate-45" size={20} />
                </button>
              </div>
              
              <div className="px-8 pb-8 -mt-12 relative">
                <div className="flex flex-col md:flex-row gap-6 items-end mb-8">
                  <div className="w-24 h-24 rounded-3xl bg-slate-800 border-4 border-slate-900 overflow-hidden shadow-xl">
                    {selectedSubmission.photoUrl ? (
                      <img src={selectedSubmission.photoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <User size={40} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold">{selectedSubmission.name}</h2>
                    <p className="text-cyan-400 font-medium">{selectedSubmission.category} Participant</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Mail size={18} className="text-cyan-500" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Email Address</p>
                        <p className="text-slate-200">{selectedSubmission.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <School size={18} className="text-cyan-500" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">School/Institution</p>
                        <p className="text-slate-200">{selectedSubmission.school}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <Calendar size={18} className="text-cyan-500" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Submission Date</p>
                        <p className="text-slate-200">{selectedSubmission.createdAt?.toDate().toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-2">Submission Details</p>
                      <p className="text-sm font-bold mb-1">Language: <span className="text-slate-300 font-normal">{selectedSubmission.language}</span></p>
                      <p className="text-sm font-bold">Theme: <span className="text-slate-300 font-normal">{selectedSubmission.theme}</span></p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      {selectedSubmission.photoUrl && (
                        <a 
                          href={selectedSubmission.photoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 min-w-[140px] bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                        >
                          <User size={18} />
                          Photo
                        </a>
                      )}
                      {selectedSubmission.fileUrl && (
                        <a 
                          href={selectedSubmission.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 min-w-[140px] bg-cyan-500 hover:bg-cyan-400 text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                        >
                          <Download size={18} />
                          Download
                        </a>
                      )}
                      {selectedSubmission.link && (
                        <a 
                          href={selectedSubmission.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 min-w-[140px] bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                        >
                          <ExternalLink size={18} />
                          View Link
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
