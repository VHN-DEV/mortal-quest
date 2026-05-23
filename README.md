# 🌌 Mortal Quest: Phàm Nhân Vấn Đạo

**Mortal Quest** là một trò chơi nhập vai (RPG) tu tiên huyền huyễn được phát triển bằng HTML5/Vite/Capacitor. Người chơi bắt đầu hành trình từ một phàm nhân bình thường, trải qua quá trình tu luyện gian khổ, học tập công pháp, hấp thu linh khí thiên địa, vượt qua thiên kiếp để đạt đến đỉnh cao của tiên đạo.

---

## 🌟 Tính Năng Cốt Lõi & Hệ Thống Game

### 1. Hệ Thống Tam Tu (Three-Path Cultivation)
Khác với các game tu tiên thông thường, Mortal Quest yêu cầu tu sĩ phát triển cân bằng giữa ba con đường:
*   **Tu Vi (Linh Lực):** Quyết định cảnh giới chính của nhân vật, mở rộng kinh mạch và gia tăng lượng Mana tối đa.
*   **Luyện Thể (Nhục Thân):** Rèn luyện thân thể cường đại, tăng lượng Máu (HP) tối đa, phòng ngự (DEF) và khả năng chống chịu lôi kiếp.
*   **Thần Thức (Linh Hồn):** Tu luyện tinh thần lực, tăng tốc độ (SPD), khả năng khống chế pháp bảo và khống chế khôi lỗi.
*   _Lưu ý: Nếu Tu Vi vượt quá xa Nhục Thân hoặc Linh Hồn, độ ổn định đạo tâm sẽ suy giảm, dễ dẫn đến **Tẩu Hỏa Nhập Ma** (Qi Deviation) hoặc bị phạt chỉ số chiến đấu._

### 2. Hệ Thống Linh Căn & Thể Chất (Spiritual Roots & Physiques)
Được thức tỉnh ngẫu nhiên khi khởi đầu nhân vật:
*   **Linh Căn (Spiritual Root):** Quyết định tốc độ tu luyện thụ động và độ tương hợp với hệ công pháp:
    *   *Thiên Linh Căn:* Đơn hệ thuần khiết (Kim, Mộc, Thủy, Hỏa, Thổ). Tốc độ tu luyện: $2.5\times$, đột phá Trúc Cơ không gặp bình cảnh.
    *   *Dị Linh Căn:* Biến dị nguyên tố (Phong, Lôi, Băng). Tốc độ tu luyện: $2.2\times$, sát thương nguyên tố cực mạnh.
    *   *Ngũ Hành Linh Căn:* Đầy đủ cả 5 hệ thuộc tính. Tốc độ tu luyện: $1.5\times$, học được mọi loại công pháp.
    *   *Tạp Linh Căn:* Có 3 hoặc 4 hệ lộn xộn. Tốc độ tu luyện: $1.0\times$ hoặc thấp hơn, bị phạt nặng khi học công pháp khắc thuộc tính.
*   **Thể Chất (Physique):** Gồm nhiều loại thể chất thần thoại từ Phàm Thể đến Tiên Thể, có thể thức tỉnh qua 5 giai đoạn (*Sơ Khai $\rightarrow$ Tiểu Thành $\rightarrow$ Đại Thành $\rightarrow$ Viên Mãn $\rightarrow$ Hoàn Mỹ*):
    *   *Hoang Cổ Thánh Thể:* Thân thể vô địch cổ đại, tăng cực mạnh HP, DEF và Tốc độ hấp thu linh khí ($2.0\times$). Dị tượng *Kim Thân Bất Diệt*.
    *   *Tiên Thiên Đạo Thể:* Gần gũi với quy tắc tự nhiên. Tăng mạnh Tốc độ tu vi ($6.0\times$). Dị tượng *Tử Khí Đông Lai*.
    *   *Hỗn Độn Thể:* Thể chất cấm kỵ thượng cổ. Tăng siêu mạnh mọi chỉ số (Tu vi speed $15\times$, ATK +1000, DEF +500, HP +10000). Dị tượng *Hỗn Độn Khai Thiên*.
    *   *Tuyệt Mạch Phế Thể:* Kinh mạch bế tắc, không thể tu luyện bình thường nhưng tăng mạnh chỉ số ẩn (Luck +200).

