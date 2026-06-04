import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  Brain, Sparkles, ShieldAlert, MessageSquare, Send, TrendingUp, 
  Coins, Users, CheckCircle, Calendar, MapPin, Activity, 
  FileText, Database, Key, Settings, LogOut, Lock, RefreshCw,
  Download, Trash2, Edit2, Check, AlertTriangle, FileSpreadsheet, Eye, Info, UserCheck, HelpCircle
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import FormOTView from './components/views/FormOTView';
import OTHistoryView from './components/views/OTHistoryView';
import ApprovalView from './components/views/ApprovalView';
import AICopilotView from './components/views/AICopilotView';
import ReportView from './components/views/ReportView';
import SettingsView from './components/views/SettingsView';
import AuditLogView from './components/views/AuditLogView';
import {
  INITIAL_USER_ROLES,
  INITIAL_DATA_KARYAWAN,
  INITIAL_OVERTIME,
  INITIAL_AUDIT_LOGS,
  DIVISIONS,
  OVERTIME_TYPES,
  LOCATIONS
} from './data/initialData';
import { getAvailableYears, getDashboardStats } from './services/dashboardService';

// ==========================================
// FORMATTERS (DATE & TIME PARSING SECURITY)
// ==========================================
const formatFriendlyDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  } catch (e) {
    return dateStr;
  }
};

const formatCleanTime = (timeStr) => {
  if (!timeStr) return '';
  // Check if string contains 'T' (ISO format like 1899-12-30T08:44:48.000Z)
  if (timeStr.includes('T')) {
    try {
      const date = new Date(timeStr);
      if (!isNaN(date.getTime())) {
        const hrs = String(date.getHours()).padStart(2, '0');
        const mins = String(date.getMinutes()).padStart(2, '0');
        return `${hrs}:${mins}`;
      }
    } catch (e) {}
  }
  // Strip timezone characters to avoid parsing errors
  const clean = timeStr.replace(/Z|(\+|-)\d{2}:\d{2}/g, '');
  const parts = clean.split(':');
  if (parts.length >= 2) {
    return `${parts[0].trim().padStart(2, '0')}:${parts[1].trim().padStart(2, '0')}`;
  }
  return timeStr;
};

const normalizeUser = (u) => {
  if (!u) return null;
  return {
    username: String(u.username || u.Username || u.userName || '').trim(),
    password: String(u.password || u.Password || '').trim(),
    displayName: String(u.displayName || u.displayname || u['Display Name'] || u['display name'] || u.username || '').trim(),
    divisi: String(u.divisi || u.Divisi || '').trim(),
    divisiKode: String(u.divisiKode || u.divisikode || u['Divisi Kode'] || u['divisi kode'] || '').trim(),
    role: String(u.role || u.Role || 'User').trim(),
    aksesMenu: String(u.aksesMenu || u.aksesmenu || u['Akses Menu'] || u['akses menu'] || 'Dashboard, Form OT, OT History').trim()
  };
};

const normalizeKaryawan = (k) => {
  if (!k) return null;
  return {
    nik: String(k.nik || k.NIK || '').trim(),
    idKaryawan: String(k.idKaryawan || k.idkaryawan || k['id karyawan'] || k['ID Karyawan'] || '').trim(),
    namaKaryawan: String(k.namaKaryawan || k.namakaryawan || k['nama karyawan'] || k['Nama Karyawan'] || '').trim(),
    divisi: String(k.divisi || k.Divisi || '').trim(),
    areaKerja: String(k.areaKerja || k.areakerja || k['area kerja'] || k['Area Kerja'] || '').trim(),
    jabatan: String(k.jabatan || k.Jabatan || '').trim()
  };
};

