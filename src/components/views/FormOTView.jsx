import React, { useState, useEffect, useMemo, useRef } from 'react';
import { FileText, Sparkles, Users } from 'lucide-react';
import { DIVISIONS, OVERTIME_TYPES, LOCATIONS } from '../../data/initialData';
import { calculateOvertimePay } from '../../utils/formatters';

export default function FormOTView({ currentUser, karyawan, overtime, setOvertime, writeLocalLog, postDataToGoogleSheets, showToast, callGeminiAPI, geminiApiKey }) {
  const [tanggalLembur, setTanggalLembur] = useState(new Date().toISOString().substring(0, 10));
  const [areaLembur, setAreaLembur] = useState(LOCATIONS[0]);
  const [selectedActivities, setSelectedActivities] = useState(['BONGKARAN']);
  const [customJenisLembur, setCustomJenisLembur] = useState('');
  const [alasanLembur, setAlasanLembur] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showAllDivisions, setShowAllDivisions] = useState(false);
  const [optimizingAlasan, setOptimizingAlasan] = useState(false);
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
    return matched.length === 0 ? karyawan : matched;
  }, [karyawan, currentUser, showAllDivisions]);

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
