import React from 'react';
import { Activity } from 'lucide-react';
import { INITIAL_AUDIT_LOGS } from '../../data/initialData';

export default function AuditLogView({ auditLogs, setAuditLogs, showToast }) {
  return (
    <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-indigo-400" />
          <div>
            <h2 className="text-base font-extrabold text-white">Audit Log Peristiwa Sistem</h2>
            <p className="text-xs text-slate-400">Jejak aktivitas log sistem, persetujuan overtimes, mutasi saldo, dan penugasan staf.</p>
          </div>
        </div>
        <button
          onClick={() => {
            setAuditLogs(INITIAL_AUDIT_LOGS);
            showToast('Log lokal berhasil di-reset!');
          }}
          className="text-rose-400 hover:text-rose-300 text-xs font-bold border border-rose-500/30 px-3 py-1 rounded-xl"
        >
          Clear Logs
        </button>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden font-mono text-[11px] leading-relaxed">
        <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-800/80 p-4 space-y-2">
          {auditLogs.map((log, idx) => (
            <div key={`audit-${idx}`} className="flex flex-col sm:flex-row sm:items-start justify-between py-2 gap-1 hover:bg-slate-950/40 px-2 rounded transition-all">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-indigo-400 font-bold">[{log.timestamp}]</span>
                  <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[9px] uppercase font-black tracking-wider text-slate-300">{log.action}</span>
                </div>
                <p className="text-slate-300">{log.details}</p>
              </div>
              <span className="text-[10px] text-slate-500 font-bold sm:text-right">User: {log.user}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
