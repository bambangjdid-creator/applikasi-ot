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

const INITIAL_USER_ROLES = [
  { username: 'admin1', password: '123', displayName: 'Budi Hartono (Admin)', divisi: 'HEAD OFFICE', divisiKode: 'HO', role: 'Admin', aksesMenu: 'Dashboard, Form OT, OT History, Approval, Audit Log, Report, Settings, AI Copilot' },
  { username: 'user1', password: '123', displayName: 'Siti Aminah (Staff)', divisi: 'GUDANG PONCOL', divisiKode: 'PCL', role: 'User', aksesMenu: 'Dashboard, Form OT, OT History, AI Copilot' },
  { username: 'mgr1', password: '123', displayName: 'Hendra Wijaya (Manager)', divisi: 'GUDANG NAGOYA', divisiKode: 'NGY', role: 'Manager', aksesMenu: 'Dashboard, OT History, Approval, Report, AI Copilot' },
  { username: 'hrd1', password: '123', displayName: 'Saskia Putri (HRD)', divisi: 'HEAD OFFICE', divisiKode: 'HO', role: 'hrd', aksesMenu: 'Dashboard, OT History, Approval, Audit Log, Report, Settings, AI Copilot' }
];

const INITIAL_DATA_KARYAWAN = [
  { nik: '3275012301', idKaryawan: 'EMP001', namaKaryawan: 'Ahmad Dani', divisi: 'GUDANG NAGOYA', areaKerja: 'GUDANG NAGOYA', jabatan: 'Staf Logistik' },
  { nik: '3275012302', idKaryawan: 'EMP002', namaKaryawan: 'Budi Santoso', divisi: 'GUDANG NAGOYA', areaKerja: 'GUDANG NAGOYA', jabatan: 'Helper Gudang' },
  { nik: '3275012303', idKaryawan: 'EMP003', namaKaryawan: 'Siti Aminah', divisi: 'GUDANG PONCOL', areaKerja: 'GUDANG PONCOL', jabatan: 'Staf Logistik' },
  { nik: '3275012304', idKaryawan: 'EMP004', namaKaryawan: 'Dedi Kurniawan', divisi: 'GUDANG CIRACAS', areaKerja: 'GUDANG CIRACAS', jabatan: 'Driver Operasional' },
  { nik: '3275012305', idKaryawan: 'EMP005', namaKaryawan: 'Eka Putri', divisi: 'FINANCE', areaKerja: 'HEAD OFFICE', jabatan: 'Kasir Utama' },
  { nik: '3275012306', idKaryawan: 'EMP006', namaKaryawan: 'Farhan Azis', divisi: 'GUDANG PONCOL', areaKerja: 'GUDANG PONCOL', jabatan: 'Operator Forklift' },
  { nik: '3275012307', idKaryawan: 'EMP007', namaKaryawan: 'Gilang Ramadhan', divisi: 'GUDANG CIRACAS', areaKerja: 'GUDANG CIRACAS', jabatan: 'Staf Penerimaan' }
];

const INITIAL_OVERTIME = [
  { 
    idDoc: 'OT/NGY/2026/05/000001', 
    tanggalPengajuan: '2026-05-20', 
    tanggalLembur: '2026-05-19', 
    areaLembur: 'GUDANG NAGOYA', 
    divisi: 'GUDANG NAGOYA', 
    jenisLembur: 'BONGKARAN', 
    namaKaryawan: 'Ahmad Dani', 
    idKaryawan: 'EMP001', 
    jabatan: 'Staf Logistik', 
    jamMulai: '17:30', 
    jamSelesai: '21:00', 
    durasiLembur: 3.5, 
    nominal: 57500, 
    statusDocument: 'approved', 
    alasanLembur: 'Bongkar kontainer impor dari pelabuhan Nagoya berisi suku cadang darurat.', 
    catatanManager: 'Tugas mendesak, disetujui penuh.' 
  },
  { 
    idDoc: 'OT/NGY/2026/05/000001', 
    tanggalPengajuan: '2026-05-20', 
    tanggalLembur: '2026-05-19', 
    areaLembur: 'GUDANG NAGOYA', 
    divisi: 'GUDANG NAGOYA', 
    jenisLembur: 'BONGKARAN', 
    namaKaryawan: 'Budi Santoso', 
    idKaryawan: 'EMP002', 
    jabatan: 'Helper Gudang', 
    jamMulai: '17:30', 
    jamSelesai: '21:00', 
    durasiLembur: 3.5, 
    nominal: 57500, 
    statusDocument: 'approved', 
    alasanLembur: 'Bongkar kontainer impor dari pelabuhan Nagoya berisi suku cadang darurat.', 
    catatanManager: 'Tugas mendesak, disetujui penuh.' 
  },
  { 
    idDoc: 'OT/PCL/2026/05/000002', 
    tanggalPengajuan: '2026-05-21', 
    tanggalLembur: '2026-05-20', 
    areaLembur: 'GUDANG PONCOL', 
    divisi: 'GUDANG PONCOL', 
    jenisLembur: 'STOCK OPNAME', 
    namaKaryawan: 'Siti Aminah', 
    idKaryawan: 'EMP003', 
    jabatan: 'Staf Logistik', 
    jamMulai: '18:00', 
    jamSelesai: '20:30', 
    durasiLembur: 2.5, 
    nominal: 42500, 
    statusDocument: 'pending', 
    alasanLembur: 'Penyesuaian stok triwulanan gudang poncol karena selisih audit.', 
    catatanManager: '' 
  },
  { 
    idDoc: 'OT/CRS/2026/05/000003', 
    tanggalPengajuan: '2026-05-22', 
    tanggalLembur: '2026-05-21', 
    areaLembur: 'GUDANG CIRACAS', 
    divisi: 'GUDANG CIRACAS', 
    jenisLembur: 'KIRIMAN', 
    namaKaryawan: 'Dedi Kurniawan', 
    idKaryawan: 'EMP004', 
    jabatan: 'Driver Operasional', 
    jamMulai: '17:00', 
    jamSelesai: '19:45', 
    durasiLembur: 2.5, 
    nominal: 42500, 
    statusDocument: 'paid', 
    alasanLembur: 'Pengiriman muatan semen mendesak ke proyek pembangunan bypass.', 
    catatanManager: 'Sudah diselesaikan dan dicairkan kasir.' 
  }
];

const INITIAL_AUDIT_LOGS = [
  { timestamp: '2026-05-23 09:30:15', user: 'admin1', action: 'login', details: 'User admin1 berhasil masuk ke sistem.' },
  { timestamp: '2026-05-23 11:00:05', user: 'system', action: 'inisialisasi', details: 'Database berhasil dikonfigurasi secara lokal dengan seed data.' }
];

const DIVISIONS = [
  { label: 'GUDANG NAGOYA', code: 'NGY' },
  { label: 'GUDANG PONCOL', code: 'PCL' },
  { label: 'GUDANG CIRACAS', code: 'CRS' },
  { label: 'FINANCE', code: 'FIN' },
  { label: 'HEAD OFFICE', code: 'HO' },
  { label: 'STORE', code: 'STR' },
  { label: 'PURCHASING', code: 'PURC' }
];

const OVERTIME_TYPES = ['BONGKARAN', 'KIRIMAN', 'MUATAN', 'STOCK OPNAME', 'LAIN-LAIN'];
const LOCATIONS = ['GUDANG PONCOL', 'GUDANG NAGOYA', 'GUDANG CIRACAS', 'HEAD OFFICE', 'STORE'];

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

