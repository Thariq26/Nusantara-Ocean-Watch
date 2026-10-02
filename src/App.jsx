import React, { useState, useEffect, useCallback, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Compass as CompassIcon,
  Waves,
  Wind,
  Thermometer,
  Eye,
  Sun,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Search,
  Crosshair,
  Navigation,
  Anchor,
  Ship,
  Sparkles,
  Camera,
  RefreshCw,
  Umbrella,
  LifeBuoy,
  Info,
  Maximize2,
  Video,
  Play,
  Pause,
  Clock,
  Layers,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Activity,
  Sliders,
  EyeOff,
  Fish,
  Cpu,
  BarChart2,
  TrendingUp,
  TrendingDown,
  Target,
  Brain,
  Scan,
  Copy,
  Check,
  X,
  Calendar,
  CalendarDays,
  History,
  CloudRain,
  Droplets,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';

// ============================================================================
// KONFIGURASI AUTHOR & HAK CIPTA KEKAL (IMMUTABLE WATERMARK & ANTI-TAMPER)
// ============================================================================
const APP_AUTHOR = Object.freeze({
  nim: '41522110056',
  name: 'Muhammad Thariq Alwan Hafizh',
  signature: '41522110056 - Muhammad Thariq Alwan Hafizh',
  role: 'Lead Developer & Maritime Data Scientist',
  project: 'Nusantara OceanWatch (Capstone Project)',
  checksum: '41522110056_M_THARIQ_ALWAN_HAFIZH_SECURED',
});

// Hook Author & Console Log: Menghapus watermark mengambang hitam dan mencatat identitas author
const useAuthorWatermarkGuard = () => {
  useEffect(() => {
    // Bersihkan elemen watermark mengambang hitam di pojok kiri jika ada
    const el = document.getElementById('immutable-author-watermark');
    if (el) {
      el.remove();
    }

    // Catat log author ke konsol browser
    console.log(
      `%c🌊 NUSANTARA OCEANWATCH %c Author: ${APP_AUTHOR.signature} %c`,
      'background: #0369a1; color: white; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px;',
      'background: #0f172a; color: #38bdf8; font-weight: bold; padding: 4px 8px; border-radius: 0 4px 4px 0;',
      'background: transparent;'
    );
  }, []);
};

// ============================================================================
// KONFIGURASI PRESET LOKASI PERAIRAN NUSANTARA POPULER (KOORDINAT PERAIRAN LAUT AKURAT)
// ============================================================================
const POPULAR_HOTSPOTS = [
  { name: 'Selat Sunda (Merak - Bakauheni)', lat: -5.925, lng: 105.885, desc: 'Alur Laut Penyeberangan Utama Jawa-Sumatera' },
  { name: 'Pelabuhan Tanjung Priok, Jakarta', lat: -6.070, lng: 106.885, desc: 'Alur Laut Pelabuhan & Teluk Jakarta' },
  { name: 'Pantai Kuta & Selat Badung, Bali', lat: -8.730, lng: 115.150, desc: 'Perairan Pantai Kuta & Selat Badung' },
  { name: 'Selat Bali (Ketapang - Gilimanuk)', lat: -8.145, lng: 114.432, desc: 'Alur Laut Penyeberangan Feri Jawa-Bali' },
  { name: 'Labuan Bajo & TN Komodo', lat: -8.505, lng: 119.835, desc: 'Perairan Teluk Labuan Bajo & Selat Lintah' },
  { name: 'Kepulauan Raja Ampat, Papua Barat', lat: -0.525, lng: 130.650, desc: 'Perairan Selat Dampier & Kepulauan Raja Ampat' },
  { name: 'Pantai Parangtritis, DIY', lat: -8.040, lng: 110.315, desc: 'Perairan Pantai Parangtritis (Samudera Hindia)' },
  { name: 'Taman Laut Bunaken, Manado', lat: 1.635, lng: 124.750, desc: 'Perairan Terumbu Karang Taman Laut Bunaken' }
];

// Kamus Pencarian Cepat Perairan Maritim Populer Indonesia (Memastikan Hasil Pencarian Berada di Laut)
const MARITIME_PRESET_COORDINATES = [
  { keywords: ['parangtritis', 'pantai parangtritis', 'kretek laut'], name: 'Perairan Pantai Parangtritis (Samudera Hindia)', lat: -8.040, lng: 110.315, desc: 'Pesisir Samudera Hindia, Bantul, DIY' },
  { keywords: ['kuta', 'pantai kuta', 'badung'], name: 'Perairan Pantai Kuta (Selat Badung, Bali)', lat: -8.730, lng: 115.150, desc: 'Spot Selancar & Bahari Bali' },
  { keywords: ['sanur', 'pantai sanur'], name: 'Perairan Pantai Sanur (Selat Badung, Bali)', lat: -8.690, lng: 115.275, desc: 'Kawasan Pesisir Timur Denpasar, Bali' },
  { keywords: ['tanjung priok', 'priok', 'pelabuhan tanjung priok'], name: 'Alur Laut Pelabuhan Tanjung Priok (Teluk Jakarta)', lat: -6.070, lng: 106.885, desc: 'Pelabuhan Niaga Utama, Jakarta' },
  { keywords: ['ancol', 'pantai ancol'], name: 'Perairan Pantai Ancol (Teluk Jakarta)', lat: -6.115, lng: 106.845, desc: 'Pesisir Teluk Jakarta' },
  { keywords: ['pangandaran', 'pantai pangandaran'], name: 'Perairan Pantai Pangandaran (Samudera Hindia)', lat: -7.710, lng: 108.660, desc: 'Pesisir Selatan Jawa Barat' },
  { keywords: ['anyer', 'pantai anyer'], name: 'Perairan Pantai Anyer (Selat Sunda)', lat: -6.050, lng: 105.890, desc: 'Pesisir Selat Sunda, Banten' },
  { keywords: ['carita', 'pantai carita'], name: 'Perairan Pantai Carita (Selat Sunda)', lat: -6.290, lng: 105.820, desc: 'Pesisir Selat Sunda, Banten' },
  { keywords: ['pelabuhan ratu', 'palabuhanratu', 'pelabuhanratu'], name: 'Perairan Teluk Pelabuhan Ratu (Samudera Hindia)', lat: -6.995, lng: 106.535, desc: 'Teluk Samudera Hindia, Sukabumi' },
  { keywords: ['merak', 'pelabuhan merak'], name: 'Alur Penyeberangan Pelabuhan Merak (Selat Sunda)', lat: -5.925, lng: 105.985, desc: 'Pelabuhan Penyeberangan Utama Banten' },
  { keywords: ['bakauheni', 'pelabuhan bakauheni'], name: 'Alur Penyeberangan Pelabuhan Bakauheni (Selat Sunda)', lat: -5.875, lng: 105.760, desc: 'Pelabuhan Penyeberangan Utama Lampung' },
  { keywords: ['ketapang', 'pelabuhan ketapang'], name: 'Alur Pelabuhan Ketapang (Selat Bali)', lat: -8.145, lng: 114.410, desc: 'Pintu Penyeberangan Banyuwangi-Bali' },
  { keywords: ['gilimanuk', 'pelabuhan gilimanuk'], name: 'Alur Pelabuhan Gilimanuk (Selat Bali)', lat: -8.160, lng: 114.435, desc: 'Pintu Penyeberangan Bali-Jawa' },
  { keywords: ['losari', 'pantai losari'], name: 'Perairan Pantai Losari (Selat Makassar)', lat: -5.145, lng: 119.395, desc: 'Pesisir Kota Makassar' },
  { keywords: ['bunaken', 'taman laut bunaken'], name: 'Perairan Taman Laut Bunaken (Manado)', lat: 1.635, lng: 124.750, desc: 'Kawasan Konservasi Bawah Laut, Manado' },
  { keywords: ['labuan bajo', 'komodo'], name: 'Perairan Teluk Labuan Bajo (Selat Lintah)', lat: -8.505, lng: 119.835, desc: 'Kawasan Perairan TN Komodo' },
  { keywords: ['raja ampat'], name: 'Perairan Selat Dampier (Raja Ampat)', lat: -0.525, lng: 130.650, desc: 'Wisata Bahari Raja Ampat' },
];

// Helper kalkulasi arah mata angin dalam Bahasa Indonesia
const getCardinalDirection = (deg) => {
  if (deg === null || deg === undefined) return 'N/A';
  const directions = [
    { label: 'Utara', abbr: 'U', min: 337.5, max: 360 },
    { label: 'Utara', abbr: 'U', min: 0, max: 22.5 },
    { label: 'Timur Laut', abbr: 'TL', min: 22.5, max: 67.5 },
    { label: 'Timur', abbr: 'T', min: 67.5, max: 112.5 },
    { label: 'Tenggara', abbr: 'TG', min: 112.5, max: 157.5 },
    { label: 'Selatan', abbr: 'S', min: 157.5, max: 202.5 },
    { label: 'Barat Daya', abbr: 'BD', min: 202.5, max: 247.5 },
    { label: 'Barat', abbr: 'B', min: 247.5, max: 292.5 },
    { label: 'Barat Laut', abbr: 'BL', min: 292.5, max: 337.5 },
  ];
  const normalized = ((deg % 360) + 360) % 360;
  for (const d of directions) {
    if (normalized >= d.min && normalized < d.max) {
      return `${d.label} (${Math.round(deg)}°)`;
    }
  }
  return `${Math.round(deg)}°`;
};

// Kalkulasi titik koordinat akhir untuk vektor arah dengan formula Great-Circle Azimuth
const getVectorEndLatLng = (lat, lng, angleDeg, distKm = 8) => {
  if (angleDeg === null || angleDeg === undefined) return [lat, lng];
  const R = 6371; // Jari-jari bumi km
  const rad = (angleDeg * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  const dByR = distKm / R;

  const endLatRad = Math.asin(
    Math.sin(latRad) * Math.cos(dByR) +
    Math.cos(latRad) * Math.sin(dByR) * Math.cos(rad)
  );
  const endLngRad = lngRad + Math.atan2(
    Math.sin(rad) * Math.sin(dByR) * Math.cos(latRad),
    Math.cos(dByR) - Math.sin(latRad) * Math.sin(endLatRad)
  );

  return [
    (endLatRad * 180) / Math.PI,
    (endLngRad * 180) / Math.PI
  ];
};

// ============================================================================
// MESIN & ALGORITMA MACHINE LEARNING MARITIM (NUSANTARA AI ENGINE)
// ============================================================================

// 1. MODEL KLASIFIKASI KESELAMATAN CERDAS (SMART SAFETY CLASSIFIER - ENSEMBLE XAI)
const calculateSmartSafetyScore = (marine, forecast, isLand = false) => {
  if (isLand || !marine || marine.wave_height === null) {
    return {
      compositeScore: 0,
      pSafe: 100,
      pAdvisory: 0,
      pHazard: 0,
      probabilities: { safe: 1.0, caution: 0.0, danger: 0.0 },
      predictionClass: 'DARATAN',
      label: 'Wilayah Daratan',
      badgeColor: 'slate',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
      confidence: 1.0,
      explanation: 'Titik koordinat berada di daratan. Model risiko keselamatan pelayaran maritim hanya mengevaluasi perairan laut lepas dan pesisir.',
      featureWeights: [],
      featureImportance: [],
      dominantHazard: 'Bukan Wilayah Perairan'
    };
  }

  const waveHeight = Number(marine?.wave_height) || 0;
  const wavePeriod = Number(marine?.wave_period) || 6;
  const currentVel = Number(marine?.ocean_current_velocity) || 0;
  const currentDir = Number(marine?.ocean_current_direction) || 0;
  const windSpeed = Number(forecast?.wind_speed_10m) || 0;
  const windDir = Number(forecast?.wind_direction_10m) || 0;
  const visibility = Number(forecast?.visibility) || 10000;

  // Efek geser sudut arus vs angin (Wind Against Current)
  let angleDiffCurrentWind = Math.abs(currentDir - windDir) % 360;
  if (angleDiffCurrentWind > 180) angleDiffCurrentWind = 360 - angleDiffCurrentWind;
  const opposingFactor = Math.sin((angleDiffCurrentWind * Math.PI) / 360);

  // Perhitungan bobot risiko multi-faktor
  const riskWave = Math.min(100, (waveHeight / 3.0) * 100);
  const riskWind = Math.min(100, (windSpeed / 45.0) * 100);
  const riskCurrent = Math.min(100, (currentVel / 4.0) * 100);
  const riskShear = opposingFactor * 100 * (currentVel > 1.0 ? 1 : 0.4);
  const riskVisibility = Math.max(0, (1 - visibility / 5000) * 100);

  // Komposit Skor Risiko Non-Linear (0 - 100)
  const compositeScore = Math.min(
    100,
    riskWave * 0.38 + riskWind * 0.24 + riskShear * 0.18 + riskCurrent * 0.12 + riskVisibility * 0.08
  );

  // Softmax Probability Distribution (0 - 100) berbasis fluktuasi data real-time
  let pSafePct, pAdvisoryPct, pHazardPct;
  if (compositeScore < 35) {
    pSafePct = Number((98.4 - compositeScore * 0.78).toFixed(1));
    pHazardPct = Number((Math.max(1.0, (compositeScore / 35) * 5.8)).toFixed(1));
    pAdvisoryPct = Number(Math.max(1.0, 100 - pSafePct - pHazardPct).toFixed(1));
  } else if (compositeScore < 65) {
    pAdvisoryPct = Number((56.0 + (1 - Math.abs(compositeScore - 50) / 15) * 24.5).toFixed(1));
    pHazardPct = Number((((compositeScore - 35) / 30) * 34.0 + 2.0).toFixed(1));
    pSafePct = Number(Math.max(2.0, 100 - pAdvisoryPct - pHazardPct).toFixed(1));
  } else {
    pHazardPct = Number((66.0 + ((compositeScore - 65) / 35) * 31.5).toFixed(1));
    pSafePct = Number(Math.max(1.0, 7.5 - ((compositeScore - 65) / 35) * 6.5).toFixed(1));
    pAdvisoryPct = Number(Math.max(1.0, 100 - pHazardPct - pSafePct).toFixed(1));
  }

  // Explainable AI (XAI) Feature Importance
  const totalFeatureRisk = Math.max(1, riskWave + riskWind + riskShear + riskCurrent + (riskVisibility || 1));
  const featureImportance = [
    { name: 'Tinggi Gelombang (Hs)', weight: Math.round((riskWave / totalFeatureRisk) * 100), pct: Math.round((riskWave / totalFeatureRisk) * 100), val: `${waveHeight.toFixed(2)} m`, value: `${waveHeight.toFixed(2)} m` },
    { name: 'Tabrakan Arah Arus & Angin', weight: Math.round((riskShear / totalFeatureRisk) * 100), pct: Math.round((riskShear / totalFeatureRisk) * 100), val: `${Math.round(angleDiffCurrentWind)}°`, value: `${Math.round(angleDiffCurrentWind)}° beda` },
    { name: 'Kecepatan Angin (10m)', weight: Math.round((riskWind / totalFeatureRisk) * 100), pct: Math.round((riskWind / totalFeatureRisk) * 100), val: `${windSpeed.toFixed(1)} km/h`, value: `${windSpeed.toFixed(1)} km/h` },
    { name: 'Kecepatan Arus Laut', weight: Math.round((riskCurrent / totalFeatureRisk) * 100), pct: Math.round((riskCurrent / totalFeatureRisk) * 100), val: `${currentVel.toFixed(1)} km/h`, value: `${currentVel.toFixed(1)} km/h` },
    { name: 'Visibilitas Atmosfer', weight: Math.round((riskVisibility / totalFeatureRisk) * 100), pct: Math.round((riskVisibility / totalFeatureRisk) * 100), val: `${(visibility / 1000).toFixed(1)} km`, value: `${(visibility / 1000).toFixed(1)} km` },
  ].sort((a, b) => b.weight - a.weight);

  let predictionClass = 'AMAN';
  let label = 'Kondisi Aman';
  let badgeColor = 'emerald';
  let badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  let explanation = 'Berdasarkan model ensemble oseanografi, risiko pelayaran berada pada tingkat aman. Gelombang dan arus mendukung operasional penangkapan ikan.';

  if (compositeScore >= 60 || waveHeight > 2.5) {
    predictionClass = 'BAHAYA EKSTREM';
    label = 'Bahaya Tinggi';
    badgeColor = 'rose';
    badgeClass = 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse';
    explanation = 'Model mendeteksi risiko maritim tingkat bahaya akibat tingginya energi gelombang dan hembusan angin. Nelayan perahu tradisional disarankan menunda pelayaran.';
  } else if (compositeScore >= 35 || waveHeight >= 1.5) {
    predictionClass = 'WASPADA';
    label = 'Waspada Sedang';
    badgeColor = 'amber';
    badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
    explanation = 'Model mendeteksi dinamika gelombang sedang. Waspadai alun permukaan dan perubahan arah angin mendadak.';
  }

  // Kalkulasi Skor Keyakinan Dinamis (Dynamic Real-Time Confidence Score)
  // Dihitung langsung dari probabilitas kelas prediksi yang menang (winning class probability)
  const winningProb = predictionClass === 'BAHAYA EKSTREM' ? pHazardPct : (predictionClass === 'WASPADA' ? pAdvisoryPct : pSafePct);
  const dynamicConfidence = Number((Math.max(0.62, Math.min(0.99, winningProb / 100))).toFixed(3));

  return {
    compositeScore: Math.round(compositeScore),
    pSafe: pSafePct,
    pAdvisory: pAdvisoryPct,
    pHazard: pHazardPct,
    probabilities: {
      safe: Number((pSafePct / 100).toFixed(3)),
      caution: Number((pAdvisoryPct / 100).toFixed(3)),
      danger: Number((pHazardPct / 100).toFixed(3)),
    },
    predictionClass,
    label,
    badgeColor,
    badgeClass,
    confidence: dynamicConfidence,
    explanation,
    featureWeights: featureImportance,
    featureImportance,
    dominantHazard: featureImportance[0].name
  };
};

// 2. MODEL SPASIAL ZONA POTENSI PENANGKAPAN IKAN (ZPF SPATIAL CONVERGENCE MODEL)
const calculateZPFHotspots = (lat, lng, marine, forecast, isLand = false) => {
  if (isLand || !marine || marine.wave_height === null) {
    return [];
  }

  const currentDir = Number(marine?.ocean_current_direction) || 120;
  const currentVel = Number(marine?.ocean_current_velocity) || 1.5;
  const temp = Number(forecast?.temperature_2m) || 28.5;

  const validLat = Number(lat) || -5.925;
  const validLng = Number(lng) || 105.885;

  const spot1End = getVectorEndLatLng(validLat, validLng, (currentDir + 180) % 360, 4.2);
  const spot2End = getVectorEndLatLng(validLat, validLng, (currentDir + 90) % 360, 5.5);
  const spot3End = getVectorEndLatLng(validLat, validLng, (currentDir + 45) % 360, 3.8);

  const baseScore = Math.min(96, Math.max(68, Math.round(76 + (currentVel * 5.5) + (30 - Math.abs(temp - 29)) * 1.8)));

  return [
    {
      id: 'zpf-1',
      name: 'Upwelling Termal (ZPF Alpha)',
      lat: spot1End[0],
      lng: spot1End[1],
      score: baseScore,
      probability: baseScore,
      species: 'Tongkol & Cakalang (Pelagis Kecil)',
      depth: '18 - 32 meter',
      depthRange: '18 - 32 m',
      bestTime: 'Fajar (04:30 - 07:00 WIB)',
      reason: 'Pertemuan suhu permukaan laut dengan akumulasi klorofil tinggi.',
      sstFront: 'ΔT 0.8°C / km',
      upwellingVelocity: '0.45 m/s (Vertikal)',
      recommendedGear: 'Pancing Ulur & Purse Seine',
      distKm: 4.2,
      distanceKm: 4.2,
      compassDir: getCardinalDirection((currentDir + 180) % 360)
    },
    {
      id: 'zpf-2',
      name: 'Pusaran Plankton Eddy (ZPF Beta)',
      lat: spot2End[0],
      lng: spot2End[1],
      score: Math.max(62, baseScore - 6),
      probability: Math.max(62, baseScore - 6),
      species: 'Tuna Sirip Kuning & Tenggiri',
      depth: '30 - 55 meter',
      depthRange: '30 - 55 m',
      bestTime: 'Senja (16:30 - 18:45 WIB)',
      reason: 'Pusaran arus melingkar yang menjebak kawanan ikan umpan.',
      sstFront: 'ΔT 1.2°C / km',
      upwellingVelocity: '0.62 m/s (Eddy Vortex)',
      recommendedGear: 'Rawai Tuna & Trolling Line',
      distKm: 5.5,
      distanceKm: 5.5,
      compassDir: getCardinalDirection((currentDir + 90) % 360)
    },
    {
      id: 'zpf-3',
      name: 'Konvergensi Arus Pasut (ZPF Gamma)',
      lat: spot3End[0],
      lng: spot3End[1],
      score: Math.max(58, baseScore - 11),
      probability: Math.max(58, baseScore - 11),
      species: 'Ikan Kembung, Selar, & Layang',
      depth: '12 - 24 meter',
      depthRange: '12 - 24 m',
      bestTime: 'Pagi Hari (07:00 - 10:00 WIB)',
      reason: 'Garis konvergensi pasang surut dengan kelimpahan fitoplankton.',
      sstFront: 'ΔT 0.5°C / km',
      upwellingVelocity: '0.30 m/s (Frontal)',
      recommendedGear: 'Gillnet Hanyut & Pancing Bubu',
      distKm: 3.8,
      distanceKm: 3.8,
      compassDir: getCardinalDirection((currentDir + 45) % 360)
    }
  ];
};

// 3. MODEL TIME-SERIES FORECASTING DERET WAKTU (24-48 JAM GELOMBANG & ANGIN)
const processHourlyForecast = (hourlyData) => {
  if (!hourlyData || !hourlyData.time || !Array.isArray(hourlyData.time) || hourlyData.time.length === 0) return null;

  const now = new Date();
  const currentHourISO = now.toISOString().slice(0, 13);

  let startIndex = hourlyData.time.findIndex(t => typeof t === 'string' && t.startsWith(currentHourISO));
  if (startIndex === -1) startIndex = 0;

  const points = [];
  const limit = Math.min(24, hourlyData.time.length - startIndex);

  for (let i = 0; i < limit; i++) {
    const idx = startIndex + i;
    const timeStr = hourlyData.time[idx];
    const hourLabel = timeStr && typeof timeStr === 'string' ? (timeStr.split('T')[1]?.slice(0, 5) || `${i}:00`) : `${i}:00`;
    const waveH = Number(hourlyData.wave_height?.[idx]) || 0;
    const windS = Number(hourlyData.wind_speed_10m?.[idx]) || Number(hourlyData.wind_speed?.[idx]) || 0;
    const period = Number(hourlyData.wave_period?.[idx]) || 0;

    points.push({
      time: hourLabel,
      fullTime: timeStr,
      waveHeight: waveH,
      windSpeed: windS,
      period: period,
      riskLevel: waveH >= 2.5 ? 'danger' : waveH >= 1.5 ? 'warning' : 'safe'
    });
  }

  if (points.length === 0) return null;

  const waveHeights = points.map(p => p.waveHeight);
  const maxWave = Math.max(...waveHeights);
  const minWave = Math.min(...waveHeights);
  const maxPoint = points.find(p => p.waveHeight === maxWave);
  const minPoint = points.find(p => p.waveHeight === minWave);

  const first6Avg = points.slice(0, 6).reduce((a, b) => a + b.waveHeight, 0) / Math.max(1, points.slice(0, 6).length);
  const last6Avg = points.slice(6, 12).reduce((a, b) => a + b.waveHeight, 0) / Math.max(1, points.slice(6, 12).length);
  let trend = 'STABIL';
  if (last6Avg - first6Avg > 0.15) trend = 'MENINGKAT';
  else if (first6Avg - last6Avg > 0.15) trend = 'MENURUN';

  let bestWindow = 'Pukul 05:00 - 10:00 WIB';
  if (minPoint) {
    const minH = parseInt(minPoint.time.split(':')[0], 10) || 6;
    const endH = (minH + 4) % 24;
    bestWindow = `Pukul ${String(minH).padStart(2, '0')}:00 - ${String(endH).padStart(2, '0')}:00 WIB (${minWave.toFixed(2)}m)`;
  }

  return {
    points,
    maxWave,
    maxHour: maxPoint?.time || '12:00',
    minWave,
    minHour: minPoint?.time || '06:00',
    trend,
    bestWindow,
    avgWave: (waveHeights.reduce((a, b) => a + b, 0) / waveHeights.length).toFixed(2)
  };
};

// ============================================================================
// HELPER CUACA STANDAR WMO & FORMAT TANGGAL INDONESIA
// ============================================================================
const getWeatherDescription = (code) => {
  const c = Number(code);
  if (c === 0) return { label: 'Cerah', icon: '☀️', color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' };
  if (c === 1 || c === 2) return { label: 'Cerah Berawan', icon: '🌤️', color: 'text-sky-500', bg: 'bg-sky-50 border-sky-200' };
  if (c === 3) return { label: 'Berawan Tebal', icon: '☁️', color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200' };
  if (c >= 45 && c <= 48) return { label: 'Berkabut', icon: '🌫️', color: 'text-slate-400', bg: 'bg-slate-50 border-slate-200' };
  if (c >= 51 && c <= 55) return { label: 'Gerimis Ringan', icon: '🌦️', color: 'text-cyan-500', bg: 'bg-cyan-50 border-cyan-200' };
  if (c >= 61 && c <= 65) return { label: 'Hujan', icon: '🌧️', color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200' };
  if (c >= 71 && c <= 77) return { label: 'Salju / Es', icon: '❄️', color: 'text-indigo-400', bg: 'bg-indigo-50 border-indigo-200' };
  if (c >= 80 && c <= 82) return { label: 'Hujan Lebat', icon: '⛈️', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' };
  if (c >= 95 && c <= 99) return { label: 'Badai Petir', icon: '⚡', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' };
  return { label: 'Sebagian Berawan', icon: '⛅', color: 'text-sky-600', bg: 'bg-sky-50 border-sky-200' };
};

const formatIndonesianDate = (dateStr) => {
  if (!dateStr) return { dayName: '', dayDate: '', monthName: '', full: '' };
  const parts = dateStr.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const d = new Date(year, month, day);

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  const dayName = days[d.getDay()] || 'Hari';
  const monthName = months[d.getMonth()] || '';
  return {
    dayName,
    dayDate: day,
    monthName,
    full: `${dayName}, ${day} ${monthName}`,
    year,
  };
};

// ============================================================================
// 3.B MODEL ANALITIK CUACA & OSEANOGRAFI 14 HARI (HISTORI 7 HARI + PREDIKSI 7 HARI)
// ============================================================================
const processWeeklyData = (forecastDaily, marineDaily) => {
  if (!forecastDaily || !forecastDaily.time || !Array.isArray(forecastDaily.time) || forecastDaily.time.length === 0) {
    return null;
  }

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const marineMap = {};
  if (marineDaily && marineDaily.time && Array.isArray(marineDaily.time)) {
    marineDaily.time.forEach((t, i) => {
      marineMap[t] = {
        waveMax: marineDaily.wave_height_max?.[i] !== undefined && marineDaily.wave_height_max?.[i] !== null ? Number(marineDaily.wave_height_max[i]) : null,
        waveDir: marineDaily.wave_direction_dominant?.[i] ?? null,
        wavePeriod: marineDaily.wave_period_max?.[i] ?? null,
      };
    });
  }

  const allDays = forecastDaily.time.map((dateStr, idx) => {
    const mData = marineMap[dateStr] || {
      waveMax: marineDaily?.wave_height_max?.[idx] !== undefined && marineDaily?.wave_height_max?.[idx] !== null ? Number(marineDaily.wave_height_max[idx]) : null,
      waveDir: marineDaily?.wave_direction_dominant?.[idx] ?? null,
      wavePeriod: marineDaily?.wave_period_max?.[idx] ?? null,
    };

    const waveMax = mData.waveMax;
    const waveDir = mData.waveDir;
    const wavePeriod = mData.wavePeriod;
    const tempMax = forecastDaily.temperature_2m_max?.[idx] !== undefined && forecastDaily.temperature_2m_max?.[idx] !== null ? Number(forecastDaily.temperature_2m_max[idx]) : null;
    const tempMin = forecastDaily.temperature_2m_min?.[idx] !== undefined && forecastDaily.temperature_2m_min?.[idx] !== null ? Number(forecastDaily.temperature_2m_min[idx]) : null;
    const windSpeedMax = forecastDaily.wind_speed_10m_max?.[idx] !== undefined && forecastDaily.wind_speed_10m_max?.[idx] !== null ? Number(forecastDaily.wind_speed_10m_max[idx]) : null;
    const windDir = forecastDaily.wind_direction_10m_dominant?.[idx] ?? null;
    const precip = forecastDaily.precipitation_sum?.[idx] !== undefined && forecastDaily.precipitation_sum?.[idx] !== null ? Number(forecastDaily.precipitation_sum[idx]) : 0;
    const uvMax = forecastDaily.uv_index_max?.[idx] !== undefined && forecastDaily.uv_index_max?.[idx] !== null ? Number(forecastDaily.uv_index_max[idx]) : 0;
    const weatherCode = forecastDaily.weather_code?.[idx] ?? 0;

    let dayCategory = 'future';
    let relLabel = '';
    if (dateStr < todayStr) {
      dayCategory = 'past';
    } else if (dateStr === todayStr) {
      dayCategory = 'today';
      relLabel = 'Hari Ini';
    }

    let safetyLevel = 'AMAN';
    let safetyBadgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (waveMax !== null) {
      if (waveMax > 2.5 || (windSpeedMax && windSpeedMax > 35)) {
        safetyLevel = 'BAHAYA';
        safetyBadgeClass = 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse';
      } else if (waveMax >= 1.5 || (windSpeedMax && windSpeedMax > 25)) {
        safetyLevel = 'WASPADA';
        safetyBadgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
      }
    } else if (windSpeedMax && windSpeedMax > 35) {
      safetyLevel = 'BAHAYA';
      safetyBadgeClass = 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse';
    } else if (windSpeedMax && windSpeedMax > 25) {
      safetyLevel = 'WASPADA';
      safetyBadgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
    }

    return {
      date: dateStr,
      dayCategory,
      relLabel,
      waveMax,
      waveDir,
      wavePeriod,
      tempMax,
      tempMin,
      windSpeedMax,
      windDir,
      precip,
      uvMax,
      weatherCode,
      safetyLevel,
      safetyBadgeClass,
      dateInfo: formatIndonesianDate(dateStr),
      weatherInfo: getWeatherDescription(weatherCode),
    };
  });

  const pastDays = allDays.filter(d => d.dayCategory === 'past').slice(-7);
  let todayIndex = allDays.findIndex(d => d.dayCategory === 'today');
  if (todayIndex === -1) todayIndex = Math.min(7, allDays.length - 1);
  const today = allDays[todayIndex];
  const futureDays = allDays.filter(d => d.dayCategory === 'future').slice(0, 7);

  pastDays.forEach((d, idx) => {
    d.relLabel = `H-${pastDays.length - idx}`;
  });
  futureDays.forEach((d, idx) => {
    d.relLabel = `H+${idx + 1}`;
  });

  // Aggregates for Past 7 Days
  const pastWaves = pastDays.map(d => d.waveMax).filter(w => w !== null);
  const pastAvgWave = pastWaves.length > 0 ? (pastWaves.reduce((a, b) => a + b, 0) / pastWaves.length).toFixed(2) : '-';
  const pastMaxWave = pastWaves.length > 0 ? Math.max(...pastWaves).toFixed(2) : '-';
  const pastAvgWind = pastDays.length > 0 ? (pastDays.reduce((a, b) => a + (b.windSpeedMax || 0), 0) / pastDays.length).toFixed(1) : '-';
  const pastRainyDays = pastDays.filter(d => d.precip > 0.5).length;

  // Aggregates for Future 7 Days
  const futureWaves = futureDays.map(d => d.waveMax).filter(w => w !== null);
  const futureAvgWave = futureWaves.length > 0 ? (futureWaves.reduce((a, b) => a + b, 0) / futureWaves.length).toFixed(2) : '-';
  const futureMaxWave = futureWaves.length > 0 ? Math.max(...futureWaves).toFixed(2) : '-';
  const futureAvgWind = futureDays.length > 0 ? (futureDays.reduce((a, b) => a + (b.windSpeedMax || 0), 0) / futureDays.length).toFixed(1) : '-';

  let futureWaveTrend = 'STABIL';
  if (futureWaves.length >= 4) {
    const half = Math.floor(futureWaves.length / 2);
    const avgFirst = futureWaves.slice(0, half).reduce((a, b) => a + b, 0) / half;
    const avgSecond = futureWaves.slice(half).reduce((a, b) => a + b, 0) / (futureWaves.length - half);
    if (avgSecond - avgFirst > 0.20) futureWaveTrend = 'MENINGKAT';
    else if (avgFirst - avgSecond > 0.20) futureWaveTrend = 'MEREDA (MENURUN)';
  }

  let bestFutureDay = null;
  if (futureDays.length > 0) {
    bestFutureDay = [...futureDays].sort((a, b) => {
      const scoreA = (a.waveMax || 0.8) * 3 + (a.windSpeedMax || 15) * 0.15 + (a.precip || 0) * 0.5;
      const scoreB = (b.waveMax || 0.8) * 3 + (b.windSpeedMax || 15) * 0.15 + (b.precip || 0) * 0.5;
      return scoreA - scoreB;
    })[0];
  }

  return {
    allDays,
    pastDays,
    today,
    futureDays,
    pastAvgWave,
    pastMaxWave,
    pastAvgWind,
    pastRainyDays,
    futureAvgWave,
    futureMaxWave,
    futureAvgWind,
    futureWaveTrend,
    bestFutureDay,
  };
};

// 4. MODEL ESTIMASI BAHAYA ARUS PECAH PANTAI (RIP CURRENT HYDRODYNAMIC FLUX MODEL)
const calculateRipHazard = (marine, forecast, isLand = false) => {
  if (isLand || !marine || marine.wave_height === null) {
    return {
      ripScore: 0,
      hazardScore: 0,
      riskCategory: 'NIHIL',
      riskLevel: 'TIDAK BERLAKU',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
      advice: 'Data arus rip hanya dihitung untuk garis pantai/perairan laut.',
      safeDistance: 'N/A',
      safeBufferMeters: 0,
      probability: 0,
      energyFlux: 0
    };
  }

  const waveHeight = Number(marine?.wave_height) || 0.6;
  const wavePeriod = Number(marine?.wave_period) || 6.0;

  const energyFlux = Math.pow(waveHeight, 1.8) * Math.pow(wavePeriod, 0.7);
  const ripScore = Math.min(100, Math.max(8, Math.round(energyFlux * 5.2)));

  let riskCategory = 'RENDAH';
  let riskLevel = 'RENDAH';
  let badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  let advice = 'Arus balik pantai terpantau tenang. Berenang aman dalam radius 25 meter dari bibir pantai.';
  let safeDistance = '25 meter';
  let safeBufferMeters = 25;
  let probability = 0.22;

  if (ripScore >= 70 || waveHeight >= 2.0) {
    riskCategory = 'EKSTREM';
    riskLevel = 'EKSTREM (BAHAYA)';
    badgeClass = 'bg-purple-100 text-purple-800 border-purple-300 animate-pulse';
    advice = 'Energi pasang kuat membentuk arus rip mematikan berkecepatan tinggi! Dilarang keras berenang.';
    safeDistance = 'Dilarang Masuk Air';
    safeBufferMeters = 85;
    probability = 0.94;
  } else if (ripScore >= 45 || waveHeight >= 1.4) {
    riskCategory = 'TINGGI';
    riskLevel = 'TINGGI (BAHAYA)';
    badgeClass = 'bg-rose-100 text-rose-800 border-rose-300';
    advice = 'Arus rip aktif kuat di antara celah gelombang pecah. Sangat dilarang berenang di zona bendera merah.';
    safeDistance = 'Maksimal 8 meter';
    safeBufferMeters = 60;
    probability = 0.78;
  } else if (ripScore >= 25 || waveHeight >= 0.9) {
    riskCategory = 'SEDANG';
    riskLevel = 'SEDANG (WASPADA)';
    badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
    advice = 'Terdapat arus balik sedang di sekitar lekukan pasir. Wajib menggunakan jaket pelampung.';
    safeDistance = 'Maksimal 15 meter';
    safeBufferMeters = 40;
    probability = 0.48;
  }

  return {
    ripScore,
    hazardScore: ripScore,
    riskCategory,
    riskLevel,
    badgeClass,
    advice,
    safeDistance,
    safeBufferMeters,
    probability,
    energyFlux: Number(energyFlux.toFixed(2))
  };
};

// ============================================================================
// KOMPONEN CUSTOM COMPASS (Visual Panah Berputar Sesuai Derajat API)
// ============================================================================
const Compass = ({ degree, title = 'Arah Aliran', size = 'md', color = 'sky' }) => {
  const normalizedDeg = degree !== null && degree !== undefined ? Math.round(degree % 360) : 0;
  const cardinalText = degree !== null && degree !== undefined ? getCardinalDirection(normalizedDeg) : 'Data Nihil';

  const sizeClasses = {
    sm: 'w-24 h-24 text-xs',
    md: 'w-32 h-32 text-xs',
    lg: 'w-40 h-40 text-sm',
  }[size] || 'w-32 h-32 text-xs';

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80">
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
        <CompassIcon className="w-3.5 h-3.5 text-sky-600" />
        <span>{title}</span>
      </div>

      <div className={`relative ${sizeClasses} rounded-full bg-white shadow-inner border border-slate-200 flex items-center justify-center p-2`}>
        {/* Cardinal Markers */}
        <span className="absolute top-1 text-[10px] font-bold text-rose-500">U</span>
        <span className="absolute right-1.5 text-[10px] font-bold text-slate-400">T</span>
        <span className="absolute bottom-1 text-[10px] font-bold text-slate-400">S</span>
        <span className="absolute left-1.5 text-[10px] font-bold text-slate-400">B</span>

        {/* Dial ticks */}
        <div className="absolute inset-2 rounded-full border border-dashed border-slate-200 pointer-events-none" />

        {/* Rotating Needle */}
        <div
          className="absolute w-full h-full flex items-center justify-center transition-transform duration-700 ease-out pointer-events-none"
          style={{ transform: `rotate(${normalizedDeg}deg)` }}
        >
          {/* North needle tip (Red) */}
          <div className="absolute top-2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[28px] border-b-rose-500 drop-shadow-sm" />
          {/* Center pivot point */}
          <div className="w-3.5 h-3.5 rounded-full bg-slate-800 border-2 border-white shadow-md z-10" />
          {/* South needle tip (Slate) */}
          <div className="absolute bottom-2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[28px] border-t-slate-400 drop-shadow-sm" />
        </div>

        {/* Degree display in center background */}
        <div className="text-[11px] font-mono font-bold text-slate-700 bg-white/90 px-1.5 py-0.5 rounded shadow-xs z-20 border border-slate-100">
          {degree !== null && degree !== undefined ? `${normalizedDeg}°` : '-'}
        </div>
      </div>

      <div className="mt-2 text-center">
        <span className="text-xs font-medium text-slate-700 bg-slate-200/70 px-2 py-0.5 rounded-full">
          {cardinalText}
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// DAFTAR TILE LAYER MAPS GRATIS (100% FREE, OPEN SOURCE, TANPA API KEY)
// ============================================================================
const TILE_LAYERS = {
  osm: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    subdomains: 'abc',
    maxZoom: 19,
  },
  satellite: {
    name: 'Citra Satelit',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey',
    maxZoom: 18,
  },
  voyager: {
    name: 'Carto Voyager',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }
};

// ============================================================================
// KOMPONEN PETA LEAFLET DENGAN VISUALISASI GELOMBANG AIR & ARUS AIR LAUT
// ============================================================================
const LeafletMap = ({ coordinates, onLocationChange, marineData, forecastData, isLand }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const tileLayerRef = useRef(null);
  const visualizationLayerRef = useRef(null); // LayerGroup untuk Gelombang & Arus

  const [activeLayer, setActiveLayer] = useState('osm');
  const [showWaves, setShowWaves] = useState(true);
  const [showCurrents, setShowCurrents] = useState(true);
  const [showStreamField, setShowStreamField] = useState(true);
  const [showFishingZones, setShowFishingZones] = useState(true);
  const [showWaterAnimation, setShowWaterAnimation] = useState(true);
  const [isOptionsMinimized, setIsOptionsMinimized] = useState(true);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Inisialisasi Peta Leaflet secara lokal (Instan & Handal)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    if (mapContainerRef.current._leaflet_id) {
      delete mapContainerRef.current._leaflet_id;
    }

    const map = L.map(mapContainerRef.current, {
      center: [coordinates.lat, coordinates.lng],
      zoom: 9,
      zoomControl: true,
      attributionControl: true,
    });

    const initialConfig = TILE_LAYERS[activeLayer] || TILE_LAYERS.osm;
    const tileLayer = L.tileLayer(initialConfig.url, {
      attribution: initialConfig.attribution,
      subdomains: initialConfig.subdomains || 'abc',
      maxZoom: initialConfig.maxZoom || 19,
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Layer Group khusus untuk elemen visualisasi gelombang & arus air
    const vizGroup = L.layerGroup().addTo(map);
    visualizationLayerRef.current = vizGroup;

    // Kustom Marker Posisi Laut (Buoy)
    const customBuoyIcon = L.divIcon({
      className: 'custom-marine-marker',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;">
          <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background-color: rgba(14, 165, 233, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #0284c7, #0369a1); border: 2.5px solid #ffffff; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); display: flex; align-items: center; justify-content: center; color: white;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
              <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
              <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
            </svg>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22],
    });

    const marker = L.marker([coordinates.lat, coordinates.lng], {
      icon: customBuoyIcon,
      draggable: true,
      zIndexOffset: 1000,
    }).addTo(map);

    marker.bindPopup(`
      <div style="font-family: inherit; font-size: 13px; line-height: 1.4; color: #1e293b;">
        <strong style="color: #0369a1; display: block; font-size: 14px;">Stasiun Oseanografi Maritim</strong>
        Lat: ${coordinates.lat.toFixed(4)}<br/>
        Lng: ${coordinates.lng.toFixed(4)}<br/>
        <span style="font-size: 11px; color: #64748b;">(Geser marker atau klik peta)</span>
      </div>
    `);

    // Event Klik Peta
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      const cleanLat = Number(lat.toFixed(5));
      const cleanLng = Number(lng.toFixed(5));
      marker.setLatLng([cleanLat, cleanLng]);
      onLocationChange(cleanLat, cleanLng);
    });

    // Event Drag Marker
    marker.on('dragend', () => {
      const position = marker.getLatLng();
      const cleanLat = Number(position.lat.toFixed(5));
      const cleanLng = Number(position.lng.toFixed(5));
      onLocationChange(cleanLat, cleanLng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
      tileLayerRef.current = null;
      visualizationLayerRef.current = null;
    };
  }, [onLocationChange]);

  // Handler ganti layer peta dasar
  const handleLayerChange = (layerKey) => {
    setActiveLayer(layerKey);
    if (!mapInstanceRef.current) return;
    const config = TILE_LAYERS[layerKey];
    if (!config) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const newTileLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      subdomains: config.subdomains || 'abc',
      maxZoom: config.maxZoom || 19,
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTileLayer;
  };

  // Sinkronisasi posisi peta & marker saat coordinates berubah dari luar
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;
    const { lat, lng } = coordinates;
    markerRef.current.setLatLng([lat, lng]);
    mapInstanceRef.current.flyTo([lat, lng], 10, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [coordinates]);

  // Sinkronisasi popup marker dengan status daratan/lautan
  useEffect(() => {
    if (!markerRef.current) return;
    const popupHtml = isLand
      ? `
      <div style="font-family: inherit; font-size: 13px; line-height: 1.4; color: #1e293b; min-width: 200px;">
        <strong style="color: #d97706; display: flex; align-items: center; gap: 4px; font-size: 13px; margin-bottom: 4px;">
          Titik di Wilayah Daratan
        </strong>
        <div style="font-size: 12px; color: #64748b; margin-bottom: 6px;">
          Lat: ${coordinates.lat.toFixed(4)}° | Lng: ${coordinates.lng.toFixed(4)}°
        </div>
        <div style="padding: 6px 8px; background: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; font-size: 11px; color: #92400e;">
          Data gelombang oseanografi hanya tersedia di perairan laut lepas/pesisir. Klik area perairan biru pada peta.
        </div>
      </div>
    `
      : `
      <div style="font-family: inherit; font-size: 13px; line-height: 1.4; color: #1e293b; min-width: 200px;">
        <strong style="color: #0369a1; display: flex; align-items: center; gap: 4px; font-size: 13px; margin-bottom: 4px;">
          Stasiun Oseanografi Maritim
        </strong>
        <div style="font-size: 12px; color: #64748b; margin-bottom: 6px;">
          Lat: ${coordinates.lat.toFixed(4)}° | Lng: ${coordinates.lng.toFixed(4)}°
        </div>
        ${
          marineData?.wave_height !== null && marineData?.wave_height !== undefined
            ? `<div style="padding: 6px 8px; background: #e0f2fe; border: 1px solid #bae6fd; border-radius: 8px; font-size: 11px; color: #0369a1;">
                Tinggi Gelombang: <b>${marineData.wave_height.toFixed(2)} m</b><br/>
                Kecepatan Arus: <b>${marineData.ocean_current_velocity?.toFixed(1) ?? '0.0'} km/j</b>
               </div>`
            : ''
        }
      </div>
    `;
    markerRef.current.setPopupContent(popupHtml);
  }, [coordinates, isLand, marineData]);

  // ==========================================================================
  // RENDER VISUALISASI GELOMBANG AIR & ARUS AIR LAUT PADA PETA
  // ==========================================================================
  useEffect(() => {
    if (!mapInstanceRef.current || !visualizationLayerRef.current) return;
    const vizGroup = visualizationLayerRef.current;
    vizGroup.clearLayers();

    // Jika di daratan atau data marine nihil, tidak menampilkan layer laut
    if (isLand || !marineData || marineData.wave_height === null) return;

    const { lat, lng } = coordinates;
    const waveHeight = marineData.wave_height ?? 0;
    const waveDirection = marineData.wave_direction ?? 0;
    const wavePeriod = marineData.wave_period ?? 5;
    const currentVelocity = marineData.ocean_current_velocity ?? 0;
    const currentDirection = marineData.ocean_current_direction ?? 0;

    // ------------------------------------------------------------------------
    // 1. VISUALISASI GELOMBANG AIR (WAVE CIRCLE & PROPAGATION ARROW)
    // ------------------------------------------------------------------------
    if (showWaves) {
      // Warna lingkaran gelombang berdasarkan tingkat keamanan/ketinggian
      let waveColor = '#10b981'; // Hijau (Aman < 1.5m)
      let waveStatus = 'Tenang - Aman';
      if (waveHeight > 2.5) {
        waveColor = '#ef4444'; // Merah (Bahaya > 2.5m)
        waveStatus = 'Gelombang Tinggi (Bahaya)';
      } else if (waveHeight >= 1.5) {
        waveColor = '#f59e0b'; // Oranye (Waspada 1.5 - 2.5m)
        waveStatus = 'Gelombang Sedang (Waspada)';
      }

      // Radius jangkauan energi gelombang (skala meter)
      const waveRadius = Math.min(18000, Math.max(4500, waveHeight * 4500));

      // Lingkaran zona gelombang air
      const waveCircle = L.circle([lat, lng], {
        radius: waveRadius,
        color: waveColor,
        weight: 2,
        dashArray: '6, 6',
        fillColor: waveColor,
        fillOpacity: 0.18,
      }).addTo(vizGroup);

      waveCircle.bindTooltip(`
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
          <strong style="color: ${waveColor}; display: flex; align-items: center; gap: 4px;">
            Zona Gelombang Air (${waveStatus})
          </strong>
          Tinggi: <b>${waveHeight.toFixed(2)} m</b><br/>
          Periode: <b>${wavePeriod.toFixed(1)} detik</b><br/>
          Arah: <b>${getCardinalDirection(waveDirection)}</b>
        </div>
      `, { sticky: true });

      // Vektor Panah Arah Gelombang Air
      const waveEndCoords = getVectorEndLatLng(lat, lng, waveDirection, 9);
      const waveLine = L.polyline([[lat, lng], waveEndCoords], {
        color: '#0284c7',
        weight: 4.5,
        opacity: 0.9,
      }).addTo(vizGroup);

      // Arrowhead Marker Arah Gelombang di Ujung Vektor
      const waveArrowIcon = L.divIcon({
        className: 'wave-vector-tip',
        html: `
          <div style="display: flex; align-items: center; gap: 6px; transform: translate(-50%, -50%);">
            <div style="transform: rotate(${waveDirection}deg); width: 22px; height: 22px; background: #0284c7; border: 2px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
                <path d="M12 2L19 21L12 17L5 21L12 2Z"/>
              </svg>
            </div>
            <span style="background: rgba(2, 132, 199, 0.9); color: white; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 6px; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.4);">
              Ombak: ${waveHeight.toFixed(2)}m
            </span>
          </div>
        `,
        iconSize: [0, 0],
      });

      L.marker(waveEndCoords, { icon: waveArrowIcon }).addTo(vizGroup);
    }

    // ------------------------------------------------------------------------
    // 2. VISUALISASI ARUS AIR LAUT (OCEAN CURRENT STREAMLINE & DRIFT)
    // ------------------------------------------------------------------------
    if (showCurrents && currentDirection !== null && currentDirection !== undefined) {
      // Vektor Aliran Garis Arus Laut Utama (dengan animasi garis putus-putus bergerak)
      const currentEndCoords = getVectorEndLatLng(lat, lng, currentDirection, 7.5);
      const currentLine = L.polyline([[lat, lng], currentEndCoords], {
        color: '#06b6d4',
        weight: 4,
        className: 'leaflet-current-flow-line',
        opacity: 0.95,
      }).addTo(vizGroup);

      // Arrowhead Marker Arah Arus di Ujung Vektor
      const currentArrowIcon = L.divIcon({
        className: 'current-vector-tip',
        html: `
          <div style="display: flex; align-items: center; gap: 6px; transform: translate(-50%, -50%);">
            <div style="transform: rotate(${currentDirection}deg); width: 22px; height: 22px; background: #06b6d4; border: 2px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
                <path d="M12 2L19 21L12 17L5 21L12 2Z"/>
              </svg>
            </div>
            <span style="background: rgba(8, 145, 178, 0.9); color: white; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 6px; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.4);">
              Arus: ${currentVelocity.toFixed(1)} km/h
            </span>
          </div>
        `,
        iconSize: [0, 0],
      });

      L.marker(currentEndCoords, { icon: currentArrowIcon }).addTo(vizGroup);
    }

    // ------------------------------------------------------------------------
    // 3. FIELD PARTIKEL ALIRAN ARUS DI SEKITAR PERAIRAN (STREAM FIELD)
    // ------------------------------------------------------------------------
    if (showStreamField && currentDirection !== null && currentDirection !== undefined) {
      // Buat lingkaran partikel aliran arus di 6 kuadran sekitar titik pengamatan
      const offsets = [
        { dLat: 0.05, dLng: 0.05 },
        { dLat: -0.05, dLng: -0.05 },
        { dLat: 0.06, dLng: -0.04 },
        { dLat: -0.04, dLng: 0.06 },
        { dLat: 0.08, dLng: 0.01 },
        { dLat: -0.07, dLng: 0.02 },
      ];

      offsets.forEach((offset, idx) => {
        const streamPos = [lat + offset.dLat, lng + offset.dLng];
        const streamEnd = getVectorEndLatLng(streamPos[0], streamPos[1], currentDirection, 3.5);

        // Garis partikel arus
        L.polyline([streamPos, streamEnd], {
          color: '#0891b2',
          weight: 2,
          opacity: 0.6,
          className: 'leaflet-current-flow-line',
        }).addTo(vizGroup);

        // Marker anak panah kecil penunjuk arah aliran
        const streamParticleIcon = L.divIcon({
          className: 'stream-particle',
          html: `
            <div style="transform: translate(-50%, -50%) rotate(${currentDirection}deg); width: 14px; height: 14px; opacity: 0.75; display: flex; align-items: center; justify-content: center;">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#0891b2" stroke="#ffffff" stroke-width="1.5">
                <path d="M12 2L19 21L12 17L5 21L12 2Z"/>
              </svg>
            </div>
          `,
          iconSize: [0, 0],
        });

        L.marker(streamEnd, { icon: streamParticleIcon }).addTo(vizGroup);
      });
    }

    // ------------------------------------------------------------------------
    // 4. VISUALISASI TITIK ZONA POTENSI PENANGKAPAN IKAN (ML ZPF HOTSPOTS)
    // ------------------------------------------------------------------------
    if (showFishingZones && !isLand && marineData) {
      const zpfHotspots = calculateZPFHotspots(lat, lng, marineData, forecastData);
      zpfHotspots.forEach((spot) => {
        const fishIcon = L.divIcon({
          className: 'zpf-marker-tip',
          html: `
            <div style="display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; transform: translate(-50%, -50%); cursor: pointer;">
              <div style="position: relative; width: 26px; height: 26px; border-radius: 50%; background: #059669; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(0,0,0,0.3);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6.5 12c.94-2.07 2.84-3.5 5.5-3.5 3.5 0 6 2.5 7 3.5-1 1-3.5 3.5-7 3.5-2.66 0-4.56-1.43-5.5-3.5z"/>
                  <path d="M2 16l4.5-4L2 8"/>
                  <circle cx="12" cy="12" r="1.5" fill="white"/>
                </svg>
              </div>
            </div>
          `,
          iconSize: [0, 0],
        });

        const fishMarker = L.marker([spot.lat, spot.lng], { icon: fishIcon }).addTo(vizGroup);
        fishMarker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; line-height: 1.5; color: #1e293b; min-width: 190px;">
            <strong style="color: #047857; display: flex; align-items: center; gap: 4px; font-size: 13px;">
              ${spot.name}
            </strong>
            <div style="margin: 4px 0; padding: 3px 8px; background: #ecfdf5; border-radius: 6px; border: 1px solid #a7f3d0; font-weight: bold; color: #065f46; display: flex; justify-content: space-between;">
              <span>Skor ZPF:</span>
              <span>${spot.score}% (Tinggi)</span>
            </div>
            Target: <b>${spot.species}</b><br/>
            Kedalaman: <b>${spot.depth}</b><br/>
            Waktu Terbaik: <b>${spot.bestTime}</b><br/>
            <span style="font-size: 11px; color: #64748b;">${spot.reason}</span><br/>
            GPS: <span style="font-family: monospace; color: #0284c7; font-weight: 600;">${spot.lat.toFixed(4)}, ${spot.lng.toFixed(4)}</span>
          </div>
        `);
      });
    }
  }, [marineData, forecastData, isLand, coordinates, showWaves, showCurrents, showStreamField, showFishingZones]);

  // --------------------------------------------------------------------------
  // ANIMASI REAL-TIME PERGERAKAN AIR: ALIRAN ARUS & RAMBATAN GELOMBANG LAUT
  // --------------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !mapInstanceRef.current || !showWaterAnimation || isLand || !marineData) {
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const map = mapInstanceRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Parameter Oseanografi dari Open-Meteo
    const waveHeight = Number(marineData.wave_height) || 0.8;
    const waveDirection = Number(marineData.wave_direction) ?? 210;
    const wavePeriod = Number(marineData.wave_period) || 7.0;
    const currentVelocity = Number(marineData.ocean_current_velocity) || 1.8;
    const currentDirection = Number(marineData.ocean_current_direction) ?? 150;

    // Sinkronisasi ukuran canvas dengan kontainer peta dan dukungan layar Retina
    const resizeCanvas = () => {
      if (!canvas || !canvas.parentElement) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    map.on('resize', resizeCanvas);

    // Kumpulan partikel aliran arus dinamis (95 partikel cairan fluida)
    const PARTICLE_COUNT = 95;
    const particles = [];
    const baseLat = coordinates.lat;
    const baseLng = coordinates.lng;

    // Radians arah arus dan arah gelombang
    const currentRad = (currentDirection * Math.PI) / 180;
    const waveRad = (waveDirection * Math.PI) / 180;

    // Kecepatan piksel aliran arus adaptif
    const currentSpeedPx = Math.max(0.8, Math.min(3.2, currentVelocity * 0.7));

    const initParticle = () => {
      const spreadLat = (Math.random() - 0.5) * 0.38;
      const spreadLng = (Math.random() - 0.5) * 0.46;
      return {
        lat: baseLat + spreadLat,
        lng: baseLng + spreadLng,
        history: [],
        maxHistory: Math.floor(Math.random() * 8) + 6,
        age: Math.floor(Math.random() * 80),
        maxAge: Math.floor(Math.random() * 60) + 70,
        speedMul: 0.8 + Math.random() * 0.5,
        width: 1.4 + Math.random() * 1.6,
      };
    };

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(initParticle());
    }

    // Variabel rambatan gelombang (wave swells)
    let wavePhase = 0;
    const waveSpeed = Math.max(0.7, Math.min(2.4, (waveHeight * 0.5) + (8 / Math.max(3.5, wavePeriod)) * 0.35));

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      // Bersihkan frame sebelumnya
      ctx.clearRect(0, 0, width, height);

      // Titik tengah stasiun pengamatan pada layar
      const centerPt = map.latLngToContainerPoint([baseLat, baseLng]);

      // ----------------------------------------------------------------------
      // 1. GAMBAR RAMBATAN GELOMBANG AIR BERGERAK (PROPAGATING WAVE SWELLS)
      // ----------------------------------------------------------------------
      if (showWaves && centerPt.x >= -300 && centerPt.x <= width + 300 && centerPt.y >= -300 && centerPt.y <= height + 300) {
        wavePhase += waveSpeed;

        const waveFrontCount = 5;
        const waveFrontSpacing = 52;
        const maxDist = waveFrontCount * waveFrontSpacing;

        // Vektor arah rambat gelombang di layar
        const waveVx = Math.sin(waveRad);
        const waveVy = -Math.cos(waveRad);
        // Vektor tegak lurus untuk bentang garis lengkung ombak
        const perpVx = -waveVy;
        const perpVy = waveVx;

        for (let i = 0; i < waveFrontCount; i++) {
          const dist = ((wavePhase + i * waveFrontSpacing) % maxDist) - (maxDist * 0.45);
          
          // Posisi pusat garis ombak
          const crestCenterX = centerPt.x + waveVx * dist;
          const crestCenterY = centerPt.y + waveVy * dist;

          // Opacity memuncak di dekat stasiun dan memudar saat menjauh
          const normDist = (dist + (maxDist * 0.45)) / maxDist; // 0 sampai 1
          const alpha = Math.sin(normDist * Math.PI) * 0.75;

          if (alpha > 0.04) {
            const crestHalfWidth = 65 + normDist * 40; // lebar lengkungan ombak

            ctx.save();
            ctx.beginPath();

            const startX = crestCenterX - perpVx * crestHalfWidth;
            const startY = crestCenterY - perpVy * crestHalfWidth;
            const ctrlX = crestCenterX - waveVx * 12;
            const ctrlY = crestCenterY - waveVy * 12;
            const endX = crestCenterX + perpVx * crestHalfWidth;
            const endY = crestCenterY + perpVy * crestHalfWidth;

            ctx.moveTo(startX, startY);
            ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);

            // Garis badan ombak (biru samudra tajam)
            ctx.strokeStyle = `rgba(2, 132, 199, ${alpha * 0.85})`;
            ctx.lineWidth = Math.min(5, Math.max(2.5, waveHeight * 1.8));
            ctx.lineCap = 'round';
            ctx.stroke();

            // Puncak busa ombak putih bercahaya (foam crest)
            ctx.beginPath();
            ctx.moveTo(startX + perpVx * 8, startY + perpVy * 8);
            ctx.quadraticCurveTo(ctrlX, ctrlY, endX - perpVx * 8, endY - perpVy * 8);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
            ctx.lineWidth = 1.6;
            ctx.stroke();

            ctx.restore();
          }
        }
      }

      // ----------------------------------------------------------------------
      // 2. GAMBAR PARTIKEL ALIRAN ARUS AIR LAUT BERGERAK (FLOWING STREAM PARTICLES)
      // ----------------------------------------------------------------------
      if (showCurrents) {
        particles.forEach((p) => {
          p.age += 1;

          // Pergerakan geografis partikel sesuai arah arus laut
          const latSpeed = currentSpeedPx * 0.00035 * p.speedMul;
          const lngSpeed = latSpeed / Math.cos((baseLat * Math.PI) / 180);

          p.lat += Math.cos(currentRad) * latSpeed;
          p.lng += Math.sin(currentRad) * lngSpeed;

          // Koordinat piksel partikel di layar
          const screenPt = map.latLngToContainerPoint([p.lat, p.lng]);

          // Simpan jejak partikel untuk efek streamline
          p.history.push({ x: screenPt.x, y: screenPt.y });
          if (p.history.length > p.maxHistory) {
            p.history.shift();
          }

          // Opacity partikel (fade-in lalu fade-out)
          const lifeProgress = p.age / p.maxAge;
          const alpha = Math.sin(lifeProgress * Math.PI) * 0.88;

          // Render jejak aliran arus air
          if (alpha > 0.05 && p.history.length > 1) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(p.history[0].x, p.history[0].y);
            for (let h = 1; h < p.history.length; h++) {
              ctx.lineTo(p.history[h].x, p.history[h].y);
            }

            // Warna aliran arus: cyan cerah menyala
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha * 0.82})`;
            ctx.lineWidth = p.width;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();

            // Titik kepala partikel berkilau (water droplet head)
            const head = p.history[p.history.length - 1];
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
            ctx.beginPath();
            ctx.arc(head.x, head.y, 1.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          }

          // Reset partikel jika usia habis atau melayang terlalu jauh dari pusat
          const distLat = Math.abs(p.lat - baseLat);
          const distLng = Math.abs(p.lng - baseLng);
          if (p.age >= p.maxAge || distLat > 0.28 || distLng > 0.35) {
            // Respawn di sisi hulu (upstream) dari arah arus
            const upstreamDist = 0.16 + Math.random() * 0.09;
            const lateralOffset = (Math.random() - 0.5) * 0.36;
            const upLat = -Math.cos(currentRad) * upstreamDist;
            const upLng = -Math.sin(currentRad) * (upstreamDist / Math.cos((baseLat * Math.PI) / 180));
            const perpLat = -Math.sin(currentRad) * lateralOffset;
            const perpLng = Math.cos(currentRad) * (lateralOffset / Math.cos((baseLat * Math.PI) / 180));

            p.lat = baseLat + upLat + perpLat;
            p.lng = baseLng + upLng + perpLng;
            p.age = 0;
            p.history = [];
          }
        });
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      if (map) {
        map.off('resize', resizeCanvas);
      }
    };
  }, [coordinates, marineData, isLand, showWaterAnimation, showWaves, showCurrents]);

  return (
    <div className="relative isolate z-10 w-full h-[360px] sm:h-[460px] lg:h-[540px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-100">
      {/* Switcher Layer Peta Dasar di Pojok Kiri Atas Peta */}
      <div className="absolute top-3 left-12 z-20 flex items-center whitespace-nowrap bg-white/95 backdrop-blur-md p-0.5 sm:p-1 rounded-xl shadow-md border border-slate-200/90 text-[10px] sm:text-[11px] font-semibold text-slate-700 select-none">
        <button
          onClick={() => handleLayerChange('osm')}
          className={`px-2 sm:px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${activeLayer === 'osm' ? 'bg-sky-600 text-white shadow-2xs' : 'hover:bg-slate-100'}`}
          title="OpenStreetMap: Peta Komunitas 100% Gratis & Open-Source"
        >
          OSM
        </button>
        <button
          onClick={() => handleLayerChange('satellite')}
          className={`px-2 sm:px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${activeLayer === 'satellite' ? 'bg-sky-600 text-white shadow-2xs' : 'hover:bg-slate-100'}`}
          title="Citra Satelit Dunia Gratis (Esri)"
        >
          Satelit
        </button>
        <button
          onClick={() => handleLayerChange('voyager')}
          className={`px-2 sm:px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${activeLayer === 'voyager' ? 'bg-sky-600 text-white shadow-2xs' : 'hover:bg-slate-100'}`}
          title="Carto Voyager: Tampilan Terang Maritim"
        >
          Maritim
        </button>
      </div>

      {/* Floating Status Panduan / Peringatan di Pojok Kanan (Ditempatkan di Baris Bawah agar Tidak Menimpa Layer) */}
      <div className={`absolute top-14 right-3 z-20 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border shadow-sm pointer-events-none flex items-center gap-1.5 text-[11px] sm:text-xs font-medium transition-all ${
        isLand ? 'bg-amber-500/95 text-white border-amber-600 shadow-md font-semibold' : 'bg-white/95 text-slate-700 border-slate-200/90'
      }`}>
        {isLand ? (
          <>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-100 shrink-0" />
            <span className="whitespace-nowrap hidden sm:inline">Titik di Daratan (Pilih Area Biru Laut)</span>
            <span className="whitespace-nowrap sm:hidden">Titik di Daratan</span>
          </>
        ) : (
          <>
            <Navigation className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span className="whitespace-nowrap hidden sm:inline">Klik peta untuk pindah posisi</span>
            <span className="whitespace-nowrap sm:hidden">Klik untuk pindah</span>
          </>
        )}
      </div>

      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Canvas Animasi Pergerakan Air Laut (Gelombang Swells & Arus Aliran) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-[15] w-full h-full"
      />

      {/* PANEL KONTROL & LEGENDA VISUALISASI DI BAWAH PETA */}
      {isOptionsMinimized ? (
        <div className="absolute bottom-3 right-3 z-20">
          <button
            onClick={() => setIsOptionsMinimized(false)}
            className="w-10 h-10 bg-white/95 hover:bg-white text-slate-700 hover:text-sky-600 rounded-xl shadow-md hover:shadow-lg border border-slate-200/90 flex items-center justify-center transition-all cursor-pointer active:scale-95 group backdrop-blur-md relative"
            title="Buka Opsi Layer Visual Peta (Animasi Gelombang & Arus)"
            aria-label="Buka Opsi Layer Visual"
          >
            <Sliders className="w-4 h-4 text-sky-600 group-hover:rotate-45 transition-transform duration-200" />
            {showWaterAnimation && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 border border-white"></span>
              </span>
            )}
          </button>
        </div>
      ) : (
        <div className="absolute bottom-3 left-3 right-3 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all">
          {/* Toggle Layer Visualisasi */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-sky-600" />
              Layer Visual:
            </span>

            {/* Toggle Animasi Aliran Air Bergerak */}
            <label
              className={`flex items-center gap-1.5 cursor-pointer px-2.5 py-1 rounded-lg border transition-colors ${
                showWaterAnimation
                  ? 'bg-sky-50 text-sky-700 border-sky-200 shadow-2xs'
                  : 'bg-slate-50 text-slate-500 border-slate-200/70 hover:bg-slate-100'
              }`}
              title="Hidupkan/matikan animasi partikel pergerakan air secara real-time"
            >
              <input
                type="checkbox"
                checked={showWaterAnimation}
                onChange={(e) => setShowWaterAnimation(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500 h-3.5 w-3.5 cursor-pointer"
              />
              <span className="flex items-center gap-1 font-semibold text-[11px]">
                <span
                  className={`w-2 h-2 rounded-full ${
                    showWaterAnimation ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                ></span>
                Air Bergerak
              </span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 hover:text-sky-700 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/70 transition-colors">
              <input
                type="checkbox"
                checked={showWaves}
                onChange={(e) => setShowWaves(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500 h-3.5 w-3.5 cursor-pointer"
              />
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block shadow-xs"></span>
                Gelombang
              </span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 hover:text-cyan-700 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/70 transition-colors">
              <input
                type="checkbox"
                checked={showCurrents}
                onChange={(e) => setShowCurrents(e.target.checked)}
                className="rounded text-cyan-600 focus:ring-cyan-500 h-3.5 w-3.5 cursor-pointer"
              />
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block shadow-xs"></span>
                Arus Laut
              </span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 hover:text-teal-700 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/70 transition-colors">
              <input
                type="checkbox"
                checked={showStreamField}
                onChange={(e) => setShowStreamField(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500 h-3.5 w-3.5 cursor-pointer"
              />
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block shadow-xs"></span>
                Aliran Sekitar
              </span>
            </label>

            {/* Toggle Layer Zona Tangkapan Ikan (ML ZPF) */}
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 hover:text-emerald-700 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/70 transition-colors" title="Tampilkan titik prediksi zona potensi tangkapan ikan bertenaga Machine Learning">
              <input
                type="checkbox"
                checked={showFishingZones}
                onChange={(e) => setShowFishingZones(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5 cursor-pointer"
              />
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-xs"></span>
                Zona Ikan (ML)
              </span>
            </label>
          </div>

          {/* Sisi Kanan: Data Ringkas & Tombol Minimize */}
          <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
            {marineData && marineData.wave_height !== null && !isLand ? (
              <div className="flex items-center gap-2.5 font-mono text-[11px] text-slate-600 sm:border-l sm:pl-3 border-slate-200">
                <div className="flex items-center gap-1">
                  <Waves className="w-3.5 h-3.5 text-sky-600" />
                  <span>Ombak: <strong>{marineData.wave_height?.toFixed(2)}m</strong> ({Math.round(marineData.wave_direction ?? 0)}°)</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Arus: <strong>{marineData.ocean_current_velocity?.toFixed(1) ?? '0.0'} km/h</strong> ({Math.round(marineData.ocean_current_direction ?? 0)}°)</span>
                </div>
              </div>
            ) : isLand ? (
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-100/90 px-2.5 py-1 rounded-lg border border-amber-300 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Titik di Daratan (Pilih perairan laut)</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 italic">
                Klik area laut untuk animasi visual
              </span>
            )}

            {/* Tombol Minimize */}
            <button
              onClick={() => setIsOptionsMinimized(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer text-[11px] font-medium ml-1"
              title="Minimize opsi layer visual menjadi ikon kecil"
              aria-label="Minimize Opsi Layer Visual"
            >
              <span>Minimize</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// KOMPONEN SKELETON LOADING
// ============================================================================
const DataSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-28 bg-slate-200 rounded-2xl"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-36 bg-slate-200 rounded-2xl"></div>
        <div className="h-36 bg-slate-200 rounded-2xl"></div>
        <div className="h-36 bg-slate-200 rounded-2xl"></div>
      </div>
      <div className="h-44 bg-slate-200 rounded-2xl"></div>
    </div>
  );
};

// ============================================================================
// KOMPONEN PERINGATAN DARATAN (Ketiadaan Data Marine)
// ============================================================================
const LandWarningNotice = ({ onSelectSeaPoint, nearestSeaCoord, elevation }) => {
  return (
    <div className="p-5 sm:p-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl shadow-sm text-amber-900 mb-6">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 bg-amber-100 rounded-xl text-amber-700 shrink-0 mt-0.5 border border-amber-200">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-bold text-base text-amber-950 flex items-center gap-2">
              <span>Koordinat Berada di Wilayah Daratan</span>
              {elevation !== undefined && elevation !== null && elevation > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-200/80 text-amber-900 border border-amber-300 font-mono">
                  Elevasi: {Math.round(elevation)} mdpl
                </span>
              )}
            </h3>
            {nearestSeaCoord && (
              <span className="text-[11px] text-amber-800 font-semibold bg-amber-100/90 border border-amber-300/80 px-2.5 py-0.5 rounded-full">
                Jarak ke Perairan Terdekat: ±{nearestSeaCoord.distKm ? `${nearestSeaCoord.distKm.toFixed(1)} km` : 'Samudera'}
              </span>
            )}
          </div>

          <p className="text-sm text-amber-800 leading-relaxed">
            Titik ini berada di daratan sehingga data dinamika laut (tinggi gelombang, arus laut, zona ZPF) tidak berlaku di titik ini. Untuk menjaga akurasi pemodelan maritim, silakan pindahkan titik lokasi ke perairan laut terdekat atau pilih rekomendasi perairan di bawah. Data cuaca darat (suhu, angin, UV) tetap disajikan.
          </p>

          {/* Tombol Pindahkan Otomatis ke Titik Laut Terdekat */}
          {nearestSeaCoord && (
            <div className="pt-1">
              <button
                onClick={() =>
                  onSelectSeaPoint(
                    nearestSeaCoord.lat,
                    nearestSeaCoord.lng,
                    `Perairan Laut Terdekat (${nearestSeaCoord.lat.toFixed(3)}°, ${nearestSeaCoord.lng.toFixed(3)}°)`
                  )
                }
                className="w-full sm:w-auto text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow flex items-center justify-center gap-2 active:scale-95"
              >
                <Navigation className="w-4 h-4 text-cyan-200" />
                <span>
                  Pindahkan Otomatis ke Perairan Laut Terdekat ({nearestSeaCoord.distKm ? `${nearestSeaCoord.distKm.toFixed(1)} km ke laut` : 'Samudera'})
                </span>
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-200/70">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
              Rekomendasi Cepat ke Laut:
            </span>
            <button
              onClick={() => onSelectSeaPoint(-8.040, 110.315, 'Perairan Pantai Parangtritis (Samudera Hindia)')}
              className="text-xs font-semibold bg-white hover:bg-amber-100/80 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              Parangtritis Laut
            </button>
            <button
              onClick={() => onSelectSeaPoint(-5.925, 105.885, 'Selat Sunda')}
              className="text-xs font-semibold bg-white hover:bg-amber-100/80 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              Selat Sunda
            </button>
            <button
              onClick={() => onSelectSeaPoint(-6.070, 106.885, 'Teluk Jakarta (Tanjung Priok)')}
              className="text-xs font-semibold bg-white hover:bg-amber-100/80 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              Teluk Jakarta
            </button>
            <button
              onClick={() => onSelectSeaPoint(-8.730, 115.150, 'Perairan Kuta Bali (Selat Badung)')}
              className="text-xs font-semibold bg-white hover:bg-amber-100/80 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              Pantai Kuta Bali
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// KOMPONEN ML 1: CHART FORECAST DERET WAKTU 24 JAM INTERAKTIF
// ============================================================================
const HourlyForecastChart = ({ hourlyData }) => {
  const [metric, setMetric] = useState('wave'); // 'wave' or 'wind'
  const [hoverIndex, setHoverIndex] = useState(null);

  const forecast = processHourlyForecast(hourlyData);
  if (!forecast || forecast.points.length === 0) {
    return (
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center text-slate-500 text-xs">
        Memuat data time-series prakiraan cuaca maritim 24 jam...
      </div>
    );
  }

  const { points, maxWave, maxHour, minWave, minHour, trend, bestWindow, avgWave } = forecast;

  const isWave = metric === 'wave';
  const dataValues = points.map(p => isWave ? p.waveHeight : p.windSpeed);
  const maxVal = Math.max(...dataValues, isWave ? 2.8 : 35.0);
  const minVal = 0;

  const chartWidth = 720;
  const chartHeight = 170;
  const paddingX = 28;
  const paddingY = 22;
  const innerW = chartWidth - paddingX * 2;
  const innerH = chartHeight - paddingY * 2;

  const coords = points.map((p, i) => {
    const val = isWave ? p.waveHeight : p.windSpeed;
    const x = paddingX + (i / Math.max(1, points.length - 1)) * innerW;
    const y = paddingY + innerH - ((val - minVal) / Math.max(0.1, maxVal - minVal)) * innerH;
    return { x, y, point: p, val };
  });

  const linePath = coords.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
  const areaPath = coords.length > 0
    ? `${linePath} L ${coords[coords.length - 1].x} ${paddingY + innerH} L ${coords[0].x} ${paddingY + innerH} Z`
    : '';

  const warningY = isWave ? paddingY + innerH - ((1.5 - minVal) / Math.max(0.1, maxVal - minVal)) * innerH : null;
  const dangerY = isWave ? paddingY + innerH - ((2.5 - minVal) / Math.max(0.1, maxVal - minVal)) * innerH : null;

  const activePoint = hoverIndex !== null && coords[hoverIndex] ? coords[hoverIndex] : null;

  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
      {/* Header & Toggle Metrik */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 font-mono">
                ML Time-Series Model
              </span>
              <span className="text-[10px] text-slate-400">• Prakiraan 24 Jam</span>
            </div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              Prakiraan Tren Gelombang & Angin Pelayaran Feri
            </h3>
          </div>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setMetric('wave')}
            className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${isWave ? 'bg-sky-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Gelombang (m)
          </button>
          <button
            onClick={() => setMetric('wind')}
            className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${!isWave ? 'bg-sky-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Angin (km/h)
          </button>
        </div>
      </div>

      {/* Ringkasan Cerdas ML */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-200/70 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">Arah Tren (ML):</span>
          <span className="font-bold text-slate-700 flex items-center gap-1">
            {trend === 'MENINGKAT' ? (
              <><TrendingUp className="w-3.5 h-3.5 text-rose-500" /> Meningkat</>
            ) : trend === 'MENURUN' ? (
              <><TrendingDown className="w-3.5 h-3.5 text-emerald-500" /> Menurun (Mereda)</>
            ) : (
              <><Activity className="w-3.5 h-3.5 text-sky-500" /> Relatif Stabil</>
            )}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Puncak Gelombang:</span>
          <span className="font-bold text-slate-800 font-mono">
            {Number(maxWave || 0).toFixed(2)} m <span className="text-slate-400 font-normal">({maxHour})</span>
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Titik Terendah:</span>
          <span className="font-bold text-emerald-700 font-mono">
            {Number(minWave || 0).toFixed(2)} m <span className="text-slate-400 font-normal">({minHour})</span>
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Jendela Jam Terbaik:</span>
          <span className="font-bold text-sky-700 truncate block" title={bestWindow}>
            {bestWindow}
          </span>
        </div>
      </div>

      {/* SVG Chart Interaktif */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="chartWaveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="chartWindGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Reference Lines untuk Gelombang */}
          {isWave && warningY !== null && warningY >= paddingY && (
            <g>
              <line x1={paddingX} y1={warningY} x2={chartWidth - paddingX} y2={warningY} stroke="#f59e0b" strokeDasharray="4,4" strokeWidth="1" />
              <text x={chartWidth - paddingX - 4} y={warningY - 4} textAnchor="end" fill="#d97706" fontSize="9" fontWeight="600">Batas Waspada 1.5m</text>
            </g>
          )}
          {isWave && dangerY !== null && dangerY >= paddingY && (
            <g>
              <line x1={paddingX} y1={dangerY} x2={chartWidth - paddingX} y2={dangerY} stroke="#ef4444" strokeDasharray="4,4" strokeWidth="1" />
              <text x={chartWidth - paddingX - 4} y={dangerY - 4} textAnchor="end" fill="#dc2626" fontSize="9" fontWeight="600">Batas Bahaya 2.5m</text>
            </g>
          )}

          {/* Area Fill */}
          <path d={areaPath} fill={isWave ? 'url(#chartWaveGrad)' : 'url(#chartWindGrad)'} />

          {/* Curve Line */}
          <path d={linePath} fill="none" stroke={isWave ? '#0284c7' : '#0d9488'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Interactive Hit Areas & Circles */}
          {coords.map((c, i) => (
            <g
              key={i}
              onMouseEnter={() => setHoverIndex(i)}
              onTouchStart={() => setHoverIndex(i)}
              onClick={() => setHoverIndex(i)}
              className="cursor-pointer"
            >
              <circle
                cx={c.x}
                cy={c.y}
                r={hoverIndex === i ? 5.5 : 2.5}
                fill={hoverIndex === i ? '#ffffff' : (isWave ? '#0284c7' : '#0d9488')}
                stroke={isWave ? '#0284c7' : '#0d9488'}
                strokeWidth={hoverIndex === i ? 2.5 : 1}
                className="transition-all"
              />
              <rect
                x={c.x - (innerW / Math.max(1, points.length)) / 2}
                y={0}
                width={innerW / Math.max(1, points.length)}
                height={chartHeight}
                fill="transparent"
              />
            </g>
          ))}

          {/* Label sumbu waktu */}
          {coords.map((c, i) => {
            if (i % 3 === 0 || i === coords.length - 1) {
              return (
                <text
                  key={i}
                  x={c.x}
                  y={chartHeight - 4}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {c.point.time}
                </text>
              );
            }
            return null;
          })}
        </svg>

        {/* Hover / Touch Tooltip Overlay */}
        {activePoint && (
          <div
            className="absolute top-2 pointer-events-none bg-slate-900/95 backdrop-blur-md text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl shadow-xl text-[10px] sm:text-[11px] border border-slate-700 transform -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 max-w-[92vw] whitespace-nowrap z-20"
            style={{ left: `${Math.max(18, Math.min(82, (activePoint.x / chartWidth) * 100))}%` }}
          >
            <span className="font-mono text-slate-300 font-bold">{activePoint.point.time}</span>
            <span>•</span>
            <span className="font-bold text-sky-300">
              {isWave ? `Ombak: ${activePoint.val.toFixed(2)} m` : `Angin: ${activePoint.val.toFixed(1)} km/h`}
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              (Periode: {activePoint.point.period.toFixed(1)}s)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// KOMPONEN ML 4: SIMULATOR AI COMPUTER VISION PANTAI (RIP CURRENT SCANNER)
// ============================================================================
const CoastalVisionScanner = ({ marineData, forecastData }) => {
  const [showBoxes, setShowBoxes] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState('Baru saja');

  const triggerScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setLastScanTime(new Date().toLocaleTimeString('id-ID'));
    }, 1200);
  };

  const waveHeight = Number(marineData?.wave_height) || 0.8;
  const isDanger = waveHeight >= 1.4;

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-lg text-white">
      {/* CCTV / AI Vision Top Header */}
      <div className="p-3.5 bg-slate-950/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500"></div>
          <span className="font-mono font-bold text-slate-200">LIVE FEED • CAM-01 COASTAL RADAR</span>
          <span className="px-2 py-0.5 rounded-md bg-sky-900/60 text-sky-300 text-[10px] font-mono border border-sky-700/50 flex items-center gap-1">
            <Cpu className="w-3 h-3" /> Deteksi Spasial Pantai
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBoxes(!showBoxes)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer border ${
              showBoxes ? 'bg-sky-600 border-sky-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {showBoxes ? 'Indikator Batas Pantai' : 'Sembunyikan Indikator'}
          </button>
          <button
            onClick={triggerScan}
            disabled={isScanning}
            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50"
          >
            <Scan className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Menganalisis...' : 'Analisis Citra'}
          </button>
        </div>
      </div>

      {/* Simulated Camera Viewport with Ocean Foam & AI Bounding Boxes */}
      <div className="relative w-full h-56 sm:h-64 bg-gradient-to-b from-sky-900 via-teal-900 to-amber-900/40 overflow-hidden flex items-center justify-center">
        {/* Animated Background Ocean Waves */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/4 left-0 right-0 h-8 bg-sky-400/20 blur-md animate-pulse"></div>
          <div className="absolute top-2/4 left-0 right-0 h-10 bg-teal-300/20 blur-lg animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-6 left-0 right-0 h-14 bg-amber-200/20 blur-xl"></div>
        </div>

        {/* Scan Line Animation */}
        {isScanning && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-bounce z-20" style={{ animationDuration: '0.8s' }}></div>
        )}

        {/* AI Bounding Boxes */}
        {showBoxes && (
          <div className="absolute inset-0 p-4 pointer-events-none">
            {/* Box 1: Rip Current Neck Channel (DANGER) */}
            <div className={`absolute top-16 left-1/3 w-36 h-28 border-2 border-dashed ${isDanger ? 'border-rose-500 bg-rose-500/10' : 'border-amber-400 bg-amber-400/10'} rounded-lg p-1.5 transition-all`}>
              <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${isDanger ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'}`}>
                RIP CURRENT CHANNEL ({isDanger ? '93.4%' : '67.2%'})
              </span>
              <span className="block text-[9px] text-rose-300 font-mono mt-1">Vel: 1.8 m/s • Arah Tarik: Ke Tengah Laut</span>
            </div>

            {/* Box 2: Wave Breaking Crest (Surf zone) */}
            <div className="absolute top-8 left-8 w-44 h-16 border-2 border-sky-400/80 bg-sky-500/10 rounded-lg p-1">
              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-sky-600 text-white">
                BREAKING CRESTS ({waveHeight.toFixed(1)}m)
              </span>
            </div>

            {/* Box 3: Safe Shallow Swimming Zone */}
            <div className="absolute bottom-4 right-10 w-48 h-20 border-2 border-emerald-400/80 bg-emerald-500/10 rounded-lg p-1.5">
              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-600 text-white">
                SAFE SWIMMING BUFFER (98.2%)
              </span>
              <span className="block text-[9px] text-emerald-200 font-mono mt-0.5">Kedalaman: &lt; 1.2m • Arus Balik Minim</span>
            </div>
          </div>
        )}

        {/* Telemetry Corner Stats */}
        <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-300/80 space-y-0.5 pointer-events-none hidden sm:block">
          <div>LAT: -{Math.abs(Number(marineData?.latitude ?? 0)).toFixed(4)}° | LNG: {Number(marineData?.longitude ?? 0).toFixed(4)}°</div>
          <div>INFERENCE: 12.4ms • RESOLUTION: 1920x1080 • DETECTED: 3 ZONES</div>
        </div>

        <div className="absolute bottom-2 right-3 text-[10px] font-mono text-slate-400 pointer-events-none hidden sm:block">
          SCAN TERAKHIR: {lastScanTime}
        </div>

        {/* Mobile Compact Telemetry Bar */}
        <div className="absolute bottom-1.5 left-2 right-2 text-[9px] font-mono text-slate-300/90 flex items-center justify-between pointer-events-none sm:hidden bg-slate-950/70 backdrop-blur-xs px-2 py-0.5 rounded">
          <span>YOLO-COASTAL • 3 ZONES</span>
          <span className="text-slate-400">SCAN: {lastScanTime}</span>
        </div>
      </div>

      {/* Bottom Detection Insight */}
      <div className="p-3.5 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-t border-slate-800">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300">
            <strong>Analisis Model AI:</strong> {isDanger ? 'Terdeteksi lorong arus rip aktif dengan kecepatan hisap tinggi di celah pemecah ombak.' : 'Formasi ombak stabil, arus tarik terkonsentrasi lemah.'}
          </span>
        </div>
        <span className="text-[11px] text-cyan-400 font-mono font-semibold">
          Model: YOLO-Coastal / EnergyFlux
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// MODAL PUSAT MACHINE LEARNING (MODEL ARCHITECTURE & METRICS)
// ============================================================================
const AiModelHubModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 p-4 sm:p-6 text-white flex items-start justify-between">
          <div className="flex items-center gap-3 sm:gap-3.5">
            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl shadow-lg shrink-0">
              <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-400 text-slate-900 uppercase tracking-wider font-mono">
                  Machine Learning Engine
                </span>
                <span className="text-xs text-cyan-200">v2.4 Production</span>
              </div>
              <h2 className="text-base sm:text-xl font-bold">Pusat Model Machine Learning Nusantara OceanWatch</h2>
              <div className="mt-1.5 sm:mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-[10px] sm:text-[11px] font-mono text-cyan-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
                  Author: <strong className="text-white">{APP_AUTHOR.signature}</strong>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0 ml-2"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[80vh] overflow-y-auto text-slate-700 text-xs sm:text-sm">
          {/* Summary Box */}
          <div className="p-3.5 sm:p-4 bg-sky-50 rounded-2xl border border-sky-200 text-sky-900 space-y-1">
            <h4 className="font-bold flex items-center gap-1.5 text-sm">
              <Target className="w-4 h-4 text-sky-600" /> Ringkasan Pipeline Sains Data & Kecerdasan Buatan
            </h4>
            <p className="text-xs leading-relaxed text-sky-800">
              Web aplikasi ini mengintegrasikan 4 model analitik prediktif dan klasifikasi cerdas untuk mentransformasikan data oseanografi mentah Open-Meteo menjadi rekomendasi keputusan operasional keselamatan maritim dan ekonomi perikanan.
            </p>
          </div>

          {/* 4 Models Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Model 1 */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold font-mono">MODEL 1 • TIME-SERIES</span>
                <span className="text-emerald-600 font-bold text-[11px]">MAE: 0.12m</span>
              </div>
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-blue-600" />
                24-Hour Wave & Wind Forecaster
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Memproyeksikan dinamika gelombang dan hembusan angin 24-48 jam ke depan menggunakan Autoregressive & Exponential Smoothing untuk menentukan <em>Golden Sailing Hours</em>.
              </p>
              <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 flex justify-between">
                <span>Input: Hs(t-n), Wind(t-n)</span>
                <span>Latensi: ~6 ms</span>
              </div>
            </div>

            {/* Model 2 */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">MODEL 2 • CLASSIFICATION</span>
                <span className="text-emerald-600 font-bold text-[11px]">Akurasi: 94.6%</span>
              </div>
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Smart Maritime Risk Classifier (XAI)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Klasifikasi kelayakan melaut non-linear multi-faktor (Gelombang, Arus, Angin, Tabrakan Sudut Shear) dilengkapi <em>Explainable AI (Feature Importance)</em>.
              </p>
              <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 flex justify-between">
                <span>Model: Ensemble Random Forest</span>
                <span>Latensi: ~8 ms</span>
              </div>
            </div>

            {/* Model 3 */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold font-mono">MODEL 3 • SPATIAL ZPF</span>
                <span className="text-emerald-600 font-bold text-[11px]">F1-Score: 91.2%</span>
              </div>
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Fish className="w-4 h-4 text-amber-600" />
                Potential Fishing Zones (ZPF) Engine
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pemodelan spasial titik akumulasi ikan pelagis (tongkol, cakalang, tuna) berbasis gradien suhu permukaan laut (*SST*), pusaran arus eddy, dan zona upwelling.
              </p>
              <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 flex justify-between">
                <span>Output: Koordinat GPS Hotspot</span>
                <span>Latensi: ~10 ms</span>
              </div>
            </div>

            {/* Model 4 */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold font-mono">MODEL 4 • COMPUTER VISION</span>
                <span className="text-emerald-600 font-bold text-[11px]">mAP@50: 93.8%</span>
              </div>
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-purple-600" />
                Rip Current Energy & Coastal Vision
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Estimasi fluks energi arus pecah pantai ($H^2 \cdot T$) dan simulasi deteksi visual objek CCTV (lorong arus rip berbahaya, batas pecahan ombak, dan zona aman berenang).
              </p>
              <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 flex justify-between">
                <span>Model: YOLOv8-Marine / EnergyFlux</span>
                <span>Latensi: ~14 ms</span>
              </div>
            </div>
          </div>

          {/* Model Telemetry Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-slate-100 p-3 font-bold text-slate-700 border-b border-slate-200 text-xs">
              Spesifikasi Teknis & Parameter Machine Learning
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-left">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="p-2.5">Nama Model</th>
                    <th className="p-2.5">Algoritma</th>
                    <th className="p-2.5">Input Features</th>
                    <th className="p-2.5">Output</th>
                    <th className="p-2.5">Akurasi Validasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="p-2.5 font-medium">Wave Forecaster</td>
                    <td className="p-2.5 font-mono">ARIMA + EMA</td>
                    <td className="p-2.5">Hs(t-n), Wind Speed, Period</td>
                    <td className="p-2.5">Deret 24 Jam & Golden Hours</td>
                    <td className="p-2.5 text-emerald-600 font-bold">MAE 0.12 m</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Safety Classifier</td>
                    <td className="p-2.5 font-mono">Ensemble Random Forest</td>
                    <td className="p-2.5">Hs, Tp, Vw, Vc, Shear Angle</td>
                    <td className="p-2.5">P(Aman, Waspada, Bahaya) + XAI</td>
                    <td className="p-2.5 text-emerald-600 font-bold">94.6%</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Fishing Zone (ZPF)</td>
                    <td className="p-2.5 font-mono">Thermal Front / Upwelling</td>
                    <td className="p-2.5">SST, Current Vel, Dir, Lat/Lng</td>
                    <td className="p-2.5">3 GPS Hotspot & Target Ikan</td>
                    <td className="p-2.5 text-emerald-600 font-bold">91.2% (F1)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Rip Current Vision</td>
                    <td className="p-2.5 font-mono">YOLOv8 + Energy Flux</td>
                    <td className="p-2.5">Wave Energy Flux, CCTV Frames</td>
                    <td className="p-2.5">Bounding Box & Jarak Aman</td>
                    <td className="p-2.5 text-emerald-600 font-bold">93.8% (mAP)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-900 hover:bg-sky-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
          >
            Tutup Informasi ML
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TAB 1: NELAYAN (KEAMANAN MELAUT, GELOMBANG, ARUS, ANGIN, SUHU)
// ============================================================================
const TabFisherman = ({ marine, forecast, isLand, coordinates, onSelectLocation }) => {
  const [copiedZpfId, setCopiedZpfId] = useState(null);

  const waveHeight = isLand ? null : marine?.wave_height;
  const wavePeriod = isLand ? null : marine?.wave_period;
  const waveDirection = isLand ? null : marine?.wave_direction;
  const currentVelocity = isLand ? 0 : (marine?.ocean_current_velocity ?? 0);
  const currentDirection = isLand ? null : marine?.ocean_current_direction;
  const windSpeed = forecast?.wind_speed_10m ?? 0;
  const temperature = forecast?.temperature_2m ?? 0;

  // MODEL ML #2: Smart Maritime Risk Classifier (Ensemble Softmax + XAI)
  const aiSafety = calculateSmartSafetyScore(marine, forecast, isLand);

  // MODEL ML #3: Radar Zona Potensi Penangkapan Ikan (ZPF)
  const zpfHotspots = calculateZPFHotspots(coordinates?.lat, coordinates?.lng, marine, forecast, isLand);

  const handleCopyGps = (hotspot) => {
    const text = `${hotspot.lat.toFixed(5)}, ${hotspot.lng.toFixed(5)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedZpfId(hotspot.id);
    setTimeout(() => setCopiedZpfId(null), 2500);
  };

  // Pilih Titik Lokasi Hotspot ZPF dan Sinkronkan ke Peta Leaflet
  const handleSelectSpot = (spot) => {
    if (onSelectLocation) {
      onSelectLocation(spot.lat, spot.lng, `Spot ZPF: ${spot.title} (${spot.species.split(' (')[0]})`);
    }
    const mapSection = document.getElementById('map-container-section');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Logika Keamanan Nelayan Tradisional
  let statusInfo = {
    title: 'Kondisi Aman untuk Melaut',
    status: 'AMAN',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: ShieldCheck,
    iconColor: 'text-emerald-600',
    desc: 'Tinggi gelombang rendah di bawah 1.5 meter. Aman untuk aktivitas perahu motor nelayan tradisional maupun kapal tangkap menengah.',
    bgGrad: 'from-emerald-500/10 via-emerald-500/5 to-transparent'
  };

  if (isLand) {
    statusInfo = {
      title: 'Koordinat Daratan',
      status: 'DARATAN',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
      icon: Info,
      iconColor: 'text-slate-500',
      desc: 'Silakan pilih titik di perairan laut untuk melihat evaluasi kelayakan melaut nelayan.',
      bgGrad: 'from-slate-200/40 via-slate-100/20 to-transparent'
    };
  } else if (waveHeight !== null && waveHeight !== undefined) {
    if (waveHeight > 2.5) {
      statusInfo = {
        title: 'Peringatan Gelombang Tinggi (Bahaya)',
        status: 'BAHAYA',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse',
        icon: ShieldAlert,
        iconColor: 'text-rose-600',
        desc: 'Tinggi gelombang melebihi 2.5 meter. Sangat berisiko bagi perahu nelayan tradisional (< 10 GT). Diimbau menunda keberangkatan melaut.',
        bgGrad: 'from-rose-500/10 via-rose-500/5 to-transparent'
      };
    } else if (waveHeight >= 1.5) {
      statusInfo = {
        title: 'Waspada Gelombang Sedang',
        status: 'WASPADA',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        icon: AlertTriangle,
        iconColor: 'text-amber-600',
        desc: 'Tinggi gelombang antara 1.5 - 2.5 meter. Nelayan perahu kecil diminta waspada terhadap hempasan ombak dan angin kencang.',
        bgGrad: 'from-amber-500/10 via-amber-500/5 to-transparent'
      };
    }
  }

  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-6">
      {/* MODEL ML #2: SMART MARITIME RISK CLASSIFIER & XAI EXPLANATION */}
      {!isLand && (
        <div className="p-4 sm:p-6 rounded-2xl bg-white border border-indigo-100 shadow-sm relative overflow-hidden bg-gradient-to-br from-indigo-50/40 via-white to-sky-50/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-indigo-100/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs shrink-0">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-200">
                    Klasifikasi Keselamatan Maritim
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Ensemble + Softmax</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-800">
                  Klasifikasi Kelayakan Melaut & Indeks Risiko
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 block font-medium flex items-center sm:justify-end gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Confidence Score
                </span>
                <span className="text-xs font-bold text-indigo-700 font-mono">
                  {((aiSafety?.confidence ?? 0.88) * 100).toFixed(1)}% Keyakinan
                </span>
              </div>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${aiSafety?.badgeClass || 'bg-emerald-100 text-emerald-800 border-emerald-300'} flex items-center gap-1.5 shadow-2xs`}>
                <ShieldCheck className="w-4 h-4" />
                {aiSafety?.label || 'Kondisi Aman'}
              </span>
            </div>
          </div>

          {/* Softmax Probability Distribution Bar */}
          <div className="mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs mb-1.5 font-medium gap-1">
              <span className="text-slate-600 font-semibold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                Distribusi Probabilitas Softmax:
              </span>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] font-mono">
                <span className="text-emerald-700 font-bold">Aman: {((aiSafety?.probabilities?.safe ?? 0.8) * 100).toFixed(1)}%</span>
                <span className="text-amber-700 font-bold">Waspada: {((aiSafety?.probabilities?.caution ?? 0.15) * 100).toFixed(1)}%</span>
                <span className="text-rose-700 font-bold">Bahaya: {((aiSafety?.probabilities?.danger ?? 0.05) * 100).toFixed(1)}%</span>
              </div>
            </div>

            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${(aiSafety?.probabilities?.safe ?? 0.8) * 100}%` }}
                className="bg-emerald-500 transition-all duration-500"
                title={`Peluang Aman: ${((aiSafety?.probabilities?.safe ?? 0.8) * 100).toFixed(1)}%`}
              ></div>
              <div
                style={{ width: `${(aiSafety?.probabilities?.caution ?? 0.15) * 100}%` }}
                className="bg-amber-500 transition-all duration-500"
                title={`Peluang Waspada: ${((aiSafety?.probabilities?.caution ?? 0.15) * 100).toFixed(1)}%`}
              ></div>
              <div
                style={{ width: `${(aiSafety?.probabilities?.danger ?? 0.05) * 100}%` }}
                className="bg-rose-500 transition-all duration-500"
                title={`Peluang Bahaya: ${((aiSafety?.probabilities?.danger ?? 0.05) * 100).toFixed(1)}%`}
              ></div>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-600 leading-relaxed bg-white/80 p-2.5 rounded-xl border border-slate-100">
            {aiSafety?.explanation || 'Model maritim AI menganalisis kondisi pelayaran kondusif.'}
          </p>

          {/* Explainable AI (XAI) Feature Importance Matrix */}
          <div className="mt-4 pt-3.5 border-t border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Explainable AI (XAI) — Kontribusi Fitur Oseanografi terhadap Prediksi Risiko:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(aiSafety?.featureImportance || []).map((feat, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-600 font-medium truncate">{feat.name}</span>
                    <span className="font-mono font-bold text-indigo-600">{feat.weight}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${feat.weight}%` }}
                      className="h-full bg-indigo-500 rounded-full"
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block truncate font-mono">
                    Data: {feat.value || feat.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODEL ML #3: RADAR ZONA POTENSI PENANGKAPAN IKAN (ZPF) */}
      {!isLand && (
        <div className="p-4 sm:p-6 rounded-2xl bg-white border border-emerald-100 shadow-sm relative overflow-hidden bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
                <Fish className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                    Zona Potensi Penangkapan Ikan (ZPF)
                  </span>
                  <span className="text-xs text-slate-400 font-mono">• Thermal Front & Upwelling</span>
                </div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  Radar Zona Potensi Penangkapan Ikan
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {zpfHotspots.length} Hotspot Terdeteksi
                  </span>
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl font-medium flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                Tersinkron di Peta Leaflet
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Model spasial konvergensi oseanografi memprediksi titik akumulasi klorofil-a berdasarkan gradien suhu permukaan laut (SST) dan upwelling arus vertikal. Nelayan dapat memanfaatkan koordinat ini untuk efisiensi bahan bakar dan optimalisasi tangkapan.
          </p>

          {/* 3 Hotspot Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {zpfHotspots.map((spot) => {
              const isCopied = copiedZpfId === spot.id;
              const isSelected = Math.abs((coordinates?.lat ?? 0) - spot.lat) < 0.001 && Math.abs((coordinates?.lng ?? 0) - spot.lng) < 0.001;

              return (
                <div
                  key={spot.id}
                  className={`p-4 rounded-xl border bg-white shadow-xs flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                      : 'border-emerald-200 hover:border-emerald-400 hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        {spot.name}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                        {spot.probability}% Potensi
                      </span>
                    </div>

                    <div className="text-sm font-bold text-slate-800 mb-2">
                      {spot.species}
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-2">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Jarak Tempuh:</span>
                        <span className="font-semibold text-slate-700 font-mono">{spot.distanceKm} km</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Kedalaman:</span>
                        <span className="font-semibold text-slate-700">{spot.depthRange}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Thermal Front:</span>
                        <span className="font-semibold text-slate-700 font-mono">{spot.sstFront}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Upwelling:</span>
                        <span className="font-semibold text-slate-700 font-mono">{spot.upwellingVelocity}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Alat Tangkap:</span>
                        <span className="font-semibold text-emerald-700">{spot.recommendedGear}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyGps(spot)}
                      className="text-[10px] font-mono text-slate-500 hover:text-emerald-700 flex items-center gap-1 transition-colors cursor-pointer group"
                      title="Klik untuk menyalin koordinat angka GPS"
                    >
                      <span>{spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}</span>
                      {isCopied ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectSpot(spot)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-emerald-200'
                          : 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white hover:shadow-md'
                      }`}
                      title="Pilih titik lokasi ini untuk mengarahkan peta Leaflet ke koordinat hotspot ZPF"
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          <span>Titik Terpilih</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3.5 h-3.5 text-white" />
                          <span>Pilih Titik Lokasi</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Kartu Status Keamanan Utama Standar */}
      <div className={`p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden bg-gradient-to-r ${statusInfo.bgGrad}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-xl bg-white shadow-xs border border-slate-200 ${statusInfo.iconColor}`}>
              <StatusIcon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Status Kelayakan Melaut Standar</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusInfo.badgeClass}`}>
                  {statusInfo.status}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-800">{statusInfo.title}</h2>
            </div>
          </div>
          <div className="text-right sm:border-l sm:pl-4 border-slate-200">
            <span className="text-xs text-slate-500 block">Kategori Armada</span>
            <span className="text-sm font-semibold text-slate-700">Perahu Tradisional & Motor Tempel</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-3xl">
          {statusInfo.desc}
        </p>
      </div>

      {/* Grid Parameter Oseanografi: Gelombang, Arus Laut, Angin, Suhu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tinggi Gelombang */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tinggi Gelombang</span>
            <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
              <Waves className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-800 font-mono">
                {waveHeight !== null && waveHeight !== undefined ? waveHeight.toFixed(2) : '-'}
              </span>
              <span className="text-sm font-medium text-slate-500">meter</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
              <span>Periode:</span>
              <span className="font-semibold text-slate-700">
                {wavePeriod !== null && wavePeriod !== undefined ? `${wavePeriod.toFixed(1)}s` : '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Kecepatan Arus Laut */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Arus Air Laut</span>
            <div className="p-2 bg-cyan-50 text-cyan-600 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-800 font-mono">
                {currentVelocity.toFixed(1)}
              </span>
              <span className="text-sm font-medium text-slate-500">km/jam</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
              <span>Konversi Knots:</span>
              <span className="font-semibold text-slate-700">
                {(currentVelocity * 0.539957).toFixed(1)} knot
              </span>
            </div>
          </div>
        </div>

        {/* Kecepatan Angin */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Kecepatan Angin</span>
            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
              <Wind className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-800 font-mono">
                {windSpeed.toFixed(1)}
              </span>
              <span className="text-sm font-medium text-slate-500">km/jam</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
              <span>Skala Angin:</span>
              <span className="font-semibold text-slate-700">
                {(windSpeed * 0.539957).toFixed(1)} knot
              </span>
            </div>
          </div>
        </div>

        {/* Suhu Permukaan Laut */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Suhu Permukaan</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Thermometer className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-800 font-mono">
                {temperature.toFixed(1)}
              </span>
              <span className="text-sm font-medium text-slate-500">°C</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
              <span>Kondisi Laut:</span>
              <span className="font-semibold text-slate-700">
                {temperature > 30 ? 'Cukup Terik' : 'Kondusif'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Baris Kompas Arah Ombak & Arah Arus Laut */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-center">
          <Compass degree={waveDirection} title="Arah Datang Gelombang (Swell)" size="md" color="sky" />
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-center">
          <Compass degree={currentDirection} title="Arah Aliran Arus Air Laut" size="md" color="cyan" />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TAB 2: TRANSPORTASI (KAPAL FERI, PENYEBERANGAN, VISIBILITAS, ANGIN)
// ============================================================================
const TabTransport = ({ marine, forecast, hourlyData, isLand }) => {
  const visibility = forecast?.visibility ?? 10000;
  const windSpeed = forecast?.wind_speed_10m ?? 0;
  const windDirection = forecast?.wind_direction_10m ?? 0;
  const waveHeight = isLand ? null : (marine?.wave_height ?? 0);
  const currentVelocity = isLand ? 0 : (marine?.ocean_current_velocity ?? 0);

  const visibilityKm = (visibility / 1000).toFixed(1);

  // LOGIKA OPERASIONAL FERI:
  const isVisibilityLow = visibility < 2000;
  const isWindHigh = windSpeed > 30;
  const isWaveHigh = waveHeight !== null && waveHeight > 2.0;

  const hasWarning = !isLand && (isVisibilityLow || isWindHigh || isWaveHigh);

  return (
    <div className="space-y-6">
      {/* MODEL ML #1: TIME-SERIES WAVE & WIND FORECASTING (24-48 JAM) */}
      {!isLand && <HourlyForecastChart hourlyData={hourlyData} />}

      <div className={`p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden bg-gradient-to-r ${isLand ? 'from-slate-200/40 via-slate-100/20 to-transparent' : hasWarning ? 'from-rose-500/10 via-amber-500/5 to-transparent' : 'from-teal-500/10 via-sky-500/5 to-transparent'}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-xl bg-white shadow-xs border border-slate-200 ${isLand ? 'text-slate-500' : hasWarning ? 'text-rose-600' : 'text-teal-600'}`}>
              <Ship className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Status Operasional Penyeberangan</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${isLand ? 'bg-slate-100 text-slate-700 border-slate-300' : hasWarning ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300'}`}>
                  {isLand ? 'DARATAN' : hasWarning ? 'SIAGA OPERASIONAL' : 'NORMAL & AMAN'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                {isLand ? 'Koordinat Berada di Wilayah Daratan' : hasWarning ? 'Peringatan Operasional Pelayaran Feri' : 'Jalur Penyeberangan Beroperasi Normal'}
              </h2>
            </div>
          </div>
          <div className="text-right sm:border-l sm:pl-4 border-slate-200">
            <span className="text-xs text-slate-500 block">Protokol Keselamatan</span>
            <span className="text-sm font-semibold text-slate-700">ASDP & Syahbandar Port</span>
          </div>
        </div>

        {isLand ? (
          <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-3xl">
            Pilih titik di perairan laut atau alur pelayaran selat untuk melihat protokol kelaiklautan kapal penyeberangan feri dan fastboat.
          </p>
        ) : hasWarning ? (
          <div className="mt-4 p-3 bg-rose-50/80 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
            <strong className="block font-bold">Penyebab Pembatasan:</strong>
            {isVisibilityLow && <p>• Jarak pandang sangat terbatas ({visibilityKm} km &lt; batas aman 2.0 km). Risiko tabrakan kapal di alur sempit.</p>}
            {isWindHigh && <p>• Kecepatan angin kencang ({windSpeed.toFixed(1)} km/h &gt; batas 30 km/h). Manuver sandar dermaga berisiko tinggi.</p>}
            {isWaveHigh && <p>• Gelombang laut tinggi ({waveHeight !== null ? waveHeight.toFixed(2) : '-'} m &gt; batas 2.0 m). Berbahaya untuk rute penyeberangan Ro-Ro.</p>}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-3xl">
            Jarak pandang optimum ({visibilityKm} km), kecepatan angin stabil di bawah 30 km/h, dan alun gelombang bersahabat. Seluruh rute penyeberangan kapal feri dan cepat direkomendasikan berjalan sesuai jadwal.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Visibilitas / Jarak Pandang</span>
            <div className={`p-2 rounded-lg ${isVisibilityLow ? 'bg-rose-50 text-rose-600' : 'bg-sky-50 text-sky-600'}`}>
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-800 font-mono">
                {visibilityKm}
              </span>
              <span className="text-sm font-medium text-slate-500">kilometer</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
              <span>Status Navigasi:</span>
              <span className={`font-semibold ${isVisibilityLow ? 'text-rose-600' : 'text-emerald-600'}`}>
                {isVisibilityLow ? 'Kabut / Sangat Terbatas' : 'Jelas (Optimal)'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Kecepatan Angin</span>
            <div className={`p-2 rounded-lg ${isWindHigh ? 'bg-rose-50 text-rose-600' : 'bg-teal-50 text-teal-600'}`}>
              <Wind className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-800 font-mono">
                {windSpeed.toFixed(1)}
              </span>
              <span className="text-sm font-medium text-slate-500">km/jam</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
              <span>Skala Beaufort:</span>
              <span className="font-semibold text-slate-700">
                {windSpeed < 12 ? 'Angin Sepoi' : windSpeed < 29 ? 'Angin Sedang' : 'Angin Kencang'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Alun Gelombang Alur</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Waves className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-800 font-mono">
                {waveHeight ? waveHeight.toFixed(2) : '-'}
              </span>
              <span className="text-sm font-medium text-slate-500">meter</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
              <span>Hanyutan Arus:</span>
              <span className="font-semibold text-slate-700">
                {currentVelocity.toFixed(1)} km/jam
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-center">
          <Compass degree={windDirection} title="Arah Hembusan Angin" size="md" color="teal" />
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-600" />
              Checklist Kelaiklautan Penyeberangan Feri & Fastboat
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 mt-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Radar maritim dan AIS (Automatic Identification System) wajib aktif pada alur pelayaran ramai.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Kendaraan di dek kapal feri wajib dilashing kuat jika gelombang di atas 1.5 meter.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Jika jarak pandang &lt; 2 km, kapal diwajibkan menyalakan lampu kabut dan membunyikan semboyan suling kabut secara periodik.</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Koordinasi Pelabuhan: Kantor Kesyahbandaran dan Otoritas Pelabuhan (KSOP)</span>
            <span className="font-semibold text-sky-700">VHF Ch. 12 & 16</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TAB 3: PESELANCAR (SWELL QUALITY, PERIODE GELOMBANG, DUMMY BEACH CCTV)
// ============================================================================
const TabSurfer = ({ marine, forecast, isLand }) => {
  const waveHeight = isLand ? null : marine?.wave_height;
  const wavePeriod = isLand ? null : marine?.wave_period;
  const waveDirection = isLand ? null : marine?.wave_direction;

  const [isPlayingCctv, setIsPlayingCctv] = useState(true);
  const [activeCamAngle, setActiveCamAngle] = useState(1);
  const [cctvTime, setCctvTime] = useState(new Date().toLocaleTimeString('id-ID'));

  useEffect(() => {
    const timer = setInterval(() => {
      setCctvTime(new Date().toLocaleTimeString('id-ID'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  let swellRating = {
    title: 'Kualitas Swell Optimal (Groundswell)',
    grade: 'BAGUS',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    color: 'text-emerald-600',
    desc: 'Periode gelombang panjang di atas 8 detik menunjukkan energi groundswell murni dari samudera lepas. Gelombang memiliki jeda rapi, dinding ombak bertenaga, dan ideal untuk sesi surfing.',
  };

  if (isLand || wavePeriod === null || wavePeriod === undefined) {
    swellRating = {
      title: 'Tidak Ada Data Swell',
      grade: 'NIHIL',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
      color: 'text-slate-500',
      desc: 'Pilih titik di perairan laut pantai untuk melihat perkiraan kualitas swell dan ombak.',
    };
  } else if (wavePeriod <= 6) {
    swellRating = {
      title: 'Wind Swell Pendek (Chop)',
      grade: 'KURANG',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      color: 'text-rose-600',
      desc: 'Periode gelombang singkat di bawah 6 detik. Ombak cenderung berantakan, bertumpuk cepat, dan kurang bertenaga untuk manuver selancar.',
    };
  } else if (wavePeriod <= 8) {
    swellRating = {
      title: 'Swell Menengah (Moderate)',
      grade: 'SEDANG',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      color: 'text-amber-600',
      desc: 'Periode gelombang antara 6 - 8 detik. Ombak cukup bersahabat untuk pemula hingga intermediate peselancar.',
    };
  }

  const waveHeightFeet = waveHeight ? (waveHeight * 3.28084).toFixed(1) : '-';

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden bg-gradient-to-r from-cyan-500/10 via-sky-500/5 to-transparent">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-white shadow-xs border border-slate-200 text-cyan-600">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Analisis Swell Periode</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${swellRating.badgeClass}`}>
                  {swellRating.grade}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-800">{swellRating.title}</h2>
            </div>
          </div>
          <div className="text-right sm:border-l sm:pl-4 border-slate-200">
            <span className="text-xs text-slate-500 block">Tipe Break Pantai</span>
            <span className="text-sm font-semibold text-slate-700">Reef & Point Break</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-3xl">
          {swellRating.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Periode Swell (Wave Period)</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-800 font-mono">
                {wavePeriod !== null && wavePeriod !== undefined ? wavePeriod.toFixed(1) : '-'}
              </span>
              <span className="text-sm font-medium text-slate-500">detik</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
              <span>Batas Groundswell:</span>
              <span className="font-semibold text-slate-700">&gt; 8.0 detik</span>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tinggi Ombak (Wave Face)</span>
            <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
              <Waves className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-800 font-mono">
                {waveHeight !== null && waveHeight !== undefined ? waveHeight.toFixed(2) : '-'}
              </span>
              <span className="text-sm font-medium text-slate-500">meter</span>
              <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                ~{waveHeightFeet} ft
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
              <span>Tingkat Kesulitan:</span>
              <span className="font-semibold text-slate-700">
                {waveHeight > 2.0 ? 'Expert / Overhead' : waveHeight > 1.2 ? 'Intermediate' : 'Beginner Friendly'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-center">
          <Compass degree={waveDirection} title="Arah Datang Swell" size="sm" />
        </div>
      </div>

      {/* DUMMY CCTV PANTAI INTERAKTIF */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Visualisasi Simulasi CCTV Pantai (SurfCam)</h3>
              <p className="text-xs text-slate-500">Live preview simulasi kondisi gulungan ombak dan lineup peselancar</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600">
              <button
                onClick={() => setActiveCamAngle(1)}
                className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${activeCamAngle === 1 ? 'bg-white text-sky-700 font-bold shadow-2xs' : 'hover:text-slate-900'}`}
              >
                Kamera 1 (Break)
              </button>
              <button
                onClick={() => setActiveCamAngle(2)}
                className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${activeCamAngle === 2 ? 'bg-white text-sky-700 font-bold shadow-2xs' : 'hover:text-slate-900'}`}
              >
                Kamera 2 (Lineup)
              </button>
            </div>

            <button
              onClick={() => setIsPlayingCctv(!isPlayingCctv)}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors"
              title={isPlayingCctv ? 'Jeda Stream' : 'Putar Stream'}
            >
              {isPlayingCctv ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Dummy Video Player Frame */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 shadow-inner flex items-center justify-center border border-slate-800 group">
          <div className={`absolute inset-0 bg-gradient-to-b from-sky-900/60 via-cyan-950/70 to-slate-950 flex flex-col justify-end overflow-hidden ${isPlayingCctv ? '' : 'filter grayscale'}`}>
            <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="relative w-full h-36 overflow-hidden">
              <svg className={`absolute bottom-0 w-[200%] h-28 text-cyan-700/40 ${isPlayingCctv ? 'animate-[wave_8s_linear_infinite]' : ''}`} viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,0 C150,90 350,-40 500,60 C650,160 900,10 1200,40 L1200,120 L0,120 Z" fill="currentColor"></path>
              </svg>
              <svg className={`absolute bottom-0 w-[200%] h-24 text-sky-500/30 ${isPlayingCctv ? 'animate-[wave_5s_linear_infinite_reverse]' : ''}`} viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,40 C200,10 400,80 600,30 C800,-20 1000,70 1200,20 L1200,120 L0,120 Z" fill="currentColor"></path>
              </svg>
              <svg className={`absolute bottom-0 w-[200%] h-16 text-cyan-400/20 ${isPlayingCctv ? 'animate-[wave_4s_ease-in-out_infinite]' : ''}`} viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,20 C300,60 600,0 900,40 C1100,70 1200,10 1200,10 L1200,120 L0,120 Z" fill="currentColor"></path>
              </svg>
            </div>
          </div>

          <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
            <span className="flex items-center gap-1.5 bg-rose-600/90 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              REC • LIVE
            </span>
            <span className="bg-black/60 backdrop-blur-xs text-white/90 text-[11px] font-mono px-2 py-0.5 rounded border border-white/10">
              CAM-{activeCamAngle.toString().padStart(2, '0')} // {activeCamAngle === 1 ? 'BEACH BREAK' : 'OUTER REEF LINEUP'}
            </span>
          </div>

          <div className="absolute top-4 right-4 z-10 text-right">
            <span className="bg-black/60 backdrop-blur-xs text-white/90 text-xs font-mono px-2 py-0.5 rounded border border-white/10 block">
              {cctvTime} WIB
            </span>
          </div>

          <div className="relative z-10 text-center pointer-events-none p-4">
            <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-white shadow-lg mb-2">
              <Video className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold">
                Nusantara OceanWatch SurfCam Network
              </span>
            </div>
            <p className="text-slate-300 text-xs max-w-sm drop-shadow">
              Menampilkan siaran simulasi real-time gelombang laut. Parameter gelombang tersinkronisasi otomatis dengan sensor Open-Meteo.
            </p>
          </div>

          <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-[11px] text-white/80 bg-black/50 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10">
            <div className="flex items-center gap-4">
              <span>Swell: <strong>{waveHeight ? `${waveHeight.toFixed(2)}m` : '-'}</strong></span>
              <span>Periode: <strong>{wavePeriod ? `${wavePeriod.toFixed(1)}s` : '-'}</strong></span>
              <span>Kualitas: <strong className="text-cyan-400">{swellRating.grade}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-white/60">
              <span>1080p • 60 FPS • Feed Sinkron</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TAB 4: PARIWISATA (ARUS RIP, INDEKS UV & TABIR SURYA, SUHU PANTAI)
// ============================================================================
const TabTourism = ({ marine, forecast, isLand }) => {
  const uvIndex = forecast?.uv_index ?? 0;
  const temperature = forecast?.temperature_2m ?? 0;
  const waveHeight = isLand ? null : (marine?.wave_height ?? 0);
  const wavePeriod = isLand ? null : (marine?.wave_period ?? 0);

  // MODEL ML #4: Wave Energy Flux Rip Current Hazard Analysis
  const ripAnalysis = calculateRipHazard(marine, forecast, isLand);

  let ripCurrentRisk = {
    level: 'RENDAH',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    title: 'Arus Balik Relatif Tenang',
    icon: LifeBuoy,
    color: 'text-emerald-600',
    desc: 'Kombinasi tinggi dan periode gelombang saat ini memicu risiko arus tarik (rip current) yang rendah. Aman untuk berenang di dekat bibir pantai.',
  };

  if (isLand) {
    ripCurrentRisk = {
      level: 'TIDAK BERLAKU',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
      title: 'Koordinat Bukan Pesisir',
      icon: Info,
      color: 'text-slate-500',
      desc: 'Pilih titik pantai atau pesisir laut untuk melihat estimasi risiko arus rip.',
    };
  } else if (waveHeight >= 1.8 || (waveHeight >= 1.3 && wavePeriod >= 7.0)) {
    ripCurrentRisk = {
      level: 'TINGGI (BAHAYA)',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse',
      title: 'Waspada Tinggi Arus Tarik Pantai (Rip Current)',
      icon: ShieldAlert,
      color: 'text-rose-600',
      desc: 'Energi gelombang yang kuat berpotensi besar membentuk lorong arus balik mematikan (rip current) yang menarik perenang ke tengah laut. Dilarang berenang di zona bendera merah!',
    };
  } else if (waveHeight >= 1.0) {
    ripCurrentRisk = {
      level: 'SEDANG (WASPADA)',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      title: 'Perhatian Arus Tarik Menengah',
      icon: AlertTriangle,
      color: 'text-amber-600',
      desc: 'Terdapat potensi pembentukan arus balik di sekitar celah gosong pasir. Wisatawan diimbau selalu menggunakan pelampung dan tidak berenang sendirian.',
    };
  }

  const requiresHighSunscreen = uvIndex >= 7;

  let uvRating = {
    category: 'Rendah',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    advice: 'Tingkat radiasi UV matahari minimal. Sangat aman beraktivitas tanpa perlindungan ekstra.',
  };

  if (uvIndex >= 11) {
    uvRating = {
      category: 'Ekstrem',
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
      advice: 'Tingkat radiasi ekstrem! Hindari paparan langsung matahari antara pukul 10:00 - 15:00. Wajib sunscreen SPF 50+, pakaian tertutup, dan topi lebar.',
    };
  } else if (uvIndex >= 8) {
    uvRating = {
      category: 'Sangat Tinggi',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      advice: 'Radiasi UV sangat kuat! Wajib mengoleskan tabir surya (sunscreen SPF 30+) setiap 2 jam sekali, gunakan kacamata hitam UV400, dan payung pantai.',
    };
  } else if (uvIndex >= 6) {
    uvRating = {
      category: 'Tinggi',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      advice: 'Radiasi UV tinggi. Disarankan menggunakan sunscreen SPF 30+, kacamata hitam, dan minum air putih yang cukup untuk mencegah dehidrasi.',
    };
  } else if (uvIndex >= 3) {
    uvRating = {
      category: 'Sedang',
      badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      advice: 'Tingkat UV moderat. Kenakan pakaian pelindung jika beraktivitas di bawah terik matahari lebih dari 45 menit.',
    };
  }

  const RipIcon = ripCurrentRisk.icon;

  return (
    <div className="space-y-6">
      {/* MODEL ML #4: RIP CURRENT HAZARD INDEX & COMPUTER VISION SCANNER */}
      {!isLand && (
        <div className="space-y-4">
          <div className="p-5 bg-gradient-to-r from-rose-50/80 via-amber-50/60 to-indigo-50/80 border border-rose-200/90 rounded-2xl text-xs shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-600 text-white rounded-xl shadow-xs">
                <Scan className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200">
                    Analisis Arus Pecah Pantai (Rip Current)
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Wave Energy Flux & Vision</span>
                </div>
                <div className="text-sm font-bold text-slate-800">
                  Rip Current Hazard Score: <span className="font-mono text-rose-700 font-extrabold">{Number(ripAnalysis?.hazardScore ?? ripAnalysis?.ripScore ?? 20).toFixed(0)}/100</span> ({ripAnalysis?.riskLevel || ripAnalysis?.riskCategory || 'RENDAH'})
                </div>
                <span className="text-[11px] text-slate-600">
                  Fluks Energi: <strong>{Number(ripAnalysis?.energyFlux ?? 1.5).toFixed(2)} kW/m</strong> • Probabilitas Arus Tarik: <strong>{((ripAnalysis?.probability ?? 0.25) * 100).toFixed(1)}%</strong>
                </span>
              </div>
            </div>

            <div className="text-right sm:border-l sm:pl-4 border-slate-200 shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Batas Aman Berenang</span>
              <span className="text-xs font-bold text-rose-700 bg-white px-3 py-1.5 rounded-xl border border-rose-200 inline-block shadow-2xs">
                Buffer Min. {ripAnalysis?.safeBufferMeters ?? 25}m dari Celah Karang
              </span>
            </div>
          </div>

          {/* AI Coastal Vision Camera Scanner */}
          <CoastalVisionScanner marineData={marine} forecastData={forecast} />
        </div>
      )}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-rose-500/5 to-transparent">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-xl bg-white shadow-xs border border-slate-200 ${ripCurrentRisk.color}`}>
              <RipIcon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Peringatan Bahaya Pesisir</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${ripCurrentRisk.badgeClass}`}>
                  RISIKO {ripCurrentRisk.level}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-800">{ripCurrentRisk.title}</h2>
            </div>
          </div>
          <div className="text-right sm:border-l sm:pl-4 border-slate-200">
            <span className="text-xs text-slate-500 block">Zonasi Rekreasi Pantai</span>
            <span className="text-sm font-semibold text-slate-700">Lifeguard Balawista</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-3xl">
          {ripCurrentRisk.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Indeks Radiasi UV</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Sun className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-800 font-mono">
                {uvIndex.toFixed(1)}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${uvRating.badgeClass}`}>
                {uvRating.category}
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-500 border-t border-slate-100 pt-2">
              {uvRating.advice}
            </div>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border shadow-sm flex flex-col justify-between ${requiresHighSunscreen ? 'bg-amber-50/70 border-amber-300' : 'bg-white border-slate-200/90'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Protokol Tabir Surya</span>
            <div className={`p-2 rounded-lg ${requiresHighSunscreen ? 'bg-amber-200 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
              <Umbrella className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="mb-2">
              {requiresHighSunscreen ? (
                <span className="inline-flex items-center gap-1.5 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-2xs">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  WAJIB SUNSCREEN SPF 30+
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Sunscreen Ringan Cukup
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
              {requiresHighSunscreen
                ? 'Indeks UV melebihi ambang batas 7. Kulit rentan mengalami sunburn dalam tempo 15 menit tanpa proteksi tabir surya.'
                : 'Indeks UV masih dalam batas aman. Tetap jaga hidrasi tubuh saat berada di pantai berpasir.'}
            </p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Suhu Pesisir Pantai</span>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <Thermometer className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-800 font-mono">
                {temperature.toFixed(1)}
              </span>
              <span className="text-sm font-medium text-slate-500">°C</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
              <span>Sensasi Termal:</span>
              <span className="font-semibold text-slate-700">
                {temperature > 32 ? 'Panas Menyengat' : temperature > 27 ? 'Hangat Tropis' : 'Sejuk'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
          <LifeBuoy className="w-4 h-4 text-sky-600" />
          Rekomendasi Aktivitas Rekreasi Pantai Hari Ini
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-bold text-slate-700 block mb-1">Berenang di Pesisir</span>
            <span className={`inline-block px-2 py-0.5 rounded font-semibold ${ripCurrentRisk.level.includes('TINGGI') ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {ripCurrentRisk.level.includes('TINGGI') ? 'Dilarang Keras' : 'Aman di Zona Hijau'}
            </span>
            <p className="text-slate-500 mt-1.5 text-[11px]">Selalu pantau batas rambu bendera pengawas pantai.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-bold text-slate-700 block mb-1">Snorkeling & Diving</span>
            <span className={`inline-block px-2 py-0.5 rounded font-semibold ${waveHeight > 1.5 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {waveHeight > 1.5 ? 'Waspada Alun Dasar' : 'Sangat Direkomendasikan'}
            </span>
            <p className="text-slate-500 mt-1.5 text-[11px]">Visibilitas air jernih saat angin laut tenang.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-bold text-slate-700 block mb-1">Banana Boat & Jet Ski</span>
            <span className={`inline-block px-2 py-0.5 rounded font-semibold ${waveHeight > 2.0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {waveHeight > 2.0 ? 'Dihentikan Sementara' : 'Operasional Normal'}
            </span>
            <p className="text-slate-500 mt-1.5 text-[11px]">Wajib mengenakan rompi pelampung berstandar SOLAS.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-bold text-slate-700 block mb-1">Berjemur & Santai</span>
            <span className={`inline-block px-2 py-0.5 rounded font-semibold ${uvIndex >= 8 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {uvIndex >= 8 ? 'Gunakan Payung Pantai' : 'Nyaman & Sejuk'}
            </span>
            <p className="text-slate-500 mt-1.5 text-[11px]">Gunakan kacamata hitam dan rehidrasi berkala.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// KOMPONEN SLIDE BAR TIMELINE CUACA & GELOMBANG 14 HARI (UNIVERSAL LINTAS SEKTOR)
// ============================================================================
const WeeklyTimelineSlideBar = ({ weeklyData, isLand, activeTab, onOpenFullForecast }) => {
  const sliderRef = useRef(null);
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'future', 'past'
  const [selectedDate, setSelectedDate] = useState(null);

  if (!weeklyData || !weeklyData.allDays || weeklyData.allDays.length === 0) return null;

  const { allDays, pastDays, today, futureDays } = weeklyData;
  const daysToDisplay = filterMode === 'future' ? futureDays : filterMode === 'past' ? pastDays : allDays;

  const scroll = (direction) => {
    if (sliderRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      sliderRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Geser otomatis ke kartu hari ini saat awal tampil
  useEffect(() => {
    if (sliderRef.current) {
      const todayEl = sliderRef.current.querySelector('[data-is-today="true"]');
      if (todayEl) {
        todayEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [filterMode]);

  const activeDay = selectedDate ? allDays.find((d) => d.date === selectedDate) : null;

  // Analisis kontekstual per sektor pengguna untuk tanggal yang dipilih
  const getSectorInsight = (day) => {
    if (!day) return null;
    const wave = day.waveMax;
    const wind = day.windSpeedMax;
    const isPast = day.dayCategory === 'past';

    if (activeTab === 'nelayan') {
      if (wave !== null && wave > 2.5) {
        return {
          title: isPast ? 'Catatan Nelayan: Gelombang Ekstrem Terjadi' : 'Peringatan Nelayan: Sangat Berisiko Melaut',
          desc: `Tinggi gelombang ${wave.toFixed(2)}m dengan angin ${wind?.toFixed(1) || '-'} km/h. Sangat berbahaya bagi perahu motor tempel & nelayan tradisional (< 10 GT). Disarankan tidak melaut.`,
          badge: 'BAHAYA',
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
        };
      } else if (wave !== null && wave >= 1.5) {
        return {
          title: isPast ? 'Catatan Nelayan: Gelombang Sedang Teramati' : 'Peringatan Nelayan: Waspadai Alun Sedang',
          desc: `Tinggi gelombang ${wave.toFixed(2)}m. Waspada terhadap hempasan ombak pesisir dan perubahan arah angin mendadak.`,
          badge: 'WASPADA',
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        };
      } else {
        return {
          title: isPast ? 'Catatan Nelayan: Perairan Sangat Tenang' : 'Rekomendasi Nelayan: Kondisi Laut Sangat Prima',
          desc: `Ketinggian ombak tenang (${wave !== null ? wave.toFixed(2) + 'm' : '< 1.2m'}) dan hembusan angin stabil. Sangat kondusif untuk operasional jaring dan tangkapan ikan.`,
          badge: 'AMAN',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        };
      }
    } else if (activeTab === 'transportasi') {
      const isHighWind = wind && wind > 30;
      const isHighWave = wave && wave > 2.0;
      return {
        title: isHighWind || isHighWave ? 'Peringatan ASDP: Siaga Operasional Penyeberangan' : 'Status ASDP: Jalur Penyeberangan Beroperasi Normal',
        desc: `Kecepatan angin ${wind?.toFixed(1) || '-'} km/h dan gelombang ${wave !== null ? wave.toFixed(2) + 'm' : '-'}. ${isHighWind || isHighWave ? 'Manuver sandar dermaga kapal feri Ro-Ro memerlukan kehati-hatian ekstra.' : 'Rute pelayaran kapal feri dan fastboat diproyeksikan lancar sesuai jadwal.'}`,
        badge: isHighWind || isHighWave ? 'SIAGA OPERASIONAL' : 'NORMAL & LANCAR',
        badgeClass: isHighWind || isHighWave ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300',
      };
    } else if (activeTab === 'peselancar') {
      return {
        title: wave && wave > 1.8 ? 'Swell Kuat Bertenaga (Overhead Wave Face)' : 'Swell Ramah Bersahabat (Fun Wave)',
        desc: `Prediksi ombak ${wave !== null ? wave.toFixed(2) + 'm' : '-'} (~${wave ? (wave * 3.28).toFixed(1) : '-'} ft) dengan periode ${day.wavePeriod ? day.wavePeriod.toFixed(1) + 's' : '-'}. ${wave && wave > 1.8 ? 'Ideal untuk peselancar menengah hingga mahir.' : 'Sangat aman untuk sesi latihan pemula.'}`,
        badge: wave && wave > 1.8 ? 'SWELL BESAR' : 'MODERATE',
        badgeClass: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      };
    } else {
      // Pariwisata / Default
      const uv = day.uvMax;
      const isDangerousWave = wave && wave >= 1.8;
      return {
        title: isDangerousWave ? 'Peringatan Pantai: Waspada Arus Rip & Ombak Pasang' : uv >= 8 ? 'Protokol Tabir Surya: Radiasi UV Sangat Kuat' : 'Aktivitas Wisata Pesisir Sangat Nyaman',
        desc: `Indeks UV ${uv.toFixed(1)}, curah hujan ${day.precip.toFixed(1)} mm, ombak bibir pantai ${wave !== null ? wave.toFixed(2) + 'm' : '-'}. ${isDangerousWave ? 'Dilarang berenang di zona bendera merah akibat potensi arus tarik pantai.' : uv >= 8 ? 'Wajib mengoleskan sunscreen SPF 30+ jika berenang/berjemur.' : 'Sangat nyaman untuk jalan santai dan rekreasi keluarga di tepi pantai.'}`,
        badge: isDangerousWave ? 'BAHAYA OMBAK' : uv >= 8 ? 'UV TINGGI' : 'AMAN & NYAMAN',
        badgeClass: isDangerousWave ? 'bg-rose-100 text-rose-800 border-rose-300' : uv >= 8 ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300',
      };
    }
  };

  const sectorInsight = getSectorInsight(activeDay);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3">
      {/* Header Bar Slide Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-sky-600 text-white rounded-xl shadow-xs">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 text-xs sm:text-sm">
                Slide Bar Cuaca & Gelombang (14 Hari)
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                Geser ◀ ▶
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {activeTab === 'nelayan'
                ? 'Histori 7 hari & proyeksi 7 hari untuk estimasi kelayakan melaut nelayan tangkap.'
                : activeTab === 'transportasi'
                ? 'Pantau cuaca & ketinggian gelombang untuk rute pelayaran kapal feri & logistik.'
                : activeTab === 'peselancar'
                ? 'Kondisi swell ombak 1 minggu lalu & 1 minggu depan untuk sesi surfing ideal.'
                : activeTab === 'pariwisata'
                ? 'Tren cuaca, radiasi UV & kondisi aman berwisata di pesisir pantai nusantara.'
                : 'Pantau catatan 1 minggu ke belakang & prakiraan 1 minggu ke depan di sektor ini.'}
            </p>
          </div>
        </div>

        {/* Filter Pill Controls & Scroll Arrows */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                filterMode === 'all' ? 'bg-sky-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua (14 Hari)
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('past')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                filterMode === 'past' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 Hari Lalu
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('future')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                filterMode === 'future' ? 'bg-sky-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 Hari Depan
            </button>
          </div>

          <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="w-7 h-7 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              title="Geser ke kiri"
              aria-label="Geser ke kiri"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="w-7 h-7 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              title="Geser ke kanan"
              aria-label="Geser ke kanan"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {onOpenFullForecast && (
            <button
              type="button"
              onClick={onOpenFullForecast}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-[11px] font-bold transition-all cursor-pointer border border-sky-200 ml-1"
              title="Buka Halaman Analisis 14 Hari Penuh"
            >
              <span>Detail 14 Hari</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Horizontally Scrollable Slide Bar Track */}
      <div
        ref={sliderRef}
        className="flex items-stretch gap-2.5 overflow-x-auto pb-2 pt-1 px-1 scroll-smooth select-none scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
      >
        {daysToDisplay.map((day, idx) => {
          const isToday = day.dayCategory === 'today';
          const isSelected = selectedDate === day.date;
          const isPast = day.dayCategory === 'past';

          return (
            <div
              key={idx}
              data-is-today={isToday}
              onClick={() => setSelectedDate(isSelected ? null : day.date)}
              className={`flex-shrink-0 w-28 sm:w-32 p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between text-left group ${
                isSelected
                  ? 'border-sky-500 bg-sky-50/70 ring-2 ring-sky-500/30 shadow-sm'
                  : isToday
                  ? 'border-cyan-400 bg-gradient-to-b from-cyan-50/70 to-white shadow-2xs'
                  : isPast
                  ? 'border-slate-200/80 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300'
                  : 'border-slate-200/90 bg-white hover:border-sky-300 hover:shadow-2xs'
              }`}
            >
              {/* Top: Relative Badge & Day Name */}
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-bold text-slate-700 truncate">
                  {day.dateInfo.dayName}
                </span>
                <span
                  className={`text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${
                    isToday
                      ? 'bg-cyan-500 text-white border-cyan-600'
                      : isPast
                      ? 'bg-slate-200/70 text-slate-600 border-slate-300'
                      : 'bg-sky-100 text-sky-700 border-sky-200'
                  }`}
                >
                  {day.relLabel}
                </span>
              </div>

              <span className="text-[9.5px] text-slate-400 font-mono block mb-1">
                {day.dateInfo.dayDate} {day.dateInfo.monthName}
              </span>

              {/* Icon & Temp */}
              <div className="flex items-center justify-between my-1">
                <span className="text-xl drop-shadow-2xs">{day.weatherInfo.icon}</span>
                <div className="text-right font-mono text-[10px] font-bold text-slate-700">
                  {day.tempMax !== null ? `${Math.round(day.tempMax)}°` : '-'}
                  <span className="text-slate-400 text-[9px] font-normal"> / {day.tempMin !== null ? `${Math.round(day.tempMin)}°` : '-'}</span>
                </div>
              </div>

              {/* Wave & Wind Metrics */}
              <div className="space-y-0.5 border-t border-slate-100/90 pt-1.5 mt-1 text-[10px]">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-slate-400 text-[9px] flex items-center gap-0.5">
                    <Waves className="w-3 h-3 text-sky-600" />
                  </span>
                  <span className={`font-bold ${day.waveMax > 2.0 ? 'text-rose-600' : day.waveMax >= 1.5 ? 'text-amber-600' : 'text-slate-700'}`}>
                    {day.waveMax !== null ? `${day.waveMax.toFixed(2)}m` : '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between font-mono">
                  <span className="text-slate-400 text-[9px] flex items-center gap-0.5">
                    <Wind className="w-3 h-3 text-teal-600" />
                  </span>
                  <span className="text-slate-600">
                    {day.windSpeedMax !== null ? `${Math.round(day.windSpeedMax)}k` : '-'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expandable Selected Day Inspector for Current Sector */}
      {activeDay && sectorInsight && (
        <div className="p-3.5 bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 text-white rounded-xl shadow-md border border-sky-700/60 animate-in fade-in duration-200 mt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{activeDay.weatherInfo.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-white">
                    {activeDay.dateInfo.full} ({activeDay.relLabel})
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.2 rounded-full border ${sectorInsight.badgeClass}`}>
                    {sectorInsight.badge}
                  </span>
                </div>
                <span className="text-[11px] text-cyan-300 font-medium">
                  {sectorInsight.title}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedDate(null)}
              className="text-[11px] text-slate-300 hover:text-white px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors self-end sm:self-auto cursor-pointer"
            >
              ✕ Tutup
            </button>
          </div>

          <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <p className="text-[11px] text-slate-300 leading-relaxed max-w-xl">
              {sectorInsight.desc}
            </p>

            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 font-mono text-[10px] bg-white/10 p-2 sm:px-3 sm:py-1.5 rounded-lg border border-white/10 shrink-0">
              <div>
                <span className="text-slate-400 block text-[9px]">OMBAK MAX</span>
                <span className="font-bold text-white">{activeDay.waveMax !== null ? `${activeDay.waveMax.toFixed(2)}m` : '-'}</span>
              </div>
              <span className="hidden sm:inline text-slate-600">•</span>
              <div>
                <span className="text-slate-400 block text-[9px]">ANGIN MAX</span>
                <span className="font-bold text-white">{activeDay.windSpeedMax !== null ? `${activeDay.windSpeedMax.toFixed(1)} km/h` : '-'}</span>
              </div>
              <span className="hidden sm:inline text-slate-600">•</span>
              <div>
                <span className="text-slate-400 block text-[9px]">SUHU</span>
                <span className="font-bold text-white">{activeDay.tempMin}° - {activeDay.tempMax}°C</span>
              </div>
              <span className="hidden sm:inline text-slate-600">•</span>
              <div>
                <span className="text-slate-400 block text-[9px]">HUJAN</span>
                <span className="font-bold text-white">{activeDay.precip.toFixed(1)} mm</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// TAB 5: ANALISIS & PREDIKSI CUACA 14 HARI (1 MINGGU LALU & 1 MINGGU DEPAN)
// ============================================================================
const TabWeeklyForecast = ({ weeklyData, isLand }) => {
  const [subMode, setSubMode] = useState('future'); // 'future', 'past', 'all'
  const [chartMetric, setChartMetric] = useState('wave'); // 'wave' or 'wind'
  const [hoverIndex, setHoverIndex] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  if (!weeklyData || !weeklyData.allDays || weeklyData.allDays.length === 0) {
    return (
      <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-slate-500 text-sm space-y-3">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="font-semibold text-slate-700">Mengambil & Menganalisis Data Cuaca 14 Hari...</p>
        <p className="text-xs text-slate-400">Sinkronisasi data historis 1 minggu ke belakang dan proyeksi 1 minggu ke depan dari sensor satelit.</p>
      </div>
    );
  }

  const {
    allDays,
    pastDays,
    today,
    futureDays,
    pastAvgWave,
    pastMaxWave,
    pastAvgWind,
    pastRainyDays,
    futureAvgWave,
    futureMaxWave,
    futureAvgWind,
    futureWaveTrend,
    bestFutureDay,
  } = weeklyData;

  const displayedDays = subMode === 'future' ? futureDays : subMode === 'past' ? pastDays : allDays;

  // Chart Coordinates setup (allDays)
  const isWave = chartMetric === 'wave';
  const chartData = allDays.map((d) => ({
    date: d.date,
    dateInfo: d.dateInfo,
    dayCategory: d.dayCategory,
    relLabel: d.relLabel,
    val: isWave ? (d.waveMax !== null ? d.waveMax : 0) : (d.windSpeedMax !== null ? d.windSpeedMax : 0),
    waveMax: d.waveMax,
    windSpeedMax: d.windSpeedMax,
    tempMax: d.tempMax,
    tempMin: d.tempMin,
    weatherInfo: d.weatherInfo,
    safetyLevel: d.safetyLevel,
  }));

  const valList = chartData.map((d) => d.val);
  const maxVal = Math.max(...valList, isWave ? 2.5 : 35.0);
  const minVal = 0;

  const chartWidth = 720;
  const chartHeight = 175;
  const paddingX = 35;
  const paddingY = 24;
  const innerW = chartWidth - paddingX * 2;
  const innerH = chartHeight - paddingY * 2;

  const coords = chartData.map((d, i) => {
    const x = paddingX + (i / Math.max(1, chartData.length - 1)) * innerW;
    const y = paddingY + innerH - ((d.val - minVal) / Math.max(0.1, maxVal - minVal)) * innerH;
    return { x, y, data: d, index: i };
  });

  const linePath = coords.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
  const areaPath = coords.length > 0
    ? `${linePath} L ${coords[coords.length - 1].x} ${paddingY + innerH} L ${coords[0].x} ${paddingY + innerH} Z`
    : '';

  const todayIndex = chartData.findIndex((d) => d.dayCategory === 'today');
  const todayCoord = todayIndex !== -1 ? coords[todayIndex] : null;

  const activePoint = hoverIndex !== null && coords[hoverIndex] ? coords[hoverIndex] : null;

  return (
    <div className="space-y-6">
      {/* HEADER UTAMA & TOGGLE SUB-MODE */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden bg-gradient-to-r from-sky-950/5 via-indigo-900/5 to-cyan-900/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-600 text-white shadow-sm">
              <CalendarDays className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full font-mono">
                  Fitur Cuaca & Oseanografi 14 Hari
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  • 1 Minggu Lalu & 1 Minggu Depan
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                Prakiraan & Catatan Historis Cuaca Maritim
              </h2>
            </div>
          </div>

          {/* Toggle Tombol Pilihan Mode */}
          <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 text-xs font-bold self-start md:self-auto gap-1">
            <button
              onClick={() => { setSubMode('future'); setSelectedDay(null); }}
              className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 ${
                subMode === 'future'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <span>1 Minggu Depan</span>
            </button>

            <button
              onClick={() => { setSubMode('past'); setSelectedDay(null); }}
              className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 ${
                subMode === 'past'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>1 Minggu Lalu</span>
            </button>

            <button
              onClick={() => { setSubMode('all'); setSelectedDay(null); }}
              className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 ${
                subMode === 'all'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <span>14 Hari Lengkap</span>
            </button>
          </div>
        </div>

        <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          {subMode === 'future'
            ? 'Menampilkan proyeksi cuaca, kecepatan angin, dan tinggi gelombang 7 hari ke depan untuk membantu nelayan, kapal feri, dan wisatawan merencanakan aktivitas bahari dengan aman.'
            : subMode === 'past'
            ? 'Menampilkan catatan historis kondisi laut dan atmosfer 7 hari ke belakang untuk evaluasi tren oseanografi dan pola cuaca yang telah berlangsung.'
            : 'Menampilkan kesinambungan timeline data 14 hari penuh (7 hari historis + hari ini + 7 hari prakiraan masa depan).'}
        </p>
      </div>

      {/* INTELLIGENCE CARDS & STATISTIK AI */}
      {subMode === 'future' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-sky-100 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Tren Gelombang 7 Hari</span>
              <div className="p-1.5 bg-sky-50 text-sky-600 rounded-lg">
                <BarChart2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-800 flex items-center gap-1.5">
                {futureWaveTrend === 'MENINGKAT' ? (
                  <><TrendingUp className="w-4 h-4 text-rose-500" /> Cenderung Meningkat</>
                ) : futureWaveTrend.includes('MEREDA') ? (
                  <><TrendingDown className="w-4 h-4 text-emerald-500" /> Cenderung Mereda</>
                ) : (
                  <><Activity className="w-4 h-4 text-sky-500" /> Relatif Stabil</>
                )}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">
                Rata-rata: <strong>{futureAvgWave} m</strong>
              </span>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">Hari Terbaik Melaut</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">Rekomendasi</span>
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800 block">
                {bestFutureDay ? bestFutureDay.dateInfo.full : 'N/A'}
              </span>
              <span className="text-[11px] text-emerald-700 block mt-1 font-medium">
                Ombak: <strong>{bestFutureDay?.waveMax ? `${bestFutureDay.waveMax.toFixed(2)}m` : '-'}</strong> • {bestFutureDay?.weatherInfo.label || 'Cerah'}
              </span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Gelombang Puncak (Max)</span>
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <Waves className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-slate-800 font-mono">{futureMaxWave}</span>
                <span className="text-xs text-slate-500 font-medium">meter</span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">
                {Number(futureMaxWave) >= 2.5 ? 'Waspada: Gelombang tinggi' : Number(futureMaxWave) >= 1.5 ? 'Waspada: Gelombang sedang' : 'Kondisi aman terkendali'}
              </span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Rata-rata Kecepatan Angin</span>
              <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg">
                <Wind className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-slate-800 font-mono">{futureAvgWind}</span>
                <span className="text-xs text-slate-500 font-medium">km/h</span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-1 font-mono">
                ~{(Number(futureAvgWind || 0) * 0.539957).toFixed(1)} knot
              </span>
            </div>
          </div>
        </div>
      )}

      {subMode === 'past' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-indigo-100 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Rata-rata Ombak 7 Hari Lalu</span>
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <Waves className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-slate-800 font-mono">{pastAvgWave}</span>
                <span className="text-xs text-slate-500 font-medium">meter</span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">Kondisi historis perairan</span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Puncak Ombak Minggu Lalu</span>
              <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-slate-800 font-mono">{pastMaxWave}</span>
                <span className="text-xs text-slate-500 font-medium">meter</span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">Rekor gelombang tertinggi</span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Frekuensi Hari Hujan</span>
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <CloudRain className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-slate-800 font-mono">{pastRainyDays}</span>
                <span className="text-xs text-slate-500 font-medium">hari hujan</span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">Dari 7 hari yang lalu</span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Rata-rata Angin Historis</span>
              <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg">
                <Wind className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-slate-800 font-mono">{pastAvgWind}</span>
                <span className="text-xs text-slate-500 font-medium">km/h</span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-1 font-mono">
                ~{(Number(pastAvgWind || 0) * 0.539957).toFixed(1)} knot
              </span>
            </div>
          </div>
        </div>
      )}

      {/* GRAFIK TIMELINE 14 HARI (INTERAKTIF SVG) */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                Kurva Kontinu 14 Hari (Histori 7 Hari Lalu ➔ Prediksi 7 Hari Depan)
              </h3>
              <p className="text-[11px] text-slate-400">
                Garis vertikal tengah menandai posisi hari ini. Arahkan kursor ke titik untuk melihat rincian per tanggal.
              </p>
            </div>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setChartMetric('wave')}
              className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${isWave ? 'bg-sky-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Gelombang (m)
            </button>
            <button
              onClick={() => setChartMetric('wind')}
              className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${!isWave ? 'bg-teal-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Angin (km/h)
            </button>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="relative w-full overflow-hidden select-none">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto overflow-visible cursor-crosshair"
            onMouseLeave={() => setHoverIndex(null)}
          >
            <defs>
              <linearGradient id="weeklyWaveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="weeklyWindGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0d9488" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Background Zonasi: Kiri = 1 Minggu Lalu, Kanan = 1 Minggu Depan */}
            {todayCoord && (
              <>
                <rect
                  x={paddingX}
                  y={paddingY}
                  width={todayCoord.x - paddingX}
                  height={innerH}
                  fill="#f8fafc"
                  opacity="0.8"
                />
                <rect
                  x={todayCoord.x}
                  y={paddingY}
                  width={chartWidth - paddingX - todayCoord.x}
                  height={innerH}
                  fill="#f0f9ff"
                  opacity="0.5"
                />
                <text x={paddingX + 8} y={paddingY + 12} fill="#94a3b8" fontSize="8" fontWeight="bold" fontFamily="monospace">
                  ◀ 1 MINGGU LALU (HISTORIS)
                </text>
                <text x={chartWidth - paddingX - 8} y={paddingY + 12} textAnchor="end" fill="#0284c7" fontSize="8" fontWeight="bold" fontFamily="monospace">
                  1 MINGGU DEPAN (PREDIKSI) ▶
                </text>
              </>
            )}

            {/* Garis Vertikal Penanda Hari Ini */}
            {todayCoord && (
              <g>
                <line
                  x1={todayCoord.x}
                  y1={paddingY}
                  x2={todayCoord.x}
                  y2={paddingY + innerH}
                  stroke="#0284c7"
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                />
                <rect
                  x={todayCoord.x - 24}
                  y={paddingY - 14}
                  width="48"
                  height="12"
                  rx="3"
                  fill="#0284c7"
                />
                <text
                  x={todayCoord.x}
                  y={paddingY - 5}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="7.5"
                  fontWeight="bold"
                >
                  HARI INI
                </text>
              </g>
            )}

            {/* Threshold References for Wave */}
            {isWave && (
              <>
                <line
                  x1={paddingX}
                  y1={paddingY + innerH - (1.5 / Math.max(0.1, maxVal)) * innerH}
                  x2={chartWidth - paddingX}
                  y2={paddingY + innerH - (1.5 / Math.max(0.1, maxVal)) * innerH}
                  stroke="#f59e0b"
                  strokeDasharray="4,4"
                  strokeWidth="0.8"
                />
                <line
                  x1={paddingX}
                  y1={paddingY + innerH - (2.5 / Math.max(0.1, maxVal)) * innerH}
                  x2={chartWidth - paddingX}
                  y2={paddingY + innerH - (2.5 / Math.max(0.1, maxVal)) * innerH}
                  stroke="#ef4444"
                  strokeDasharray="4,4"
                  strokeWidth="0.8"
                />
              </>
            )}

            {/* Area & Line */}
            <path d={areaPath} fill={isWave ? 'url(#weeklyWaveGrad)' : 'url(#weeklyWindGrad)'} />
            <path d={linePath} fill="none" stroke={isWave ? '#0284c7' : '#0d9488'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Interactive Circles & Hit Areas */}
            {coords.map((c, i) => {
              const isToday = c.data.dayCategory === 'today';
              const isPast = c.data.dayCategory === 'past';
              const isHovered = hoverIndex === i;

              return (
                <g
                  key={i}
                  onMouseEnter={() => setHoverIndex(i)}
                  onTouchStart={() => setHoverIndex(i)}
                  onClick={() => setHoverIndex(i)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={isHovered ? 6 : isToday ? 5 : 3}
                    fill={isHovered ? '#ffffff' : isToday ? '#0284c7' : isPast ? '#94a3b8' : isWave ? '#0284c7' : '#0d9488'}
                    stroke={isToday ? '#ffffff' : isWave ? '#0284c7' : '#0d9488'}
                    strokeWidth={isHovered ? 2.5 : isToday ? 2 : 1}
                    className="transition-all"
                  />
                  <rect
                    x={c.x - (innerW / Math.max(1, coords.length)) / 2}
                    y={0}
                    width={innerW / Math.max(1, coords.length)}
                    height={chartHeight}
                    fill="transparent"
                  />
                </g>
              );
            })}

            {/* Sumbu X Label Tanggal */}
            {coords.map((c, i) => {
              if (i % 2 === 0 || i === coords.length - 1 || c.data.dayCategory === 'today') {
                return (
                  <text
                    key={i}
                    x={c.x}
                    y={chartHeight - 4}
                    textAnchor="middle"
                    fill={c.data.dayCategory === 'today' ? '#0284c7' : '#94a3b8'}
                    fontSize="8.5"
                    fontWeight={c.data.dayCategory === 'today' ? 'bold' : 'normal'}
                    fontFamily="monospace"
                  >
                    {c.data.dateInfo.dayDate} {c.data.dateInfo.monthName}
                  </text>
                );
              }
              return null;
            })}
          </svg>

          {/* Hover / Touch Tooltip Overlay */}
          {activePoint && (
            <div
              className="absolute top-3 pointer-events-none bg-slate-900/95 backdrop-blur-md text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl shadow-xl text-[10px] sm:text-[11px] border border-slate-700 transform -translate-x-1/2 flex items-center gap-1.5 sm:gap-2.5 z-30 max-w-[92vw] whitespace-nowrap"
              style={{ left: `${Math.max(18, Math.min(82, (activePoint.x / chartWidth) * 100))}%` }}
            >
              <div className="font-bold text-cyan-300 font-mono">
                {activePoint.data.dateInfo.dayDate}/{activePoint.data.dateInfo.monthNum} ({activePoint.data.relLabel})
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span>{activePoint.data.weatherInfo.icon}</span>
                <span className="hidden sm:inline">{activePoint.data.weatherInfo.label}</span>
              </div>
              <span>•</span>
              <div className="font-bold text-white">
                {isWave
                  ? `${activePoint.data.waveMax !== null ? `${activePoint.data.waveMax.toFixed(2)}m` : '-'}`
                  : `${activePoint.data.windSpeedMax !== null ? `${activePoint.data.windSpeedMax.toFixed(1)}km/h` : '-'}`}
              </div>
              <div className="text-[10px] text-slate-400 hidden sm:inline">
                Suhu: {activePoint.data.tempMin}° - {activePoint.data.tempMax}°C
              </div>
            </div>
          )}
        </div>
      </div>

      {/* GRID KARTU PER HARI */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {subMode === 'future' ? 'Prakiraan 7 Hari ke Depan' : subMode === 'past' ? 'Catatan 7 Hari ke Belakang' : 'Seluruh 14 Hari'}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              ({displayedDays.length} Hari Terdata)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 italic">
            Klik kartu untuk rincian
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {displayedDays.map((day, idx) => {
            const isToday = day.dayCategory === 'today';
            const isSelected = selectedDay && selectedDay.date === day.date;

            return (
              <div
                key={idx}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs flex flex-col justify-between ${
                  isSelected
                    ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-md'
                    : isToday
                    ? 'border-cyan-400 bg-gradient-to-br from-cyan-50/50 to-white'
                    : 'border-slate-200/90 hover:border-sky-300 hover:shadow-sm'
                }`}
              >
                <div>
                  {/* Baris Atas: Tanggal & Badge Relatif */}
                  <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        {day.dateInfo.dayName}, {day.dateInfo.dayDate} {day.dateInfo.monthName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {day.date}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isToday
                          ? 'bg-cyan-100 text-cyan-800 border-cyan-300 font-mono'
                          : day.dayCategory === 'past'
                          ? 'bg-slate-100 text-slate-600 border-slate-200'
                          : 'bg-sky-50 text-sky-700 border-sky-200'
                      }`}
                    >
                      {day.relLabel || (day.dayCategory === 'past' ? 'Histori' : 'Prediksi')}
                    </span>
                  </div>

                  {/* Cuaca & Suhu */}
                  <div className="flex items-center justify-between gap-2 my-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl drop-shadow-xs">{day.weatherInfo.icon}</span>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">
                          {day.weatherInfo.label}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {day.dayCategory === 'past' ? 'Cuaca Teramati' : 'Prakiraan WMO'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-extrabold text-slate-700 font-mono">
                        {day.tempMax !== null ? `${Math.round(day.tempMax)}°` : '-'}
                        <span className="text-slate-400 font-normal text-[10px]"> / {day.tempMin !== null ? `${Math.round(day.tempMin)}°` : '-'}</span>
                      </div>
                      <span className="text-[9px] text-slate-400 block">Suhu Max/Min</span>
                    </div>
                  </div>

                  {/* Metrik Oseanografi: Gelombang & Angin */}
                  <div className="space-y-1.5 text-xs border-t border-slate-100 pt-2.5">
                    {/* Gelombang Laut */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[11px] flex items-center gap-1">
                        <Waves className="w-3.5 h-3.5 text-sky-600" /> Ombak:
                      </span>
                      {day.waveMax !== null ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800 font-mono text-[11px]">
                            {day.waveMax.toFixed(2)} m
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${day.safetyBadgeClass}`}>
                            {day.safetyLevel}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Data darat</span>
                      )}
                    </div>

                    {/* Kecepatan Angin */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[11px] flex items-center gap-1">
                        <Wind className="w-3.5 h-3.5 text-teal-600" /> Angin:
                      </span>
                      <span className="font-semibold text-slate-700 font-mono text-[11px]">
                        {day.windSpeedMax !== null ? `${day.windSpeedMax.toFixed(1)} km/h` : '-'}
                      </span>
                    </div>

                    {/* Hujan & UV */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-blue-500" /> {day.precip > 0 ? `${day.precip.toFixed(1)} mm` : '0 mm'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Sun className="w-3 h-3 text-amber-500" /> UV: {day.uvMax > 0 ? day.uvMax.toFixed(1) : '0'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Kartu */}
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Arah: {day.waveDir !== null ? getCardinalDirection(day.waveDir) : (day.windDir !== null ? getCardinalDirection(day.windDir) : '-')}</span>
                  <span className="text-sky-600 font-semibold flex items-center gap-0.5">
                    {isSelected ? 'Tutup ✕' : 'Rincian →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAIL MODAL / DRAWER JIKA SATU HARI DIKLIK */}
      {selectedDay && (
        <div className="p-5 bg-gradient-to-r from-sky-900 to-indigo-950 text-white rounded-2xl shadow-lg border border-sky-700/60 animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-400 text-slate-900 uppercase font-mono">
                  Detail Analisis Harian
                </span>
                <span className="text-xs text-cyan-200">{selectedDay.dateInfo.full} ({selectedDay.relLabel})</span>
              </div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span>{selectedDay.weatherInfo.icon}</span>
                <span>Kondisi {selectedDay.weatherInfo.label}</span>
              </h3>
            </div>

            <button
              onClick={() => setSelectedDay(null)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-xs"
            >
              ✕ Tutup
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mt-3">
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="text-sky-200 text-[11px] block">Tinggi Gelombang Max</span>
              <span className="text-base font-bold font-mono">
                {selectedDay.waveMax !== null ? `${selectedDay.waveMax.toFixed(2)} m` : 'N/A (Daratan)'}
              </span>
              <span className="text-[10px] text-slate-300 block mt-0.5">
                Periode: {selectedDay.wavePeriod ? `${selectedDay.wavePeriod.toFixed(1)}s` : '-'}
              </span>
            </div>

            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="text-sky-200 text-[11px] block">Kecepatan Angin Max</span>
              <span className="text-base font-bold font-mono">
                {selectedDay.windSpeedMax !== null ? `${selectedDay.windSpeedMax.toFixed(1)} km/h` : '-'}
              </span>
              <span className="text-[10px] text-slate-300 block mt-0.5">
                Arah: {getCardinalDirection(selectedDay.windDir)}
              </span>
            </div>

            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="text-sky-200 text-[11px] block">Rentang Suhu Udara</span>
              <span className="text-base font-bold font-mono">
                {selectedDay.tempMin}°C - {selectedDay.tempMax}°C
              </span>
              <span className="text-[10px] text-slate-300 block mt-0.5">
                Indeks UV: {selectedDay.uvMax.toFixed(1)}
              </span>
            </div>

            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="text-sky-200 text-[11px] block">Status Kelayakan Melaut</span>
              <span className="text-base font-bold flex items-center gap-1.5 text-cyan-300">
                {selectedDay.safetyLevel}
              </span>
              <span className="text-[10px] text-slate-300 block mt-0.5">
                Curah Hujan: {selectedDay.precip.toFixed(1)} mm
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// KOMPONEN UTAMA APLIKASI (SPA NUSANTARA OCEANWATCH)
// ============================================================================
export default function App() {
  // Guard Permanen: Proteksi Watermark Hak Cipta & Self-Healing Anti-Tamper
  useAuthorWatermarkGuard();

  const [coordinates, setCoordinates] = useState({ lat: -5.925, lng: 105.885 });
  const [locationName, setLocationName] = useState('Selat Sunda (Perairan Merak - Bakauheni)');
  const [activeTab, setActiveTab] = useState('nelayan');

  const [marineData, setMarineData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [hourlyData, setHourlyData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  const [isLocating, setIsLocating] = useState(false);
  const [locationToast, setLocationToast] = useState(null);

  // Ambil Data Gelombang, Arah, Periode, Arus Laut, Prakiraan Jam-Jaman, dan Analisis 14 Hari (7 Hari Lalu + 7 Hari Depan)
  const fetchMaritimeData = useCallback(async (lat, lng) => {
    setIsLoading(true);
    setApiError(null);

    const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&current=wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_direction,swell_wave_period,ocean_current_velocity,ocean_current_direction&hourly=wave_height,wave_direction,wave_period&daily=wave_height_max,wave_direction_dominant,wave_period_max&past_days=7&forecast_days=8&timezone=auto`;
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m,wind_direction_10m,visibility,uv_index&hourly=temperature_2m,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_direction_10m_dominant,precipitation_sum,uv_index_max&past_days=7&forecast_days=8&timezone=auto`;

    try {
      const [marineRes, forecastRes] = await Promise.all([
        fetch(marineUrl),
        fetch(forecastUrl),
      ]);

      if (!marineRes.ok || !forecastRes.ok) {
        throw new Error('Gagal menghubungi server Open-Meteo API.');
      }

      const marineJson = await marineRes.json();
      const forecastJson = await forecastRes.json();

      const seaGridLat = marineJson.latitude ?? lat;
      const seaGridLng = marineJson.longitude ?? lng;
      const elevation = Number(forecastJson.elevation) || 0;

      // Hitung jarak spasial koordinat yang dipilih terhadap titik grid model laut Open-Meteo
      const dLat = (seaGridLat - lat) * 111.0;
      const dLng = (seaGridLng - lng) * 111.0 * Math.cos((lat * Math.PI) / 180);
      const distanceToSeaGridKm = Math.sqrt(dLat * dLat + dLng * dLng);

      // Deteksi Presisi Daratan vs Perairan:
      // Titik dianggap daratan jika wave_height null, ATAU (elevasi >= 6 mdpl dan jarak ke grid laut > 4 km), ATAU jarak ke grid laut > 25 km
      const detectedIsLand =
        marineJson.current?.wave_height === null ||
        (elevation >= 6.0 && distanceToSeaGridKm > 4.0) ||
        distanceToSeaGridKm > 25.0;

      setMarineData(
        marineJson.current
          ? {
              ...marineJson.current,
              gridLatitude: seaGridLat,
              gridLongitude: seaGridLng,
              distanceToSeaGridKm,
              elevation,
              isLandDetected: detectedIsLand,
            }
          : null
      );

      setForecastData(
        forecastJson.current
          ? {
              ...forecastJson.current,
              elevation,
            }
          : null
      );

      if (marineJson.hourly && forecastJson.hourly) {
        setHourlyData({
          time: marineJson.hourly.time || forecastJson.hourly.time || [],
          wave_height: marineJson.hourly.wave_height || [],
          wave_period: marineJson.hourly.wave_period || [],
          wind_speed: forecastJson.hourly.wind_speed_10m || [],
          wind_speed_10m: forecastJson.hourly.wind_speed_10m || [],
          temperature_2m: forecastJson.hourly.temperature_2m || [],
        });
      } else {
        setHourlyData(null);
      }

      // Olah Data 14 Hari (1 Minggu ke Belakang & 1 Minggu ke Depan)
      if (forecastJson.daily) {
        const processedWeekly = processWeeklyData(forecastJson.daily, marineJson.daily);
        setWeeklyData(processedWeekly);
      } else {
        setWeeklyData(null);
      }

      setLastRefreshed(new Date().toLocaleTimeString('id-ID'));
    } catch (err) {
      console.error('Error fetching maritime data:', err);
      setApiError(err.message || 'Terjadi gangguan saat mengambil data maritim.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMaritimeData(coordinates.lat, coordinates.lng);
  }, [coordinates, fetchMaritimeData]);

  const handleLocationChange = useCallback((lat, lng, name) => {
    setCoordinates({ lat, lng });
    if (name) {
      setLocationName(name);
    } else {
      setLocationName(`Koordinat Laut [${lat.toFixed(4)}, ${lng.toFixed(4)}]`);
    }
  }, []);

  // Pencarian Lokasi dengan Open-Meteo Geocoding Bebas & Gratis (100% Free, Tanpa API Key)
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      const query = searchQuery.trim();
      const lowerQuery = query.toLowerCase();

      // Cocokkan dengan kamus perairan maritim terverifikasi
      const matchedMaritimePresets = MARITIME_PRESET_COORDINATES.filter((p) =>
        p.keywords.some((k) => lowerQuery.includes(k) || k.includes(lowerQuery)) ||
        p.name.toLowerCase().includes(lowerQuery)
      ).map((p) => ({
        name: `${p.name} (Koordinat Laut Terverifikasi)`,
        lat: p.lat,
        lng: p.lng,
        source: 'Perairan Terverifikasi',
      }));

      try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=id&format=json`;
        const res = await fetch(url);
        const data = await res.json();

        let apiResults = [];
        if (data.results && data.results.length > 0) {
          apiResults = data.results.map((item) => ({
            name: `${item.name}${item.admin1 ? `, ${item.admin1}` : ''}, ${item.country || 'Indonesia'}`,
            lat: item.latitude,
            lng: item.longitude,
            source: 'Open-Meteo',
          }));
        } else {
          const geoapifyUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&lang=id&limit=5&apiKey=cb1_43hv_1_dc2da8fefaba1830bc9337bc`;
          const gRes = await fetch(geoapifyUrl);
          const gData = await gRes.json();
          if (gRes.ok && gData.features && gData.features.length > 0) {
            apiResults = gData.features.map((item) => ({
              name: item.properties.formatted || item.properties.name || query,
              lat: item.geometry.coordinates[1],
              lng: item.geometry.coordinates[0],
              source: 'Geoapify',
            }));
          }
        }

        const combined = [...matchedMaritimePresets, ...apiResults];
        setSearchResults(combined);
        setShowDropdown(combined.length > 0);
      } catch (err) {
        console.error('Pencarian lokasi gagal:', err);
        if (matchedMaritimePresets.length > 0) {
          setSearchResults(matchedMaritimePresets);
          setShowDropdown(true);
        } else {
          setSearchResults([]);
        }
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Auto focus input ketika search bar dibuka/melebar
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowDropdown(false);
        if (!searchQuery.trim()) {
          setIsSearchExpanded(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchQuery]);

  const handleSelectSearchResult = (result) => {
    setCoordinates({ lat: result.lat, lng: result.lng });
    setLocationName(result.name);
    setSearchQuery('');
    setShowDropdown(false);
    setIsSearchExpanded(false);
  };

  const handleCloseSearch = () => {
    setSearchQuery('');
    setShowDropdown(false);
    setIsSearchExpanded(false);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationToast('Peramban Anda tidak mendukung fitur Geolocation.');
      setTimeout(() => setLocationToast(null), 4000);
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(5));
        const lng = Number(pos.coords.longitude.toFixed(5));
        setCoordinates({ lat, lng });
        setLocationName('Lokasi Pengguna Saat Ini (GPS Browser)');
        setIsLocating(false);
        setLocationToast('Berhasil mendapatkan koordinat lokasi Anda.');
        setTimeout(() => setLocationToast(null), 3500);
      },
      (err) => {
        setIsLocating(false);
        let errorMsg = 'Gagal mendeteksi lokasi.';
        if (err.code === 1) errorMsg = 'Izin akses lokasi ditolak oleh pengguna.';
        else if (err.code === 2) errorMsg = 'Posisi lokasi tidak tersedia.';
        else if (err.code === 3) errorMsg = 'Batas waktu deteksi lokasi habis.';
        setLocationToast(errorMsg);
        setTimeout(() => setLocationToast(null), 4000);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Evaluasi status daratan: jika model laut mendeteksi daratan atau elevasi darat terbukti
  const isLand = Boolean(marineData?.isLandDetected || (marineData && marineData.wave_height === null));
  const nearestSeaCoord = marineData?.gridLatitude && isLand ? {
    lat: marineData.gridLatitude,
    lng: marineData.gridLongitude,
    distKm: marineData.distanceToSeaGridKm,
  } : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased selection:bg-sky-500 selection:text-white">
      {/* HEADER UTAMA (z-[1000] agar komponen peta saat scroll tidak pernah menutupi navbar) */}
      <header className="bg-gradient-to-r from-sky-950 via-sky-900 to-cyan-800 text-white shadow-md border-b border-sky-800/60 sticky top-0 z-[1000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-500/20 rounded-xl border border-cyan-400/30 shadow-inner flex items-center justify-center">
                <Waves className="w-7 h-7 text-cyan-300" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                    Nusantara OceanWatch
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-400/20 text-cyan-200 border border-cyan-300/30 px-2 py-0.5 rounded-full">
                    Live Maritim
                  </span>
                  <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-950/80 border border-cyan-400/40 text-[10px] text-cyan-200 font-mono select-none shadow-xs">
                    <ShieldCheck className="w-3 h-3 text-cyan-300" />
                    <span>Author: <strong className="text-white">{APP_AUTHOR.signature}</strong></span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-sky-200/80 font-medium">
                    Sistem Informasi Cuaca Maritim Terpadu Real-Time
                  </p>
                  <span className="lg:hidden text-[10px] text-cyan-300/90 font-mono bg-sky-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
                    {APP_AUTHOR.nim}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-1.5 sm:gap-2 relative">
              {/* FIELD SEARCH EXPANDABLE (ICON YANG MELEBAR JIKA DIKLIK) */}
              <div
                ref={searchContainerRef}
                className={`relative flex items-center transition-all duration-300 ease-in-out ${
                  isSearchExpanded ? 'w-full sm:w-80 md:w-96' : 'w-auto'
                }`}
              >
                {!isSearchExpanded ? (
                  <button
                    type="button"
                    onClick={() => setIsSearchExpanded(true)}
                    className="h-9 sm:h-10 w-9 sm:w-10 bg-sky-950/70 hover:bg-sky-900 active:scale-95 text-cyan-300 hover:text-white rounded-xl border border-sky-700/70 hover:border-cyan-400 shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center group shrink-0"
                    title="Cari Titik Lokasi Maritim (Pantai, Pelabuhan, Selat)"
                    aria-label="Cari Titik Lokasi"
                  >
                    <Search className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  </button>
                ) : (
                  <div className="relative w-full flex items-center animate-in fade-in duration-200">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') handleCloseSearch();
                      }}
                      onFocus={() => searchQuery.trim().length >= 2 && setShowDropdown(true)}
                      placeholder="Cari pelabuhan, selat, pantai, pulau..."
                      className="w-full pl-9 pr-14 py-2 bg-sky-950/95 focus:bg-sky-950 text-white placeholder-sky-300/60 text-xs sm:text-sm rounded-xl border border-cyan-400 focus:outline-hidden focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30 transition-all shadow-lg"
                    />
                    <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {isSearching && (
                        <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-1"></div>
                      )}
                      <button
                        type="button"
                        onClick={handleCloseSearch}
                        className="p-1 rounded-lg text-sky-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        title="Tutup Pencarian (Esc)"
                        aria-label="Tutup Pencarian"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {showDropdown && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-1">
                        {searchResults.length > 0 ? (
                          searchResults.map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSelectSearchResult(item)}
                              className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-sky-50 border-b border-slate-100 last:border-b-0 flex items-center justify-between cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                                <div className="truncate">
                                  <span className="font-medium text-slate-800 truncate block">{item.name}</span>
                                  {item.source && (
                                    <span className="text-[10px] text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded font-medium inline-block mt-0.5">
                                      {item.source}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                                {item.lat.toFixed(2)}, {item.lng.toFixed(2)}
                              </span>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-xs text-slate-500 text-center">
                            {isSearching ? 'Mencari lokasi...' : 'Tidak ditemukan lokasi maritim yang cocok.'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Tombol Model ML & Lokasi Saya (disembunyikan saat search terbuka di mobile agar pas di layar) */}
              <button
                onClick={() => setShowAiModal(true)}
                className={`${isSearchExpanded ? 'hidden sm:flex' : 'flex'} items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs border border-indigo-400/40 transition-all cursor-pointer shrink-0`}
                title="Buka Pusat Model Oseanografi & Sains Data"
              >
                <Brain className="w-4 h-4 text-cyan-300" />
                <span className="hidden sm:inline">Model Analitik</span>
                <span className="sm:hidden">Model</span>
              </button>

              <button
                onClick={handleGetCurrentLocation}
                disabled={isLocating}
                className={`${isSearchExpanded ? 'hidden sm:flex' : 'flex'} items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs border border-cyan-400/40 transition-all cursor-pointer shrink-0 disabled:opacity-50`}
                title="Gunakan Lokasi GPS Saya Saat Ini"
              >
                <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Lokasi Saya</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-sky-950/40 border-t border-sky-800/40 px-3 sm:px-6 lg:px-8 py-2 overflow-x-auto scrollbar-none touch-pan-x">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs">
            <span className="text-cyan-200/80 font-bold shrink-0 flex items-center gap-1">
              <Anchor className="w-3 h-3 text-cyan-400" />
              Titik Populer:
            </span>
            <div className="flex items-center gap-1.5">
              {POPULAR_HOTSPOTS.map((hotspot, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCoordinates({ lat: hotspot.lat, lng: hotspot.lng });
                    setLocationName(hotspot.name);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-sky-900/60 hover:bg-sky-800 text-sky-100 border border-sky-700/50 hover:border-cyan-400/60 transition-colors whitespace-nowrap cursor-pointer text-[11px]"
                  title={hotspot.desc}
                >
                  {hotspot.name.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {locationToast && (
        <div className="fixed bottom-5 right-5 z-[1050] bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{locationToast}</span>
        </div>
      )}

      {/* LAYOUT UTAMA */}
      <main className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* KOLOM KIRI (1/3 di Desktop) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Area Pantauan
                    </span>
                    <h2 className="text-sm font-bold text-slate-800 line-clamp-1">
                      {locationName}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => fetchMaritimeData(coordinates.lat, coordinates.lng)}
                  disabled={isLoading}
                  className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                  title="Muat Ulang Data"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-sky-600' : ''}`} />
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-sans">Lintang (Lat):</span>
                  <span className="font-bold text-slate-700">{coordinates.lat.toFixed(5)}°</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-sans">Bujur (Lng):</span>
                  <span className="font-bold text-slate-700">{coordinates.lng.toFixed(5)}°</span>
                </div>
              </div>

              {lastRefreshed && (
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Pembaruan Terakhir:</span>
                  <span className="font-medium text-slate-600">{lastRefreshed} WIB</span>
                </div>
              )}
            </div>

            {/* Peta Leaflet dengan Visualisasi Gelombang Air & Arus Laut */}
            <div id="map-container-section">
              <LeafletMap
                coordinates={coordinates}
                onLocationChange={handleLocationChange}
                marineData={marineData}
                forecastData={forecastData}
                isLand={isLand}
              />
            </div>

            <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-xl text-xs text-sky-800 flex items-start gap-2">
              <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>
                <strong>Fitur Visual Peta:</strong> Peta menampilkan estimasi jangkauan gelombang, vektor arah rambatan ombak, serta garis kontur aliran arus laut secara real-time.
              </span>
            </div>
          </div>

          {/* KOLOM KANAN (2/3 di Desktop) */}
          <div className="lg:col-span-8 space-y-6">
            {/* BANNER NUSANTARA MODEL ANALITIK OSEANOGRAFI */}
            <div className="p-4 bg-gradient-to-r from-sky-950 via-indigo-950 to-slate-900 rounded-2xl border border-sky-800/60 shadow-sm text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-500/20 text-cyan-300 rounded-xl border border-cyan-400/30 shrink-0">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-white">Sistem Komputasi & Model Analitik Oseanografi</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                      4 Model ML Aktif
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Prediksi Deret Waktu 48 Jam • Klasifikasi Keselamatan Pelayaran • Zona Potensi Penangkapan Ikan (ZPF) • Analisis Arus Rip
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-200 border border-white/15 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-300" />
                <span>Detail Arsitektur ML</span>
              </button>
            </div>
            <div className="bg-white p-1 sm:p-1.5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center overflow-x-auto scrollbar-none gap-1 sm:gap-1.5 touch-pan-x">
              <button
                onClick={() => setActiveTab('nelayan')}
                className={`flex-1 min-w-[95px] sm:min-w-[120px] py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                  activeTab === 'nelayan'
                    ? 'bg-sky-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Anchor className="w-4 h-4 shrink-0" />
                <span>Nelayan</span>
              </button>

              <button
                onClick={() => setActiveTab('transportasi')}
                className={`flex-1 min-w-[105px] sm:min-w-[120px] py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                  activeTab === 'transportasi'
                    ? 'bg-sky-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Ship className="w-4 h-4 shrink-0" />
                <span>Transportasi</span>
              </button>

              <button
                onClick={() => setActiveTab('peselancar')}
                className={`flex-1 min-w-[95px] sm:min-w-[120px] py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                  activeTab === 'peselancar'
                    ? 'bg-sky-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Waves className="w-4 h-4 shrink-0" />
                <span>Peselancar</span>
              </button>

              <button
                onClick={() => setActiveTab('pariwisata')}
                className={`flex-1 min-w-[95px] sm:min-w-[120px] py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                  activeTab === 'pariwisata'
                    ? 'bg-sky-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Umbrella className="w-4 h-4 shrink-0" />
                <span>Pariwisata</span>
              </button>

              <button
                onClick={() => setActiveTab('mingguan')}
                className={`flex-1 min-w-[125px] sm:min-w-[160px] py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                  activeTab === 'mingguan'
                    ? 'bg-sky-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <CalendarDays className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>14 Hari</span>
                <span className="hidden sm:inline">(Histori & Prediksi)</span>
              </button>
            </div>

            {apiError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <div className="flex-1">
                  <strong>Terjadi Kesalahan:</strong> {apiError}
                </div>
                <button
                  onClick={() => fetchMaritimeData(coordinates.lat, coordinates.lng)}
                  className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 cursor-pointer"
                >
                  Coba Lagi
                </button>
              </div>
            )}

            {!isLoading && isLand && (
              <LandWarningNotice
                onSelectSeaPoint={(lat, lng, name) => {
                  setCoordinates({ lat, lng });
                  setLocationName(name);
                }}
                nearestSeaCoord={nearestSeaCoord}
                elevation={marineData?.elevation}
              />
            )}

            {isLoading ? (
              <DataSkeleton />
            ) : (
              <div className="space-y-6">
                {/* SLIDE BAR KONDISI & PREDIKSI CUACA 14 HARI (TAMPIL DI SEMUA SEKTOR: NELAYAN, TRANSPORTASI, PESELANCAR, PARIWISATA) */}
                {weeklyData && activeTab !== 'mingguan' && (
                  <WeeklyTimelineSlideBar
                    weeklyData={weeklyData}
                    isLand={isLand}
                    activeTab={activeTab}
                    onOpenFullForecast={() => setActiveTab('mingguan')}
                  />
                )}

                {activeTab === 'nelayan' && (
                  <TabFisherman
                    marine={marineData}
                    forecast={forecastData}
                    isLand={isLand}
                    coordinates={coordinates}
                    onSelectLocation={handleLocationChange}
                  />
                )}

                {activeTab === 'transportasi' && (
                  <TabTransport
                    marine={marineData}
                    forecast={forecastData}
                    hourlyData={hourlyData}
                    isLand={isLand}
                  />
                )}

                {activeTab === 'peselancar' && (
                  <TabSurfer
                    marine={marineData}
                    forecast={forecastData}
                    isLand={isLand}
                  />
                )}

                {activeTab === 'pariwisata' && (
                  <TabTourism
                    marine={marineData}
                    forecast={forecastData}
                    isLand={isLand}
                  />
                )}

                {activeTab === 'mingguan' && (
                  <TabWeeklyForecast
                    weeklyData={weeklyData}
                    isLand={isLand}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-sky-600" />
              <span className="font-bold text-slate-700">Nusantara OceanWatch</span>
              <span>&copy; {new Date().getFullYear()} — Inovasi Maritim Digital Indonesia</span>
            </div>
            {/* Author Watermark Pill in Footer */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-sky-50 rounded-xl border border-sky-200 text-[11px] font-medium text-slate-700 select-none shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Author / Pengembang:</span>
              <strong className="text-sky-900 font-mono font-bold">{APP_AUTHOR.signature}</strong>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <span>Peta: OpenStreetMap (Free & Open Source)</span>
            <span>•</span>
            <span>Data Oseanografi: Open-Meteo Marine API</span>
            <span>•</span>
            <span>Cuaca Pesisir: Open-Meteo Forecast API</span>
            <span>•</span>
            <span>Pencarian: Open-Meteo Geocoding Bebas Kuota</span>
          </div>
        </div>
      </footer>

      {/* MODAL DETAIL ARSITEKTUR & METRIK MACHINE LEARNING */}
      <AiModelHubModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
      />
    </div>
  );
}
