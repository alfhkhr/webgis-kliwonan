# 🗺️ Peta Desa Kliwonan

WebGIS interaktif Desa Kliwonan yang menyajikan informasi geospasial desa secara digital. Peta ini digunakan untuk membantu masyarakat dalam mengenali wilayah Desa Kliwonan serta menampilkan berbagai fasilitas, sarana dan prasarana, kondisi lingkungan, potensi ekonomi, jaringan transportasi, dan informasi kewilayahan desa.

---

## 🌍 Fitur Utama

- **Multiple Basemap**
  - OpenStreetMap
  - Esri World Imagery
  - Google Satellite
  - OpenTopoMap

- **Peta Interaktif**
  - Navigasi peta
  - Zoom in / zoom out
  - Informasi fitur melalui pop-up
  - Pencarian dan visualisasi data spasial

- **Layer Batas & Wilayah**
  - Batas Desa Kliwonan
  - Batas Dusun
  - Batas RT

- **Sarana & Pelayanan**
  - Pemerintahan
  - Pendidikan
  - Peribadatan
  - Lapangan
  - TPU
  - SPPG
  - Koperasi Desa

- **Ekonomi**
  - UMKM
  - Industri

- **Transportasi & Infrastruktur**
  - Jaringan Jalan
  - Jalur Kereta Api
  - Penerangan Jalan Umum (PJU)
  - Area Minim Penerangan

- **Lingkungan & Potensi**
  - Sungai
  - Situs Budaya
  - Sumur Bor

- **Informasi Fasilitas Desa**
  - Jumlah Penerangan Jalan
  - Jumlah Tempat Peribadatan
  - Jumlah Peninggalan Sejarah
  - Informasi UMKM

- **Pengaturan Tampilan Layer**
  - Pengaturan warna
  - Ketebalan garis
  - Opacity
  - Pengaturan fill pada batas wilayah

- **Tool Pengukuran**
  - Pengukuran jarak
  - Pengukuran luas

- **Responsive Design**
  - Dapat digunakan pada komputer, laptop, tablet, maupun perangkat mobile.

- **GitHub Pages Ready**
  - WebGIS dapat dipublikasikan secara online menggunakan GitHub Pages.

---

## 📍 Wilayah

**Desa Kliwonan**

WebGIS ini dikembangkan untuk menyajikan informasi geospasial Desa Kliwonan secara interaktif dan mudah digunakan oleh masyarakat.

---

## 📂 Struktur Data

Data spasial yang digunakan dalam WebGIS meliputi:

### Batas & Wilayah

- Batas Desa Kliwonan
- Batas Dusun
- Batas RT

### Sarana & Pelayanan

- Pemerintahan
- Pendidikan
- Peribadatan
- Lapangan
- TPU
- SPPG
- Koperasi Desa

### Ekonomi

- UMKM
- Industri

### Transportasi & Infrastruktur

- Jaringan Jalan
- Jalur Kereta Api
- Penerangan Jalan (PJU)
- Area Minim Penerangan

### Lingkungan & Potensi

- Sungai
- Situs Budaya
- Sumur Bor

---

## 🗂️ Struktur Folder

```text
/
├── data/
│   ├── pju.geojson
│   ├── peribadatan.geojson
│   ├── situsbudaya.geojson
│   ├── umkm.geojson
│   ├── pemerintahan.geojson
│   ├── pendidikan.geojson
│   ├── lapangan.geojson
│   ├── tpu.geojson
│   ├── sppg.geojson
│   ├── kopdes.geojson
│   ├── industri.geojson
│   ├── jaringanjalan.geojson
│   ├── relkereta.geojson
│   ├── sungai.geojson
│   ├── sumbor.geojson
│   ├── batasdesa.geojson
│   ├── batasdusun.geojson
│   ├── batasrt.geojson
│   └── minim_penerangan.geojson
│
├── js/
│   ├── map-config.js
│   ├── popup-handler.js
│   ├── layer-manager.js
│   ├── main.js
│   └── measure-tool.js
│
├── videos/
│   └── logo_kliwonan.png
│
├── index.html
├── fasilitas.html
├── map.html
├── album.html
├── fasilitas.js
├── style.css
└── README.md
```

> Nama file pada folder `data/` dapat disesuaikan dengan struktur data yang digunakan pada proyek.

---

## 🚀 Cara Menjalankan

### 1. Clone Repository

```bash
git clone https://github.com/USERNAME/NAMA-REPOSITORY.git
```

Kemudian masuk ke folder proyek:

```bash
cd NAMA-REPOSITORY
```

### 2. Menjalankan WebGIS

Buka file:

```text
index.html
```

menggunakan browser.

Untuk pengembangan menggunakan Visual Studio Code, proyek dapat dijalankan menggunakan **Live Server** agar pemuatan file GeoJSON berjalan lebih stabil.

### 3. Publikasikan dengan GitHub Pages

Setelah repository diunggah ke GitHub, aktifkan:

```text
Settings
→ Pages
→ Deploy from a branch
→ main
→ / (root)
→ Save
```

Setelah proses deployment selesai, WebGIS dapat diakses melalui alamat GitHub Pages repository.

---

## 🗺️ Halaman WebGIS

### Home

Halaman utama yang memberikan informasi awal mengenai WebGIS Desa Kliwonan.

### Fasilitas

