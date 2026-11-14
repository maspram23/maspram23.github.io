# Website Portofolio Maspram

Website statis (HTML, CSS, JavaScript murni) untuk **Sigit Pramono / Maspram**:
fotografi, coding, aplikasi PAKU, dan toko POD.

Tidak butuh Node.js, build tool, atau server khusus. Cukup buka `index.html`
di browser, atau unggah seluruh folder ini ke hosting statis (GitHub Pages,
Netlify, Vercel, Cloudflare Pages, cPanel, dan sebagainya).

---

## 1. Hal yang paling sering diganti

Semua link utama ada di **`assets/js/config.js`**. Edit satu file itu saja.

```js
window.MASPRAM_CONFIG = {
  email: "halo@maspram.com",

  links: {
    instagram: "",          // isi URL Instagram
    github: "https://github.com/maspram23",
    tiktok: "",             // isi URL TikTok
    podStore: "",           // isi URL toko POD kamu

    appPaku: "assets/downloads/PAKU.apk",
    appPakuRepo: "https://github.com/maspram23/Android-Cash-FLow-APK"
  }
};
```

- Link yang dibiarkan kosong (`""`) tetap aman: tombolnya menampilkan pesan
  “segera hadir”, bukan membuka halaman kosong.
- Ganti email di `email`; form kontak, tombol salin email, dan menu mobile
  ikut menyesuaikan.

### Nanti saat toko POD sudah jadi

1. Buka **`assets/js/config.js`** dengan Notepad / VS Code.
2. Cari baris `podStore: "",` di bagian `links`.
3. Isi URL toko di antara tanda kutip, lalu simpan:

   ```js
   podStore: "https://maspram.myspreadshop.com",
   ```

4. Refresh website. Otomatis:
   - tombol berubah dari **“Toko POD Segera Hadir”** menjadi
     **“Kunjungi Toko POD”**;
   - tombol dan ikon toko di bagian kontak langsung mengarah ke URL tersebut;
   - keterangan “Preview koleksi — toko POD sedang disiapkan.” berganti jadi
     promo koleksi.

Tidak perlu mengedit `index.html` atau CSS sama sekali.

## 2. Mengganti APK aplikasi

APK yang sekarang dipakai ada di:

```
assets/downloads/PAKU.apk
```

Untuk merilis versi baru:

1. Ganti file `assets/downloads/PAKU.apk` dengan APK terbaru (nama file sama),
   **atau** ubah `appPaku` di `config.js` ke URL lain (Google Drive, GitHub
   Release, dan seterusnya).
2. Perbarui teks versi di `index.html` bila perlu:
   - `APK gratis · v1.0.0` (badge bagian Aplikasi)
   - `v1.0.0` (baris meta di kartu PAKU)
   - ukuran file `14,9 MB` pada tombol unduh
3. Tombol “Lihat di GitHub” memakai `appPakuRepo` di `config.js`.

> Catatan: APK yang disertakan adalah **versi final**. Karena dipasang langsung
> dari file APK (bukan Play Store), Android dapat meminta izin “Instal dari
> sumber tidak dikenal”.

## 3. Mengganti foto galeri

Foto galeri ada di:

```
assets/img/gallery/
```

Nama file yang dipakai:

| File | Kategori |
| --- | --- |
| `01-mountains.jpg` | Lanskap |
| `02-fog.jpg` | Lanskap |
| `03-night-peak.jpg` | Lanskap |
| `04-coast.jpg` | Lanskap |
| `05-city-night.jpg` | Jalanan |
| `06-street.jpg` | Jalanan |
| `07-city.jpg` | Jalanan |
| `08-portrait-a.jpg` | Potret |
| `09-portrait-b.jpg` | Potret |
| `10-portrait-c.jpg` | Potret |
| `11-camera.jpg` | Detail |
| `12-camera-b.jpg` | Detail |

Cara termudah: timpa file dengan nama yang sama memakai fotomu (rasio bebas,
disarankan sisi terpanjang ±1400 px). Semua judul, kategori, dan keterangan
diatur di `index.html` pada bagian `GALLERY`.

Foto yang ada sekarang adalah **placeholder** dari Unsplash. Ganti dengan
karya sendiri sebelum website dipublikasikan.

Foto lain:

- `assets/img/about-camera.jpg` — gambar di bagian Tentang
- `assets/img/hero-1.jpg`, `hero-2.jpg`, `hero-3.jpg` — kartu orbit di hero
- `assets/img/product-tee.jpg`, `product-poster.jpg`, `product-tote.jpg` —
  gambar produk di bagian Toko POD

## 4. Struktur file

```
index.html                  Halaman utama (semua section)
assets/css/style.css        Seluruh tampilan, animasi, dan 3D
assets/js/config.js         Link & email (edit di sini)
assets/js/main.js           Interaksi: tema, galeri, lightbox, tab, tilt
assets/img/                 Foto, logo, tangkapan layar PAKU, panduan
assets/downloads/PAKU.apk   File aplikasi
aplikasi cashflow PAKU/     Proyek sumber Android (tidak dipakai website)
cara download aplikasinya/  Gambar panduan asli (sudah disalin ke assets/img/guide)
```

## 5. Menjalankan & publikasi

- **Lokal:** klik dua kali `index.html`. Semua fitur berjalan tanpa server.
- **GitHub Pages:** unggah folder ini ke repositori, lalu
  *Settings → Pages → Deploy from branch → main / root*.
- **Netlify / Vercel / Cloudflare Pages:** drag-and-drop folder ini, tidak
  perlu build command.

## 6. Fitur interaktif

- Preloader, cursor kustom, bokeh canvas di hero
- Scene lensa 3D + kartu foto berputar, tilt mengikuti gerakan mouse
- Tema gelap/terang (tersimpan di `localStorage`)
- Filter galeri + lightbox (tombol panah, swipe, Escape)
- Tab tangkapan layar PAKU + panduan unduh yang bisa dibuka
- Tombol magnetik, reveal on scroll, penghitung angka, form kontak via email
