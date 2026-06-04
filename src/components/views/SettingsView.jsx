import React, { useState } from 'react';
import { Settings, Brain } from 'lucide-react';
import { DIVISIONS, LOCATIONS } from '../../data/initialData';

export default function SettingsView({ users, setUsers, karyawan, setKaryawan, currentUser, writeLocalLog, showToast, gasUrl, setGasUrl, geminiApiKey, setGeminiApiKey, pullDataFromGoogleSheets, postDataToGoogleSheets }) {
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
      username,
      password,
      displayName,
      divisi: divisiUser,
      divisiKode: divObj.code,
      role: roleUser,
      aksesMenu: computedAkses
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
                    onClick={() => { setNik(''); setIdKaryawan(''); setNamaKaryawan(''); setJabatan(''); setEditingId(null); }}
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
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-indigo-400 font-mono font-bold">{item.idKaryawan}</span>
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
                    onClick={() => { setUsername(''); setPassword(''); setDisplayName(''); setEditingUsername(null); }}
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
