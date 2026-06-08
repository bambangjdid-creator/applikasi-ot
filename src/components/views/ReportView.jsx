import React from 'react';
import { Download } from 'lucide-react';

export default function ReportView({ db }) {
  if (!db) return null;

  return (
    <div className="space-y-6">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center py-16">
        <Download className="h-12 w-12 text-slate-600 mx-auto mb-4" />
        <h2 className="text-xl font-black text-white">Laporan & Analitik</h2>
        <p className="text-sm text-slate-400 mt-2">Modul laporan akan dikembangkan pada iterasi berikutnya.</p>
      </div>
    </div>
  );
}
