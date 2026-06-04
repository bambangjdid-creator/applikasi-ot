import React, { useState, useMemo } from 'react';
import { CheckCircle, Brain, Info } from 'lucide-react';
import { formatFriendlyDate, formatCleanTime } from '../../utils/formatters';

export default function ApprovalView({ currentUser, overtime, setOvertime, writeLocalLog, postDataToGoogleSheets, showToast, callGeminiAPI, geminiApiKey }) {
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

      if (userRole === 'admin' || userRole === 'hrd' || userDiv === 'HRD') {
        return true;
      }
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

    const systemPrompt = `Anda adalah asisten audit kepatuhan internal yang bertugas mengevaluasi pengajuan lembur karyawan. Analisis draf dokumen lembur berikut dan berikan:\n1. Skor Risiko Pengajuan (0-100%, di mana 100% sangat berisiko melanggar peraturan depnakertrans).\n2. Tiga butir poin pengamatan utama (misal: jam lembur melebihi regulasi harian, kesesuaian uraian tugas, efisiensi nominal).\n3. Rekomendasi final (Setujui / Tolak / Minta Revisi).\nGunakan Bahasa Indonesia formal dan berikan struktur output terformat Markdown bersih yang mudah dibaca.`;

    const userPrompt = `Dokumen ID: ${doc.idDoc}\nDivisi: ${doc.divisi}\nJenis Kegiatan: ${doc.jenisLembur}\nAlasan: "${doc.alasanLembur}"\nTotal Karyawan: ${doc.karyawanList.length} orang\nTotal Durasi: ${doc.totalDuration} Jam\nTotal Nominal: Rp ${doc.totalNominal.toLocaleString('id-ID')}\nStaf Terlibat: ${doc.karyawanList.map(e => `${e.namaKaryawan} (${e.jabatan}, ${e.durasiLembur} Jam)`).join(', ')}`;

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
        return { ...item, statusDocument: newStatus, catatanManager };
      }
      return item;
    });

    postDataToGoogleSheets('UPDATE_STATUS', { idDoc: docId, statusDocument: newStatus, catatanManager }, () => {
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
