import React, { useState, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { DIVISIONS, OVERTIME_TYPES } from '../../data/initialData';
import { formatFriendlyDate, formatCleanTime } from '../../utils/formatters';

export default function OTHistoryView({ currentUser, overtime, setOvertime, writeLocalLog, postDataToGoogleSheets, showToast, setPreviewPdfData }) {
  const [filterDivisi, setFilterDivisi] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterJenis, setFilterJenis] = useState('ALL');
  const [filterBulan, setFilterBulan] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const userRole = (currentUser?.role || '').toLowerCase();
  const userDiv = (currentUser?.divisi || '').toUpperCase().trim();
  const isHrdOrAdmin = userRole === 'admin' || userRole === 'hrd' || userDiv === 'HRD';

  const filteredData = useMemo(() => {
    return overtime.filter(item => {
      const itemDiv = (item.divisi || '').toUpperCase().trim();
      if (!isHrdOrAdmin) {
        if (userRole === 'user' && itemDiv !== userDiv) return false;
        if (userRole === 'manager') {
          const isMatch = userDiv === itemDiv || (userDiv === 'GUDANG' && itemDiv.startsWith('GUDANG'));
          if (!isMatch) return false;
        }
      }

      if (filterDivisi !== 'ALL' && item.divisi !== filterDivisi) return false;
      if (filterStatus !== 'ALL' && item.statusDocument !== filterStatus) return false;
      if (filterBulan !== 'ALL') {
        if (!item.tanggalLembur) return false;
        const tgl = new Date(item.tanggalLembur);
        if (isNaN(tgl.getTime())) return false;
        const bulanStr = String(tgl.getMonth() + 1).padStart(2, '0');
        if (bulanStr !== filterBulan) return false;
      }
      if (filterJenis !== 'ALL' && !item.jenisLembur.toLowerCase().includes(filterJenis.toLowerCase())) return false;
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        return item.idDoc.toLowerCase().includes(query) ||
          item.namaKaryawan.toLowerCase().includes(query) ||
          item.alasanLembur.toLowerCase().includes(query);
      }
      return true;
    });
  }, [overtime, currentUser, filterDivisi, filterStatus, filterJenis, filterBulan, searchTerm, isHrdOrAdmin, userRole, userDiv]);

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
                <td colSpan="6" className="py-10 text-center text-slate-500 font-bold italic">Tidak ada transaksi yang sesuai kriteria filter.</td>
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
                    }`}>{item.statusDocument}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setPreviewPdfData(item)}
                        className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 rounded text-[10px] font-bold"
                      >
                        📄 Slip
                      </button>
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