const normalizeOvertime = (ot) => {
  if (!ot) return null;
  return {
    idDoc: String(ot.idDoc || ot.iddoc || ot['id doc'] || ot['ID Doc'] || '').trim(),
    tanggalPengajuan: String(ot.tanggalPengajuan || ot.tanggalpengajuan || ot['tanggal pengajuan'] || '').trim(),
    tanggalLembur: String(ot.tanggalLembur || ot.tanggallembur || ot['tanggal lembur'] || '').trim(),
    areaLembur: String(ot.areaLembur || ot.arealembur || ot['area lembur'] || '').trim(),
    divisi: String(ot.divisi || ot.Divisi || '').trim(),
    jenisLembur: String(ot.jenisLembur || ot.jenislembur || ot['jenis lembur'] || '').trim(),
    namaKaryawan: String(ot.namaKaryawan || ot.namakaryawan || ot['nama karyawan'] || '').trim(),
    idKaryawan: String(ot.idKaryawan || ot.idkaryawan || ot['id karyawan'] || '').trim(),
    jabatan: String(ot.jabatan || ot.Jabatan || '').trim(),
    jamMulai: String(ot.jamMulai || ot.jammulai || ot['jam mulai'] || '').trim(),
    jamSelesai: String(ot.jamSelesai || ot.jamselesai || ot['jam selesai'] || '').trim(),
    durasiLembur: Number(ot.durasiLembur || ot.durasilembur || ot['durasi lembur'] || 0),
    nominal: Number(ot.nominal || ot.Nominal || 0),
    statusDocument: String(ot.statusDocument || ot.statusdocument || ot['status document'] || 'pending').trim(),
    alasanLembur: String(ot.alasanLembur || ot.alasanlembur || ot['alasan lembur'] || '').trim(),
    catatanManager: String(ot.catatanManager || ot.catatanmanager || ot['catatan manager'] || '').trim()
  };
};

const normalizeAuditLog = (log) => {
  if (!log) return null;
  return {
    timestamp: String(log.timestamp || log.Timestamp || '').trim(),
    user: String(log.user || log.User || '').trim(),
    action: String(log.action || log.Action || '').trim(),
    details: String(log.details || log.Details || '').trim()
  };
};

const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbwATrebY_OE4otejULIlcsbVyyDTFkQHCVZihESTWuwtBAU7NdMwi_2usoC2a4GeHi60g/exec';

