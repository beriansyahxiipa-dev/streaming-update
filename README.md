# Streaming Update Dashboard

Template website gratis untuk dashboard Spotify + YouTube.

## Fitur
- Dashboard total Spotify streams
- Dashboard total YouTube views
- Daily increase
- Target milestone
- Kartu setiap release
- Ranking
- Grafik 7 hari
- Responsive untuk HP
- Tombol refresh
- Opsional YouTube Data API

## File
- `index.html` = halaman utama
- `style.css` = desain
- `data.js` = DATA YANG PERLU DIUBAH
- `script.js` = fungsi dashboard

## Mengubah data
Buka `data.js`, lalu ubah:
- title
- artist
- cover
- spotify.total
- spotify.daily
- youtube.total
- youtube.daily
- youtube.videoId

### Catatan Spotify
Jangan menaruh angka seolah-olah berasal langsung dari Spotify Web API. Total stream lagu tidak tersedia sebagai angka publik langsung melalui endpoint Web API umum. Gunakan data yang memang kamu punya/berhak gunakan lalu masukkan ke `data.js`.

### YouTube otomatis
1. Buat YouTube Data API key.
2. Masukkan key pada `youtubeApiKey`.
3. Isi `videoId` setiap video.
4. Website akan meminta `statistics.viewCount` saat halaman dibuka/refresh.

Untuk keamanan, API key yang ditaruh di frontend dapat terlihat oleh pengunjung. Untuk penggunaan publik yang serius, lebih baik pindahkan pengambilan API ke serverless/backend dan batasi key berdasarkan API/service yang diperlukan.

## Deploy gratis ke GitHub Pages
1. Buat repository baru di GitHub.
2. Upload `index.html`, `style.css`, `data.js`, `script.js`.
3. Buka Settings → Pages.
4. Pilih source dari branch `main` dan folder `/root`.
5. Simpan dan buka URL GitHub Pages kamu.

GitHub Pages dapat meng-host file HTML/CSS/JavaScript secara langsung dan tersedia untuk repository publik pada GitHub Free.
