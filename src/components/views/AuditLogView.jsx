import React from 'react';
import { Activity, Clock, ShieldAlert } from 'lucide-react';

export default function AuditLogView({ db }) {
  if (!db) return null;

  const sortedLogs = [...db.auditLog].sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));

  return (
    <div className="space-y-6">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Sistem Audit Log</h2>
            <p className="text-xs text-slate-400 mt-1">Rekaman aktivitas keamanan dan transaksi sistem.</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative">
          <div className="absolute top-0 left-0 bottom-0 w-8 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-4 space-y-4">
            <ShieldAlert className="h-4 w-4 text-slate-600" />
          </div>
          <div className="pl-12 py-4 pr-4 space-y-1 max-h-[600px] overflow-y-auto custom-scrollbar">
            {sortedLogs.length === 0 ? (
              <p className="text-sm text-slate-500 py-4">Belum ada aktivitas terekam.</p>
            ) : (
              sortedLogs.map(log => {
                const karyawan = db.karyawan.find(k => k.IdKaryawan === log.IdKaryawan);
                return (
                  <div key={log.IdLog} className="relative py-3 group">
                    <div className="absolute left-[-1.6rem] top-4 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-slate-900 z-10 group-hover:scale-150 transition-transform"></div>
                    <div className="absolute left-[-1.3rem] top-6 bottom-[-1rem] w-px bg-slate-800"></div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 bg-slate-950 border border-slate-800/50 p-3 rounded-xl group-hover:border-slate-700 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded uppercase tracking-wider">
                            {log.IdKaryawan}
                          </span>
                          <span className="text-xs font-medium text-slate-400">{karyawan?.Nama || 'System'}</span>
                        </div>
                        <p className="text-sm text-slate-200 font-medium">{log.Activity}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 bg-slate-900 px-2 py-1 rounded-lg shrink-0">
                        <Clock className="h-3 w-3" />
                        {log.Timestamp}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