export default function App() {
  const [gasUrl, setGasUrl] = useState(() => {
    return localStorage.getItem('ot_gas_web_app_url') || DEFAULT_GAS_URL;
  });

  useEffect(() => {
    if (gasUrl) {
      localStorage.setItem('ot_gas_web_app_url', gasUrl);
    }
  }, [gasUrl]);

  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return localStorage.getItem('ot_gemini_api_key') || '';
  });

  const [users, setUsers] = useState(() => {
    const cached = localStorage.getItem('ot_users_role');
    const parsed = cached ? JSON.parse(cached) : INITIAL_USER_ROLES;
    return Array.isArray(parsed) ? parsed.map(normalizeUser) : INITIAL_USER_ROLES.map(normalizeUser);
  });

  const [karyawan, setKaryawan] = useState(() => {
    const cached = localStorage.getItem('ot_data_karyawan');
    const parsed = cached ? JSON.parse(cached) : INITIAL_DATA_KARYAWAN;
    return Array.isArray(parsed) ? parsed.map(normalizeKaryawan) : INITIAL_DATA_KARYAWAN.map(normalizeKaryawan);
  });

  const [overtime, setOvertime] = useState(() => {
    const cached = localStorage.getItem('ot_data_overtime');
    const parsed = cached ? JSON.parse(cached) : INITIAL_OVERTIME;
    return Array.isArray(parsed) ? parsed.map(normalizeOvertime) : INITIAL_OVERTIME.map(normalizeOvertime);
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const cached = localStorage.getItem('ot_audit_logs');
    const parsed = cached ? JSON.parse(cached) : INITIAL_AUDIT_LOGS;
    return Array.isArray(parsed) ? parsed.map(normalizeAuditLog) : INITIAL_AUDIT_LOGS.map(normalizeAuditLog);
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('Dashboard');
  const [toast, setToast] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error
  const [syncProgressMsg, setSyncProgressMsg] = useState('');
  const [remoteDataSynced, setRemoteDataSynced] = useState(false);
  const [previewPdfData, setPreviewPdfData] = useState(null);

  // Authentication Fields
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Dashboard Level Month and Year Filters
  const [dashMonth, setDashMonth] = useState('ALL');
  const [dashYear, setDashYear] = useState('ALL');

  useEffect(() => { localStorage.setItem('ot_users_role', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('ot_data_karyawan', JSON.stringify(karyawan)); }, [karyawan]);
  useEffect(() => { localStorage.setItem('ot_data_overtime', JSON.stringify(overtime)); }, [overtime]);
  useEffect(() => { localStorage.setItem('ot_audit_logs', JSON.stringify(auditLogs)); }, [auditLogs]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const writeLocalLog = (user, action, details) => {
    const newLog = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: user?.username || 'system',
      action: action,
      details: typeof details === 'object' ? JSON.stringify(details) : details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const pullDataFromGoogleSheets = async (silent = false) => {
    if (!gasUrl) {
      setRemoteDataSynced(false);
      if (!silent) showToast('Google Apps Script URL belum diatur. Berjalan dalam mode lokal.', 'warning');
      return;
    }

    setSyncStatus('syncing');
    setSyncProgressMsg('Menarik database terbaru dari Google Drive...');

    try {
      const response = await fetch(gasUrl);
      const resData = await response.json();

      if (resData.success && resData.data) {
        const { users: fetchedUsers, overtime: fetchedOT, karyawan: fetchedKar, auditLogs: fetchedLogs } = resData.data;
        
        if (fetchedUsers && Array.isArray(fetchedUsers)) {
          const normalized = fetchedUsers.map(normalizeUser);
          setUsers(normalized);
          if (currentUser) {
            const activeMatch = normalized.find(u => u.username === currentUser.username);
            if (activeMatch) setCurrentUser(activeMatch);
          }
        }
        if (fetchedOT && Array.isArray(fetchedOT)) {
          setOvertime(fetchedOT.map(normalizeOvertime));
        }
        if (fetchedKar && Array.isArray(fetchedKar)) {
          setKaryawan(fetchedKar.map(normalizeKaryawan));
        }
        if (fetchedLogs && Array.isArray(fetchedLogs)) {
          setAuditLogs(fetchedLogs.map(normalizeAuditLog));
        }
        
        setSyncStatus('success');
        setRemoteDataSynced(true);
        if (!silent) showToast('Berhasil sinkronisasi dengan Google Sheet!', 'success');
        setTimeout(() => setSyncStatus('idle'), 1500);
      } else {
        throw new Error(resData.message || 'Respons server tidak valid');
      }
    } catch (error) {
      console.error(error);
      setSyncStatus('error');
      setRemoteDataSynced(false);
      showToast('Gagal sinkronisasi Google Sheets. Cek koneksi / URL App Script!', 'error');
      setTimeout(() => setSyncStatus('idle'), 2000);
    }
  };

  const postDataToGoogleSheets = async (action, payload, successCallback) => {
    if (!gasUrl) {
      if (successCallback) successCallback();
      return;
    }

    setSyncStatus('syncing');
    setSyncProgressMsg(`Menyimpan perubahan (${action}) ke Google Sheets...`);

    try {
      await fetch(gasUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: action,
          payload: payload,
          currentUser: currentUser
        })
      });

      setSyncStatus('success');
      showToast('Database berhasil diposting ke Cloud!');
      setTimeout(() => {
        setSyncStatus('idle');
        pullDataFromGoogleSheets(true);
      }, 1500);

      if (successCallback) successCallback();
    } catch (error) {
      console.error(error);
      setSyncStatus('error');
      showToast('Gagal mengirim update ke Google Sheets Webhook!', 'error');
      setTimeout(() => setSyncStatus('idle'), 2000);
    }
  };

  useEffect(() => {
    if (gasUrl) {
      pullDataFromGoogleSheets(true);
    }
  }, [gasUrl]);

  /**
   * Mengimplementasikan Perhitungan Lembur Sesuai Aturan:
   * 1. 1 JAM PERTAMA = Rp. 20.000, di bawah 1 jam = Rp. 0
   * 2. Jam berikutnya = Rp. 15.000 per jam
   * 3. LEMBUR DIBAWAH ATAU SAMA DENGAN 30 Menit (dari sisa jam) dibulatkan ke bawah (.0),
   * DIATAS 30 Menit dibulatkan ke setengah jam (.5).
   */
  const calculateOvertimePay = (startTimeStr, endTimeStr) => {
    if (!startTimeStr || !endTimeStr) return { duration: 0, roundedDuration: 0, pay: 0, steps: [] };

    const cleanStart = formatCleanTime(startTimeStr);
    const cleanEnd = formatCleanTime(endTimeStr);

    const [startH, startM] = cleanStart.split(':').map(Number);
    const [endH, endM] = cleanEnd.split(':').map(Number);

    let diffMinutes = (endH * 60 + endM) - (startH * 60 + startM);
    if (diffMinutes < 0) {
      diffMinutes += 24 * 60; // Cross-midnight buffer
    }

    if (diffMinutes < 60) {
      return { 
        duration: Number((diffMinutes / 60).toFixed(2)), 
        roundedDuration: 0, 
        pay: 0, 
        steps: ['Durasi di bawah 1 jam tidak dihitung (Rp. 0)'] 
      };
    }

    const rawHours = diffMinutes / 60;
    let roundedHours = 0;
    const wholeHours = Math.floor(rawHours);
    const remainingMins = diffMinutes % 60;

    if (remainingMins <= 30) {
      roundedHours = wholeHours;
    } else {
      roundedHours = wholeHours + 0.5;
    }

    let totalPay = 0;
    const steps = [];

    if (roundedHours >= 1.0) {
      totalPay += 20000;
      steps.push('1 Jam Pertama = Rp. 20.000');

      const extraHours = roundedHours - 1.0;
      if (extraHours > 0) {
        const extraPay = extraHours * 15000;
        totalPay += extraPay;
        steps.push(`Jam Berikutnya (${extraHours} Jam x Rp. 15.000) = Rp. ${extraPay.toLocaleString('id-ID')}`);
      }
    }

    return { 
      duration: Number(rawHours.toFixed(2)), 
      roundedDuration: roundedHours, 
      pay: totalPay, 
      steps 
    };
  };

  const availableYears = useMemo(() => getAvailableYears(overtime), [overtime]);

  const stats = useMemo(() => getDashboardStats(overtime, dashMonth, dashYear), [overtime, dashMonth, dashYear]);

  const hasAccess = (menuName) => {
    return (currentUser?.aksesMenu || '').toLowerCase().includes(menuName.toLowerCase());
  };

  const callGeminiAPI = async (systemPrompt, userQuery) => {
    const keyToUse = geminiApiKey || ""; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${keyToUse}`;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      }
    };

    let delay = 1000;
    const maxRetries = 3;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          if (response.status === 429 && attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
            continue;
          }
          throw new Error(`API HTTP Error: ${response.status}`);
        }

        const result = await response.json();
        const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generatedText) {
          return generatedText;
        } else {
          throw new Error("Gagal mengekstrak teks respons dari struktur Gemini API.");
        }
      } catch (err) {
        if (attempt === maxRetries) {
          throw err;
        }
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword.trim()) {
      showToast('Wajib memasukkan nama pengguna dan sandi!', 'error');
      return;
    }

    if (gasUrl && !remoteDataSynced) {
      await pullDataFromGoogleSheets(true);
    }

    const matchedUser = users.find(
      u => u.username.toLowerCase() === loginUsername.trim().toLowerCase() && u.password === loginPassword
    );

    if (matchedUser) {
      setCurrentUser(matchedUser);
      writeLocalLog(matchedUser, 'login', `User ${matchedUser.displayName} berhasil login.`);
      showToast(`Selamat datang kembali, ${matchedUser.displayName}!`, 'success');
    } else {
      showToast('Kombinasi nama pengguna atau kata sandi keliru!', 'error');
    }
  };

  const handleLogout = () => {
    writeLocalLog(currentUser, 'logout', 'User keluar dari sistem.');
    setCurrentUser(null);
    setCurrentTab('Dashboard');
    setLoginUsername('');
    setLoginPassword('');
    showToast('Berhasil keluar dari sesi.');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-900/20 blur-[120px] pointer-events-none"></div>

        <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl relative backdrop-blur-md">
          <div className="text-center space-y-2 mb-8">
            <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl mx-auto shadow-xl shadow-indigo-500/30">
              ⚡
            </div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase">Overtime Portal</h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide">GARUDA HUB - DRIVE & SPREADSHEET INTEGRATION</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Lock className="h-3 w-3 text-indigo-400" /> Username
              </label>
              <input 
                type="text" 
                placeholder="Masukkan username (cth: admin1)"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Key className="h-3 w-3 text-indigo-400" /> Password
              </label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
            >
              Masuk Ke Portal
            </button>
          </form>

          {!remoteDataSynced && (
            <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-2">
              <p className="text-[9px] text-slate-500 font-bold uppercase text-center tracking-wider">Akses Cepat Pengujian (Demo Profiles)</p>
              <div className="grid grid-cols-2 gap-2">
                {INITIAL_USER_ROLES.map((roleInfo) => (
                  <button
                    key={roleInfo.username}
                    onClick={() => {
                      setLoginUsername(roleInfo.username);
                      setLoginPassword(roleInfo.password);
                    }}
                    className="bg-slate-950 hover:bg-indigo-950 border border-slate-800/80 hover:border-indigo-800 rounded-xl p-2 text-left transition-all group"
                  >
                    <p className="text-[10px] font-bold text-slate-300 group-hover:text-indigo-400 truncate">{roleInfo.displayName.split(' (')[0]}</p>
                    <span className="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase font-black tracking-wider block mt-1 w-fit">
                      {roleInfo.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {gasUrl && !remoteDataSynced && (
            <p className="text-[9px] text-amber-300 text-center mt-4">Menunggu sinkronisasi data pengguna dari Google Sheet...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30 shadow-md backdrop-blur bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between py-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-xl tracking-tight text-white shadow-lg shadow-indigo-500/30">
              ⚡
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-white">OVERTIME PORTAL</span>
                {gasUrl ? (
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-500/30">
                    Live Connected
                  </span>
                ) : (
                  <span className="bg-amber-500/20 text-amber-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-amber-500/30">
                    Demo Mode (Local)
                  </span>
                )}
                {geminiApiKey ? (
                  <span className="bg-violet-500/20 text-violet-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-violet-500/30 flex items-center gap-1">
                    <Brain className="h-2.5 w-2.5" /> Gemini Ready
                  </span>
                ) : (
                  <span className="bg-slate-800 text-slate-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-700">
                    No LLM Key
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                Sistem Integrasi Google Drive & Gemini AI Assistant
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl space-x-2 text-xs font-bold text-slate-300">
              <span className="bg-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase px-2 py-0.5 rounded">
                {currentUser.role}
              </span>
              <span>{currentUser.displayName}</span>
            </div>

            {gasUrl && (
              <button 
                onClick={() => pullDataFromGoogleSheets()}
                className="bg-slate-850 hover:bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
              >
                <RefreshCw className="h-3 w-3" /> Sinkron Sheet
              </button>
            )}

            <button 
              onClick={handleLogout}
              className="bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/30 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-300 transition-all flex items-center gap-1 active:scale-95"
            >
              <LogOut className="h-3 w-3" /> Keluar
            </button>
          </div>
        </div>
      </header>

      {syncStatus === 'syncing' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto"></div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Google Cloud Integration</p>
            <p className="text-sm font-semibold text-white animate-pulse">{syncProgressMsg}</p>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`p-4 rounded-xl shadow-2xl flex items-center space-x-3 border ${
            toast.type === 'error' ? 'bg-rose-950 border-rose-500 text-rose-200' : 
            toast.type === 'warning' ? 'bg-amber-950 border-amber-500 text-amber-200' :
            'bg-emerald-950 border-emerald-500 text-emerald-200'
          }`}>
            <span className="text-xl">
              {toast.type === 'error' ? '⚠️' : toast.type === 'warning' ? '🔔' : '✅'}
            </span>
            <p className="text-xs font-bold leading-relaxed">{toast.message}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-grow flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sticky top-24 space-y-4">
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-indigo-500 flex items-center justify-center font-black text-sm text-white">
                {currentUser.displayName.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-xs text-white truncate">{currentUser.displayName}</h4>
                <p className="text-[10px] text-slate-400 font-semibold">{currentUser.divisi}</p>
              </div>
            </div>

            <nav className="flex flex-col space-y-1">
              {[
                { name: 'Dashboard', icon: TrendingUp },
                { name: 'Form OT', icon: FileText },
                { name: 'OT History', icon: Calendar },
                { name: 'Approval', icon: CheckCircle },
                { name: 'AI Copilot', icon: Brain },
                { name: 'Audit Log', icon: Activity },
                { name: 'Report', icon: Download },
                { name: 'Settings', icon: Settings }
              ].map((tab) => {
                if (!hasAccess(tab.name)) return null;

                return (
                  <button
                    key={tab.name}
                    onClick={() => setCurrentTab(tab.name)}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      currentTab === tab.name 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                        : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-slate-800/80 pt-4 space-y-3 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kunci Data (Sheets)</span>
                <Database className="h-4 w-4 text-cyan-400" />
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Penyimpanan data cloud aktif melalui Google Sheets.
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentTab('Settings')}
                  className="flex-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] font-bold py-2 rounded-lg text-slate-300 transition-all text-center"
                >
                  Setting
                </button>
                {gasUrl && (
                  <a 
                    href={gasUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] font-black py-2 rounded-lg transition-all text-center"
                  >
                    Buka Sheet
                  </a>
                )}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-grow flex flex-col space-y-6">
          {currentTab === 'Dashboard' && hasAccess('Dashboard') && (
            <Dashboard
              gasUrl={gasUrl}
              dashMonth={dashMonth}
              setDashMonth={setDashMonth}
              dashYear={dashYear}
              setDashYear={setDashYear}
              availableYears={availableYears}
              stats={stats}
              setCurrentTab={setCurrentTab}
            />
          )}

          {currentTab === 'Form OT' && hasAccess('Form OT') && (
            <FormOTView 
              currentUser={currentUser} 
              karyawan={karyawan} 
              overtime={overtime} 
              setOvertime={setOvertime} 
              calculateOvertimePay={calculateOvertimePay} 
              writeLocalLog={writeLocalLog} 
              postDataToGoogleSheets={postDataToGoogleSheets} 
              showToast={showToast}
              callGeminiAPI={callGeminiAPI}
              geminiApiKey={geminiApiKey}
            />
          )}

          {currentTab === 'OT History' && hasAccess('OT History') && (
            <OTHistoryView 
              currentUser={currentUser} 
              overtime={overtime} 
              setOvertime={setOvertime} 
              writeLocalLog={writeLocalLog} 
              postDataToGoogleSheets={postDataToGoogleSheets} 
              showToast={showToast} 
              setPreviewPdfData={setPreviewPdfData} 
            />
          )}

          {currentTab === 'Approval' && hasAccess('Approval') && (
            <ApprovalView 
              currentUser={currentUser} 
              overtime={overtime} 
              setOvertime={setOvertime} 
              writeLocalLog={writeLocalLog} 
              postDataToGoogleSheets={postDataToGoogleSheets} 
              showToast={showToast}
              callGeminiAPI={callGeminiAPI}
              geminiApiKey={geminiApiKey}
            />
          )}

          {currentTab === 'AI Copilot' && hasAccess('AI Copilot') && (
            <AICopilotView 
              overtime={overtime}
              karyawan={karyawan}
              callGeminiAPI={callGeminiAPI}
              geminiApiKey={geminiApiKey}
              showToast={showToast}
            />
          )}

          {currentTab === 'Audit Log' && hasAccess('Audit Log') && (
            <AuditLogView auditLogs={auditLogs} setAuditLogs={setAuditLogs} showToast={showToast} />
          )}

          {currentTab === 'Report' && hasAccess('Report') && (
            <ReportView 
              overtime={overtime} 
              currentUser={currentUser} 
              writeLocalLog={writeLocalLog} 
              showToast={showToast} 
            />
          )}

          {currentTab === 'Settings' && hasAccess('Settings') && (
            <SettingsView 
              users={users} 
              setUsers={setUsers} 
              karyawan={karyawan} 
              setKaryawan={setKaryawan} 
              currentUser={currentUser} 
              writeLocalLog={writeLocalLog} 
              showToast={showToast} 
              gasUrl={gasUrl}
              setGasUrl={setGasUrl}
              geminiApiKey={geminiApiKey}
              setGeminiApiKey={setGeminiApiKey}
              pullDataFromGoogleSheets={pullDataFromGoogleSheets}
              postDataToGoogleSheets={postDataToGoogleSheets}
            />
          )}
        </main>
      </div>

      {previewPdfData && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm overflow-y-auto flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-2xl w-full p-8 shadow-2xl space-y-6 relative border border-slate-200">
            <button 
              onClick={() => setPreviewPdfData(null)}
              className="absolute top-5 right-5 bg-slate-100 hover:bg-slate-200 text-slate-700 h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs"
            >
              ✕
            </button>

            <div className="border-b-2 border-slate-800 pb-5 text-center space-y-1">
              <h2 className="text-lg font-black tracking-tight text-indigo-900 uppercase">BERKAS LEMBUR KARYAWAN (OVERTIME PAYSLIP)</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Enterprise Group Warehouse & Operations</p>
              <p className="text-[10px] text-slate-400 font-medium">Sistem Integrasi Basis Data Google Drive - Auto-Generated</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <p className="text-slate-500">Nomor Berkas (ID DOC): <strong className="text-slate-800 block text-sm font-mono">{previewPdfData.idDoc}</strong></p>
                <p className="text-slate-500">Tanggal Pengajuan: <strong className="text-slate-800 block">{previewPdfData.tanggalPengajuan}</strong></p>
                <p className="text-slate-500">Tanggal Kerja Lembur: <strong className="text-slate-800 block">{formatFriendlyDate(previewPdfData.tanggalLembur)}</strong></p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-slate-500">Departemen / Divisi: <strong className="text-slate-800 block uppercase">{previewPdfData.divisi}</strong></p>
                <p className="text-slate-500">Lokasi Penugasan: <strong className="text-slate-800 block uppercase">{previewPdfData.areaLembur}</strong></p>
                <p className="text-slate-500">Jenis Kegiatan: <strong className="text-slate-800 block">{previewPdfData.jenisLembur}</strong></p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden mt-4 text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                    <th className="py-2 px-4">Nama Lengkap (NIK)</th>
                    <th className="py-2 px-4">Jabatan</th>
                    <th className="py-2 px-4">Waktu (Durasi)</th>
                    <th className="py-2 px-4 text-right">Kompensasi (Nominal)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="text-slate-800">
                    <td className="py-3 px-4">
                      <p className="font-extrabold">{previewPdfData.namaKaryawan}</p>
                      <p className="text-[10px] text-slate-500">NIK: {previewPdfData.idKaryawan}</p>
                    </td>
                    <td className="py-3 px-4">{previewPdfData.jabatan}</td>
                    <td className="py-3 px-4">
                      <p className="font-bold">{formatCleanTime(previewPdfData.jamMulai)} - {formatCleanTime(previewPdfData.jamSelesai)}</p>
                      <p className="text-[10px] text-slate-500">{previewPdfData.durasiLembur} Jam Kerja</p>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-indigo-700 text-sm">
                      Rp. {Number(previewPdfData.nominal).toLocaleString('id-ID')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
              <strong className="block text-slate-800 font-bold">Alasan Penugasan Overtime:</strong>
              <p className="italic">"{previewPdfData.alasanLembur}"</p>
            </div>

            {previewPdfData.catatanManager && (
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-800">
                <strong>Catatan Evaluasi / Catatan Manager:</strong>
                <p className="italic">"{previewPdfData.catatanManager}"</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 pt-8 text-xs text-center font-bold text-slate-700">
              <div className="space-y-12">
                <p className="text-slate-400">Petugas Pengaju</p>
                <p className="underline text-slate-900">( {currentUser?.displayName?.split(' ')[0] || 'User'} )</p>
              </div>
              <div className="space-y-12">
                <p className="text-slate-400">Manager Operasional</p>
                <p className="underline text-slate-900">
                  {previewPdfData.statusDocument === 'approved' || previewPdfData.statusDocument === 'paid' ? '✔ DISETUJUI' : '( Belum Disetujui )'}
                </p>
              </div>
              <div className="space-y-12">
                <p className="text-slate-400">Verifikator Keuangan</p>
                <p className="underline text-slate-900">
                  {previewPdfData.statusDocument === 'paid' ? '✔ SUDAH LUNAS' : '( Kasir / HRD )'}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <p className="text-[10px] text-slate-400 italic">Sistem Validasi Drive: Secure-Verification-Check</p>
              <button 
                onClick={() => window.print()}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-1"
              >
                <span>🖨️</span>
                <span>Print PDF Berkas</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-slate-950 border-t border-slate-800 py-6 text-center text-xs text-slate-500 font-bold mt-12">
        <p>© 2026 Enterprise Overtime Portal. Cloud Sync and Gemini LLM Engine Active.</p>
      </footer>
    </div>
  );
}

