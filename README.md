# 🎮 Garuda Game Forum API
Proyek ini adalah submission untuk kelas **Menjadi Back-End Developer Expert** di Dicoding. Garuda Game Forum API dikembangkan secara bertahap melalui dua versi, dengan setiap versi membawa fitur-fitur baru untuk meningkatkan fungsionalitas dan performa aplikasi. Berikut ini adalah penjelasan mengenai setiap versi dari Garuda Game Forum API.

## 📝 Deskripsi
Garuda Game Forum API adalah aplikasi back-end yang memungkinkan pengguna untuk berinteraksi dalam forum diskusi seputar game. API ini menyediakan operasi CRUD (Create, Read, Update, Delete) untuk thread, komentar, dan balasan komentar, serta fitur menyukai komentar, memungkinkan para pemain game untuk berdiskusi dan berbagi pendapat mereka. Aplikasi ini dirancang dengan menerapkan Clean Architecture dan automation testing untuk memastikan kualitas dan skalabilitas yang optimal.

## 🚀 Fitur Utama
#### **Versi 1:**
* **Registrasi Pengguna:** Pengguna baru dapat mendaftar untuk membuat akun dan berpartisipasi dalam diskusi.
* **Login dan Logout:** Pengguna dapat masuk dan keluar dari akun mereka menggunakan JWT untuk autentikasi.
* **Menambahkan Thread:** Pengguna dapat membuat thread baru untuk memulai diskusi terkait game.
* **Melihat Thread:** Semua pengguna dapat melihat thread yang ada di forum.
* **Menambahkan dan Menghapus Komentar:** Pengguna dapat menambahkan komentar pada thread dan menghapus komentar mereka sendiri.
* **Menambahkan dan Menghapus Balasan Komentar:** (Opsional) Pengguna dapat membalas komentar dan menghapus balasan yang mereka buat.

#### **Versi 2:**
* **CI/CD Implementation:** Mengimplementasikan Continuous Integration/Continuous Deployment menggunakan GitHub Action untuk otomatisasi pengujian dan deployment.
* **Security Enhancement:** Menerapkan limit access dan HTTPS untuk melindungi aplikasi dari serangan DDoS dan MITM (Man-In-The-Middle).
* **Preventive Measures:** Menambahkan langkah-langkah preventif untuk menghindari berbagai macam serangan pada RESTful API.
* **Menyukai dan Batal Menyukai Komentar:** (Opsional) Pengguna dapat menyukai komentar yang mereka anggap bermanfaat dan dapat membatalkan suka jika berubah pikiran.

## 🔧 Tech Stack
* **Backend:** Node.js dengan framework Hapi.
* **Database:** PostgreSQL untuk menyimpan data forum.
* **Authentication:** JWT untuk token-based authentication.
* **Testing:** Jest dan Supertest untuk automation testing.
* **CI/CD:** GitHub Action untuk otomatisasi pengujian dan deployment.
* **Security:** HTTPS dan rate limiting untuk mencegah serangan.
* **Dependency Management:** npm untuk manajemen dependensi.
* **Linting:** ESLint dengan Airbnb style guide untuk konsistensi kode.

## ⚙️ Cara Menjalankan Aplikasi
1. Clone Repository:
    ```sh
    https://github.com/ChristiantoKape/submission_forum_api.git
    cd submission_forum_api
    ```
2. Instalasi Dependensi:
    ```sh
    npm install
    ```
3. Konfigurasi Environment:
    Buat file .env di root folder dan masukkan konfigurasi yang dibutuhkan seperti database connection, JWT secret key, dan konfigurasi lainnya.
3. Menjalankan Aplikasi:
    ```sh
    npm run start
    ```
    Aplikasi akan berjalan pada port `5000`.
4. Untuk Pengembangan:
    Jika ingin menggunakan `nodemon` selama pengembangan, jalankan:
    ```sh
    npm run start-dev
    ```

## 📄 Studi Kasus
#### **Versi 1:**
**Garuda Game Forum API versi 1** dikembangkan untuk memfasilitasi interaksi antar pemain dalam forum diskusi. Aplikasi ini memungkinkan pengguna untuk mendaftar, login, membuat thread, menambah dan menghapus komentar atau balasan.
#### **Versi 2:**
**Garuda Game Forum API versi 2** menekankan pada penerapan CI/CD dan peningkatan keamanan API. Dengan CI/CD, pengujian dan deployment dilakukan secara otomatis, sementara langkah-langkah keamanan diterapkan untuk melindungi aplikasi dari serangan yang mungkin terjadi. Fitur opsional yang disertakan adalah kemampuan pengguna untuk menyukai dan membatalkan suka pada komentar.

### Author
[Christianto Kurniawan Priyono](https://www.linkedin.com/in/chriskape/)

### Rating & Certificate
**Versi 1:**

![submission be-expert-v1](https://github.com/user-attachments/assets/5a066303-3b23-4f8a-ba88-6407e458c1ab)

**Versi 2:**

![submission be-expert-v2](https://github.com/user-attachments/assets/503d6bbd-8d12-433e-849d-3184721229a7)

[Sertifikat Menjadi Back-End Developer Expert](https://www.dicoding.com/certificates/1RXYLRQN1PVM)
