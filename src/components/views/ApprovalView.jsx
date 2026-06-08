import React, { useState } from 'react';
import { CheckCircle, XCircle, Search, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { api } from '../../services/api';

export default function ApprovalView({ db, currentUser, setDb, writeAuditLog, showToast }) {
  const [rejectNotes, setRejectNotes] = useState('');
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (!db) return null;

  // Managers only see their division's pending OT. HRD sees all pending.
  const roleName = db.roles.find(r => r.IdRole === currentUser.IdRole)?.RoleName;
  
  let pendingData = db.otHeader.filter(h => h.StatusApproval === 'PENDING');
  
  if (roleName === 'Manager') {
    const employeeIdsInDiv = db.karyawan
      .filter(k => k.IdDivisi === currentUser.IdDivisi)
      .map(k => k.IdKaryawan);
    pendingData = pendingData.filter(h => employeeIdsInDiv.includes(h.IdKaryawan));
  }

  // Filter by search term
  pendingData = pendingData.filter(h => 
    h.IdForm.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.IdKaryawan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = async (idForm) => {
    try {
      const newApproval = {
        IdApproval: `APP-${Date.now()}`,
        IdForm: idForm,
        IdManager: currentUser.IdKaryawan,
        Status: 'APPROVED',
        Notes: '',
        OrderApproval: 1
      };
      
      await api.post('postApproval', newApproval);
      await api.post('updateOtHeaderStatus', { IdForm: idForm, StatusApproval: 'APPROVED' });

      // Optimistic Update
      setDb(prev => ({
        ...prev,
        approval: [newApproval, ...prev.approval],
        otHeader: prev.otHeader.map(h => h.IdForm === idForm ? { ...h, StatusApproval: 'APPROVED' } : h)
      }));

      writeAuditLog(currentUser.IdKaryawan, `Menyetujui Form Lembur: ${idForm}`);
      showToast('Form lembur berhasil disetujui.', 'success');
    } catch (err) {
      showToast('Gagal memproses persetujuan.', 'error');
    }
  };

  const openRejectModal = (idForm) => {
    setSelectedFormId(idForm);
    setRejectNotes('');
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectNotes.trim()) {
      showToast('Alasan penolakan (Notes) wajib diisi!', 'error');
      return;
    }

    try {
      const newApproval = {
        IdApproval: `APP-${Date.now()}`,
        IdForm: selectedFormId,
        IdManager: currentUser.IdKaryawan,
        Status: 'REJECTED',
        Notes: rejectNotes,
        OrderApproval: 1
      };

      await api.post('postApproval', newApproval);
      await api.post('updateOtHeaderStatus', { IdForm: selectedFormId, StatusApproval: 'REJECTED' });

      // Optimistic Update
      setDb(prev => ({
        ...prev,
        approval: [newApproval, ...prev.approval],
        otHeader: prev.otHeader.map(h => h.IdForm === selectedFormId ? { ...h, StatusApproval: 'REJECTED' } : h)
      }));

      writeAuditLog(currentUser.IdKaryawan, `Menolak Form Lembur: ${selectedFormId}`);
      showToast('Form lembur telah ditolak.', 'warning');
      setShowRejectModal(false);
    } catch (err) {
      showToast('Gagal memproses penolakan.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-black text-white">Daftar Persetujuan (Approval List)</h2>
            <p className="text-xs text-slate-400 mt-1">Tinjau dan setujui pengajuan lembur yang tertunda.</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Cari ID Form..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {pendingData.length === 0 ? (
            <div className="col-span-1 lg:col-span-2 text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
              <CheckCircle className="h-10 w-10 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 font-medium">Tidak ada pengajuan yang perlu disetujui.</p>
            </div>
          ) : (
            pendingData.map(h => {
              const karyawan = db.karyawan.find(k => k.IdKaryawan === h.IdKaryawan);
              const details = db.otDetail.filter(d => d.IdForm === h.IdForm);

              return (
                <div key={h.IdForm} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-colors">
                  <div className="flex justify-between items-start mb-4 border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{h.IdForm}</span>
                      <h3 className="text-sm font-black text-slate-200 mt-1">{karyawan?.Nama || h.IdKaryawan}</h3>
                      <p className="text-xs text-slate-400">{karyawan?.IdKaryawan}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-slate-300 text-sm font-bold bg-slate-950 px-2 py-1 rounded">
                        <Clock className="h-3 w-3 text-indigo-400" /> {h.TotalJam} Jam
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                        <Calendar className="h-3 w-3" /> {h.TanggalPengajuan}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {details.map((d, i) => (
                      <div key={i} className="text-xs text-slate-400 flex justify-between bg-slate-950/50 p-2 rounded">
                        <span>{d.TaskName}</span>
                        <span className="text-slate-500">{d.StartTime} - {d.EndTime}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleApprove(h.IdForm)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95 text-xs"
                    >
                      <CheckCircle className="h-4 w-4" /> Approve
                    </button>
                    <button 
                      onClick={() => openRejectModal(h.IdForm)}
                      className="flex-1 bg-rose-600/20 hover:bg-rose-600/40 border border-rose-600/30 text-rose-400 font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95 text-xs"
                    >
                      <XCircle className="h-4 w-4" /> Reject
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-4 text-rose-400">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-lg font-black">Tolak Pengajuan Lembur</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Anda akan menolak pengajuan <span className="font-bold text-white">{selectedFormId}</span>. Wajib memberikan alasan penolakan.
            </p>
            <textarea
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              placeholder="Masukkan alasan penolakan..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-rose-500 min-h-[100px] mb-6"
            ></textarea>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleRejectConfirm}
                className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-rose-500/20"
              >
                Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
