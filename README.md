# 🚀 tobiforceHRMS

**tobiforceHRMS** adalah aplikasi pengelolaan data pegawai (Human Resource Management System) yang ringan, modern, dan efisien. Aplikasi ini menggunakan pendekatan *serverless* dengan memanfaatkan Google Sheets sebagai database dan Google Apps Script sebagai API backend.

---

## ✨ Fitur Utama
* **Manajemen Data Pegawai:** Tambah, lihat, ubah, dan hapus data karyawan secara real-time.
* **UI Modern & Responsif:** Dibangun menggunakan Tailwind CSS untuk tampilan yang bersih di berbagai perangkat.
* **Tanpa Biaya Server:** Menggunakan infrastruktur Google Cloud (Apps Script & Sheets) secara gratis.
* **Integrasi Spreadsheet:** Data tersimpan rapi di Google Sheets, memudahkan pelaporan manual jika diperlukan.

## 🛠️ Tech Stack
* **Frontend:** HTML5, JavaScript (Vanilla ES6)
* **CSS Framework:** [Tailwind CSS](https://tailwindcss.com/)
* **Backend:** [Google Apps Script](https://developers.google.com/apps-script) (`code.gs`)
* **Database:** [Google Sheets](https://www.google.com/sheets/about/)

---

## 🚀 Panduan Instalasi

### 1. Setup Backend (Google Ecosystem)
1. Buat **Google Sheets** baru dan siapkan kolom header (misal: ID, Nama, Jabatan, dll).
2. Klik menu **Extensions** > **Apps Script**.
3. Salin kode dari file `code.gs` proyek ini ke editor Apps Script tersebut.
4. Klik **Deploy** > **New Deployment**.
5. Pilih jenis **Web App**, lalu setel akses ke **Anyone**.
6. Salin **Web App URL** yang muncul.

### 2. Konfigurasi Frontend
1. Clone repositori ini ke komputer Anda:
   ```bash
   git clone [https://github.com/rtegar1/tobiforceHRMS.git](https://github.com/rtegar1/tobiforceHRMS.git)

2. Buka file JavaScript Anda (misal navbar.js) dan cari variabel untuk URL API.

const scriptURL = 'MASUKKAN_URL_WEB_APP_DISINI';

Tempelkan Web App URL yang sudah disalin tadi:

3. Jalankan Aplikasi
Buka file index.html menggunakan browser atau gunakan ekstensi Live Server di VS Code untuk pengalaman pengembangan yang lebih baik
username role admin: admin   | username role staff: najib
password role admin: 1234    | password role staff: 1234

5. Struktur File
--- 
    index.html - Struktur utama aplikasi dan UI.
    navbar.js - Logika frontend dan pemanggilan API.
    code.gs - Script backend untuk memproses data ke Spreadsheet.
    README.md - Dokumentasi proyek.

5. Lisensi
Proyek ini menggunakan lisensi MIT. Anda bebas untuk memodifikasi dan mendistribusikan kembali.

Dikembangkan oleh rtegar1

---

### Cara Update ke GitHub setelah Copas:
Setelah kamu simpan filenya, jalankan ini di terminal agar file README-nya muncul di halaman utama GitHub kamu:

```bash
git add README.md
git commit -m "docs: menambahkan README lengkap"
git push origin main
