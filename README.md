# ⚡ OVERTIME PORTAL

Aplikasi web untuk manajemen pengajuan lembur karyawan dengan integrasi Google Sheets, fitur approval workflow, dan AI Assistant (Gemini) untuk analisa compliance.

## ✨ Fitur Utama

- **📝 Pengajuan Lembur**: Form OT dengan perhitungan nominal otomatis sesuai peraturan
- **📋 Riwayat & Tracking**: Lihat status pengajuan real-time
- **✅ Approval Workflow**: Review, approve, reject dengan catatan manager
- **🤖 AI Copilot**: Analisa risk score & kepatuhan peraturan menggunakan Gemini
- **📊 Report & Analytics**: Dashboard & laporan lembur per periode/divisi
- **🔍 Audit Log**: Tracking semua aktivitas user untuk compliance
- **☁️ Cloud Sync**: Otomatis sinkron data ke Google Sheets
- **👥 Multi-User**: Support Admin, Manager, HRD, User dengan akses berbeda

## 🚀 Quick Start

### Prasyarat
- Node.js v16+ ([download](https://nodejs.org))
- npm (termasuk Node.js)
- Akun Google untuk Google Sheet & Google Apps Script

### Instalasi

```bash
# Clone repository
git clone https://github.com/bambangjdid-creator/applikasi-ot.git
cd aplikasi-form-ot

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Buka browser ke `http://localhost:5173`

### Setup Backend (Google Apps Script)

**Lihat panduan lengkap di: [INSTALL_GUIDE.md](./INSTALL_GUIDE.md)**

Ringkas:
1. Buat Google Sheet dengan sheets: `users`, `karyawan`, `overtime`, `audit_logs`
2. Buat Google Apps Script untuk backend (lihat kode di INSTALL_GUIDE.md)
3. Deploy Google Apps Script dengan akses "Anyone, even anonymous"
4. Copy URL deployment (berakhir dengan `/exec`)
5. Login ke aplikasi → Settings → Google Sync → Paste URL → Save

## 📚 Dokumentasi Lengkap

Panduan lengkap tersedia di **[INSTALL_GUIDE.md](./INSTALL_GUIDE.md)** yang mencakup:

- ✅ Instalasi step-by-step
- ✅ Setup Google Apps Script backend
- ✅ Konfigurasi aplikasi
- ✅ Panduan pemakaian setiap menu
- ✅ Manajemen user & karyawan
- ✅ Deploy ke production
- ✅ Troubleshooting

## 🏗️ Tech Stack

- **Frontend**: React 19 + Vite 8
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: Google Apps Script + Google Sheets
- **AI**: Gemini 2.5 Flash API

## 📱 User Roles

| Role | Akses |
|------|-------|
| **Admin** | Semua fitur, kelola user & karyawan |
| **Manager** | OT History, Approval, Report |
| **HRD** | OT History, Approval, Audit Log, Report, Settings |
| **User** | Form OT, OT History, AI Copilot |

## 📦 Build & Deploy

```bash
# Build untuk production
npm run build

# Preview build lokal
npm run preview

# Deploy ke GitHub Pages
npm run deploy
```

## 🔒 Security Note

- Ganti password user demo di production
- Gunakan HTTPS saat production
- Jangan share Google Apps Script URL yang sensitive
- Backup Google Sheet secara berkala

## 🐛 Troubleshooting

Jika mengalami masalah:
1. Buka [INSTALL_GUIDE.md - Troubleshooting section](./INSTALL_GUIDE.md#-troubleshooting)
2. Cek Google Apps Script URL valid & deploy benar
3. Pastikan browser sudah sync data dari backend
4. Buka Dev Tools (F12) untuk melihat error console

## 📞 Support

- 📧 Issues: https://github.com/bambangjdid-creator/applikasi-ot/issues
- 💬 GitHub Discussions: https://github.com/bambangjdid-creator/applikasi-ot/discussions

## 📄 License

MIT License - Bebas digunakan untuk keperluan komersial maupun non-komersial

## 📝 Catatan

- Versi: **1.0.0**
- Last Updated: **June 2, 2026**
- Status: **Production Ready** (dengan setup backend yang benar)

---

**Selamat menggunakan Overtime Portal! 🎉**

Untuk panduan detail, buka: **[INSTALL_GUIDE.md](./INSTALL_GUIDE.md)**