### 3. Hệ Thống Linh Khí & Luyện Hóa (Energy & Cultivation)
Môi trường xung quanh phân bố 16 loại khí nguyên tố khác nhau (Linh Khí, Ma Khí, Yêu Khí, Hàn Khí, Viêm Khí, Lôi Khí, Kiếm Khí, Hỗn Độn Khí,...).
*   **Độ Tinh Khiết:** *Tạp Khí* (0.5x), *Tinh Thuần* (1.0x), *Cực Phẩm* (2.0x), *Đạo Khí* (5.0x).
*   **Quy Luật Tương Khắc:** Hấp thu các loại khí tương khắc đồng thời (ví dụ: Hàn Khí và Viêm Khí) sẽ gây nổ kinh mạch, trừ HP trực tiếp.
*   **Tích Lũy Cộng Chỉ Số:** Lượng khí tích lũy trong cơ thể sẽ mang lại các chỉ số cộng thêm vĩnh viễn theo hàm logarit (ví dụ: Kiếm Khí tăng ATK, Lôi Khí tăng ATK/SPD, Ma Khí tăng ATK nhưng giảm HP).
*   **Chuyển Hóa Tu Vi:** Lượng khí chỉ được luyện hóa thành Tu Vi thụ động khi nhân vật đã trang bị **Công pháp chủ đạo** (`mainTechniqueId`). Các khí hiếm như Tiên Khí hay Hỗn Độn Khí có hệ số nhân tu vi cực cao ($3.0\times \rightarrow 10.0\times$).

### 4. Học & Tu Luyện Công Pháp (Techniques)
*   **Tham Ngộ (Comprehension):** Học công pháp mới tiêu hao thời gian. Tốc độ học phụ thuộc vào điểm Ngộ Tính (Comprehension), độ tương hợp Linh Căn và Thần Hồn.
*   **Rủi ro Phản Phệ:** Nếu cố tình học công pháp đòi hỏi Thần Thức hoặc Căn Cốt quá cao so với thực tế, nhân vật có 1.5% tỷ lệ mỗi giây bị phản phệ chấn động linh hải, trừ HP/Mana và Độ ổn định đạo tâm.
*   **Đột Phá Tầng & Biến Dị:** Khi tích lũy đủ điểm thuần thục bằng Điểm Công Pháp (Technique Points), người chơi tiêu hao Tu Vi để đột phá tầng. Có tỷ lệ nhỏ kích hoạt biến dị công pháp hoặc tự động tiến hóa thành phẩm giai cổ xưa khi đạt độ thuần thục *Viên Mãn*.
*   **Sáng Tạo Công Pháp:** Người chơi có thể tự viết nên bộ công pháp độc quyền của mình với chi phí 50,000 Tu Vi và 100 Điểm Công Pháp.

### 5. Hệ Thống Tứ Đại Nghề Nghiệp (The Four Professions)
*   **Luyện Đan (Alchemy):** Chế tạo các loại linh đan tăng tu vi hoặc đan dược đột phá (như Trúc Cơ Đan). Gặp phải **Đan Kiếp** khi luyện chế linh đan phẩm cấp cao.
*   **Phù Lục (Talisman):** Sử dụng thần hồn vẽ bùa chú công kích, phòng thủ.
*   **Luyện Khí (Smithing):** Đúc rèn các loại pháp bảo, giáp trụ nâng cao chỉ số.
*   **Trận Pháp (Formation):** Bố trí các trận đồ linh mạch xung quanh phủ đệ để tăng vọt tốc độ tu luyện hoặc tạo buff chiến đấu dài hạn.

---

## 📜 Quy Tắc Đột Phá Bình Cảnh (Breakthrough Rules)

