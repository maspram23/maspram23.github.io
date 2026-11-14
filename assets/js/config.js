/* ==========================================================================
   KONFIGURASI — cukup edit file ini untuk mengganti semua link.
   Link kosong ("") aman: tombolnya menampilkan pesan "segera hadir".
   ========================================================================== */

window.MASPRAM_CONFIG = {
  // Email utama (dipakai di form kontak, tombol salin email, dan menu mobile)
  email: "halo@maspram.com",

  // Media sosial & toko
  links: {
    instagram: "",            // contoh: "https://instagram.com/username"
    github: "https://github.com/maspram23",
    tiktok: "",               // contoh: "https://tiktok.com/@username"

    // ▼▼▼  EDIT LINK TOKO POD DI SINI NANTI  ▼▼▼
    // Tempel URL toko kamu menggantikan "" di bawah, contoh:
    //   podStore: "https://maspram.myspreadshop.com",
    // Setelah diisi, tombol "Toko POD Segera Hadir" otomatis berubah
    // menjadi "Kunjungi Toko POD" dan mengarah ke link tersebut.
    podStore: "",
    // ▲▲▲ ------------------------------------ ▲▲▲

    // Aplikasi PAKU — file APK lokal + halaman unduhan cadangan di GitHub.
    // Ganti appPaku dengan URL eksternal kalau nanti APK disimpan di Drive.
    appPaku: "assets/downloads/PAKU.apk",
    appPakuRepo: "https://github.com/maspram23/Android-Cash-FLow-APK"
  }
};
