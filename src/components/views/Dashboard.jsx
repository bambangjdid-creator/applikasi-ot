import React from 'react';
import { 
  TrendingUp, Calendar, CheckCircle, Clock, Users 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function Dashboard({ db, currentUser }) {
  if (!db) return null;

  // Filter logic based on Role
  const roleName = db.roles.find(r => r.IdRole === currentUser.IdRole)?.RoleName;
  let relevantHeaders = db.otHeader;
  
  if (roleName === 'Employee') {
    relevantHeaders = db.otHeader.filter(h => h.IdKaryawan === currentUser.IdKaryawan);
  } else if (roleName === 'Manager') {
    const employeeIdsInDiv = db.karyawan
      .filter(k => k.IdDivisi === currentUser.IdDivisi)
      .map(k => k.IdKaryawan);
    relevantHeaders = db.otHeader.filter(h => employeeIdsInDiv.includes(h.IdKaryawan));
  }
  // HRD / Admin sees all

  const totalPending = relevantHeaders.filter(h => h.StatusApproval === 'PENDING').length;
  const totalApproved = relevantHeaders.filter(h => h.StatusApproval === 'APPROVED').length;
  
  const totalHours = relevantHeaders
    .filter(h => h.StatusApproval === 'APPROVED')
    .reduce((sum, h) => sum + (parseFloat(h.TotalJam) || 0), 0);

  // Chart data
  const statusData = [
    { name: 'Pending', count: totalPending },
    { name: 'Approved', count: totalApproved },
    { name: 'Rejected', count: relevantHeaders.filter(h => h.StatusApproval === 'REJECTED').length }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Dashboard Overview</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Menampilkan data untuk peran: <span className="text-indigo-400">{roleName}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="w-16 h-16 text-indigo-500" />
          </div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-8 w-8 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Jam Lembur (Disetujui)</h3>
          </div>
          <p className="text-3xl font-black text-white">{totalHours.toFixed(1)} <span className="text-sm font-semibold text-slate-500">Jam</span></p>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-amber-500/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar className="w-16 h-16 text-amber-500" />
          </div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-8 w-8 bg-amber-500/20 text-amber-400 rounded-lg flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Menunggu Persetujuan</h3>
          </div>
          <p className="text-3xl font-black text-white">{totalPending}</p>
        </div>

        {/* Card 3 */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle className="w-16 h-16 text-emerald-500" />
          </div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-8 w-8 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-4 w-4" />
            </div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Disetujui</h3>
          </div>
          <p className="text-3xl font-black text-white">{totalApproved}</p>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white mb-6">Status Pengajuan Lembur</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip 
                cursor={{ fill: '#1e293b' }}
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.75rem' }} 
              />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
