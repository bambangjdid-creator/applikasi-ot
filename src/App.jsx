import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { 
  TrendingUp, FileText, Calendar, CheckCircle, Activity, 
  Download, Settings, LogOut, Lock, Key, RefreshCw, ChevronDown, User
} from 'lucide-react';

import Dashboard from './components/views/Dashboard';
import FormOTView from './components/views/FormOTView';
import OTHistoryView from './components/views/OTHistoryView';
import ApprovalView from './components/views/ApprovalView';
import AuditLogView from './components/views/AuditLogView';
import ReportView from './components/views/ReportView';
import SettingsView from './components/views/SettingsView';

export default function App() {
  const [gasUrl, setGasUrl] = useState(() => localStorage.getItem('ot_gas_web_app_url') || '');
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentMenu, setCurrentMenu] = useState('M1'); // Dashboard by default
  const [toast, setToast] = useState(null);
  
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.get('getAllData');
      setDb(data);
    } catch (err) {
      showToast('Gagal memuat data!', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [gasUrl]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!db) return;
    const user = db.karyawan.find(k => k.IdKaryawan === loginUsername && k.Password === loginPassword);
    if (user) {
      setCurrentUser(user);
      writeAuditLog(user.IdKaryawan, 'Login ke sistem');
      showToast(`Selamat datang, ${user.Nama}!`, 'success');
    } else {
      showToast('ID Karyawan atau Password salah!', 'error');
    }
  };

  const handleLogout = () => {
    if (currentUser) {
      writeAuditLog(currentUser.IdKaryawan, 'Logout dari sistem');
    }
    setCurrentUser(null);
    setCurrentMenu('M1');
  };

  const writeAuditLog = async (idKaryawan, activity) => {
    const newLog = {
      IdLog: `LOG-${Date.now()}`,
      Timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      IdKaryawan: idKaryawan,
      Activity: activity
    };
    await api.post('postAuditLog', newLog);
    // Optimistic update
    setDb(prev => ({ ...prev, auditLog: [newLog, ...prev.auditLog] }));
  };

  const handleRoleSwitch = (roleId) => {
    if (!currentUser) return;
    const role = db.roles.find(r => r.IdRole === roleId);
    if (role) {
      setCurrentUser(prev => ({ ...prev, IdRole: roleId }));
      showToast(`Role diubah menjadi ${role.RoleName}`);
      setCurrentMenu('M1'); // Reset to dashboard to avoid unauthorized view
    }
  };

  // Role Access Logic Based on Request
  const getAccessibleMenus = () => {
    if (!currentUser || !db) return [];
    const role = db.roles.find(r => r.IdRole === currentUser.IdRole)?.RoleName;
    let allowedIds = [];
    if (role === 'Employee') allowedIds = ['M1', 'M2', 'M3'];
    if (role === 'Manager') allowedIds = ['M1', 'M3', 'M3-1'];
    if (role === 'HRD / Admin') allowedIds = ['M1', 'M3', 'M5', 'M6', 'M7'];

    return db.menu.filter(m => allowedIds.includes(m.IdMenu) && m.IsActive).sort((a, b) => a.OrderIndex - b.OrderIndex);
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Enterprise System...</div>;
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-900/20 blur-[120px] pointer-events-none"></div>

        <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl relative backdrop-blur-md">
          <div className="text-center space-y-2 mb-8">
            <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl mx-auto shadow-xl shadow-indigo-500/30">⚡</div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase">Overtime Portal</h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide">ENTERPRISE JAMSTACK SPA</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <User className="h-3 w-3 text-indigo-400" /> ID Karyawan
              </label>
              <input 
                type="text" 
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Cth: EMP001, MGR001, ADM001"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Key className="h-3 w-3 text-indigo-400" /> Password
              </label>
              <input 
                type="password" 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="•••••••• (Gunakan 123)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                required
              />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-lg active:scale-95">
              Masuk Ke Portal
            </button>
          </form>
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <p className="text-[10px] text-slate-500 mb-2 font-semibold">Demo Accounts:</p>
            <div className="flex justify-center gap-2 text-[10px] text-slate-400">
              <span className="bg-slate-800 px-2 py-1 rounded">EMP001 (Emp)</span>
              <span className="bg-slate-800 px-2 py-1 rounded">MGR001 (Mgr)</span>
              <span className="bg-slate-800 px-2 py-1 rounded">ADM001 (HRD)</span>
            </div>
          </div>
        </div>
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 animate-bounce">
            <div className={`p-4 rounded-xl shadow-2xl flex items-center space-x-3 border ${
              toast.type === 'error' ? 'bg-rose-950 border-rose-500 text-rose-200' : 'bg-emerald-950 border-emerald-500 text-emerald-200'
            }`}>
              <span className="text-xl">{toast.type === 'error' ? '⚠️' : '✅'}</span>
              <p className="text-xs font-bold leading-relaxed">{toast.message}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  const accessibleMenus = getAccessibleMenus();
  const currentRoleName = db.roles.find(r => r.IdRole === currentUser.IdRole)?.RoleName;

  const renderView = () => {
    switch (currentMenu) {
      case 'M1': return <Dashboard db={db} currentUser={currentUser} setDb={setDb} />;
      case 'M2': return <FormOTView db={db} currentUser={currentUser} setDb={setDb} writeAuditLog={writeAuditLog} showToast={showToast} />;
      case 'M3': return <OTHistoryView db={db} currentUser={currentUser} setDb={setDb} />;
      case 'M3-1': return <ApprovalView db={db} currentUser={currentUser} setDb={setDb} writeAuditLog={writeAuditLog} showToast={showToast} />;
      case 'M5': return <AuditLogView db={db} />;
      case 'M6': return <ReportView db={db} />;
      case 'M7': return <SettingsView db={db} />;
      default: return <Dashboard db={db} currentUser={currentUser} setDb={setDb} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30 shadow-md backdrop-blur bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-lg shadow-indigo-500/30">⚡</div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-white">OVERTIME PORTAL</span>
                <span className="bg-amber-500/20 text-amber-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-amber-500/30">Local Mock</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Role Switcher */}
            <div className="relative group">
              <button className="flex items-center bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl space-x-2 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors">
                <span className="bg-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase px-2 py-0.5 rounded">
                  {currentRoleName}
                </span>
                <span>{currentUser.Nama}</span>
                <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-white" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-800 bg-slate-950">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Switch Role</p>
                </div>
                {db.roles.map(r => (
                  <button 
                    key={r.IdRole}
                    onClick={() => handleRoleSwitch(r.IdRole)}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    {r.RoleName}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleLogout} className="bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/30 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-300 transition-all flex items-center gap-1 active:scale-95">
              <LogOut className="h-3 w-3" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex-grow flex gap-6">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 hidden md:block">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sticky top-24 space-y-2">
            <nav className="flex flex-col space-y-1">
              {accessibleMenus.map((menu) => {
                let Icon = FileText;
                if (menu.IdMenu === 'M1') Icon = TrendingUp;
                if (menu.IdMenu === 'M3') Icon = Calendar;
                if (menu.IdMenu === 'M3-1') Icon = CheckCircle;
                if (menu.IdMenu === 'M5') Icon = Activity;
                if (menu.IdMenu === 'M6') Icon = Download;
                if (menu.IdMenu === 'M7') Icon = Settings;

                return (
                  <button
                    key={menu.IdMenu}
                    onClick={() => setCurrentMenu(menu.IdMenu)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-xl text-xs font-bold transition-all ${
                      currentMenu === menu.IdMenu 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                        : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{menu.MenuName}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow flex flex-col space-y-6">
          {renderView()}
        </main>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`p-4 rounded-xl shadow-2xl flex items-center space-x-3 border ${
            toast.type === 'error' ? 'bg-rose-950 border-rose-500 text-rose-200' : 'bg-emerald-950 border-emerald-500 text-emerald-200'
          }`}>
            <span className="text-xl">{toast.type === 'error' ? '⚠️' : '✅'}</span>
            <p className="text-xs font-bold leading-relaxed">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
