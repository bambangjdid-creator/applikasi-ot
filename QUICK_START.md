# 🎯 OVERTIME PORTAL - QUICK REFERENCE

## 🚀 Mulai Cepat (5 Menit)

### 1️⃣ Install & Jalankan
```bash
npm install
npm run dev
```
Buka: http://localhost:5173

### 2️⃣ Login Pertama
- Username: `admin1`
- Password: `123`
- Role: Admin (akses semua)

### 3️⃣ Setup Backend (Google Sheets)
1. Buka Settings → Google Sync
2. Paste URL Web App Google Apps Script Anda
3. Klik "Tarik Data Sheet 🔄"
4. Done! Data terhubung ke Google Sheets

---

## 📱 Menu & Fungsi

| Menu | Fungsi | Akses |
|------|--------|-------|
| **Dashboard** | Lihat ringkas data lembur | Semua |
| **Form OT** | Buat pengajuan lembur baru | User, Mng, HRD, Adm |
| **OT History** | Lihat riwayat semua lembur | Semua |
| **Approval** | Review & setujui pengajuan | Mng, HRD, Adm |
| **Report** | Export laporan lembur | Mng, HRD, Adm |
| **Audit Log** | Lihat log aktivitas user | HRD, Adm |
| **Settings** | Kelola user, karyawan, config | Adm |

---

## 👤 Roles & Akses

```
User (Staff)     → Form OT, OT History, AI Copilot
Manager          → + Approval, Report
HRD              → + Audit Log, Settings
Admin            → Semua fitur
```

---

## 🔑 Default Demo Users

| Username | Password | Role | Divisi |
|----------|----------|------|--------|
| admin1 | 123 | Admin | HEAD OFFICE |
| user1 | 123 | User | GUDANG PONCOL |
| mgr1 | 123 | Manager | GUDANG NAGOYA |
| hrd1 | 123 | HRD | HEAD OFFICE |

> **PENTING**: Ganti password ini di production!

---

## 📝 Form OT - Field yang Diperlukan

```
Tanggal Pengajuan     : YYYY-MM-DD format
Tanggal Lembur        : YYYY-MM-DD format
Area Lembur           : Pilih dari dropdown
Jenis Lembur          : BONGKARAN, KIRIMAN, MUATAN, STOCK OPNAME, LAIN-LAIN
Karyawan              : Pilih dari data yang sudah terdaftar
Jam Mulai             : HH:MM format (contoh: 17:30)
Jam Selesai           : HH:MM format (contoh: 21:00)
Alasan Lembur         : Deskripsi singkat
```

### Perhitungan Nominal (Otomatis)
```
< 1 jam       → Rp. 0 (tidak dihitung)
1 jam pertama → Rp. 20.000
Jam berikutnya → Rp. 15.000/jam
≤ 30 menit    → Bulatkan ke bawah
> 30 menit    → Bulatkan ke 0.5 jam
```

---

## ✅ Approval Workflow

**Status Pengajuan:**
- `pending`    : Menunggu review
- `approved`   : Disetujui manager
- `paid`       : Sudah dicairkan kasir
- `rejected`   : Ditolak

**Approval Steps:**
1. Manager/HRD buka Approval
2. Review detail + AI risk score
3. Pilih: Setujui / Tolak / Minta Revisi
4. Tambah catatan (opsional)
5. Submit → status berubah

---

## 🛠️ Admin - Tambah User

Di Settings → Akses User:

```
Username    : staff_1        (unik, tidak ada spasi)
Password    : Pwd123!        (akan di-hash di backend)
Nama Display: Budi Santoso   (nama lengkap)
Divisi      : GUDANG NAGOYA  (pilih dari dropdown)
Role        : User / Mgr / HRD / Admin
```

Akses menu otomatis disesuaikan dengan role.

---

## 🛠️ Admin - Tambah Karyawan

Di Settings → Karyawan:

```
NIK          : 327501230     (nomor identitas nasional)
ID Karyawan  : EMP001        (kode internal unik)
Nama         : Ahmad Dani
Divisi       : GUDANG NAGOYA
Area Kerja   : GUDANG NAGOYA
Jabatan      : Staf Logistik
```

---

## 🤖 AI Copilot (Opsional)

Untuk aktivasi:
1. Dapatkan Gemini API Key gratis di: https://aistudio.google.com/app/apikey
2. Settings → Gemini LLM
3. Paste API Key
4. Simpan

Gunakan di:
- Approval: Analisa risk score & kepatuhan
- AICopilot: Chat & konsultasi lembur

---

## 📊 Export Data

**Di Report menu:**
- Pilih periode (bulan/tahun)
- View ringkas per divisi
- Download format (upcoming feature)

---

## 🔍 Search & Filter

**Di OT History:**
- Search nama karyawan
- Filter status (pending, approved, paid)
- Filter divisi / area kerja
- Filter tanggal range

---

## 💾 Backup & Restore

**Backup:**
- Aplikasi otomatis backup ke Google Sheets saat sync
- Manual: Buka Google Sheet langsung

**Restore:**
- Jika ada issue, bisa restore dari Google Sheet manual
- Settings → Tarik Data Sheet (refresh dari backend)

---

## ⚠️ Status Badge (Header)

| Badge | Arti |
|-------|------|
| 🟢 Live Connected | Terhubung ke Google Sheets backend |
| 🟡 Demo Mode (Local) | Hanya data lokal (belum setup backend) |
| 🟣 Gemini Ready | AI Copilot aktif |
| ⚪ No LLM Key | AI Copilot belum setup |

---

## 🔐 Password Policy

- Minimal 6 karakter (recommended 8+)
- Bisa campur huruf, angka, simbol
- Case-sensitive (huruf besar/kecil berbeda)
- Disimpan plain-text (untuk dev; di production gunakan hashing)

---

## 📱 Responsive Design

- **Desktop** (≥ 1024px): Sidebar + Main content
- **Tablet** (768-1023px): Collapsed sidebar, responsive grid
- **Mobile** (< 768px): Full-width stacked layout

---

## 🎨 Keyboard Shortcuts

- `Ctrl + S` : Auto-save (jika form aktif)
- `Esc` : Close modal/dialog
- `Tab` : Navigate form fields
- `Enter` : Submit form

---

## 🆘 Common Issues

### Login gagal
→ Cek username & password (password case-sensitive)

### Data tidak muncul
→ Klik "Tarik Data Sheet" di Settings

### Staff tidak bisa login
→ Pastikan user sudah dibuat di Settings, dan browser sudah sync backend

### AI error
→ Cek Gemini API Key valid & quota masih ada

---

## 📞 Bantuan

**Dokumentasi Lengkap**: [INSTALL_GUIDE.md](./INSTALL_GUIDE.md)

**GitHub Issues**: https://github.com/bambangjdid-creator/applikasi-ot/issues

---

**Last Updated**: June 2, 2026 | **Version**: 1.0.0
