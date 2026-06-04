import {
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis
} from 'recharts';
import {
  Sparkles,
  Calendar,
  Coins,
  Info,
  ShieldAlert,
  Database,
  UserCheck,
  Activity
} from 'lucide-react';

export default function Dashboard({
  gasUrl,
  dashMonth,
  setDashMonth,
  dashYear,
  setDashYear,
  availableYears,
  stats,
  setCurrentTab
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-blue-950/90 p-6 text-slate-100 shadow-xl shadow-slate-950/20 ring-1 ring-slate-700/25">
        <div className="flex items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Dashboard Ringkas</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Laporan Lembur Bulanan</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300/90 sm:text-base">Ringkasan performa lembur, status persetujuan, dan laporan keuangan berdasarkan bulan dan tahun terpilih.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 sm:items-center">
            <div className="rounded-3xl border border-slate-800/70 bg-slate-950/80 p-4 shadow-xl shadow-slate-950/15">
              <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Filter Bulan</p>
              <select value={dashMonth} onChange={(e) => setDashMonth(e.target.value)} className="mt-3 w-full cursor-pointer rounded-2xl border border-slate-800/75 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition hover:border-cyan-400/80 focus:border-cyan-300/90 focus:ring-2 focus:ring-cyan-400/20">
                <option value="ALL">Semua Bulan</option>
                {Array.from({ length: 12 }, (_, index) => (
                  <option key={index} value={String(index + 1).padStart(2, '0')}>{['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][index]}</option>
                ))}
              </select>
            </div>
            <div className="rounded-3xl border border-slate-800/70 bg-slate-950/80 p-4 shadow-xl shadow-slate-950/15">
              <p className="text-xs uppercase tracking-[0.34em] text-slate-500">Filter Tahun</p>
              <select value={dashYear} onChange={(e) => setDashYear(e.target.value)} className="mt-3 w-full cursor-pointer rounded-2xl border border-slate-800/75 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition hover:border-cyan-400/80 focus:border-cyan-300/90 focus:ring-2 focus:ring-cyan-400/20">
                <option value="ALL">Semua Tahun</option>
                {availableYears.map((year) => (
                  <option key={year} value={String(year)}>{year}</option>
                ))}
                {availableYears.length === 0 && <option value={String(new Date().getFullYear())}>{new Date().getFullYear()}</option>}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-slate-800/70 bg-slate-950/85 p-5 shadow-2xl shadow-slate-950/10 flex flex-col justify-between min-h-[140px]">
              <div className="flex items-start justify-between gap-3 w-full">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Total Jam Lembur</p>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-800/70 text-cyan-300 shadow-lg shadow-cyan-400/5">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-100 tracking-tight break-words">{stats.totalDurasi.toFixed(1)} jam</p>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-800/70 bg-slate-950/85 p-5 shadow-2xl shadow-slate-950/10 flex flex-col justify-between min-h-[140px]">
              <div className="flex items-start justify-between gap-3 w-full">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Estimasi Total Bayar</p>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-800/70 text-emerald-300 shadow-lg shadow-emerald-400/5">
                  <Coins className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-100 tracking-tight break-words">Rp {stats.totalNominal.toLocaleString('id-ID')}</p>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-800/70 bg-slate-950/85 p-5 shadow-2xl shadow-slate-950/10 flex flex-col justify-between min-h-[140px]">
              <div className="flex items-start justify-between gap-3 w-full">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Status Approved</p>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-800/70 text-lime-300 shadow-lg shadow-lime-400/5">
                  <UserCheck className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-100 tracking-tight break-words">{stats.approvedCount}</p>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-800/70 bg-slate-950/85 p-5 shadow-2xl shadow-slate-950/10 flex flex-col justify-between min-h-[140px]">
              <div className="flex items-start justify-between gap-3 w-full">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Rata-rata Durasi</p>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-800/70 text-amber-300 shadow-lg shadow-amber-400/5">
                  <Info className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-100 tracking-tight break-words">{stats.averageDurationPerDoc.toFixed(1)} jam</p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-slate-800/70 bg-slate-950/85 p-5 shadow-xl shadow-slate-950/10">
              <div className="mb-4 flex items-center justify-between gap-5">
                <div>
                  <h2 className="text-lg font-semibold text-slate-100">Grafik Durasi Lembur</h2>
                  <p className="mt-1 text-sm text-slate-400">Performa lembur 5 hari terakhir.</p>
                </div>
                <div className="rounded-full bg-slate-800/70 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-300">Riwayat Ringkas</div>
              </div>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.dailyChartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', border: '1px solid #334155' }} />
                    <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 10, color: '#cbd5e1' }} />
                    <Line type="monotone" dataKey="durasi" stroke="#38bdf8" strokeWidth={4} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800/70 bg-slate-950/85 p-5 shadow-xl shadow-slate-950/10">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-100">Jenis Lembur Teratas</h2>
                <p className="mt-1 text-sm text-slate-400">Proyeksi jenis lembur berdasarkan durasi.</p>
              </div>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      nameKey="name"
                      stroke="transparent"
                    >
                      {stats.pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1rem', border: '1px solid #334155' }} />
                    <Legend verticalAlign="bottom" align="center" wrapperStyle={{ color: '#cbd5e1' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800/70 bg-slate-950/85 p-5 shadow-xl shadow-slate-950/10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">Aktivitas Terakhir</h2>
                <p className="mt-1 text-sm text-slate-400">Ringkasan aksi dokumen lembur terbaru.</p>
              </div>
              <button onClick={() => setCurrentTab('OT History')} className="inline-flex items-center justify-center rounded-3xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                Lihat Semua History
              </button>
            </div>
            <div className="mt-5 grid gap-4">
              {stats.recentActivities.length > 0 ? (
                stats.recentActivities.map((activity) => (
                  <div key={activity.idDoc + activity.tanggalLembur} className="rounded-3xl border border-slate-800/75 bg-slate-950/90 p-4 shadow-inner shadow-slate-950/5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Activity className="h-4 w-4 text-cyan-300" />
                          <span>{activity.tanggalLembur}</span>
                        </div>
                        <p className="text-sm text-slate-300">{activity.namaKaryawan} - {activity.jenisLembur}</p>
                      </div>
                      <span className="rounded-2xl bg-slate-800/75 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">{activity.statusDocument}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-400">{activity.alasanLembur}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-slate-800/75 bg-slate-950/90 p-6 text-center text-slate-400">Tidak ada aktivitas lembur untuk periode ini.</div>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-slate-800/70 bg-slate-950/85 p-5 shadow-xl shadow-slate-950/10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Kunci Wawasan</h3>
                <p className="mt-1 text-sm text-slate-400">Data cepat untuk keputusan operasi.</p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-3xl bg-slate-800/70 text-amber-300 shadow-lg shadow-amber-400/10">
                <ShieldAlert className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5 grid gap-4">
              <div className="rounded-3xl bg-slate-950/90 p-4 text-slate-300 shadow-slate-950/5 ring-1 ring-slate-800/70">
                <p className="text-sm text-slate-400">Laporan Approved</p>
                <p className="mt-3 text-2xl font-semibold text-slate-100">{stats.approvedCount}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/90 p-4 text-slate-300 shadow-slate-950/5 ring-1 ring-slate-800/70">
                <p className="text-sm text-slate-400">Laporan Pending</p>
                <p className="mt-3 text-2xl font-semibold text-slate-100">{stats.pendingCount}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/90 p-4 text-slate-300 shadow-slate-950/5 ring-1 ring-slate-800/70">
                <p className="text-sm text-slate-400">Dokumen Paid</p>
                <p className="mt-3 text-2xl font-semibold text-slate-100">{stats.paidCount}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800/70 bg-slate-950/85 p-5 shadow-xl shadow-slate-950/10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Kunci Data</h3>
                <p className="mt-1 text-sm text-slate-400">Link cepat ke Google Sheets.</p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-3xl bg-slate-800/70 text-cyan-300 shadow-lg shadow-cyan-400/10">
                <Database className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-5 text-sm text-slate-400">Penting untuk menyimpan data di Google Sheets jika koneksi dimungkinkan.</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setCurrentTab('Settings')} className="inline-flex flex-1 items-center justify-center rounded-3xl bg-slate-800/80 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-700/90">Pengaturan</button>
              {gasUrl && (
                <a href={gasUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-3xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">Buka Sheet</a>
              )}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
