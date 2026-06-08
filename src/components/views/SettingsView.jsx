import React, { useState } from 'react';
import { Settings, Users, Key, Building2 } from 'lucide-react';

export default function SettingsView({ db }) {
  const [activeTab, setActiveTab] = useState('karyawan');

  if (!db) return null;

  return (
    <div className="space-y-6">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Sistem Pengaturan</h2>
            <p className="text-xs text-slate-400 mt-1">Manajemen master data dan konfigurasi aplikasi.</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-slate-800 pb-4 mb-6 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('karyawan')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'karyawan' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Users className="h-4 w-4" /> Data Karyawan
          </button>
          <button 
            onClick={() => setActiveTab('roles')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'roles' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Key className="h-4 w-4" /> Role Management
          </button>
          <button 
            onClick={() => setActiveTab('divisi')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'divisi' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Building2 className="h-4 w-4" /> Division Routing
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          {activeTab === 'karyawan' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-400">
                <thead className="text-[10px] text-slate-500 uppercase bg-slate-950 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">ID Karyawan</th>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">ID Divisi</th>
                    <th className="px-4 py-3">ID Role</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {db.karyawan.map(k => (
                    <tr key={k.IdKaryawan} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="px-4 py-3 font-medium text-slate-200">{k.IdKaryawan}</td>
                      <td className="px-4 py-3">{k.Nama}</td>
                      <td className="px-4 py-3">{k.IdDivisi}</td>
                      <td className="px-4 py-3">{k.IdRole}</td>
                      <td className="px-4 py-3">
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                          {k.Status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-400">
                <thead className="text-[10px] text-slate-500 uppercase bg-slate-950 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">ID Role</th>
                    <th className="px-4 py-3">Nama Role</th>
                    <th className="px-4 py-3">Status Aktif</th>
                  </tr>
                </thead>
                <tbody>
                  {db.roles.map(r => (
                    <tr key={r.IdRole} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="px-4 py-3 font-medium text-slate-200">{r.IdRole}</td>
                      <td className="px-4 py-3">{r.RoleName}</td>
                      <td className="px-4 py-3">
                        {r.IsActive ? (
                          <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">Yes</span>
                        ) : (
                          <span className="bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded text-[10px] font-bold">No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'divisi' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-400">
                <thead className="text-[10px] text-slate-500 uppercase bg-slate-950 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">ID Divisi</th>
                    <th className="px-4 py-3">Nama Divisi</th>
                    <th className="px-4 py-3">Sub Divisi</th>
                    <th className="px-4 py-3">ID Manager (Approval Route)</th>
                  </tr>
                </thead>
                <tbody>
                  {db.divisi.map(d => (
                    <tr key={d.IdDivisi} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="px-4 py-3 font-medium text-slate-200">{d.IdDivisi}</td>
                      <td className="px-4 py-3">{d.Divisi}</td>
                      <td className="px-4 py-3">{d.SubDivisi}</td>
                      <td className="px-4 py-3">
                        <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-1 rounded text-xs font-bold font-mono">
                          {d.IdManager}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
