/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Particles from './components/Particles';
import FullscreenFlow from './components/FullscreenFlow';
import PersistentUI from './components/PersistentUI';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const path = window.location.pathname;
    if (params.get('admin') === 'true' || path === '/admin') {
      setIsAdminView(true);
    }
  }, []);

  return (
    <div className="fixed inset-0 h-[100dvh] w-screen bg-[#020617] text-slate-200 font-sans overflow-hidden selection:bg-cyan-500/30">
      <Particles />
      <PersistentUI />
      {isAdminView ? <AdminPanel /> : <FullscreenFlow />}
    </div>
  );
}


