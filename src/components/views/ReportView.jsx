import React, { useState, useMemo } from 'react';
import { Download } from 'lucide-react';
import { DIVISIONS } from '../../data/initialData';

export default function ReportView({ overtime, currentUser, writeLocalLog, showToast }) {
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

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [csvHeaders.join(','), ...csvRows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Overtime_${filterDivisi.replace(/ /g, '_')}_M${filterMonth}.csv`);
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
          <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-800/80 p-3">
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
