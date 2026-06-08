import React, { useState } from 'react';
import { Plus, Trash2, Save, Calculator } from 'lucide-react';
import { api } from '../../services/api';

export default function FormOTView({ db, currentUser, setDb, writeAuditLog, showToast }) {
  const [tanggalPengajuan, setTanggalPengajuan] = useState(new Date().toISOString().split('T')[0]);
  const [details, setDetails] = useState([{ TaskName: '', StartTime: '', EndTime: '' }]);

  const calculateDurationMinutes = (start, end) => {
    if (!start || !end) return 0;
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    let diff = (endH * 60 + endM) - (startH * 60 + startM);
    if (diff < 0) diff += 24 * 60; // Cross midnight
    return diff;
  };

  const calculateRowStats = (start, end) => {
    const mins = calculateDurationMinutes(start, end);
    let durationHr = 0;
    let pay = 0;
    let label = '';

    if (mins < 60) {
      durationHr = 0;
      pay = 0;
      label = 'Di bawah 1 jam (Tidak dihitung)';
    } else if (mins < 90) {
      durationHr = 1;
      pay = 20000;
      label = 'Dihitung 1 jam (Rp 20.000)';
    } else {
      // 90 mins and above
      durationHr = Number((mins / 60).toFixed(2));
      pay = 20000 + ((durationHr - 1) * 15000);
      label = `Dihitung ${durationHr} jam (Rp ${pay.toLocaleString('id-ID')})`;
    }
    return { durationHr, pay, label };
  };

  const totalMinutesAllRows = details.reduce((sum, row) => sum + calculateDurationMinutes(row.StartTime, row.EndTime), 0);
  
  // Aggregate calculation based on rules for the whole day or just sums of rows?
  // Usually overtime is calculated daily. We will sum the durationHr of the rows, or recalculate from totalMinutes?
  // Let's recalculate from totalMinutes.
  const overallStats = calculateRowStats(
    "00:00", 
    `${Math.floor(totalMinutesAllRows / 60).toString().padStart(2, '0')}:${(totalMinutesAllRows % 60).toString().padStart(2, '0')}`
  );

  const handleAddRow = () => {
    setDetails([...details, { TaskName: '', StartTime: '', EndTime: '' }]);
  };

  const handleRemoveRow = (index) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...details];
    newDetails[index][field] = value;
    setDetails(newDetails);
  };

  const handleSubmit = async () => {
    if (details.some(d => !d.TaskName || !d.StartTime || !d.EndTime)) {
      showToast('Semua kolom detail lembur harus diisi!', 'error');
      return;
    }

    if (overallStats.durationHr === 0) {
      showToast('Total durasi lembur tidak memenuhi syarat (minimal 1 jam).', 'warning');
      return;
    }

    const newIdForm = `OT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;

    const newHeader = {
      IdForm: newIdForm,
      TanggalPengajuan: tanggalPengajuan,
      IdKaryawan: currentUser.IdKaryawan,
      TotalJam: overallStats.durationHr,
      StatusApproval: 'PENDING'
    };

    const newDetailRows = details.map(d => ({
      IdForm: newIdForm,
      TaskName: d.TaskName,
      Duration: calculateRowStats(d.StartTime, d.EndTime).durationHr,
      StartTime: d.StartTime,
      EndTime: d.EndTime
    }));

    try {
      await api.post('postOtHeader', newHeader);
      await api.post('postOtDetail', newDetailRows);

      setDb(prev => ({
        ...prev,
        otHeader: [newHeader, ...prev.otHeader],
        otDetail: [...newDetailRows, ...prev.otDetail]
      }));

      writeAuditLog(currentUser.IdKaryawan, `Mengajukan form lembur: ${newIdForm}`);
      showToast('Form Lembur berhasil diajukan!');
      
      // Reset
      setTanggalPengajuan(new Date().toISOString().split('T')[0]);
      setDetails([{ TaskName: '', StartTime: '', EndTime: '' }]);
    } catch (err) {
      showToast('Gagal mengajukan form lembur.', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-black text-white mb-6">Form Pengajuan Lembur (Master-Detail)</h2>

        {/* Master Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-slate-900/50 p-5 rounded-xl border border-slate-800">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase">Karyawan</label>
            <input 
              type="text" 
              value={currentUser.Nama} 
              disabled 
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 cursor-not-allowed"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase">Tanggal Lembur</label>
            <input 
              type="date" 
              value={tanggalPengajuan}
              onChange={(e) => setTanggalPengajuan(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Detail Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Detail Pekerjaan Lembur</label>
            <button 
              onClick={handleAddRow}
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
            >
              <Plus className="h-3 w-3" /> Tambah Baris
            </button>
          </div>

          {details.map((row, index) => {
            const stats = calculateRowStats(row.StartTime, row.EndTime);
            return (
              <div key={index} className="grid grid-cols-12 gap-3 items-start bg-slate-900 p-3 rounded-xl border border-slate-800 relative">
                <div className="col-span-12 md:col-span-5 space-y-1">
                  <input 
                    type="text" 
                    placeholder="Deskripsi Pekerjaan" 
                    value={row.TaskName}
                    onChange={(e) => handleDetailChange(index, 'TaskName', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
                <div className="col-span-5 md:col-span-2 space-y-1">
                  <input 
                    type="time" 
                    value={row.StartTime}
                    onChange={(e) => handleDetailChange(index, 'StartTime', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
                <div className="col-span-5 md:col-span-2 space-y-1">
                  <input 
                    type="time" 
                    value={row.EndTime}
                    onChange={(e) => handleDetailChange(index, 'EndTime', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
                <div className="col-span-2 md:col-span-2 flex justify-center items-center h-full">
                  {details.length > 1 && (
                    <button 
                      onClick={() => handleRemoveRow(index)}
                      className="text-rose-500 hover:text-rose-400 p-2 bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="col-span-12 text-[10px] text-slate-500 italic px-1 flex items-center gap-1">
                  <Calculator className="h-3 w-3" /> {stats.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Calculation Summary */}
        <div className="mt-8 bg-indigo-950/30 border border-indigo-900/50 rounded-xl p-5 flex flex-col md:flex-row justify-between items-center">
          <div className="space-y-1 mb-4 md:mb-0">
            <h4 className="text-sm font-bold text-white">Estimasi Total Lembur Harian</h4>
            <p className="text-xs text-indigo-300">{overallStats.label}</p>
          </div>
          <button 
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all active:scale-95 w-full md:w-auto justify-center"
          >
            <Save className="h-4 w-4" /> Ajukan Lembur
          </button>
        </div>
      </div>
    </div>
  );
}
