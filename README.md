# 🌌 Mortal Quest: Phàm Nhân Vấn Đạo

**Mortal Quest** là một trò chơi nhập vai (RPG) tu tiên huyền huyễn, nơi người chơi bắt đầu từ một phàm nhân bình thường, trải qua quá trình tu luyện gian khổ, vượt qua thiên kiếp để đạt đến đỉnh cao của tiên đạo.

## 🌟 Tính Năng Cốt Lõi

### 1. Hệ Thống Tam Tu (Three-Path Cultivation)
Khác với các game tu tiên thông thường, Mortal Quest yêu cầu sự cân bằng giữa ba con đường:
- **Tu Vi (Linh Lực):** Tăng trưởng cảnh giới chính, mở rộng kinh mạch và nâng cao Mana.
- **Luyện Thể (Nhục Thân):** Rèn luyện thân thể cường đại, tăng máu (HP) và phòng ngự (DEF).
- **Thần Thức (Linh Hồn):** Tu luyện tinh thần lực, tăng tốc độ (SPD) và khả năng khống chế pháp bảo.
*Lưu ý: Nếu Tu Vi vượt quá xa Nhục Thân hoặc Linh Hồn, bạn sẽ đối mặt với rủi ro Tẩu Hỏa Nhập Ma khi đột phá.*

### 2. Hệ Thống Tứ Đại Nghề Nghiệp (The Four Professions)
- **Luyện Đan (Alchemy):** Thu thập linh thảo, sử dụng Đan Lư và Dị Hỏa để chế tạo các loại linh đan tăng tu vi, hồi phục hoặc đột phá. Hệ thống có cơ chế **Đan Kiếp** cho các loại đan dược cao cấp.
- **Phù Lục (Talisman):** Vẽ các phù văn lên giấy linh để tạo ra các đạo cụ công kích, phòng thủ hoặc truyền tống. Phụ thuộc vào chất lượng Phù Bút và sức mạnh Thần Thức.
- **Luyện Khí (Smithing):** Đúc quặng sắt, dị kim thành các loại pháp bảo, phi kiếm và giáp trụ. Cần có Rèn Đài và kỹ thuật khống hỏa.
- **Trận Pháp (Formation):** Bố trí các trận đồ xung quanh linh địa để gia tăng tốc độ tu luyện hoặc tạo ra các buff chỉ số trong thời gian dài.

### 3. Hệ Thống Thiên Mệnh (Destiny System)
Ngay khi bắt đầu, người chơi sẽ được thức tỉnh Thiên Mệnh bao gồm:
- **Linh Căn:** Ảnh hưởng trực tiếp đến tốc độ thu nạp linh khí.
- **Thể Chất:** Các loại thể chất đặc biệt mang lại thuộc tính ẩn.
- **Tài Năng:** Những năng khiếu bẩm sinh giúp ưu thế trong chiến đấu hoặc nghề nghiệp.

### 4. Thế Giới & Thời Gian (Living World)
- **Dòng Chảy Thời Gian:** Game có hệ thống 12 canh giờ, 4 mùa và các hiện tượng thiên văn (Huyết Nguyệt, Linh Triều...) ảnh hưởng đến hiệu quả tu luyện.
- **Bế Quan (Seclusion):** Người chơi có thể lựa chọn bế quan từ vài ngày đến hàng năm để tăng mạnh tu vi nhưng sẽ đánh đổi bằng thọ nguyên (tuổi tác).
- **Bản Đồ Đa Dạng:** Khám phá từ Nhân Giới đến các Bí Cảnh, Thập Vạn Đại Sơn để tìm kiếm tài nguyên.

### 5. Kinh Tế & Thương Hội
- **Linh Thạch:** Tiền tệ chính, phân cấp từ Hạ phẩm đến Cực phẩm.
- **Vạn Bảo Các:** Thương hội lớn nhất giới tu tiên, nơi giao dịch mọi thứ từ hạt giống linh thảo đến bí pháp cao cấp.
- **VIP System:** Cấp độ VIP tăng theo tổng lượng linh thạch bạn đã giao dịch tại thương hội.

## 🛠 Hướng Dẫn Kỹ Thuật

### Công Nghệ Sử Dụng:
- **Core:** JavaScript (ES6+), Vite.
- **UI:** HTML5, CSS3 (Vanilla + Tailwind for layout), Phosphor Icons.
- **Design:** Glassmorphism, Premium Jade & Gold aesthetics.

### Cài Đặt:
1. Clone repository.
2. Chạy `npm install` để cài đặt dependencies.
3. Chạy `npm run dev` để khởi động môi trường phát triển.
4. Chạy `npm run build` để đóng gói sản phẩm.

### Xây dựng bản cài đặt Android (APK):
Để chuyển đổi game từ web sang Android APK, dự án sử dụng **Capacitor**.

1. **Đóng gói tài nguyên web:**
   ```bash
   npm run build
   ```
   *Lưu ý: Luôn chạy lệnh này trước khi sync để đảm bảo bản build Android có code mới nhất.*

2. **Đồng bộ hóa với project Android:**
   ```bash
   npx cap sync android
   ```

3. **Mở project trong Android Studio:**
   ```bash
   npx cap open android
   ```

4. **Tạo file APK:**
   - Trong Android Studio, đợi Gradle đồng bộ xong.
   - Chọn menu **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
   - Sau khi hoàn tất, nhấn **Locate** trong thông báo popup để tìm file `app-debug.apk`.
   - Đường dẫn mặc định: `android/app/build/outputs/apk/debug/app-debug.apk`.

*Lưu ý: Thư mục `android` chính là một project Android hoàn chỉnh. Nếu bạn muốn build thủ công bằng command line (Gradle), bạn cần `cd android` trước khi chạy các lệnh như `./gradlew assembleDebug`.*

## 📜 Quy Tắc Đột Phá (Breakthrough Rules)
- Để lên **Trúc Cơ**, cần nhục thân đủ mạnh.
- Để lên **Nguyên Anh**, thần thức phải đạt mức Thần Hải.
- Đột phá khi độ ổn định thấp (Stability) có tỷ lệ thất bại và bị phản phệ (mất máu, giảm tu vi).

---
*Chúc đạo hữu sớm ngày đắc đạo thành tiên!*
