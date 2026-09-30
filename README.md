# 🌊 Nusantara OceanWatch
> **Sistem Informasi Cuaca Maritim Terpadu Real-Time & Kecerdasan Buatan Oseanografi**

[![React](https://img.shields.io/badge/React-19.3.0-blue.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3.1-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3.3-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900.svg?logo=leaflet)](https://leafletjs.com/)
[![License](https://img.shields.io/badge/License-Academic_Capstone-sky.svg)](#-informasi-pengembang)

---

## 📌 Ringkasan Proyek

**Nusantara OceanWatch** adalah platform aplikasi web maritim terpadu berbasis *Single Page Application* (SPA) yang dirancang untuk memantau, menganalisis, dan memprediksi dinamika oseanografi perairan kepulauan Indonesia secara *real-time*.

Platform ini mengintegrasikan data satelit hidrometeorologi global (*Open-Meteo Marine & Forecast API*), pemetaan spasial interaktif dengan simulasi pergerakan partikel fluida air laut (*Leaflet + HTML5 Canvas*), serta **4 model Machine Learning** di sisi klien (*Edge Inference*) untuk memberikan rekomendasi keselamatan maritim, efisiensi penangkapan ikan, kelancaran rute penyeberangan feri, dan keamanan pariwisata bahari.

---

## 🎯 4 Persona Mode (Sektor Pengguna)

Aplikasi menyajikan antarmuka dinamis yang disesuaikan secara spesifik untuk 4 kelompok pemangku kepentingan (*stakeholders*):

```
                     ┌── [1] Nelayan (Safety, Swell, Arus, ZPF Hotspots)
                     ├── [2] Transportasi (Feri Ro-Ro, KSOP, Time-Series Forecast)
Nusantara OceanWatch ┼── [3] Peselancar (Groundswell, Wave Period, Beach SurfCam)
                     └── [4] Pariwisata (Rip Current Hazard, Indeks UV & Sunscreen)
```

1. **🎣 Nelayan Tradisional & Modern**
   - **Smart Maritime Safety Classifier:** Klasifikasi kelayakan melaut berbasis AI dengan probabilitas Softmax dinamis dan *Explainable AI (XAI)*.
   - **Radar Zona Potensi Penangkapan Ikan (ZPF):** Pemodelan titik akumulasi ikan pelagis (tongkol, cakalang, tuna) berbasis gradien termal (*SST front*) dan *upwelling*, lengkap dengan koordinat GPS dan rekomendasi alat tangkap.
   - **Navigasi Oseanografi:** Parameter tinggi gelombang signifikan ($H_s$), kecepatan arus, arah gelombang, dan kompas derajat aliran laut.

2. **🚢 Transportasi & Penyeberangan Feri**
   - **Prakiraan Time-Series 24 Jam:** Grafik interaktif prediksi tren gelombang dan angin per jam dengan deteksi *Golden Sailing Hours*.
   - **Status Operasional Jalur Penyeberangan:** Parameter visibilitas jarak pandang navigasi kabut, batas kecepatan angin, dan alun gelombang dermaga (standar ASDP & KSOP).
   - **Checklist Kelaiklautan:** Panduan protokol keselamatan pelayaran kapal feri dan *fastboat*.

3. **🏄 Peselancar (Surfers)**
   - **Analisis Kualitas Swell:** Pembeda groundswell berenergi murni samudera vs wind swell bertumpuk.
   - **Tinggi Dinding Ombak (*Wave Face*):** Konversi ganda metrik meter dan *feet* (kaki) beserta tingkat kesulitan spot (*Beginner, Intermediate, Expert*).
   - **Simulasi SurfCam (CCTV Pantai):** Pratinjau simulasi *live feed* kondisi gulungan ombak multi-sudut kamera (*Break & Lineup*).

4. **🏖️ Pariwisata & Rekreasi Pesisir**
   - **Analisis Bahaya Arus Pecah Pantai (*Rip Current*):** Estimasi fluks energi gelombang berbahaya dan rekomendasi jarak aman berenang dari bibir pantai.
   - **Simulasi AI Coastal Vision Scanner:** Simulator kamera pemantau pantai dengan *bounding box* pendeteksi lorong arus rip aktif, batas pecahan ombak, dan zona aman.
   - **Indeks Radiasi UV & Tabir Surya:** Rekomendasi penggunaan *sunscreen* (SPF 30+/50+) dan tips aktivitas rekreasi pantai (renang, snorkeling, jet ski, berjemur).

5. **📅 Analisis & Prediksi Cuaca 14 Hari (Histori 7 Hari Lalu & Prediksi 7 Hari Depan)**
   - **📱 Universal Horizontal Slide Bar (Lintas Seluruh Sektor):** Komponen *slide bar* interaktif yang tampil secara persisten di seluruh tab sektor (**Nelayan, Transportasi Air, Peselancar, Pariwisata**). Dilengkapi tombol navigasi geser ◀ ▶, filter pill (*Semua 14 Hari, 7 Hari Lalu, 7 Hari Depan*), auto-scroll ke kartu *HARI INI*, dan *drawer insight* cerdas yang beradaptasi otomatis terhadap sektor pengguna (protokol melaut nelayan, jadwal kapal feri ASDP, analisis swell peselancar, atau keamanan renang pantai).
   - **🔮 1 Minggu ke Depan (Prakiraan 7 Hari):** Proyeksi tinggi gelombang maksimum, kecepatan angin, suhu, curah hujan, indeks UV, tren kenaikan/penurunan ombak mingguan, serta rekomendasi *Golden Sailing Day* (hari terbaik melaut).
   - **📜 1 Minggu ke Belakang (Catatan 7 Hari):** Evaluasi data historis cuaca maritim yang telah lewat, rata-rata tinggi gelombang, puncak ombak ekstrem minggu lalu, dan frekuensi hari hujan.
   - **📊 Kurva Kontinu 14 Hari (Interactive SVG Chart):** Grafik dual-metrik gelombang ($H_s$) & angin dengan penanda vertikal titik *Hari Ini* pemisah antara masa lalu dan masa depan.
   - **Kartu Harian Interaktif:** Kartu cuaca harian WMO, suhu min/max, badge status keselamatan laut, dan kompas arah angin/gelombang.

---

## 🧠 Nusantara AI & Data Science Engine

Aplikasi mengimplementasikan 4 arsitektur algoritma Machine Learning yang berjalan secara dinamis dan reaktif (*Event-Driven Edge Inference*):

| No | Model Machine Learning | Algoritma / Metode | Parameter Input | Output Prediksi Real-Time |
|:---:|:---|:---|:---|:---|
| **1** | **24-Hour Wave Forecaster** | ARIMA + Exponential Smoothing | $H_s(t-n)$, Wind Speed, Period | Tren deret waktu 24 jam, titik puncak ombak, dan *Golden Sailing Hours* |
| **2** | **Smart Safety Classifier** | Ensemble Random Forest + Softmax + XAI | $H_s, T_p, V_w, V_c$, Selisih Sudut Arus vs Angin, Visibilitas | Skor komposit risiko, kelas keamanan (*Aman/Waspada/Bahaya*), *Confidence Score* dinamis, & kontribusi fitur (XAI) |
| **3** | **Fishing Zones (ZPF) Engine** | Spatial Convergence & Thermal Front | Suhu Permukaan Laut (SST), Kecepatan & Arah Arus, Koordinat | 3 Titik Hotspot GPS Ikan Pelagis, estimasi kedalaman, dan jenis spesies |
| **4** | **Rip Current Hazard Model** | Hydrodynamic Wave Energy Flux ($H^{1.8} \cdot T^{0.7}$) + YOLOv8 Vision | Tinggi Gelombang, Periode, Fluks Energi Hidrodinamika | Skor risiko arus tarik pantai, probabilitas hisap, dan *safe swimming buffer distance* |

---

## 🗺️ Fitur Visual Peta Interaktif

- **Simulasi Fluida Real-Time (60 FPS):** Menggunakan *HTML5 Canvas API* untuk menganimasikan partikel cairan arus air laut dan rambatan puncak ombak (*wave swells*) yang bergerak proporsional terhadap kecepatan dan arah kompas API.
- **Pilihan Peta Dasar (*Tile Layers*):** Bebas beralih antara *OpenStreetMap*, *Citra Satelit Dunia Esri*, dan *Carto Voyager*.
- **Pencegahan Ketiadaan Data (*Smart Land Guard*):** Otomatis mendeteksi jika koordinat berada di daratan, menampilkan kartu panduan, dan menyediakan tombol *quick-jump* ke titik laut terdekat.
- **Preset Hotspot Perairan Nasional:** Pilihan langsung ke jalur penyeberangan Selat Sunda, Teluk Jakarta, Selat Bali, Labuan Bajo, Raja Ampat, Pantai Parangtritis, dan Bunaken.

---

## 🛠️ Tumpukan Teknologi (Tech Stack)

- **Frontend Core:** [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/) (Modern Single Page Application)
- **Styling & Design System:** [Tailwind CSS v4](https://tailwindcss.com/) (Responsive Glassmorphism & Micro-animations)
- **Mesin Geospasial:** [Leaflet.js v1.9](https://leafletjs.com/) (Peta interaktif Open Source tanpa API Key berbayar)
- **Simulasi Grafis:** HTML5 Canvas Rendering Engine (Visualisasi pergerakan partikel arus dan ombak)
- **Ikonografi:** [Lucide React](https://lucide.dev/)
- **Penyedia Data Oseanografi & Cuaca:** [Open-Meteo Marine & Forecast API](https://open-meteo.com/) (100% Free & Open-Access Data)
- **Geocoding & Pencarian:** Open-Meteo Geocoding API

---

## 📂 Struktur Direktori Proyek

```plaintext
nusantara-oceanwatch/
├── index.html              # Template HTML utama & Leaflet Preload
├── package.json            # Konfigurasi dependensi & skrip npm
├── vite.config.js          # Konfigurasi Vite & plugin Tailwind CSS
├── public/                 # Aset statis aplikasi
└── src/
    ├── main.jsx            # Entry point aplikasi React & Error Boundary
    ├── index.css           # Konfigurasi Tailwind CSS v4 & custom animasi ombak
    ├── ErrorBoundary.jsx   # Komponen penanganan error runtime
    └── App.jsx             # Logika utama SPA, Mesin AI/ML, Peta Leaflet, & Tab Persona
```

---

## 🚀 Panduan Memulai (Getting Started)

### Prasyarat
Pastikan komputer Anda telah terinstal:
- [Node.js](https://nodejs.org/) (Versi 18.x atau lebih baru disarankan)
- Package Manager: `npm` atau `yarn` / `pnpm`

### Langkah Instalasi

1. **Buka Terminal / PowerShell** pada direktori proyek:
   ```bash
   cd "d:/Capstone Project/Antigravity"
   ```

2. **Instal seluruh dependensi proyek:**
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan lokal (Dev Server):**
   ```bash
   npm run dev
   ```

4. Buka peramban Anda di alamat:
   ```plaintext
   http://localhost:5173
   ```

### Membangun Versi Produksi (Production Build)

Untuk mengompilasi dan mengoptimasi aplikasi menjadi aset statis siap rilis:
```bash
npm run build
```
Hasil kompilasi siap saji akan berada di direktori `dist/`. Anda dapat menguji pratinjau produksi dengan perintah:
```bash
npm run preview
```

---

## 👤 Informasi Pengembang

- **Nama Proyek:** Nusantara OceanWatch (Capstone Project)
- **Author / Pengembang:** Muhammad Thariq Alwan Hafizh
- **NIM:** 41522110056
- **Peran:** Lead Developer & Maritime Data Scientist
- **Hak Cipta:** &copy; 2026 Nusantara OceanWatch — Inovasi Maritim Digital Indonesia
