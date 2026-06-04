export const INITIAL_USER_ROLES = [
  { username: 'admin1', password: '123', displayName: 'Budi Hartono (Admin)', divisi: 'HEAD OFFICE', divisiKode: 'HO', role: 'Admin', aksesMenu: 'Dashboard, Form OT, OT History, Approval, Audit Log, Report, Settings, AI Copilot' },
  { username: 'user1', password: '123', displayName: 'Siti Aminah (Staff)', divisi: 'GUDANG PONCOL', divisiKode: 'PCL', role: 'User', aksesMenu: 'Dashboard, Form OT, OT History, AI Copilot' },
  { username: 'mgr1', password: '123', displayName: 'Hendra Wijaya (Manager)', divisi: 'GUDANG NAGOYA', divisiKode: 'NGY', role: 'Manager', aksesMenu: 'Dashboard, OT History, Approval, Report, AI Copilot' },
  { username: 'hrd1', password: '123', displayName: 'Saskia Putri (HRD)', divisi: 'HEAD OFFICE', divisiKode: 'HO', role: 'hrd', aksesMenu: 'Dashboard, OT History, Approval, Audit Log, Report, Settings, AI Copilot' }
];

export const INITIAL_DATA_KARYAWAN = [
  { nik: '3275012301', idKaryawan: 'EMP001', namaKaryawan: 'Ahmad Dani', divisi: 'GUDANG NAGOYA', areaKerja: 'GUDANG NAGOYA', jabatan: 'Staf Logistik' },
  { nik: '3275012302', idKaryawan: 'EMP002', namaKaryawan: 'Budi Santoso', divisi: 'GUDANG NAGOYA', areaKerja: 'GUDANG NAGOYA', jabatan: 'Helper Gudang' },
  { nik: '3275012303', idKaryawan: 'EMP003', namaKaryawan: 'Siti Aminah', divisi: 'GUDANG PONCOL', areaKerja: 'GUDANG PONCOL', jabatan: 'Staf Logistik' },
  { nik: '3275012304', idKaryawan: 'EMP004', namaKaryawan: 'Dedi Kurniawan', divisi: 'GUDANG CIRACAS', areaKerja: 'GUDANG CIRACAS', jabatan: 'Driver Operasional' },
  { nik: '3275012305', idKaryawan: 'EMP005', namaKaryawan: 'Eka Putri', divisi: 'FINANCE', areaKerja: 'HEAD OFFICE', jabatan: 'Kasir Utama' },
  { nik: '3275012306', idKaryawan: 'EMP006', namaKaryawan: 'Farhan Azis', divisi: 'GUDANG PONCOL', areaKerja: 'GUDANG PONCOL', jabatan: 'Operator Forklift' },
  { nik: '3275012307', idKaryawan: 'EMP007', namaKaryawan: 'Gilang Ramadhan', divisi: 'GUDANG CIRACAS', areaKerja: 'GUDANG CIRACAS', jabatan: 'Staf Penerimaan' }
];

export const INITIAL_OVERTIME = [
  {
    idDoc: 'OT/NGY/2026/05/000001',
    tanggalPengajuan: '2026-05-20',
    tanggalLembur: '2026-05-19',
    areaLembur: 'GUDANG NAGOYA',
    divisi: 'GUDANG NAGOYA',
    jenisLembur: 'BONGKARAN',
    namaKaryawan: 'Ahmad Dani',
    idKaryawan: 'EMP001',
    jabatan: 'Staf Logistik',
    jamMulai: '17:30',
    jamSelesai: '21:00',
    durasiLembur: 3.5,
    nominal: 57500,
    statusDocument: 'approved',
    alasanLembur: 'Bongkar kontainer impor dari pelabuhan Nagoya berisi suku cadang darurat.',
    catatanManager: 'Tugas mendesak, disetujui penuh.'
  },
  {
    idDoc: 'OT/NGY/2026/05/000001',
    tanggalPengajuan: '2026-05-20',
    tanggalLembur: '2026-05-19',
    areaLembur: 'GUDANG NAGOYA',
    divisi: 'GUDANG NAGOYA',
    jenisLembur: 'BONGKARAN',
    namaKaryawan: 'Budi Santoso',
    idKaryawan: 'EMP002',
    jabatan: 'Helper Gudang',
    jamMulai: '17:30',
    jamSelesai: '21:00',
    durasiLembur: 3.5,
    nominal: 57500,
    statusDocument: 'approved',
    alasanLembur: 'Bongkar kontainer impor dari pelabuhan Nagoya berisi suku cadang darurat.',
    catatanManager: 'Tugas mendesak, disetujui penuh.'
  },
  {
    idDoc: 'OT/PCL/2026/05/000002',
    tanggalPengajuan: '2026-05-21',
    tanggalLembur: '2026-05-20',
    areaLembur: 'GUDANG PONCOL',
    divisi: 'GUDANG PONCOL',
    jenisLembur: 'STOCK OPNAME',
    namaKaryawan: 'Siti Aminah',
    idKaryawan: 'EMP003',
    jabatan: 'Staf Logistik',
    jamMulai: '18:00',
    jamSelesai: '20:30',
    durasiLembur: 2.5,
    nominal: 42500,
    statusDocument: 'pending',
    alasanLembur: 'Penyesuaian stok triwulanan gudang poncol karena selisih audit.',
    catatanManager: ''
  },
  {
    idDoc: 'OT/CRS/2026/05/000003',
    tanggalPengajuan: '2026-05-22',
    tanggalLembur: '2026-05-21',
    areaLembur: 'GUDANG CIRACAS',
    divisi: 'GUDANG CIRACAS',
    jenisLembur: 'KIRIMAN',
    namaKaryawan: 'Dedi Kurniawan',
    idKaryawan: 'EMP004',
    jabatan: 'Driver Operasional',
    jamMulai: '17:00',
    jamSelesai: '19:45',
    durasiLembur: 2.5,
    nominal: 42500,
    statusDocument: 'paid',
    alasanLembur: 'Pengiriman muatan semen mendesak ke proyek pembangunan bypass.',
    catatanManager: 'Sudah diselesaikan dan dicairkan kasir.'
  }
];

export const INITIAL_AUDIT_LOGS = [
  { timestamp: '2026-05-23 09:30:15', user: 'admin1', action: 'login', details: 'User admin1 berhasil masuk ke sistem.' },
  { timestamp: '2026-05-23 11:00:05', user: 'system', action: 'inisialisasi', details: 'Database berhasil dikonfigurasi secara lokal dengan seed data.' }
];

export const DIVISIONS = [
  { label: 'GUDANG NAGOYA', code: 'NGY' },
  { label: 'GUDANG PONCOL', code: 'PCL' },
  { label: 'GUDANG CIRACAS', code: 'CRS' },
  { label: 'FINANCE', code: 'FIN' },
  { label: 'HEAD OFFICE', code: 'HO' },
  { label: 'STORE', code: 'STR' },
  { label: 'PURCHASING', code: 'PURC' }
];

export const OVERTIME_TYPES = ['BONGKARAN', 'KIRIMAN', 'MUATAN', 'STOCK OPNAME', 'LAIN-LAIN'];
export const LOCATIONS = ['GUDANG PONCOL', 'GUDANG NAGOYA', 'GUDANG CIRACAS', 'HEAD OFFICE', 'STORE'];
