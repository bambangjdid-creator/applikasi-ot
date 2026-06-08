export const MOCK_MENU = [
  { IdMenu: 'M1', MenuName: 'Dashboard', IdParent: null, RoutePath: '/dashboard', OrderIndex: 1, IsActive: true },
  { IdMenu: 'M2', MenuName: 'Form OT', IdParent: null, RoutePath: '/form-ot', OrderIndex: 2, IsActive: true },
  { IdMenu: 'M3', MenuName: 'OT History', IdParent: null, RoutePath: '/ot-history', OrderIndex: 3, IsActive: true },
  { IdMenu: 'M3-1', MenuName: 'Approval List', IdParent: 'M3', RoutePath: '/approval', OrderIndex: 4, IsActive: true },
  { IdMenu: 'M5', MenuName: 'Audit Log', IdParent: null, RoutePath: '/audit-log', OrderIndex: 5, IsActive: true },
  { IdMenu: 'M6', MenuName: 'Report', IdParent: null, RoutePath: '/report', OrderIndex: 6, IsActive: true },
  { IdMenu: 'M7', MenuName: 'Settings', IdParent: null, RoutePath: '/settings', OrderIndex: 7, IsActive: true },
  { IdMenu: 'M8', MenuName: 'AI Copilot', IdParent: null, RoutePath: '/ai-copilot', OrderIndex: 8, IsActive: true }
];

export const MOCK_USER_ROLE = [
  { IdRole: 'R1', RoleName: 'Employee', IsActive: true },
  { IdRole: 'R2', RoleName: 'Manager', IsActive: true },
  { IdRole: 'R3', RoleName: 'HRD / Admin', IsActive: true }
];

export const MOCK_DATA_KARYAWAN = [
  { IdKaryawan: 'EMP001', Nama: 'Siti Aminah', IdDivisi: 'D1', IdRole: 'R1', Status: 'Aktif', Password: '123' },
  { IdKaryawan: 'EMP002', Nama: 'Budi Santoso', IdDivisi: 'D2', IdRole: 'R1', Status: 'Aktif', Password: '123' },
  { IdKaryawan: 'MGR001', Nama: 'Hendra Wijaya', IdDivisi: 'D1', IdRole: 'R2', Status: 'Aktif', Password: '123' },
  { IdKaryawan: 'MGR002', Nama: 'Dewi Lestari', IdDivisi: 'D2', IdRole: 'R2', Status: 'Aktif', Password: '123' },
  { IdKaryawan: 'ADM001', Nama: 'Bambang HRD', IdDivisi: 'D3', IdRole: 'R3', Status: 'Aktif', Password: '123' }
];

export const MOCK_DIVISI = [
  { IdDivisi: 'D1', Divisi: 'GUDANG PONCOL', SubDivisi: 'Logistik', IdManager: 'MGR001' },
  { IdDivisi: 'D2', Divisi: 'GUDANG NAGOYA', SubDivisi: 'Operasional', IdManager: 'MGR002' },
  { IdDivisi: 'D3', Divisi: 'HEAD OFFICE', SubDivisi: 'HRD', IdManager: 'ADM001' }
];

export const MOCK_OT_HEADER = [
  { IdForm: 'OT-202605-001', TanggalPengajuan: '2026-05-20', IdKaryawan: 'EMP001', TotalJam: 2.5, StatusApproval: 'PENDING' },
  { IdForm: 'OT-202605-002', TanggalPengajuan: '2026-05-19', IdKaryawan: 'EMP002', TotalJam: 3.5, StatusApproval: 'APPROVED' }
];

export const MOCK_OT_DETAIL = [
  { IdForm: 'OT-202605-001', TaskName: 'Stock Opname Gudang Poncol', Duration: 2.5, StartTime: '18:00', EndTime: '20:30' },
  { IdForm: 'OT-202605-002', TaskName: 'Bongkar Muat Barang Masuk', Duration: 3.5, StartTime: '17:30', EndTime: '21:00' }
];

export const MOCK_APPROVAL = [
  { IdApproval: 'APP-001', IdForm: 'OT-202605-002', IdManager: 'MGR002', Status: 'APPROVED', Notes: 'Tugas mendesak, disetujui penuh.', OrderApproval: 1 }
];

export const MOCK_AUDIT_LOG = [
  { IdLog: 'LOG-001', Timestamp: '2026-05-20 08:00:00', IdKaryawan: 'EMP001', Activity: 'Login ke sistem' },
  { IdLog: 'LOG-002', Timestamp: '2026-05-20 08:30:00', IdKaryawan: 'EMP001', Activity: 'Mengajukan form lembur OT-202605-001' }
];
