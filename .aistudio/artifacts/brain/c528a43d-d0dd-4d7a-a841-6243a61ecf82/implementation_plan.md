# Kế hoạch Thực thi (Đã chuẩn hóa theo phản hồi): Trò chơi 'A Dilemma'

## Bản thiết kế Tinh gọn & Thông thoáng (Airy, Focused & Non-slop Light Mode)

### 1. Nguyên tắc Thị giác Cốt lõi
- **Chỉ đóng hộp nút bấm**: Tuyệt đối không đóng khung các đoạn text, thông tin, bảng biểu (tránh cảm giác bí bách, bento slop). Chỉ có nút tương tác (Button, Slider thumb, Input) mới có viền đen.
- **Typography Tiếng Việt Chuẩn mực**: Sử dụng `Plus Jakarta Sans` với các độ dày sắc nét (400, 600, 700), không dùng font pixel lỗi dấu tiếng Việt.
- **Nền Báo giấy Thông thoáng**: `#FBF9F5` (off-white tự nhiên), chữ đen than `#18181B`.
- **Thông tin thứ yếu**: Để ở góc trên màn hình, chữ nhỏ, viết thường, không đóng khung.

---

### 2. Giao diện Người chơi (Player Flow)
1. **Vào phòng**: Nhập tên + Toggle [Cá nhân] / [Nhóm] (hiện ô tên nhóm nếu chọn nhóm) + Nút "Vào phòng" (không có mã PIN).
2. **Phòng chờ**: Chữ thoáng đãng ở trung tâm: "đã sẵn sàng: [Tên]" và tóm tắt đề bài ngắn gọn.
3. **Màn hình Chơi**:
   - Góc trên bên phải: Tên người chơi và đồng hồ đếm ngược (chữ nhỏ, không đóng khung).
   - Khi có Breaking News:
     - Màn hình phủ tin tức Breaking News toàn màn hình, mờ dần để lộ cán cân và thanh trượt.
     - Quá trình phân bổ tiền bắt đầu ngay khi Quản trò bấm nút bắt đầu đếm giờ.
   - Trọng tâm trung tâm: Cán cân cơ học 8-bit nghiêng trực tiếp theo Thanh trượt phân bổ bên dưới.
   - Thanh trượt: Kéo trượt mượt mà 10 nấc phân bổ 100 Giá Đại lộ giữa Lý trí và Tình cảm.
4. **Màn hình Cảm ơn**:
   - Khi hết giờ: Dòng chữ lớn ở trung tâm: **CẢM ƠN BẠN ĐÃ THAM GIA!**
   - Dưới là kết quả chốt: [X] Giá Lý trí — [Y] Giá Tình cảm (không đóng khung thừa thãi).

---

### 3. Giao diện Quản trò (Host Flow)
1. **Góc trên bên trái**: `a dilemma · lịch sử báo chí` và `[N] người tham gia` (font thứ yếu, chữ nhỏ, không đóng khung).
2. **Trung tâm**:
   - Cán cân 8-bit cỡ đại nghiêng theo thời gian thực dựa trên tổng số tiền toàn lớp.
   - Khi bấm Vòng 2 hoặc Vòng 3 (Breaking News):
     - Màn hình Quản trò hiện tin Breaking News toàn màn hình.
     - Dưới chữ Breaking News có nút bấm **[BẮT ĐẦU ĐẾM GIỜ]**.
     - Khi Quản trò bấm nút này: Đồng hồ bắt đầu chạy, lớp bắt đầu phân bổ tiền, và màn hình tin tức biến mất để hiện lại cán cân.
3. **Thanh điều khiển Quản trò**:
   - Nằm gọn ở đáy màn hình, gồm 4 nút tối giản: **`[ 1 ]`**, **`[ 2 ]`**, **`[ 3 ]`**, **`[ 4 ]`** kèm biểu tượng bàn tay 8-bit chỉ vào nút hiện tại.
     - `1`: Bắt đầu Vòng 1 (Tình huống gốc - 60s)
     - `2`: Bật Breaking News 1 (kèm nút bắt đầu đếm 30s)
     - `3`: Bật Breaking News 2 (kèm nút bắt đầu đếm 30s)
     - `4`: Khóa cán cân & Kết thúc
4. **Phần Tổng kết sau khi Khóa cân (Nút 4)**:
   - Hiện sau khi hết giờ / khóa cân: tâm điểm thứ yếu, không đóng khung, nhấn mạnh số liệu 3 vòng và dòng chữ "Cảm ơn bạn đã tham gia".