export default function App() {
  const [gasUrl, setGasUrl] = useState(() => {
    return localStorage.getItem('ot_gas_web_app_url') || '';
  });

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
        if (!silent) showToast('Berhasil sinkronisasi dengan Google Sheet!', 'success');
        setTimeout(() => setSyncStatus('idle'), 1500);
      } else {
        throw new Error(resData.message || 'Respons server tidak valid');
      }
    } catch (error) {
      console.error(error);
      setSyncStatus('error');
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

  const availableYears = useMemo(() => {
    const years = new Set();
    overtime.forEach(item => {
      if (item.tanggalLembur) {
        try {
          const yr = new Date(item.tanggalLembur).getFullYear();
          if (!isNaN(yr)) {
            years.add(yr);
          }
        } catch (e) {}
      }
    });
    if (years.size === 0) {
      years.add(2025);
      years.add(2026);
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [overtime]);

  const stats = useMemo(() => {
    // 1. Saring data berdasarkan status lunas/disetujui serta filter bulan & tahun terpilih
    const approvedOrPaidFiltered = overtime.filter(item => {
      if (item.statusDocument !== 'approved' && item.statusDocument !== 'paid') return false;
      
      if (dashYear !== 'ALL') {
        try {
          const yr = new Date(item.tanggalLembur).getFullYear();
          if (String(yr) !== String(dashYear)) return false;
        } catch (e) { return false; }
      }
      
      if (dashMonth !== 'ALL') {
        try {
          const mo = new Date(item.tanggalLembur).getMonth() + 1;
          if (String(mo).padStart(2, '0') !== String(dashMonth)) return false;
        } catch (e) { return false; }
      }
      return true;
    });
    
    const totalDuration = approvedOrPaidFiltered.reduce((sum, item) => sum + Number(item.durasiLembur || 0), 0);
    const totalNominal = approvedOrPaidFiltered.reduce((sum, item) => sum + Number(item.nominal || 0), 0);
    const approvedCount = approvedOrPaidFiltered.length;
    const averageDurationPerDoc = approvedCount ? Number((totalDuration / approvedCount).toFixed(1)) : 0;
    
    // Status global (selalu update semua periode sebagai alarm aksi bagi manager)
    const pendingCount = overtime.filter(item => item.statusDocument === 'pending').length;
    const revisionCount = overtime.filter(item => item.statusDocument === 'revision').length;

    // 2. Trend Bulanan (Mengabaikan filter bulan agar grafik line tetap utuh satu tahun)
    const approvedOrPaidForTrend = overtime.filter(item => {
      if (item.statusDocument !== 'approved' && item.statusDocument !== 'paid') return false;
      if (dashYear !== 'ALL') {
        try {
          const yr = new Date(item.tanggalLembur).getFullYear();
          if (String(yr) !== String(dashYear)) return false;
        } catch (e) { return false; }
      }
      return true;
    });

    const monthlyTrendMap = {};
    approvedOrPaidForTrend.forEach(item => {
      const date = new Date(item.tanggalLembur);
      const monthLabel = date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
      if (!monthlyTrendMap[monthLabel]) {
        monthlyTrendMap[monthLabel] = { month: monthLabel, timestamp: date.getTime(), Durasi: 0, Nominal: 0 };
      }
      monthlyTrendMap[monthLabel].Durasi += Number(item.durasiLembur || 0);
      monthlyTrendMap[monthLabel].Nominal += Number(item.nominal || 0);
    });
    const trendData = Object.values(monthlyTrendMap).sort((a, b) => a.timestamp - b.timestamp);

    // 3. Top Karyawan Terfilter
    const employeeMap = {};
    approvedOrPaidFiltered.forEach(item => {
      if (!employeeMap[item.namaKaryawan]) {
        employeeMap[item.namaKaryawan] = { name: item.namaKaryawan, nominal: 0, jam: 0 };
      }
      employeeMap[item.namaKaryawan].nominal += Number(item.nominal || 0);
      employeeMap[item.namaKaryawan].jam += Number(item.durasiLembur || 0);
    });
    const topEmployees = Object.values(employeeMap)
      .sort((a, b) => b.nominal - a.nominal)
      .slice(0, 5);

    // 4. Pembagian Overtime Per Divisi Terfilter (Grafik Batang Bar)
    const divisionMap = {};
    approvedOrPaidFiltered.forEach(item => {
      if (!divisionMap[item.divisi]) {
        divisionMap[item.divisi] = { name: item.divisi, nominal: 0, jam: 0 };
      }
      divisionMap[item.divisi].nominal += Number(item.nominal || 0);
      divisionMap[item.divisi].jam += Number(item.durasiLembur || 0);
    });
    const topDivisions = Object.values(divisionMap)
      .sort((a, b) => b.nominal - a.nominal);

    // 5. Jenis Kegiatan Terfilter
    const typeMap = {};
    approvedOrPaidFiltered.forEach(item => {
      const cleanType = item.jenisLembur.split(' (')[0];
      if (!typeMap[cleanType]) {
        typeMap[cleanType] = { name: cleanType, value: 0 };
      }
      typeMap[cleanType].value += Number(item.nominal || 0);
    });
    const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    return {
      totalDuration: Number(totalDuration.toFixed(1)),
      totalNominal,
      approvedCount,
      averageDurationPerDoc,
      pendingCount,
      revisionCount,
      trendData,
      topEmployees,
      topDivisions,
      topTypes: Object.values(typeMap),
      COLORS
    };
  }, [overtime, dashMonth, dashYear]);

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

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword.trim()) {
      showToast('Wajib memasukkan nama pengguna dan sandi!', 'error');
      return;
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
          </div>
        </aside>

        <main className="flex-grow flex flex-col space-y-6">
          {currentTab === 'Dashboard' && hasAccess('Dashboard') && (
            <div className="space-y-6 animate-fade-in">
              {!gasUrl && (
                <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-xl flex items-center justify-between gap-4">
                  <div className="text-xs">
                    <p className="font-bold text-amber-200">⚠️ Aplikasi Berjalan Dalam Mode Demo Lokal</p>
                    <p className="text-amber-400 mt-0.5">Data tersimpan secara offline di browser Anda. Hubungkan URL Google Web App Anda di tab **Settings** untuk sinkronisasi Google Sheet.</p>
                  </div>
                  <button 
                    onClick={() => setCurrentTab('Settings')}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] px-3 py-1.5 rounded-lg whitespace-nowrap"
                  >
                    Atur URL Sekarang
                  </button>
                </div>
              )}

              <div className="bg-slate-950 border border-slate-800 rounded-[2rem] p-6 shadow-2xl shadow-slate-950/40 ring-1 ring-slate-800/70">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div className="space-y-3 max-w-3xl">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400 font-semibold">Dashboard Overtime</p>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Ringkasan Kinerja dan Biaya Lembur</h1>
                    <p className="text-sm text-slate-400 leading-6">Lihat performa lembur, status dokumen, dan distribusi biaya secara real time dengan filter bulan dan tahun.</p>
                  </div>
                  <div className="flex flex-col items-start gap-3 sm:items-end">
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                      <Sparkles className="h-4 w-4 text-amber-400" />
                      {dashMonth === 'ALL' ? 'Semua Bulan' : ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][Number(dashMonth) - 1]} • {dashYear === 'ALL' ? 'Semua Tahun' : dashYear}
                    </div>
                    <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[11px] font-semibold text-emerald-300">{stats.approvedCount} Disetujui</span>
                      <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-[11px] font-semibold text-amber-300">{stats.pendingCount} Menunggu</span>
                      <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-[11px] font-semibold text-rose-300">{stats.revisionCount} Revisi</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Dashboard Global Filter Panel */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 border border-slate-800 p-4 rounded-2xl shadow-lg">
                <div>
                  <h2 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                    📊 FILTER ANALISA DATA OVERTIME
                  </h2>
                  <p className="text-[10px] text-slate-400">Atur periode bulan & tahun untuk mengerucutkan grafik kompensasi divisi.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Bulan:</span>
                    <select
                      value={dashMonth}
                      onChange={(e) => setDashMonth(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-200 focus:outline-none cursor-pointer hover:border-slate-700 transition"
                    >
                      <option value="ALL">Semua Bulan</option>
                      <option value="01">Januari</option>
                      <option value="02">Februari</option>
                      <option value="03">Maret</option>
                      <option value="04">April</option>
                      <option value="05">Mei</option>
                      <option value="06">Juni</option>
                      <option value="07">Juli</option>
                      <option value="08">Agustus</option>
                      <option value="09">September</option>
                      <option value="10">Oktober</option>
                      <option value="11">November</option>
                      <option value="12">Desember</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Tahun:</span>
                    <select
                      value={dashYear}
                      onChange={(e) => setDashYear(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-200 focus:outline-none cursor-pointer hover:border-slate-700 transition"
                    >
                      <option value="ALL">Semua Tahun</option>
                      {availableYears.map(yr => (
                        <option key={yr} value={yr}>{yr}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl shadow-xl shadow-slate-950/20 ring-1 ring-slate-800/60">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-indigo-500/10 text-indigo-300 rounded-2xl">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold">Total Jam</p>
                      <p className="text-xs text-slate-400">Disetujui & Lunas</p>
                    </div>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white break-words">{stats.totalDuration}</h3>
                  <p className="mt-2 text-sm text-slate-400">Total jam lembur yang sudah diverifikasi.</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl shadow-xl shadow-slate-950/20 ring-1 ring-slate-800/60">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-emerald-500/10 text-emerald-300 rounded-2xl">
                      <Coins className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold">Nominal Kompensasi</p>
                      <p className="text-xs text-slate-400">Anggaran lembur saat ini</p>
                    </div>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white break-words">Rp. {stats.totalNominal.toLocaleString('id-ID')}</h3>
                  <p className="mt-2 text-sm text-slate-400">Total pengeluaran kompensasi.</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl shadow-xl shadow-slate-950/20 ring-1 ring-slate-800/60">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-slate-700/40 text-slate-200 rounded-2xl">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold">Dokumen Disetujui</p>
                      <p className="text-xs text-slate-400">Lembar pengajuan selesai</p>
                    </div>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white break-words">{stats.approvedCount}</h3>
                  <p className="mt-2 text-sm text-slate-400">Jumlah dokumen yang sudah diverifikasi.</p>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl shadow-xl shadow-slate-950/20 ring-1 ring-slate-800/60">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-slate-700/40 text-slate-200 rounded-2xl">
                      <Activity className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold">Rata-rata Jam</p>
                      <p className="text-xs text-slate-400">Per dokumen disetujui</p>
                    </div>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white break-words">{stats.averageDurationPerDoc.toFixed(1)}</h3>
                  <p className="mt-2 text-sm text-slate-400">Jam lembur rata-rata per dokumen.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Grafik Trend Overtime Bulanan</h3>
                      <p className="text-[10px] text-slate-400">Total jam kerja vs total nominal biaya lembur.</p>
                    </div>
                  </div>
                  <div className="h-64">
                    {stats.trendData.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-xs text-slate-500 font-bold gap-1">
                        <Database className="h-8 w-8 text-slate-700 animate-pulse" />
                        <span>Belum ada data lembur yang disetujui untuk ditampilkan.</span>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats.trendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                          <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} />
                          <YAxis yAxisId="left" stroke="#6366F1" fontSize={10} />
                          <YAxis yAxisId="right" orientation="right" stroke="#10B981" fontSize={10} />
                          <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }} />
                          <Legend wrapperStyle={{ fontSize: 10 }} />
                          <Line yAxisId="left" type="monotone" dataKey="Durasi" stroke="#6366F1" name="Durasi (Jam)" strokeWidth={2.5} activeDot={{ r: 8 }} />
                          <Line yAxisId="right" type="monotone" dataKey="Nominal" stroke="#10B981" name="Nominal (Rp)" strokeWidth={2.5} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Proporsi Jenis Kegiatan</h3>
                    <p className="text-[10px] text-slate-400">Distribusi pembebanan anggaran berdasarkan jenis kegiatan.</p>
                  </div>
                  <div className="h-44 my-2 flex items-center justify-center relative">
                    {stats.topTypes.length === 0 ? (
                      <div className="text-xs text-slate-500 font-bold">Tidak ada data proporsi.</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats.topTypes}
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {stats.topTypes.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={stats.COLORS[index % stats.COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `Rp. ${value.toLocaleString('id-ID')}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                  <div className="space-y-1.5 text-[10px]">
                    {stats.topTypes.map((t, idx) => (
                      <div key={t.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: stats.COLORS[idx % stats.COLORS.length] }}></span>
                          <span className="font-bold text-slate-300">{t.name}</span>
                        </div>
                        <span className="font-mono text-slate-400 font-bold">Rp. {t.value.toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                    <UserCheck className="h-4 w-4 text-indigo-400" /> ⭐ Top 5 Karyawan (Lembur Terbanyak)
                  </h3>
                  <div className="divide-y divide-slate-800/80">
                    {stats.topEmployees.length === 0 ? (
                      <p className="text-xs text-slate-500 py-4 italic">Belum ada data lembur tercatat.</p>
                    ) : (
                      stats.topEmployees.map((emp, index) => (
                        <div key={`${emp.name}-${index}`} className="flex items-center justify-between py-2.5">
                          <div className="flex items-center space-x-3">
                            <span className="font-mono font-black text-indigo-400 text-sm">#{index + 1}</span>
                            <span className="text-xs font-bold text-slate-200">{emp.name}</span>
                          </div>
                          <div className="text-right text-xs">
                            <span className="font-bold text-white block">Rp. {emp.nominal.toLocaleString('id-ID')}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{emp.jam} Jam</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                      <Database className="h-4 w-4 text-indigo-400" /> 🏢 Grafik Distribusi Overtime Per Divisi
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Analisa komparasi anggaran biaya lembur antar departemen.</p>
                  </div>
                  
                  <div className="h-56 mt-2 flex items-center justify-center relative">
                    {stats.topDivisions.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-xs text-slate-500 font-bold italic">
                        Belum ada data alokasi divisi pada periode ini.
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats.topDivisions}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={4}
                            dataKey="nominal"
                            nameKey="name"
                          >
                            {stats.topDivisions.map((entry, index) => (
                              <Cell key={`cell-div-${index}`} fill={stats.COLORS[index % stats.COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px' }}
                            formatter={(value) => [`Rp. ${value.toLocaleString('id-ID')}`, 'Nominal']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                  
                  {stats.topDivisions.length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[9px] text-slate-400 justify-center pt-2 border-t border-slate-800/80">
                      {stats.topDivisions.map((div, idx) => (
                        <div key={div.name} className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: stats.COLORS[idx % stats.COLORS.length] }}></span>
                          <span className="font-bold">{div.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
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
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-white">Audit Log Peristiwa Sistem</h2>
                  <p className="text-xs text-slate-400">Jejak aktivitas log sistem, persetujuan overtimes, mutasi saldo, dan penugasan staf.</p>
                </div>
                <button 
                  onClick={() => {
                    setAuditLogs(INITIAL_AUDIT_LOGS.map(normalizeAuditLog));
                    showToast('Log lokal berhasil di-reset!');
                  }}
                  className="text-rose-400 hover:text-rose-300 text-xs font-bold border border-rose-500/30 px-3 py-1 rounded-xl"
                >
                  Clear Logs
                </button>
              </div>

              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden font-mono text-[11px] leading-relaxed">
                <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-800/80 p-4 space-y-2">
                  {auditLogs.map((log, idx) => (
                    <div key={`audit-${idx}`} className="flex flex-col sm:flex-row sm:items-start justify-between py-2 gap-1 hover:bg-slate-950/40 px-2 rounded transition-all">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="text-indigo-400 font-bold">[{log.timestamp}]</span>
                          <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[9px] uppercase font-black tracking-wider text-slate-300">
                            {log.action}
                          </span>
                        </div>
                        <p className="text-slate-300">{log.details}</p>
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold sm:text-right">User: {log.user}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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

function FormOTView({ 
  currentUser, karyawan, overtime, setOvertime, calculateOvertimePay, writeLocalLog, postDataToGoogleSheets, showToast, callGeminiAPI, geminiApiKey
}) {
  const [tanggalLembur, setTanggalLembur] = useState(new Date().toISOString().substring(0, 10));
  const [areaLembur, setAreaLembur] = useState(LOCATIONS[0]);
  const [selectedActivities, setSelectedActivities] = useState(['BONGKARAN']);
  const [customJenisLembur, setCustomJenisLembur] = useState('');
  const [alasanLembur, setAlasanLembur] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showAllDivisions, setShowAllDivisions] = useState(false);
  const [optimizingAlasan, setOptimizingAlasan] = useState(false);

  // State pencarian staf interaktif berdasarkan huruf/kata kunci
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredKaryawan = useMemo(() => {
    const matched = karyawan.filter(k => showAllDivisions ? true : k.divisi === currentUser?.divisi);
    if (matched.length === 0) {
      return karyawan;
    }
    return matched;
  }, [karyawan, currentUser, showAllDivisions]);

  // Memfilter daftar karyawan real-time berdasarkan kata kunci nama atau ID
  const searchedKaryawan = useMemo(() => {
    if (!employeeSearchQuery.trim()) return filteredKaryawan;
    const query = employeeSearchQuery.toLowerCase();
    return filteredKaryawan.filter(k => 
      k.namaKaryawan.toLowerCase().includes(query) || 
      k.idKaryawan.toLowerCase().includes(query)
    );
  }, [filteredKaryawan, employeeSearchQuery]);

  const handleToggleActivity = (activity) => {
    if (selectedActivities.includes(activity)) {
      if (selectedActivities.length > 1) {
        setSelectedActivities(prev => prev.filter(a => a !== activity));
      } else {
        showToast('Pilih minimal satu jenis kegiatan!', 'warning');
      }
    } else {
      setSelectedActivities(prev => [...prev, activity]);
    }
  };

  const handleAddEmployeeRow = (empId) => {
    if (!empId) return;
    const isAlreadyAdded = selectedEmployees.some(item => item.idKaryawan === empId);
    if (isAlreadyAdded) {
      showToast('Karyawan sudah ditambahkan dalam list pengajuan ini!', 'error');
      return;
    }

    const data = karyawan.find(k => k.idKaryawan === empId);
    if (data) {
      setSelectedEmployees(prev => [
        ...prev, 
        { 
          ...data,
          jamMulai: '17:30', 
          jamSelesai: '21:00',
          dur: 3.5,
          roundedDur: 3.5,
          pay: 57500,
          steps: ['1 Jam Pertama = Rp. 20.000', 'Jam Berikutnya (2.5 Jam x Rp. 15.000) = Rp. 37.500']
        }
      ]);
    }
  };

  const handleUpdateEmployeeHours = (empId, field, val) => {
    setSelectedEmployees(prev => prev.map(emp => {
      if (emp.idKaryawan === empId) {
        const updated = { ...emp, [field]: val };
        const calc = calculateOvertimePay(updated.jamMulai, updated.jamSelesai);
        updated.dur = calc.duration;
        updated.roundedDur = calc.roundedDuration;
        updated.pay = calc.pay;
        updated.steps = calc.steps;
        return updated;
      }
      return emp;
    }));
  };

  const handleRemoveEmployeeRow = (empId) => {
    setSelectedEmployees(prev => prev.filter(emp => emp.idKaryawan !== empId));
  };

  const optimizeReasonWithGemini = async () => {
    if (!geminiApiKey) {
      showToast('Konfigurasikan Gemini API Key di menu Settings terlebih dahulu!', 'warning');
      return;
    }
    if (!alasanLembur.trim()) {
      showToast('Tuliskan draf alasan kasar terlebih dahulu sebelum dioptimalkan!', 'warning');
      return;
    }

    setOptimizingAlasan(true);
    showToast('AI sedang mengoptimalkan kalimat Anda...', 'info');

    const activityText = selectedActivities.includes('LAIN-LAIN') 
      ? `${selectedActivities.join(', ')} (${customJenisLembur})`
      : selectedActivities.join(', ');

    const systemPrompt = `Anda adalah asisten manajemen HR profesional di Indonesia. Tugas Anda adalah mengoreksi dan mengoptimalkan alasan penugasan kerja lembur (overtime) agar terdengar formal, berorientasi hasil, kritis bagi operasional gudang/kantor, serta meyakinkan bagi pengambil keputusan. Gunakan Bahasa Indonesia formal (EYD) yang sopan namun mendesak. Sampaikan dalam maksimal 2-3 kalimat lugas.`;
    const userPrompt = `Draf asli: "${alasanLembur}". Kegiatan lembur: ${activityText}. Lokasi: ${areaLembur}. Karyawan: ${selectedEmployees.map(e => e.namaKaryawan).join(', ')}. Optimalkan!`;

    try {
      const optimizedText = await callGeminiAPI(systemPrompt, userPrompt);
      if (optimizedText) {
        setAlasanLembur(optimizedText.trim().replace(/^"|"$/g, ''));
        showToast('Alasan berhasil dioptimalkan oleh AI!', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal memanggil Gemini API. Cek kuota / validitas API Key!', 'error');
    } finally {
      setOptimizingAlasan(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (selectedEmployees.length === 0) {
      showToast('Wajib menambahkan minimal 1 karyawan ke dalam penugasan!', 'error');
      return;
    }
    if (!alasanLembur.trim()) {
      showToast('Wajib memasukkan alasan / deskripsi penugasan lembur!', 'error');
      return;
    }

    const divisionObj = DIVISIONS.find(d => d.label === currentUser?.divisi) || { code: 'HO' };
    const dateObj = new Date(tanggalLembur);
    const yearStr = dateObj.getFullYear();
    const monthStr = String(dateObj.getMonth() + 1).padStart(2, '0');
    
    const runningNum = String(overtime.length + 1).padStart(6, '0');
    const computedDocId = `OT/${divisionObj.code}/${yearStr}/${monthStr}/${runningNum}`;

    const rawActivitiesText = selectedActivities.join(', ');
    const finalJenisLemburText = selectedActivities.includes('LAIN-LAIN')
      ? `${rawActivitiesText} (${customJenisLembur || 'Tugas Tambahan'})`
      : rawActivitiesText;

    const newRecords = selectedEmployees.map(emp => ({
      idDoc: computedDocId,
      tanggalPengajuan: new Date().toISOString().substring(0, 10),
      tanggalLembur,
      areaLembur,
      divisi: currentUser?.divisi || '',
      jenisLembur: finalJenisLemburText,
      namaKaryawan: emp.namaKaryawan,
      idKaryawan: emp.idKaryawan,
      jabatan: emp.jabatan,
      jamMulai: emp.jamMulai,
      jamSelesai: emp.jamSelesai,
      durasiLembur: emp.roundedDur,
      nominal: emp.pay,
      statusDocument: 'pending',
      alasanLembur,
      catatanManager: ''
    }));

    postDataToGoogleSheets('CREATE_OT', newRecords, () => {
      setOvertime(prev => [...newRecords, ...prev]);
      writeLocalLog(currentUser, 'pembuatan berkas', `Mengunggah berkas pengajuan multi-employee ${computedDocId} ke database.`);
      setSelectedEmployees([]);
      setAlasanLembur('');
      setCustomJenisLembur('');
      setSelectedActivities(['BONGKARAN']);
      showToast('Pengajuan sukses dicatat!');
    });
  };

  return (
    <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-6 animate-fade-in">
      <div>
        <h2 className="text-base font-extrabold text-white flex items-center gap-1.5">
          <FileText className="h-5 w-5 text-indigo-400" /> Formulir Penugasan Lembur (Multi-Employee)
        </h2>
        <p className="text-xs text-slate-400">Buat dokumen lembur terpadu bersama untuk beberapa nama sekaligus dengan penaksiran nominal otomatis.</p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Divisi Pengaju (Default)</label>
            <input 
              type="text" 
              value={currentUser?.divisi || ''} 
              disabled 
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-bold text-indigo-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tanggal Kerja Lembur</label>
            <input 
              type="date" 
              value={tanggalLembur}
              onChange={(e) => setTanggalLembur(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-200 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lokasi Penempatan</label>
            <select 
              value={areaLembur}
              onChange={(e) => setAreaLembur(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
            >
              {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Jenis Kegiatan (Bisa pilih lebih dari satu)</label>
          <div className="flex flex-wrap gap-2">
            {OVERTIME_TYPES.map(type => {
              const active = selectedActivities.includes(type);
              return (
                <button
                  type="button"
                  key={type}
                  onClick={() => handleToggleActivity(type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    active 
                      ? 'bg-indigo-600 border-indigo-500 text-white' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>

          {selectedActivities.includes('LAIN-LAIN') && (
            <div className="pt-2">
              <input 
                type="text" 
                placeholder="Tulis detail jenis pekerjaan tambahan lainnya..." 
                value={customJenisLembur}
                onChange={(e) => setCustomJenisLembur(e.target.value)}
                className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none"
                required
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Alasan Urgensi Penugasan</label>
            {geminiApiKey && (
              <button
                type="button"
                onClick={optimizeReasonWithGemini}
                disabled={optimizingAlasan}
                className="bg-indigo-500/10 hover:bg-indigo-500/30 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 transition-all disabled:opacity-50"
              >
                <Sparkles className="h-3 w-3 animate-pulse" /> 
                {optimizingAlasan ? 'Mengoptimalkan...' : 'Optimalkan Dengan AI'}
              </button>
            )}
          </div>
          <textarea 
            rows="3"
            placeholder="Contoh: Bongkar sisa kontainer raw material dari pelabuhan karena besok pabrik beroperasi..."
            value={alasanLembur}
            onChange={(e) => setAlasanLembur(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-300 focus:outline-none resize-none focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1">
                <Users className="h-4 w-4 text-indigo-400" /> Nama Karyawan Lembur
              </h4>
              <p className="text-[10px] text-slate-400">Pilih personil aktif untuk ditugaskan di penugasan di atas.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center space-x-1.5 cursor-pointer text-[10px] text-slate-400 font-semibold select-none">
                <input 
                  type="checkbox" 
                  checked={showAllDivisions || filteredKaryawan.length === karyawan.length}
                  onChange={(e) => setShowAllDivisions(e.target.checked)}
                  className="rounded border-slate-800 text-indigo-600 focus:ring-0 cursor-pointer"
                />
                <span>Tampilkan Semua Divisi</span>
              </label>

              {/* Searchable Autocomplete Dropdown */}
              <div className="relative w-full sm:w-72" ref={dropdownRef}>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Cari & tambah staf..." 
                    value={employeeSearchQuery}
                    onFocus={() => setIsDropdownOpen(true)}
                    onChange={(e) => {
                      setEmployeeSearchQuery(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-10 py-2 text-xs font-semibold text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                    <span className="text-slate-500 text-xs">🔍</span>
                  </div>
                </div>

                {isDropdownOpen && (
                  <div className="absolute right-0 left-0 sm:left-auto sm:w-72 z-50 mt-1 max-h-60 overflow-y-auto bg-slate-950 border border-slate-800 rounded-xl shadow-2xl divide-y divide-slate-900/60">
                    {searchedKaryawan.length === 0 ? (
                      <div className="p-3 text-center text-xs text-slate-500 italic">
                        Tidak ada staf cocok "{employeeSearchQuery}"
                      </div>
                    ) : (
                      searchedKaryawan.map((k, index) => {
                        const isAlreadyAdded = selectedEmployees.some(item => item.idKaryawan === k.idKaryawan);
                        return (
                          <button
                            type="button"
                            key={`search-emp-${k.idKaryawan || index}-${index}`}
                            disabled={isAlreadyAdded}
                            onClick={() => {
                              handleAddEmployeeRow(k.idKaryawan);
                              setEmployeeSearchQuery('');
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left p-2.5 text-xs flex flex-col gap-0.5 hover:bg-slate-900 transition-all ${
                              isAlreadyAdded ? 'opacity-40 cursor-not-allowed bg-slate-900/20' : ''
                            }`}
                          >
                            <div className="flex justify-between items-center w-full">
                              <strong className="text-slate-200 font-bold">{k.namaKaryawan}</strong>
                              <span className="text-[9px] font-mono bg-slate-900 text-indigo-400 px-1.5 py-0.5 rounded">
                                {k.idKaryawan}
                              </span>
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-400">
                              <span>{k.jabatan}</span>
                              <span className="text-[9px] font-semibold text-slate-500 uppercase">{k.divisi}</span>
                            </div>
                            {isAlreadyAdded && (
                              <span className="text-[8px] text-indigo-400 font-bold uppercase mt-0.5">✓ Sudah Ditambahkan</span>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {selectedEmployees.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-6 text-center">Belum ada karyawan lembur terpilih.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-max text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[9px] font-black text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Nama (NIK)</th>
                    <th className="py-2.5 px-3">Jabatan</th>
                    <th className="py-2.5 px-3 w-32">Jam Mulai</th>
                    <th className="py-2.5 px-3 w-32">Jam Selesai</th>
                    <th className="py-2.5 px-3 w-28">Durasi</th>
                    <th className="py-2.5 px-3 text-right">Rincian Nominal</th>
                    <th className="py-2.5 px-3 text-center">Batal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs">
                  {selectedEmployees.map((emp, index) => (
                    <tr key={`sel-row-${emp.idKaryawan || index}-${index}`} className="hover:bg-slate-900/30">
                      <td className="py-3 px-3">
                        <strong className="text-slate-200 block">{emp.namaKaryawan}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">{emp.idKaryawan}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-300">{emp.jabatan}</td>
                      <td className="py-3 px-3">
                        <input 
                          type="time" 
                          value={emp.jamMulai}
                          onChange={(e) => handleUpdateEmployeeHours(emp.idKaryawan, 'jamMulai', e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs font-semibold text-slate-200 focus:outline-none"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input 
                          type="time" 
                          value={emp.jamSelesai}
                          onChange={(e) => handleUpdateEmployeeHours(emp.idKaryawan, 'jamSelesai', e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs font-semibold text-slate-200 focus:outline-none"
                        />
                      </td>
                      <td className="py-3 px-3 font-semibold text-indigo-400">
                        {emp.roundedDur} Jam <span className="text-[9px] text-slate-500 font-mono">({emp.dur || 0} jam asli)</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-block text-right">
                          <p className="font-mono font-black text-indigo-400">Rp. {emp.pay.toLocaleString('id-ID')}</p>
                          {emp.steps.map((step, sIdx) => (
                            <span key={sIdx} className="block text-[8px] text-slate-400 italic">{step}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button 
                          type="button"
                          onClick={() => handleRemoveEmployeeRow(emp.idKaryawan)}
                          className="text-rose-500 hover:text-rose-400 text-base font-bold px-2 py-1"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button 
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-500/10 transition-all active:scale-95"
          >
            Kirim Pengajuan Ke Google Sheet
          </button>
        </div>
      </form>
    </div>
  );
}

function OTHistoryView({ 
  currentUser, overtime, setOvertime, writeLocalLog, postDataToGoogleSheets, showToast, setPreviewPdfData 
}) {
  const [filterDivisi, setFilterDivisi] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterJenis, setFilterJenis] = useState('ALL');
  const [filterBulan, setFilterBulan] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Deteksi apakah user aktif merupakan HRD atau Admin secara akurat
  const userRole = (currentUser?.role || '').toLowerCase();
  const userDiv = (currentUser?.divisi || '').toUpperCase().trim();
  const isHrdOrAdmin = userRole === 'admin' || userRole === 'hrd' || userDiv === 'HRD';

  const filteredData = useMemo(() => {
    return overtime.filter(item => {
      // Pembatasan hak akses tampilan data
      if (!isHrdOrAdmin) {
        if (userRole === 'user' && item.divisi !== currentUser?.divisi) return false;
        
        if (userRole === 'manager') {
          const isMatch = userDiv === itemDiv || (userDiv === 'GUDANG' && itemDiv.startsWith('GUDANG'));
          if (!isMatch) return false;
        }
      }

      // Filter Pencarian Dasar
      if (filterDivisi !== 'ALL' && item.divisi !== filterDivisi) return false;
      if (filterStatus !== 'ALL' && item.statusDocument !== filterStatus) return false;
      
      // Filter Bulan (Berdasarkan tanggalLembur)
      if (filterBulan !== 'ALL') {
        if (!item.tanggalLembur) return false;
        try {
          const tgl = new Date(item.tanggalLembur);
          const bulanStr = String(tgl.getMonth() + 1).padStart(2, '0');
          if (bulanStr !== filterBulan) return false;
        } catch (e) {
          return false;
        }
      }

      if (filterJenis !== 'ALL') {
        if (!item.jenisLembur.toLowerCase().includes(filterJenis.toLowerCase())) return false;
      }

      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        return item.idDoc.toLowerCase().includes(query) || 
               item.namaKaryawan.toLowerCase().includes(query) || 
               item.alasanLembur.toLowerCase().includes(query);
      }
      return true;
    });
  }, [overtime, currentUser, filterDivisi, filterStatus, filterJenis, filterBulan, searchTerm, isHrdOrAdmin]);

  // Melakukan pelunasan/pembayaran kompensasi lembur
  const handleProcessPayment = (itemToPay) => {
    if (itemToPay.statusDocument !== 'approved') {
      showToast('Hanya berkas berstatus APPROVED yang dapat langsung dicairkan/dibayar!', 'error');
      return;
    }

    const updatedOvertime = overtime.map(item => {
      if (item.idDoc === itemToPay.idDoc && item.idKaryawan === itemToPay.idKaryawan) {
        return { ...item, statusDocument: 'paid' };
      }
      return item;
    });

    postDataToGoogleSheets('UPDATE_STATUS', { idDoc: itemToPay.idDoc, statusDocument: 'paid', catatanManager: itemToPay.catatanManager }, () => {
      setOvertime(updatedOvertime);
      writeLocalLog(currentUser, 'pembayaran', `Melakukan pembayaran uang lembur ${itemToPay.idDoc} untuk ${itemToPay.namaKaryawan}`);
      showToast(`Sukses mencairkan uang lembur untuk ${itemToPay.namaKaryawan}!`, 'success');
    });
  };

  const handleDeleteRequest = (itemToDelete) => {
    if (itemToDelete.statusDocument === 'approved' || itemToDelete.statusDocument === 'paid') {
      showToast('Berkas yang sudah disetujui / dibayar tidak dapat dibatalkan!', 'error');
      return;
    }

    const updatedOvertime = overtime.filter(item => !(item.idDoc === itemToDelete.idDoc && item.idKaryawan === itemToDelete.idKaryawan));

    postDataToGoogleSheets('UPDATE_STATUS', { idDoc: itemToDelete.idDoc, statusDocument: 'cancelled' }, () => {
      setOvertime(updatedOvertime);
      writeLocalLog(currentUser, 'revisi', `Membatalkan & menghapus berkas lembur ${itemToDelete.idDoc} atas nama ${itemToDelete.namaKaryawan}`);
      showToast('Transaksi lembur berhasil dihapus dari database.');
    });
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
      <div>
        <h2 className="text-base font-extrabold text-white flex items-center gap-1.5">
          <Calendar className="h-5 w-5 text-indigo-400" /> Daftar Transaksi (OT History)
        </h2>
        <p className="text-xs text-slate-400">Lihat seluruh riwayat, status pengajuan, evaluasi, dan cetak slip pembayaran PDF.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Kata Kunci</label>
          <input 
            type="text" 
            placeholder="Cari ID, nama..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Divisi</label>
          <select 
            value={filterDivisi}
            onChange={(e) => setFilterDivisi(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-300 cursor-pointer"
          >
            <option value="ALL">Semua Divisi</option>
            {DIVISIONS.map(d => <option key={d.label} value={d.label}>{d.label}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Bulan Lembur</label>
          <select 
            value={filterBulan}
            onChange={(e) => setFilterBulan(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-300 cursor-pointer"
          >
            <option value="ALL">Semua Bulan</option>
            <option value="01">Januari</option>
            <option value="02">Februari</option>
            <option value="03">Maret</option>
            <option value="04">April</option>
            <option value="05">Mei</option>
            <option value="06">Juni</option>
            <option value="07">Juli</option>
            <option value="08">Agustus</option>
            <option value="09">September</option>
            <option value="10">Oktober</option>
            <option value="11">November</option>
            <option value="12">Desember</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Status</label>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-300 cursor-pointer"
          >
            <option value="ALL">Semua Status</option>
            <option value="pending">PENDING</option>
            <option value="approved">APPROVED</option>
            <option value="revision">REVISION</option>
            <option value="rejected">REJECTED</option>
            <option value="paid">PAID</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Jenis Kegiatan</label>
          <select 
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-300 cursor-pointer"
          >
            <option value="ALL">Semua Jenis</option>
            {OVERTIME_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-max text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-wider bg-slate-900/40">
              <th className="py-3 px-4">ID Berkas & Pengajuan</th>
              <th className="py-3 px-4">Nama Pelaksana</th>
              <th className="py-3 px-4">Detail Waktu & Biaya</th>
              <th className="py-3 px-4">Uraian Tugas</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Aksi Kerja</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-xs">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-slate-500 font-bold italic">
                  Tidak ada transaksi yang sesuai kriteria filter.
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr key={`${item.idDoc}-${item.idKaryawan}-${index}`} className="hover:bg-slate-900/20">
                  <td className="py-4 px-4">
                    <span className="font-mono font-black text-white block tracking-tight">{item.idDoc}</span>
                    <span className="text-[9px] text-slate-400 block">Diajukan: {item.tanggalPengajuan}</span>
                    <span className="text-[9px] text-slate-400 block">Tanggal Lembur: {formatFriendlyDate(item.tanggalLembur)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-200">{item.namaKaryawan}</p>
                    <p className="text-[10px] text-slate-400">{item.jabatan} - <span className="font-bold text-indigo-400">{item.divisi}</span></p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-300">⏱️ {formatCleanTime(item.jamMulai)} - {formatCleanTime(item.jamSelesai)} ({item.durasiLembur} Jam)</p>
                    <p className="text-xs font-black text-indigo-400 font-mono">Rp. {Number(item.nominal).toLocaleString('id-ID')}</p>
                  </td>
                  <td className="py-4 px-4 max-w-xs">
                    <p className="text-slate-300 truncate font-semibold">[{item.jenisLembur}]</p>
                    <p className="text-[10px] text-slate-400 line-clamp-2">"{item.alasanLembur}"</p>
                    {item.catatanManager && (
                      <p className="text-[9px] bg-amber-500/10 text-amber-300 border border-amber-500/20 p-1.5 rounded mt-1">
                        <strong>Komentar:</strong> "{item.catatanManager}"
                      </p>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                      item.statusDocument === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      item.statusDocument === 'approved' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                      item.statusDocument === 'revision' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                      item.statusDocument === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {item.statusDocument}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button 
                        onClick={() => setPreviewPdfData(item)}
                        className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 rounded text-[10px] font-bold"
                      >
                        📄 Slip
                      </button>
                      
                      {/* Tombol Khusus Pembayaran: Hanya Terlihat dan Aktif untuk HRD/Admin */}
                      {isHrdOrAdmin && item.statusDocument === 'approved' && (
                        <button 
                          onClick={() => handleProcessPayment(item)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-700/40 px-2.5 py-1 rounded text-[10px] font-black shadow-lg shadow-emerald-600/10 active:scale-95 transition"
                        >
                          💵 Bayar
                        </button>
                      )}

                      {(item.statusDocument === 'pending' || item.statusDocument === 'revision') && (
                        <button 
                          onClick={() => handleDeleteRequest(item)}
                          className="bg-rose-950/40 hover:bg-rose-900 border border-rose-900/30 text-rose-300 px-2.5 py-1 rounded text-[10px] font-bold"
                        >
                          ✕ Hapus
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ApprovalView({ 
  currentUser, overtime, setOvertime, writeLocalLog, postDataToGoogleSheets, showToast, callGeminiAPI, geminiApiKey 
}) {
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [catatanManager, setCatatanManager] = useState('');
  const [aiAuditing, setAiAuditing] = useState(false);
  const [aiAuditResult, setAiAuditResult] = useState(null);

  const pendingRequests = useMemo(() => {
    return overtime.filter(item => {
      if (item.statusDocument !== 'pending') return false;

      const userRole = (currentUser?.role || '').toLowerCase();
      const userDiv = (currentUser?.divisi || '').toUpperCase().trim();
      const itemDiv = (item.divisi || '').toUpperCase().trim();

      // Admin dan divisi HRD memiliki akses pengawasan penuh untuk mengaudit & menyetujui seluruh divisi
      if (userRole === 'admin' || userRole === 'hrd' || userDiv === 'HRD') {
        return true;
      }

      // Pencocokan fleksibel divisi untuk manager operasional non-HRD
      return userDiv === itemDiv || (userDiv === 'GUDANG' && itemDiv.startsWith('GUDANG'));
    });
  }, [overtime, currentUser]);

  const groupedDocs = useMemo(() => {
    const map = {};
    pendingRequests.forEach(item => {
      if (!map[item.idDoc]) {
        map[item.idDoc] = {
          idDoc: item.idDoc,
          divisi: item.divisi,
          jenisLembur: item.jenisLembur,
          tanggalLembur: item.tanggalLembur,
          alasanLembur: item.alasanLembur,
          totalNominal: 0,
          totalDuration: 0,
          karyawanList: []
        };
      }
      map[item.idDoc].totalNominal += Number(item.nominal || 0);
      map[item.idDoc].totalDuration += Number(item.durasiLembur || 0);
      map[item.idDoc].karyawanList.push(item);
    });
    return Object.values(map);
  }, [pendingRequests]);

  const runAiComplianceAudit = async (doc) => {
    if (!geminiApiKey) {
      showToast('Atur Gemini API Key terlebih dahulu di tab Settings!', 'warning');
      return;
    }

    setAiAuditing(true);
    setAiAuditResult(null);

    const systemPrompt = `Anda adalah asisten audit kepatuhan internal yang bertugas mengevaluasi pengajuan lembur karyawan. Analisis draf dokumen lembur berikut dan berikan:
1. Skor Risiko Pengajuan (0-100%, di mana 100% sangat berisiko melanggar peraturan depnakertrans).
2. Tiga butir poin pengamatan utama (misal: jam lembur melebihi regulasi harian, kesesuaian uraian tugas, efisiensi nominal).
3. Rekomendasi final (Setujui / Tolak / Minta Revisi).
Gunakan Bahasa Indonesia formal dan berikan struktur output terformat Markdown bersih yang mudah dibaca.`;

    const userPrompt = `
    Dokumen ID: ${doc.idDoc}
    Divisi: ${doc.divisi}
    Jenis Kegiatan: ${doc.jenisLembur}
    Alasan: "${doc.alasanLembur}"
    Total Karyawan: ${doc.karyawanList.length} orang
    Total Durasi: ${doc.totalDuration} Jam
    Total Nominal: Rp ${doc.totalNominal.toLocaleString('id-ID')}
    Staf Terlibat: ${doc.karyawanList.map(e => `${e.namaKaryawan} (${e.jabatan}, ${e.durasiLembur} Jam)`).join(', ')}
    `;

    try {
      const response = await callGeminiAPI(systemPrompt, userPrompt);
      setAiAuditResult(response);
      showToast('Evaluasi audit AI selesai!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal memproses audit dengan Gemini.', 'error');
    } finally {
      setAiAuditing(false);
    }
  };

  const handleReviewAction = (docId, newStatus) => {
    if ((newStatus === 'revision' || newStatus === 'rejected') && !catatanManager.trim()) {
      showToast('Wajib melampirkan catatan evaluasi penolakan / revisi!', 'error');
      return;
    }

    const updatedOvertime = overtime.map(item => {
      if (item.idDoc === docId) {
        return { ...item, statusDocument: newStatus, catatanManager: catatanManager };
      }
      return item;
    });

    postDataToGoogleSheets('UPDATE_STATUS', { idDoc: docId, statusDocument: newStatus, catatanManager: catatanManager }, () => {
      setOvertime(updatedOvertime);
      writeLocalLog(currentUser, 'mutasi status persetujuan', `Mengubah status berkas ${docId} menjadi ${newStatus.toUpperCase()}`);
      setSelectedDocId(null);
      setCatatanManager('');
      setAiAuditResult(null);
      showToast(`Dokumen ${docId} berhasil di-${newStatus}!`);
    });
  };

  return (
    <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-6 animate-fade-in">
      <div>
        <h2 className="text-base font-extrabold text-white flex items-center gap-1.5">
          <CheckCircle className="h-5 w-5 text-indigo-400" /> Konfirmasi Approval (Manager Review)
        </h2>
        <p className="text-xs text-slate-400">Verifikasi, lakukan evaluasi kepatuhan, dan sahkan berkas pengajuan lembur staf Anda.</p>
      </div>

      {groupedDocs.length === 0 ? (
        <div className="p-10 border border-slate-800 rounded-xl bg-slate-900/20 text-center text-slate-500 font-bold italic">
          🎉 Luar biasa! Tidak ada dokumen lembur tertunda untuk divisi Anda saat ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            {groupedDocs.map((doc, index) => (
              <div 
                key={`pending-doc-${doc.idDoc}-${index}`} 
                onClick={() => {
                  setSelectedDocId(doc.idDoc);
                  setCatatanManager('');
                  setAiAuditResult(null);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedDocId === doc.idDoc 
                    ? 'bg-indigo-600/10 border-indigo-500/80' 
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-xs text-slate-100">{doc.idDoc}</span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-indigo-400 font-black">{doc.divisi}</span>
                </div>
                <div className="mt-2 text-xs space-y-1">
                  <p className="text-slate-400">Tanggal Lembur: <strong className="text-slate-200">{formatFriendlyDate(doc.tanggalLembur)}</strong></p>
                  <p className="text-slate-400">Staf Terlibat: <strong className="text-slate-200">{doc.karyawanList.length} Orang</strong></p>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800 mt-2">
                    <span className="font-bold text-slate-300">Total Biaya:</span>
                    <span className="font-mono font-black text-indigo-400">Rp. {doc.totalNominal.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            {!selectedDocId ? (
              <div className="h-full flex flex-col items-center justify-center text-xs text-slate-500 italic text-center py-10 gap-2">
                <Info className="h-8 w-8 text-slate-700" />
                <span>Silakan pilih salah satu berkas di sebelah kiri untuk melakukan audit persetujuan.</span>
              </div>
            ) : (
              (() => {
                const doc = groupedDocs.find(d => d.idDoc === selectedDocId);
                if (!doc) return null;

                return (
                  <div className="space-y-4">
                    <div className="border-b border-slate-800 pb-3 flex justify-between items-start">
                      <div>
                        <span className="font-mono text-[9px] text-indigo-400 font-bold uppercase tracking-wider">Meninjau Berkas</span>
                        <h3 className="font-black text-white text-sm">{doc.idDoc}</h3>
                        <p className="text-[10px] text-slate-400 mt-1">Urgensi: "{doc.alasanLembur}"</p>
                      </div>
                      {geminiApiKey && (
                        <button
                          type="button"
                          onClick={() => runAiComplianceAudit(doc)}
                          disabled={aiAuditing}
                          className="bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-[9px] uppercase px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
                        >
                          <Brain className="h-3 w-3" />
                          {aiAuditing ? 'Auditing...' : 'AI Evaluasi'}
                        </button>
                      )}
                    </div>

                    {aiAuditResult && (
                      <div className="bg-violet-950/30 border border-violet-500/30 rounded-xl p-4 space-y-2 text-xs">
                        <h4 className="font-extrabold text-violet-300 flex items-center gap-1 uppercase tracking-wider text-[10px]">
                          <Brain className="h-3.5 w-3.5" /> Laporan Analisis Kepatuhan Gemini AI
                        </h4>
                        <div className="text-slate-300 leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap font-sans text-[11px] pr-2">
                          {aiAuditResult}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pelaksana Overtime:</h4>
                      <div className="max-h-48 overflow-y-auto space-y-1.5 bg-slate-950 p-2.5 rounded border border-slate-800">
                        {doc.karyawanList.map((emp, index) => (
                          <div key={`approval-emp-${emp.idKaryawan || index}-${index}`} className="flex justify-between items-center text-xs">
                            <div>
                              <p className="font-bold text-slate-200">{emp.namaKaryawan}</p>
                              <p className="text-[10px] text-slate-500">⏱️ {formatCleanTime(emp.jamMulai)} - {formatCleanTime(emp.jamSelesai)} ({emp.durasiLembur} Jam)</p>
                            </div>
                            <span className="font-mono font-bold text-indigo-400">Rp. {Number(emp.nominal).toLocaleString('id-ID')}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Catatan Evaluasi / Catatan Peninjau</label>
                      <textarea 
                        rows="2"
                        placeholder="Wajib diisi jika Anda menolak atau meminta revisi pengajuan..."
                        value={catatanManager}
                        onChange={(e) => setCatatanManager(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs font-bold pt-2">
                      <button 
                        onClick={() => handleReviewAction(doc.idDoc, 'revision')}
                        className="bg-amber-500/10 hover:bg-amber-500 border border-amber-500/20 hover:text-slate-900 text-amber-400 py-2 rounded-xl transition-all"
                      >
                        Minta Revisi
                      </button>
                      <button 
                        onClick={() => handleReviewAction(doc.idDoc, 'rejected')}
                        className="bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 hover:text-white text-rose-400 py-2 rounded-xl transition-all"
                      >
                        Tolak Berkas
                      </button>
                      <button 
                        onClick={() => handleReviewAction(doc.idDoc, 'approved')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl transition-all shadow-md active:scale-95"
                      >
                        Setujui Lembur
                      </button>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AICopilotView({ overtime, karyawan, callGeminiAPI, geminiApiKey, showToast }) {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Halo! Saya **Overtime Copilot** bertenaga Gemini AI. Saya memiliki akses instan ke seluruh catatan kerja lembur & daftar staf karyawan Anda. Tanyakan apa saja seperti "Siapa karyawan terboros?", "Rekomendasikan efisiensi biaya", atau "Berapa jam total lembur divisi GUDANG PONCOL?".' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;
    if (!geminiApiKey) {
      showToast('Masukkan Gemini API Key terlebih dahulu di tab Settings!', 'warning');
      return;
    }

    const userMessageText = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMessageText }]);
    setSending(true);

    const systemPrompt = `Anda adalah asisten virtual ahli analisis data SDM (HR Data Analyst & Overtime Expert). 
    Gunakan data real-time berikut untuk menjawab pertanyaan pengguna dengan akurat, objektif, dan sopan dalam Bahasa Indonesia.
    Tampilkan perhitungan matematis singkat jika diperlukan. Jangan pernah membuat asumsi data di luar konteks ini.

    DATA LEMBUR SAAT INI (OVERTIME):
    ${JSON.stringify(overtime.map(ot => ({
      idDoc: ot.idDoc,
      tanggal: ot.tanggalLembur,
      divisi: ot.divisi,
      kegiatan: ot.jenisLembur,
      nama: ot.namaKaryawan,
      durasiJam: ot.durasiLembur,
      nominalRp: ot.nominal,
      status: ot.statusDocument,
      alasan: ot.alasanLembur
    })))}

    DATA KARYAWAN MASTER:
    ${JSON.stringify(karyawan.map(k => ({
      id: k.idKaryawan,
      nama: k.namaKaryawan,
      divisi: k.divisi,
      jabatan: k.jabatan,
      area: k.areaKerja
    })))}
    `;

    try {
      const resultText = await callGeminiAPI(systemPrompt, userMessageText);
      setMessages(prev => [...prev, { role: 'assistant', content: resultText }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Terjadi kegagalan komunikasi dengan server Gemini. Pastikan API Key Anda benar dan kuota tersedia.' }]);
    } finally {
      setSending(false);
    }
  };

  const loadSuggestion = (suggestion) => {
    setInputValue(suggestion);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col h-[520px] animate-fade-in justify-between">
      <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-1.5">
            <Brain className="h-5 w-5 text-indigo-400" /> Overtime Copilot (Analisis AI)
          </h2>
          <p className="text-xs text-slate-400">Analisis pengeluaran, pantau tren, audit kepatuhan, & cari tahu fakta menarik dari database Anda.</p>
        </div>
        <button 
          onClick={() => {
            setMessages([
              { role: 'assistant', content: 'Riwayat obrolan di-reset. Ada analisis data lembur yang bisa saya bantu hari ini?' }
            ]);
          }}
          className="text-slate-500 hover:text-slate-300 text-[10px] font-bold uppercase tracking-wider"
        >
          Reset Chat
        </button>
      </div>

      {messages.length === 1 && (
        <div className="pt-3 flex flex-wrap gap-2 text-[10px] font-bold">
          {[
            'Siapa yang mengumpulkan uang lembur terbanyak?',
            'Berapa rata-rata jam kerja lembur staf?',
            'Analisis tingkat risiko kepatuhan data lembur saat ini',
            'Sebutkan divisi dengan pengeluaran lembur terbesar'
          ].map((chip) => (
            <button
              key={chip}
              onClick={() => loadSuggestion(chip)}
              className="bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-800/20 text-indigo-300 px-2.5 py-1 rounded-xl transition-all text-left"
            >
              💡 {chip}
            </button>
          ))}
        </div>
      )}

      <div 
        ref={scrollRef}
        className="flex-grow my-4 overflow-y-auto space-y-4 pr-2 text-xs leading-relaxed"
      >
        {messages.map((m, idx) => (
          <div 
            key={`msg-${idx}`} 
            className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-black flex-shrink-0 ${
              m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-violet-400 border border-slate-700'
            }`}>
              {m.role === 'user' ? 'U' : 'AI'}
            </div>
            <div className={`p-3.5 rounded-2xl whitespace-pre-wrap ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="h-8 w-8 rounded-full bg-slate-800 text-violet-400 flex items-center justify-center font-black animate-spin">
              ⚡
            </div>
            <div className="p-3.5 bg-slate-900 border border-slate-800 text-slate-400 italic rounded-2xl rounded-tl-none flex items-center gap-2">
              <span className="animate-pulse">Copilot sedang menganalisis database...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input 
          type="text" 
          placeholder={geminiApiKey ? "Ketik pertanyaan Anda di sini..." : "❌ Harap masukkan Gemini API Key di Settings terlebih dahulu..."}
          value={inputValue}
          disabled={!geminiApiKey || sending}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-grow bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
        />
        <button 
          type="submit"
          disabled={!geminiApiKey || sending || !inputValue.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-all disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

function ReportView({ overtime, currentUser, writeLocalLog, showToast }) {
  const [filterDivisi, setFilterDivisi] = useState('ALL');
  const [filterMonth, setFilterMonth] = useState('ALL');

  const reportedData = useMemo(() => {
    return overtime.filter(item => {
      if (filterDivisi !== 'ALL' && item.divisi !== filterDivisi) return false;
      if (filterMonth !== 'ALL') {
        const itemMonth = new Date(item.tanggalLembur).getMonth() + 1;
        if (String(itemMonth).padStart(2, '0') !== filterMonth) return false;
      }
      return true;
    });
  }, [overtime, filterDivisi, filterMonth]);

  const handleDownloadCSV = () => {
    if (reportedData.length === 0) {
      showToast('Tidak ada data rekapitulasi lembur untuk diekspor!', 'error');
      return;
    }

    const csvHeaders = ['ID Doc', 'Tanggal Pengajuan', 'Tanggal Lembur', 'Area Lembur', 'Divisi', 'Jenis Lembur', 'Nama Karyawan', 'ID Karyawan', 'Jabatan', 'Jam Mulai', 'Jam Selesai', 'Durasi Lembur', 'Nominal Gaji', 'Status', 'Alasan Lembur', 'Catatan Manager'];
    const csvRows = reportedData.map(item => [
      item.idDoc,
      item.tanggalPengajuan,
      item.tanggalLembur,
      item.areaLembur,
      item.divisi,
      item.jenisLembur,
      `"${item.namaKaryawan.replace(/"/g, '""')}"`,
      item.idKaryawan,
      item.jabatan,
      item.jamMulai,
      item.jamSelesai,
      item.durasiLembur,
      item.nominal,
      item.statusDocument,
      `"${item.alasanLembur.replace(/"/g, '""')}"`,
      `"${(item.catatanManager || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [csvHeaders.join(','), ...csvRows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Overtime_${filterDivisi.replace(/ /g, '_')}_M${filterMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    writeLocalLog(currentUser, 'eksport data', `Mengekspor ${reportedData.length} baris data laporan ke CSV.`);
    showToast('Laporan Excel / CSV berhasil diunduh!');
  };

  return (
    <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-6 animate-fade-in">
      <div>
        <h2 className="text-base font-extrabold text-white flex items-center gap-1.5">
          <Download className="h-5 w-5 text-indigo-400" /> Ekspor & Laporan Rekapitulasi
        </h2>
        <p className="text-xs text-slate-400">Unduh data instan yang tersimpan dalam format Google Sheets untuk pelaporan eksternal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/40 p-5 rounded-xl border border-slate-800">
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Filter Departemen / Divisi</label>
          <select 
            value={filterDivisi}
            onChange={(e) => setFilterDivisi(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-200 cursor-pointer focus:outline-none"
          >
            <option value="ALL">Semua Divisi</option>
            {DIVISIONS.map(d => <option key={d.label} value={d.label}>{d.label}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Filter Bulan Kerja</label>
          <select 
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-200 cursor-pointer focus:outline-none"
          >
            <option value="ALL">Semua Bulan</option>
            <option value="01">Januari</option>
            <option value="02">Februari</option>
            <option value="03">Maret</option>
            <option value="04">April</option>
            <option value="05">Mei</option>
            <option value="06">Juni</option>
            <option value="07">Juli</option>
            <option value="08">Agustus</option>
            <option value="09">September</option>
            <option value="10">Oktober</option>
            <option value="11">November</option>
            <option value="12">Desember</option>
          </select>
        </div>

        <div className="flex items-end">
          <button 
            onClick={handleDownloadCSV}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95"
          >
            <Download className="h-4 w-4" />
            <span>Unduh Laporan CSV</span>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-bold text-slate-300 text-xs">Pratinjau Data Ekspor ({reportedData.length} Baris):</h4>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden text-[11px]">
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/80 p-3">
            {reportedData.length === 0 ? (
              <p className="text-slate-500 italic py-6 text-center">Data rekap masih kosong.</p>
            ) : (
              reportedData.map((item, idx) => (
                <div key={`report-idx-${idx}`} className="flex justify-between items-center py-2 hover:bg-slate-950/40 px-2 rounded">
                  <div>
                    <span className="font-mono font-bold text-slate-300">{item.idDoc}</span>
                    <span className="text-slate-400"> - {item.namaKaryawan} ({item.divisi})</span>
                  </div>
                  <span className="font-mono text-indigo-400 font-bold">Rp. {Number(item.nominal).toLocaleString('id-ID')}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsView({ 
  users, setUsers, karyawan, setKaryawan, currentUser, writeLocalLog, showToast,
  gasUrl, setGasUrl, geminiApiKey, setGeminiApiKey, pullDataFromGoogleSheets, postDataToGoogleSheets
}) {
  const [activeConfigTab, setActiveConfigTab] = useState('koneksi');
  const [localGasUrl, setLocalGasUrl] = useState(gasUrl);
  const [localGeminiApiKey, setLocalGeminiApiKey] = useState(geminiApiKey);

  const [nik, setNik] = useState('');
  const [idKaryawan, setIdKaryawan] = useState('');
  const [namaKaryawan, setNamaKaryawan] = useState('');
  const [divisiKaryawan, setDivisiKaryawan] = useState(DIVISIONS[0].label);
  const [areaKerja, setAreaKerja] = useState(LOCATIONS[0]);
  const [jabatan, setJabatan] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [divisiUser, setDivisiUser] = useState(DIVISIONS[0].label);
  const [roleUser, setRoleUser] = useState('User');
  const [editingUsername, setEditingUsername] = useState(null);

  const handleSaveGasUrl = (e) => {
    e.preventDefault();
    localStorage.setItem('ot_gas_web_app_url', localGasUrl);
    setGasUrl(localGasUrl);
    showToast('Koneksi Web App Google Drive disimpan!', 'success');
  };

  const handleSaveGeminiKey = (e) => {
    e.preventDefault();
    localStorage.setItem('ot_gemini_api_key', localGeminiApiKey);
    setGeminiApiKey(localGeminiApiKey);
    showToast('Gemini LLM API Key berhasil diperbarui!', 'success');
  };

  const handleSaveKaryawan = (e) => {
    e.preventDefault();
    if (!nik || !idKaryawan || !namaKaryawan || !jabatan) {
      showToast('Wajib melengkapi semua kolom informasi staf!', 'error');
      return;
    }

    const item = { nik, idKaryawan, namaKaryawan, divisi: divisiKaryawan, areaKerja, jabatan };

    postDataToGoogleSheets('SAVE_KARYAWAN', item, () => {
      if (editingId) {
        setKaryawan(prev => prev.map(k => k.idKaryawan === editingId ? item : k));
        writeLocalLog(currentUser, 'revisi', `Mengubah profil data staf ${namaKaryawan} (${idKaryawan})`);
        showToast('Profil staf berhasil diperbarui!');
      } else {
        setKaryawan(prev => [...prev, item]);
        writeLocalLog(currentUser, 'pembuatan berkas', `Mendaftarkan staf baru ${namaKaryawan} (${idKaryawan})`);
        showToast('Karyawan baru berhasil ditambahkan!');
      }
      setNik(''); setIdKaryawan(''); setNamaKaryawan(''); setJabatan(''); setEditingId(null);
    });
  };

  const handleSaveUserRole = (e) => {
    e.preventDefault();
    if (!username || !password || !displayName) {
      showToast('Lengkapi nama pengguna, password, dan nama display!', 'error');
      return;
    }

    let computedAkses = 'Dashboard, Form OT, OT History, AI Copilot';
    if (roleUser.toLowerCase() === 'admin') {
      computedAkses = 'Dashboard, Form OT, OT History, Approval, Audit Log, Report, Settings, AI Copilot';
    } else if (roleUser.toLowerCase() === 'manager') {
      computedAkses = 'Dashboard, OT History, Approval, Report, AI Copilot';
    } else if (roleUser.toLowerCase() === 'hrd') {
      computedAkses = 'Dashboard, OT History, Approval, Audit Log, Report, Settings, AI Copilot';
    }

    const divObj = DIVISIONS.find(d => d.label === divisiUser) || { code: 'HO' };

    const item = {
      username, password, displayName, divisi: divisiUser, divisiKode: divObj.code, role: roleUser, aksesMenu: computedAkses
    };

    if (editingUsername) {
      setUsers(prev => prev.map(u => u.username === editingUsername ? item : u));
      writeLocalLog(currentUser, 'revisi', `Mengupdate kredensial / menu role user ${username}`);
      showToast('Kredensial pengguna diperbarui!');
    } else {
      setUsers(prev => [...prev, item]);
      writeLocalLog(currentUser, 'pembuatan berkas', `Mendaftarkan hak akses menu user baru ${username}`);
      showToast('Pengguna baru berhasil diregistrasikan!');
    }

    setUsername(''); setPassword(''); setDisplayName(''); setEditingUsername(null);
  };

  const handleEditKaryawan = (item) => {
    setEditingId(item.idKaryawan);
    setNik(item.nik);
    setIdKaryawan(item.idKaryawan);
    setNamaKaryawan(item.namaKaryawan);
    setDivisiKaryawan(item.divisi);
    setAreaKerja(item.areaKerja);
    setJabatan(item.jabatan);
  };

  const handleEditUser = (item) => {
    setEditingUsername(item.username);
    setUsername(item.username);
    setPassword(item.password);
    setDisplayName(item.displayName);
    setDivisiUser(item.divisi);
    setRoleUser(item.role);
  };

  const handleDeleteKaryawan = (id) => {
    setKaryawan(prev => prev.filter(k => k.idKaryawan !== id));
    showToast('Data staf lokal dibersihkan.');
  };

  const handleDeleteUser = (uname) => {
    if (uname === currentUser?.username) {
      showToast('Anda tidak dapat menghapus akun Anda sendiri!', 'error');
      return;
    }
    setUsers(prev => prev.filter(u => u.username !== uname));
    showToast('Akses akun berhasil dicabut.');
  };

  return (
    <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-1.5">
            <Settings className="h-5 w-5 text-indigo-400" /> Manajemen Database & Konfigurasi
          </h2>
          <p className="text-xs text-slate-400">Atur kredensial, database karyawan, penyesuaian integrasi Google Sheets & Gemini AI.</p>
        </div>
        
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button 
            onClick={() => setActiveConfigTab('koneksi')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeConfigTab === 'koneksi' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Google Sync
          </button>
          <button 
            onClick={() => setActiveConfigTab('gemini')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeConfigTab === 'gemini' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Gemini LLM
          </button>
          <button 
            onClick={() => setActiveConfigTab('karyawan')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeConfigTab === 'karyawan' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Karyawan
          </button>
          <button 
            onClick={() => setActiveConfigTab('user_role')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeConfigTab === 'user_role' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Akses User
          </button>
        </div>
      </div>

      {activeConfigTab === 'koneksi' && (
        <div className="space-y-4 max-w-xl">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">🔗 Integrasi Web App Google Apps Script (Webhook)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Masukkan URL hasil deploy Web App Google Apps Script Anda (akhiran `/exec`) di bawah ini. Aplikasi web React ini akan langsung terhubung secara live untuk membaca dan menyimpan data secara otomatis ke Google Sheet di Google Drive Anda.
            </p>
            <form onSubmit={handleSaveGasUrl} className="space-y-3 pt-2">
              <input 
                type="url"
                required
                placeholder="https://script.google.com/macros/s/.../exec"
                value={localGasUrl}
                onChange={(e) => setLocalGasUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
              />
              <div className="flex space-x-2">
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2 rounded-xl"
                >
                  Simpan URL Web App
                </button>
                {gasUrl && (
                  <button 
                    type="button"
                    onClick={() => pullDataFromGoogleSheets()}
                    className="bg-slate-850 hover:bg-slate-700 text-slate-300 font-bold text-xs px-4 py-2 rounded-xl border border-slate-700"
                  >
                    Tarik Data Sheet 🔄
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {activeConfigTab === 'gemini' && (
        <div className="space-y-4 max-w-xl">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
              <Brain className="h-4 w-4" /> Konfigurasi Gemini LLM API Key (Kecerdasan Buatan)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dapatkan API Key gratis di Google AI Studio untuk mengaktifkan asisten cerdas pengoptimal alasan, audit kepatuhan, & obrolan di halaman AI Copilot.
            </p>
            <form onSubmit={handleSaveGeminiKey} className="space-y-3 pt-2">
              <input 
                type="password"
                required
                placeholder="AIzaSy..."
                value={localGeminiApiKey}
                onChange={(e) => setLocalGeminiApiKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
              />
              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2 rounded-xl"
              >
                Simpan API Key Gemini
              </button>
            </form>
          </div>
        </div>
      )}

      {activeConfigTab === 'karyawan' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-4 h-fit">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              {editingId ? '✏️ Edit Data Karyawan' : '➕ Registrasi Staf Baru'}
            </h3>
            <form onSubmit={handleSaveKaryawan} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Nomor NIK</label>
                <input 
                  type="text" 
                  value={nik} 
                  onChange={(e) => setNik(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">ID Karyawan</label>
                <input 
                  type="text" 
                  value={idKaryawan} 
                  onChange={(e) => setIdKaryawan(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200"
                  disabled={editingId !== null}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={namaKaryawan} 
                  onChange={(e) => setNamaKaryawan(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Divisi</label>
                <select 
                  value={divisiKaryawan} 
                  onChange={(e) => setDivisiKaryawan(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200"
                >
                  {DIVISIONS.map(d => <option key={d.label} value={d.label}>{d.label}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Area Kerja</label>
                <select 
                  value={areaKerja} 
                  onChange={(e) => setAreaKerja(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200"
                >
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Jabatan</label>
                <input 
                  type="text" 
                  value={jabatan} 
                  onChange={(e) => setJabatan(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                {editingId && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setNik(''); setIdKaryawan(''); setNamaKaryawan(''); setJabatan(''); setEditingId(null);
                    }}
                    className="w-1/3 bg-slate-800 text-slate-300 rounded-xl"
                  >
                    Batal
                  </button>
                )}
                <button 
                  type="submit" 
                  className="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white font-black py-2 rounded-xl"
                >
                  Simpan Staf
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">📋 Database Master Karyawan ({karyawan.length} Staf)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto">
              {karyawan.map((item, index) => (
                <div key={`karyawan-row-${item.idKaryawan || index}-${index}`} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-indigo-400 font-mono font-bold">
                        {item.idKaryawan}
                      </span>
                      <span className="text-[9px] text-slate-500 font-bold">NIK: {item.nik}</span>
                    </div>
                    <div>
                      <strong className="text-xs text-white block">{item.namaKaryawan}</strong>
                      <span className="text-[10px] text-slate-400 block">{item.jabatan}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-indigo-300 pt-1">
                      <span>Divisi: {item.divisi}</span>
                      <span>Lokasi: {item.areaKerja}</span>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800/80 mt-3 text-[10px] font-bold">
                    <button onClick={() => handleEditKaryawan(item)} className="text-indigo-400 hover:text-indigo-300">✏️ Edit</button>
                    <button onClick={() => handleDeleteKaryawan(item.idKaryawan)} className="text-rose-500 hover:text-rose-400">🗑️ Hapus</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeConfigTab === 'user_role' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-4 h-fit">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              {editingUsername ? '✏️ Edit Hak Akses Karyawan' : '➕ Tambah Akses User'}
            </h3>
            <form onSubmit={handleSaveUserRole} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Username</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200"
                  disabled={editingUsername !== null}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Nama Display</label>
                <input 
                  type="text" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Divisi</label>
                <select 
                  value={divisiUser} 
                  onChange={(e) => setDivisiUser(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200"
                >
                  {DIVISIONS.map(d => <option key={d.label} value={d.label}>{d.label}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Role</label>
                <select 
                  value={roleUser} 
                  onChange={(e) => setRoleUser(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200"
                >
                  <option value="User">User (Staff Gudang/Admin)</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                  <option value="hrd">HRD</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                {editingUsername && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setUsername(''); setPassword(''); setDisplayName(''); setEditingUsername(null);
                    }}
                    className="w-1/3 bg-slate-800 text-slate-300 rounded-xl"
                  >
                    Batal
                  </button>
                )}
                <button type="submit" className="flex-grow bg-indigo-600 text-white font-black py-2 rounded-xl">Simpan Akun</button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">👥 Otoritas USER_ROLE ({users.length} Akun)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto">
              {users.map((item, index) => (
                <div key={`user-row-${item.username || index}-${index}`} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <strong className="text-xs text-white font-extrabold">{item.displayName}</strong>
                      <span className="text-[8px] bg-indigo-500/10 text-indigo-400 font-black px-2 py-0.5 rounded uppercase">
                        {item.role}
                      </span>
                    </div>
                    <div className="text-[10px] space-y-1 text-slate-400">
                      <p>Username: <span className="font-mono text-slate-300">{item.username}</span></p>
                      <p>Divisi: <strong className="text-slate-300">{item.divisi}</strong></p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800/80 mt-3 text-[10px] font-bold">
                    <button onClick={() => handleEditUser(item)} className="text-indigo-400 hover:text-indigo-300">✏️ Edit</button>
                    <button onClick={() => handleDeleteUser(item.username)} className="text-rose-500 hover:text-rose-400">🗑️ Hapus</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}