Halaman yang menampilkan informasi fasilitas Desa Kliwonan dalam bentuk ringkasan data, informasi kewilayahan, serta data fasilitas seperti PJU, peribadatan, peninggalan sejarah, dan UMKM.

### Peta Interaktif

Halaman utama untuk menjelajahi seluruh layer spasial Desa Kliwonan.

Pengguna dapat mengaktifkan atau menonaktifkan layer sesuai kebutuhan.

### Album Peta

Halaman untuk menampilkan dokumentasi atau koleksi peta Desa Kliwonan.

---

## 🧭 Layer Peta

Peta interaktif menyediakan beberapa kelompok layer:

### Batas & Wilayah

| Layer | Keterangan |
|---|---|
| Batas Desa Kliwonan | Batas administrasi desa |
| Batas Dusun | Pembagian wilayah dusun |
| Batas RT | Pembagian wilayah RT |

### Sarana & Pelayanan

| Layer | Keterangan |
|---|---|
| Pemerintahan | Fasilitas pemerintahan |
| Pendidikan | Fasilitas pendidikan |
| Peribadatan | Tempat ibadah |
| Lapangan | Fasilitas lapangan |
| TPU | Tempat Pemakaman Umum |
| SPPG | Sarana SPPG |
| Koperasi Desa | Fasilitas koperasi desa |

### Ekonomi

| Layer | Keterangan |
|---|---|
| UMKM | Sebaran usaha mikro, kecil, dan menengah |
| Industri | Sebaran lokasi industri |

### Transportasi & Infrastruktur

| Layer | Keterangan |
|---|---|
| Jaringan Jalan | Jaringan jalan di wilayah desa |
| Jalur Kereta Api | Jalur rel kereta api |
| PJU | Titik Penerangan Jalan Umum |
| Area Minim Penerangan | Area dengan kondisi penerangan yang minim |

### Lingkungan & Potensi

| Layer | Keterangan |
|---|---|
| Sungai | Jaringan sungai |
| Situs Budaya | Lokasi situs atau peninggalan budaya |
| Sumur Bor | Lokasi sumur bor |

---

## 💡 Data Penerangan Jalan

Data Penerangan Jalan Umum (PJU) menyajikan titik lokasi lampu penerangan jalan beserta informasi atributnya.

Contoh atribut PJU:

```text
ID Lampu
Dusun
Latitude
Longitude
Kondisi
BeginTime
EndTime
```

Status kondisi PJU dapat digunakan untuk memberikan informasi mengenai kondisi penerangan pada masing-masing titik.

---

## 🏪 Data UMKM

Data UMKM digunakan untuk menampilkan informasi persebaran usaha masyarakat Desa Kliwonan.

Informasi yang dapat ditampilkan antara lain:

- Nama usaha
- Kategori usaha
- Pemilik/pengelola
- Lokasi
- Informasi atribut lainnya yang tersedia pada data spasial

Data UMKM juga dapat ditampilkan dalam bentuk tabel pada halaman **Fasilitas**.

---

## 🏛️ Data Situs Budaya

Layer Situs Budaya digunakan untuk menampilkan lokasi peninggalan sejarah dan budaya yang terdapat di Desa Kliwonan.

Data ini dapat digunakan sebagai informasi pendukung dalam mengenali potensi sejarah dan budaya desa.

---

## 📊 Informasi Desa

Halaman fasilitas menyediakan ringkasan jumlah data spasial yang tersedia.

Beberapa informasi yang ditampilkan meliputi:

- Jumlah Penerangan Jalan
- Jumlah Tempat Peribadatan
- Jumlah Peninggalan Sejarah
- Informasi UMKM
- Informasi pembagian wilayah desa

Struktur wilayah yang ditampilkan meliputi:

- **3 Dusun**
- **3 RW**
- **6 RT**

---

## 🧩 Teknologi yang Digunakan

WebGIS ini dikembangkan menggunakan teknologi web dan pemetaan digital, antara lain:

- HTML5
- CSS3
- JavaScript
- Leaflet.js
- Leaflet Draw
- GeoJSON
- Font Awesome
- Google Fonts
- GitHub Pages

---

## 📡 Sumber Data

Data spasial dalam WebGIS Desa Kliwonan berasal dari:

- Data hasil digitasi
- Pengolahan data spasial
- Survei lapangan
- Data fasilitas dan kewilayahan Desa Kliwonan

---

## 👨‍💻 Pengembang

**Swakarsa Banyuurip**

**Desa Kliwonan**

WebGIS Desa Kliwonan dikembangkan sebagai media informasi geospasial untuk membantu masyarakat dalam mengenali wilayah, fasilitas, infrastruktur, potensi, serta kondisi Desa Kliwonan.

---

## 📜 Lisensi

Proyek ini dikembangkan untuk keperluan informasi, edukasi, dokumentasi, dan pengembangan WebGIS Desa Kliwonan.

Penggunaan dan pengembangan lebih lanjut dapat dilakukan dengan tetap mencantumkan sumber data dan pengembang.

---

## ❤️ Penutup

WebGIS Desa Kliwonan diharapkan dapat menjadi media informasi geospasial yang mudah digunakan serta mendukung penyampaian informasi mengenai kondisi wilayah dan potensi desa secara digital.

---

**© Swakarsa Banyuurip Desa Kliwonan**

**Peta Digital Desa Kliwonan**