Đột phá đại cảnh giới là bước ngoặt quan trọng quyết định sinh tử của tu sĩ:
*   **Trúc Cơ Kỳ:** Đòi hỏi Nhục Thân đạt cấp độ tương ứng để tránh bị linh lực bạo thể. Cần sử dụng **Trúc Cơ Đan** để đảm bảo tỷ lệ thành công.
*   **Nguyên Anh Kỳ:** Yêu cầu Thần Thức đạt cảnh giới **Thần Hải** mới có thể ngưng tụ Nguyên Anh thành công.
*   **Hình Phạt Thất Bại:** Nếu đột phá thất bại khi độ ổn định đạo tâm quá thấp, tu sĩ sẽ bị phản phệ dữ dội, tụt thảm hại từ 30% đến 50% kinh nghiệm Tu Vi tích lũy và bị trừ nặng HP.

---

## 🛠 Hướng Dẫn Kỹ Thuật

### 1. Cài Đặt và Khởi Chạy
*   **Yêu cầu hệ thống:** NodeJS phiên bản 16 trở lên.
*   **Cài đặt dependencies:**
    ```bash
    npm install
    ```
*   **Chạy môi trường phát triển (Local Dev):**
    ```bash
    npm run dev
    ```
*   **Đóng gói sản phẩm (Production Build):**
    ```bash
    npm run build
    ```

### 2. Xây Dựng Bản Cài Đặt Android (APK)
Dự án tích hợp **Capacitor** để chuyển đổi giao diện web thành ứng dụng Android native.

1.  **Đóng gói tài nguyên web trước khi đồng bộ:**
    ```bash
    npm run build
    ```
2.  **Thêm nền tảng Android (chỉ cần thực hiện lần đầu):**
    ```bash
    npx cap add android
    ```
3.  **Đồng bộ hóa tài nguyên và code mới vào thư mục Android:**
    ```bash
    npx cap sync android
    ```
4.  **Mở project Android trong Android Studio:**
    ```bash
    npx cap open android
    ```
5.  **Tạo file APK cài đặt:**
    *   Đợi Android Studio hoàn thành Gradle đồng bộ.
    *   Trên thanh công cụ, chọn: **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
    *   Sau khi quá trình build hoàn tất, nhấn **Locate** ở hộp thoại góc phải để tìm file cài đặt `app-debug.apk`.
    *   Đường dẫn file build mặc định: `android/app/build/outputs/apk/debug/app-debug.apk`.

---

## 🗂 Cấu Trúc Mã Nguồn (Codebase Architecture)

*   `src/configs/`: Chứa toàn bộ dữ liệu cấu hình của trò chơi (danh sách đan dược, yêu thú, cảnh giới, linh khí, công pháp, bản đồ...).
    *   [realm-data.js](file:///c:/xampp/htdocs/mortal-quest/src/configs/realm-data.js): Quản lý dữ liệu exp và danh sách cảnh giới.
    *   [energy-data.js](file:///c:/xampp/htdocs/mortal-quest/src/configs/energy-data.js): Quản lý thuộc tính và tính chất của 16 loại khí.
    *   [technique-data.js](file:///c:/xampp/htdocs/mortal-quest/src/configs/technique-data.js): Danh mục công pháp và thần thông tương ứng.
*   `src/systems/`: Chứa các bộ xử lý logic tính toán trung tâm.
    *   [energy-system.js](file:///c:/xampp/htdocs/mortal-quest/src/systems/energy-system.js): Xử lý hấp thu khí môi trường, tính toán xung đột và tẩu hỏa nhập ma.
    *   [technique-system.js](file:///c:/xampp/htdocs/mortal-quest/src/systems/technique-system.js): Xử lý luyện tập, đột phá tầng, biến dị và tiến hóa công pháp.
*   `src/core/`: Các lớp lõi trạng thái game.
    *   [player.js](file:///c:/xampp/htdocs/mortal-quest/src/core/player.js): Quản lý vòng lặp cập nhật trạng thái nhân vật chính, tính toán và áp dụng các loại chỉ số thuộc tính.

---
_Chúc các đạo hữu sớm ngày đốn ngộ thiên đạo, đắc đạo thành tiên!_
