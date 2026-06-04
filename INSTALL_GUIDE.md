# 📋 Panduan Instalasi & Pemakaian Aplikasi OVERTIME PORTAL

## 📌 Daftar Isi
1. [Prasyarat](#prasyarat)
2. [Instalasi Lokal](#instalasi-lokal)
3. [Setup Google Apps Script Backend](#setup-google-apps-script-backend)
4. [Konfigurasi Aplikasi](#konfigurasi-aplikasi)
5. [Pemakaian Aplikasi](#pemakaian-aplikasi)
6. [Manajemen User & Karyawan](#manajemen-user--karyawan)
7. [Deploy ke Production](#deploy-ke-production)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 Prasyarat

Sebelum memulai, pastikan sudah tersedia:

### Software
- **Node.js** v16+ ([download](https://nodejs.org))
- **npm** (sudah termasuk dengan Node.js)
- **Git** (opsional, untuk clone repo)
- **Browser modern** (Chrome, Firefox, Edge)

### Akun Google
- Akun Google untuk membuat Google Sheet & Google Apps Script
- Google Drive untuk menyimpan data

### Optional
- **Gemini API Key** untuk fitur AI Copilot ([dapatkan gratis](https://aistudio.google.com/app/apikey))

---

## 📥 Instalasi Lokal

### Step 1: Download/Clone Aplikasi

**Opsi A: Via Git**
```bash
git clone https://github.com/bambangjdid-creator/applikasi-ot.git
cd applikasi-ot
```

**Opsi B: Manual Download**
- Download folder `aplikasi-form-ot` dari repository
- Ekstrak ke lokasi pilihan Anda
- Buka terminal di folder tersebut

### Step 2: Install Dependencies

```bash
npm install
```

Tunggu hingga selesai (sekitar 2-5 menit tergantung koneksi internet).

### Step 3: Jalankan Development Server

```bash
npm run dev
```

Output akan menampilkan:
```
  VITE v8.0.12  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 4: Buka di Browser

- Buka browser
- Akses: `http://localhost:5173`
- Anda akan melihat halaman login aplikasi

---

## 🔌 Setup Google Apps Script Backend

Backend menggunakan **Google Apps Script** untuk menyimpan & sinkron data ke Google Sheet.

### Step 1: Buat Google Sheet

1. Buka **Google Drive** (`drive.google.com`)
2. Klik **Baru** → **Google Sheets**
3. Beri nama: `Overtime Portal - Database`
4. Buat 4 sheet dengan nama:
   - `users` (untuk user login)
   - `karyawan` (untuk data staf)
   - `overtime` (untuk data lembur)
   - `audit_logs` (untuk log aktivitas)

### Step 2: Buat Google Apps Script

1. Buka Google Sheet yang sudah dibuat
2. Klik **Extensions** → **Apps Script**
3. Ganti semua kode dengan kode berikut:

```javascript
// ==========================================
// CONFIGURATION
// ==========================================
const SHEET_ID = SpreadsheetApp.getActive().getId(); // Auto-detect sheet ID
const SHEET = SpreadsheetApp.getActive();

const SHEET_USERS = SHEET.getSheetByName('users');
const SHEET_KARYAWAN = SHEET.getSheetByName('karyawan');
const SHEET_OVERTIME = SHEET.getSheetByName('overtime');
const SHEET_AUDIT = SHEET.getSheetByName('audit_logs');

// ==========================================
// HTTP HANDLERS
// ==========================================

function doGet(e) {
  try {
    const data = {
      users: getDataFromSheet(SHEET_USERS),
      karyawan: getDataFromSheet(SHEET_KARYAWAN),
      overtime: getDataFromSheet(SHEET_OVERTIME),
      auditLogs: getDataFromSheet(SHEET_AUDIT)
    };
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: data,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    const data = payload.payload;
    
    switch (action) {
      case 'SAVE_KARYAWAN':
        saveOrUpdateRow(SHEET_KARYAWAN, 'idKaryawan', data);
        break;
      case 'SAVE_USER_ROLE':
        saveOrUpdateRow(SHEET_USERS, 'username', data);
        break;
      case 'UPDATE_STATUS':
        updateOvertimeStatus(SHEET_OVERTIME, data);
        break;
      default:
        throw new Error('Unknown action: ' + action);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data berhasil disimpan'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function getDataFromSheet(sheet) {
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = row[idx] || '';
    });
    return obj;
  }).filter(row => Object.values(row).some(v => v !== ''));
}

function saveOrUpdateRow(sheet, keyColumn, data) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const keyIndex = headers.indexOf(keyColumn);
  
  if (keyIndex === -1) {
    throw new Error('Column ' + keyColumn + ' not found');
  }
  
  const keyValue = data[keyColumn];
  const allRows = sheet.getDataRange().getValues();
  
  // Cari baris existing
  let rowIndex = -1;
  for (let i = 1; i < allRows.length; i++) {
    if (allRows[i][keyIndex] === keyValue) {
      rowIndex = i + 1;
      break;
    }
  }
  
  if (rowIndex === -1) {
    // Tambah baris baru
    const newRow = headers.map(header => data[header] || '');
    sheet.appendRow(newRow);
  } else {
    // Update baris existing
    const row = sheet.getRange(rowIndex, 1, 1, headers.length);
    const values = headers.map(header => data[header] || '');
    row.setValues([values]);
  }
}

function updateOvertimeStatus(sheet, data) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const idDocIndex = headers.indexOf('idDoc');
  const statusIndex = headers.indexOf('statusDocument');
  const catatanIndex = headers.indexOf('catatanManager');
  
  if (idDocIndex === -1) throw new Error('idDoc column not found');
  if (statusIndex === -1) throw new Error('statusDocument column not found');
  
  const allRows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < allRows.length; i++) {
    if (allRows[i][idDocIndex] === data.idDoc) {
      sheet.getRange(i + 1, statusIndex + 1).setValue(data.statusDocument);
      if (catatanIndex !== -1 && data.catatanManager) {
        sheet.getRange(i + 1, catatanIndex + 1).setValue(data.catatanManager);
      }
      break;
    }
  }
}
```

4. Klik **Save** (Ctrl+S)
5. Beri nama project: `Overtime Portal Backend`
6. Klik **Save**

### Step 3: Deploy Google Apps Script

1. Klik **Deploy** (tombol biru di atas)
2. Pilih **New Deployment**
3. Pilih type: **Web app**
4. Atur settings:
   - **Execute as**: Akun Google Anda
   - **Who has access**: `Anyone, even anonymous`
5. Klik **Deploy**
6. Coppy URL yang ditampilkan (berakhir dengan `/exec`)

Contoh URL:
```
https://script.google.com/macros/s/AKfycbwATrebY_OE4otejULIlcsbVyyDTFkQHCVZihESTWuwtBAU7NdMwi_2usoC2a4GeHi60g/exec
```

> **Simpan URL ini, diperlukan untuk konfigurasi aplikasi**

### Step 4: Siapkan Data di Google Sheet

Tambahkan header di setiap sheet:

**Sheet `users` - Row 1:**
```
username | password | displayName | divisi | divisiKode | role | aksesMenu
```

**Sheet `karyawan` - Row 1:**
```
nik | idKaryawan | namaKaryawan | divisi | areaKerja | jabatan
```

**Sheet `overtime` - Row 1:**
```
idDoc | tanggalPengajuan | tanggalLembur | areaLembur | divisi | jenisLembur | namaKaryawan | idKaryawan | jabatan | jamMulai | jamSelesai | durasiLembur | nominal | statusDocument | alasanLembur | catatanManager
```

**Sheet `audit_logs` - Row 1:**
```
timestamp | user | action | details
```

---

## ⚙️ Konfigurasi Aplikasi

### Step 1: Login Pertama Kali

1. Di aplikasi, pilih user demo (contoh: **admin1** / **123**)
2. Klik **Masuk Ke Portal**

### Step 2: Buka Settings & Input URL Web App

1. Di menu sidebar, klik **Settings**
2. Pilih tab **Google Sync**
3. Paste URL Web App Google Apps Script di field URL
4. Klik **Simpan URL Web App**
5. Klik **Tarik Data Sheet 🔄**

Tunggu hingga muncul notif "Berhasil sinkronisasi dengan Google Sheet!"

### Step 3: (Opsional) Setup Gemini AI

Jika ingin fitur AI Copilot:

1. Buka [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Klik **Get API Key** → **Create API key in new project**
3. Copy API Key
4. Kembali ke aplikasi
5. Di Settings, pilih tab **Gemini LLM**
6. Paste API Key di field
7. Klik **Simpan API Key Gemini**

---

## 🚀 Pemakaian Aplikasi

### Menu-Menu Utama

#### 1. **Dashboard** 📊
- Tampilan ringkas data lembur
- Filter per bulan/tahun
- Grafik statistik lembur
- Akses langsung ke Google Sheet

#### 2. **Form OT** 📝
- Membuat pengajuan lembur baru
- Isi data karyawan, jam, alasan, dll
- Sistem perhitungan nominal otomatis sesuai peraturan

#### 3. **OT History** 📋
- Lihat riwayat semua pengajuan lembur
- Status: pending, approved, paid, rejected
- Search & filter berdasarkan karyawan, divisi, status

#### 4. **Approval** ✅ (Admin/Manager/HRD)
- Review pengajuan lembur yang pending
- Lihat detail & analisa AI (risk score)
- Setujui / Tolak / Minta Revisi
- Tambah catatan manager

#### 5. **Report** 📊 (Admin/Manager/HRD)
- Export laporan lembur per periode
- Ringkas nominali per divisi
- Data untuk keperluan payroll

#### 6. **Audit Log** 🔍 (Admin/HRD)
- Lihat semua aktivitas user
- Kapan login, logout, perubahan data
- Untuk keperluan compliance & audit

#### 7. **Settings** ⚙️ (Admin)
- Atur URL Google Apps Script
- Manajemen user/akun login
- Manajemen data karyawan
- Setup Gemini API

---

## 👥 Manajemen User & Karyawan

### Menambah User Baru (Admin)

1. Buka **Settings** → **Akses User**
2. Isi form:
   - **Username**: nama unik login (contoh: `staff_1`)
   - **Password**: kata sandi (contoh: `Pwd123!`)
   - **Nama Display**: nama lengkap (contoh: `Budi Santoso (Staff)`)
   - **Divisi**: pilih divisi
   - **Role**: pilih tipe akses
     - `User` = akses Form OT, OT History, AI Copilot
     - `Manager` = + Approval & Report
     - `HRD` = + Audit Log, Settings
     - `Admin` = akses penuh
3. Klik **Simpan Pengguna Baru**

Role akan otomatis diatur menu akses berdasarkan role yang dipilih.

### Menambah Karyawan (Admin)

1. Buka **Settings** → **Karyawan**
2. Isi form:
   - **NIK**: nomor identitas (contoh: `327501230`)
   - **ID Karyawan**: kode internal (contoh: `EMP001`)
   - **Nama Karyawan**: nama lengkap
   - **Divisi**: pilih divisi
   - **Area Kerja**: lokasi kerja
   - **Jabatan**: posisi karyawan
3. Klik **Simpan Karyawan Baru**

### Edit/Hapus User & Karyawan

- Klik tombol **Edit** pada user/karyawan yang ingin diubah
- Edit data sesuai kebutuhan
- Untuk hapus, klik tombol **Hapus** (hati-hati, tidak bisa dibatalkan)

---

## 📦 Deploy ke Production

### Option 1: Deploy ke Vercel (Recommended)

1. Push kode ke GitHub
2. Buka [Vercel](https://vercel.com)
3. Klik **New Project**
4. Pilih repository GitHub Anda
5. Klik **Import**
6. Settings:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
7. Klik **Deploy**

### Option 2: Deploy ke GitHub Pages

```bash
npm run build
npm run deploy
```

URL akan menjadi: `https://bambangjdid-creator.github.io/applikasi-ot/`

### Option 3: Deploy ke Server Sendiri

1. Build aplikasi:
   ```bash
   npm run build
   ```

2. Folder `dist/` berisi file production

3. Upload ke web server (Nginx, Apache, dll)

4. Configure server untuk serve `index.html` pada semua route (SPA)

---

## ⚡ Troubleshooting

### ❌ Error: "Google Apps Script URL belum diatur"

**Solusi:**
- Login sebagai admin
- Buka Settings → Google Sync
- Paste URL Web App Google Apps Script
- Klik Simpan & Tarik Data Sheet

### ❌ Staff tidak bisa login

**Solusi:**
1. Pastikan staff sudah dibuat di Settings → Akses User
2. Pastikan semua browser staff sudah sync URL backend (minimal 1x buka, Settings → Google Sync)
3. Cek username & password tepat sama (password case-sensitive)
4. Buka browser lain/inkognito, coba login ulang

### ❌ Data tidak tersimpan ke Google Sheet

**Solusi:**
1. Cek koneksi internet
2. Buka Dev Tools (F12) → Network, lihat apakah request ke Google Apps Script berhasil (status 200)
3. Pastikan Google Apps Script deploy dengan "Who has access" = "Anyone, even anonymous"
4. Coba refresh & sinkron ulang via Settings → Tarik Data Sheet

### ❌ AI Copilot tidak bekerja

**Solusi:**
- Pastikan sudah paste Gemini API Key di Settings → Gemini LLM
- Cek API Key valid (buka AI Studio, cek key aktif)
- Pastikan quota API Gemini masih tersedia (free tier = 60 request/menit)

### ❌ npm install gagal

**Solusi:**
```bash
# Clear cache npm
npm cache clean --force

# Delete node_modules
rm -r node_modules
rm package-lock.json

# Install ulang
npm install
```

### ❌ Port 5173 sudah dipakai

**Solusi:**
```bash
# Jalankan di port lain
npm run dev -- --port 3000
```

---

## 📞 Support & Kontribusi

- **GitHub**: https://github.com/bambangjdid-creator/applikasi-ot
- **Issues**: Buat issue jika ada bug atau pertanyaan
- **Pull Requests**: Welcome untuk kontribusi

---

## 📄 Catatan Penting

- **Backup Data**: Backup Google Sheet secara berkala
- **Security**: Ganti password default demo user
- **HTTPS**: Gunakan HTTPS saat production
- **Performance**: Untuk >1000 record overtime, pertimbangkan database yang lebih robust

---

**Last Updated:** June 2, 2026

**Versi Aplikasi:** 1.0.0

Selamat menggunakan Overtime Portal! 🎉
