import React, { useState } from 'react';
import { Search, Filter, Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export default function OTHistoryView({ db, currentUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedRow, setExpandedRow] = useState(null);

  if (!db) return null;

  const roleName = db.roles.find(r => r.IdRole === currentUser.IdRole)?.RoleName;
  let historyData = db.otHeader;

  // Role-based filtering
  if (roleName === 'Employee') {
    historyData = historyData.filter(h => h.IdKaryawan === currentUser.IdKaryawan);
  } else if (roleName === 'Manager') {
    const employeeIdsInDiv = db.karyawan
      .filter(k => k.IdDivisi === currentUser.IdDivisi)
      .map(k => k.IdKaryawan);
    historyData = historyData.filter(h => employeeIdsInDiv.includes(h.IdKaryawan));
  }
  // HRD / Admin sees all

  // Apply search and status filters
  const filteredData = historyData.filter(h => {
    const matchesSearch = h.IdForm.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          h.IdKaryawan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || h.StatusApproval === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.TanggalPengajuan) - new Date(a.TanggalPengajuan));

  const getStatusStyle = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'REJECTED': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default: return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-black text-white mb-6">Riwayat Lembur (OT History)</h2>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Cari ID Form atau ID Karyawan..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white appearance-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Semua Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="text-[10px] text-slate-500 uppercase bg-slate-900 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">ID Form</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Karyawan</th>
                <th className="px-4 py-3">Total Jam</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-500">Tidak ada data lembur ditemukan.</td>
                </tr>
              ) : (
                filteredData.map((row) => {
                  const karyawan = db.karyawan.find(k => k.IdKaryawan === row.IdKaryawan);
                  const isExpanded = expandedRow === row.IdForm;
                  const details = db.otDetail.filter(d => d.IdForm === row.IdForm);

                  return (
                    <React.Fragment key={row.IdForm}>
                      <tr className="border-b border-slate-800 hover:bg-slate-900/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-200">{row.IdForm}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" /> {row.TanggalPengajuan}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-300">{karyawan?.Nama || row.IdKaryawan}</div>
                          <div className="text-[10px]">{row.IdKaryawan}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" /> {row.TotalJam} Jam
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold border ${getStatusStyle(row.StatusApproval)}`}>
                            {row.StatusApproval}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button 
                            onClick={() => toggleRow(row.IdForm)}
                            className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-300"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-slate-900/50">
                          <td colSpan="6" className="px-4 py-4">
                            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Detail Pekerjaan</h4>
                              <div className="space-y-2">
                                {details.map((d, i) => (
                                  <div key={i} className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800 text-xs">
                                    <span className="text-slate-300 font-medium">{d.TaskName}</span>
                                    <span className="text-slate-500">{d.StartTime} - {d.EndTime} ({d.Duration} Jam)</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
