# Kế Hoạch Nâng Cấp & Ổn Định Toàn Diện: A Dilemma (8-Bit Journalism)

Bản kế hoạch giải quyết triệt để vấn đề phiên bản Next.js lỗi thời, xóa bỏ tình trạng người chơi bị văng phòng trên môi trường serverless Vercel bằng Firebase Firestore thời gian thực, đồng thời cải tiến luồng tạo phòng quản trò với mã PIN 6 số chuyên nghiệp như Kahoot/Mentimeter.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> Toàn bộ 3 quyết định then chốt đã được thống nhất trực tiếp cùng bạn trong lượt phỏng vấn trước:
> 1. **Luồng tạo phòng Quản trò**: Chuyển sang mô hình tạo phòng chủ động với **mã PIN 6 số ngẫu nhiên** và liên kết tham gia trực tiếp (`/play?pin=...`), thay thế phòng cố định `CLASS`.
> 2. **Giải pháp đồng bộ chống văng phòng**: Tích hợp **Firebase Firestore** để các serverless container (lambda trên Vercel) cùng truy cập một nguồn dữ liệu duy nhất, đồng thời hỗ trợ cập nhật thời gian thực (`onSnapshot`).
> 3. **Nâng cấp phiên bản Next.js**: Nâng cấp trực tiếp lên **Next.js 16 mới nhất (16.4.2)**, loại bỏ triệt để cảnh báo bảo mật / outdated từ Vercel và dọn dẹp sạch sẽ mã nguồn dư thừa.

---

## 1. Tổng Quan & Mục Tiêu Cốt Lõi

* **Tên ứng dụng:** A Dilemma - Trò chơi Lịch sử Báo chí (8-Bit Retro Edition).
* **Mục tiêu sư phạm:** Giúp sinh viên trải nghiệm trực tiếp sự dịch chuyển của định kiến truyền thông thông qua việc phân bổ **100 Giá Đại lộ** giữa Lý trí và Tình cảm qua từng đợt Breaking News.
* **Vấn đề cốt lõi cần giải quyết:**
  * **Vấn đề Out phòng:** Kiến trúc serverless của Vercel phân tách thành hàng chục lambda container độc lập; bộ nhớ RAM (`Map`) và ổ cứng `/tmp` không được chia sẻ giữa các container, khiến người chơi liên tục nhận trạng thái rỗng và bị văng về LOBBY.
  * **Vấn đề Cảnh báo phiên bản:** Next.js 15.2.9 cũ bị Vercel gắn cờ cảnh báo phiên bản cần cập nhật.
  * **Vấn đề Phòng chơi xung đột:** Mọi lượt truy cập `/host` trước đây đều dùng chung phòng `CLASS`, dễ dẫn tới xung đột dữ liệu giữa các lớp hoặc lượt chơi thử.

---

## 2. Trải Nghiệm Người Dùng (UX) & Thiết Kế Giao Diện

### A. Luồng Trải Nghiệm Mới Chuẩn Kahoot / Mentimeter
1. **Quản trò (Host):**
   * Truy cập `/host`, hiển thị màn hình khởi tạo: Nút bấm lớn **[TẠO PHÒNG CHƠI MỚI]**.
   * Hệ thống sinh ngẫu nhiên mã **PIN 6 chữ số** (ví dụ: `849201`).
   * Quản trò bước vào Sảnh chờ (Lobby):
     * Hiển thị mã PIN to rõ ràng ở trung tâm màn hình.
     * Hiển thị đường dẫn nhanh kèm nút sao chép link: `.../play?pin=849201`.
     * Danh sách người chơi / nhóm sinh viên kết nối được hiển thị theo thời gian thực dưới dạng thẻ tên 8-bit gọn gàng (không viền thô).
     * Nút **[BẮT ĐẦU CHƠI (60S)]** và nút **[Mô phỏng lớp ảo]** để kiểm thử.
2. **Người chơi (Sinh viên):**
   * Truy cập `/play` hoặc mở link `/play?pin=849201`. Nếu vào qua link có sẵn PIN, ô PIN tự động điền và khóa cố định.
   * Nhập Họ tên và chọn hình thức (Cá nhân hoặc Tên Nhóm) -> Bấm **[VÀO PHÒNG]**.
   * Khi Quản trò bấm bắt đầu: Giao diện người chơi lập tức chuyển trạng thái sang Vòng 1 với đồng hồ đếm ngược và thanh trượt 100 Giá Đại lộ.
   * Kết nối luôn được giữ vững thông qua Firebase Firestore listener, sinh viên tắt màn hình bật lại hoặc chuyển tab vẫn giữ nguyên trạng thái bỏ phiếu.

### B. Ngôn Ngữ Thiết Kế & Thẩm Mỹ
* **Font chữ:** Duy trì font 8-bit **KVN-97** hỗ trợ trọn vẹn dấu tiếng Việt.
* **Bảng màu:** Nền giấy báo cổ điển `#FBF9F5`, chữ đen xám `#18181B`, điểm nhấn vàng kim `#EAB308` cho đồng xu Đại lộ, xanh dương `#2563EB` cho Lý trí và đỏ hồng `#DC2626` cho Tình cảm.
* **Cán cân 8-bit tinh tế:** 10 đồng xu vàng nằm trực tiếp trên 2 mặt đĩa cân bằng đồng thau, góc nghiêng tự động điều chỉnh theo tỷ lệ bình chọn của toàn lớp học.
* **Triết lý Zero-Pill & Phẳng:** Nút bấm phẳng không viền thô, văn bản thông tin thả tự nhiên phân tách bằng dấu chấm giữa `·`.

---

## 3. Quyết Định Kỹ Thuật & Quản Trị Rủi Ro

### A. Kiến Trúc Lưu Trữ & Đồng Bộ Dữ Liệu
* **Trước đây:** In-memory `Map` + `/tmp` file đĩa (bị phân mảnh và mất mát trên Vercel Serverless).
* **Giải pháp mới:** Tích hợp **Firebase Firestore**:
  * Mỗi phòng là 1 document tại `/rooms/{pin}`.
  * Danh sách người chơi lưu tại subcollection `/rooms/{pin}/players/{playerId}` hoặc mảng document được quản lý an toàn.
  * Cả Quản trò và Sinh viên sử dụng `onSnapshot` để lắng nghe thay đổi trạng thái theo thời gian thực (real-time push) với độ trễ dưới 100ms, không phụ thuộc vào chu kỳ polling 1000ms gây nghẽn mạng.

### B. Kế Hoạch Quản Trị Rủi Ro Kỹ Thuật (Risk Management)
| Rủi Ro Kỹ Thuật | Tác Động | Biện Pháp Kiểm Soát & Giải Pháp Phòng Ngừa |
| :--- | :--- | :--- |
| **Vercel Serverless Cold Start** | Cao | Dùng Firestore Client SDK trực tiếp ở phía trình duyệt người dùng kết hợp Firestore Rules. Dữ liệu thời gian thực không đi qua API route trung gian, loại trừ 100% rủi ro container lạnh. |
| **Mất kết nối mạng / Rớt sóng di động** | Trung bình | Lưu `pin`, `playerId`, `name` vào `localStorage` và `sessionStorage`. Khi người chơi có mạng trở lại, ứng dụng tự động tái kết nối đúng phòng và khôi phục số điểm đã vote. |
| **Vượt hạn mức miễn phí Firestore (Quota)** | Thấp | Cấu trúc dữ liệu tối giản (mỗi phòng chỉ cập nhật khi đổi vòng hoặc khi người chơi trượt cân với cơ chế debounce 200ms). Lớp học 50-100 sinh viên chỉ tiêu tốn <1% hạn mức miễn phí mỗi ngày. |
| **Xung đột phiên bản Next.js 16** | Trung bình | Kiểm tra tương thích với React 19, xác thực cấu hình PostCSS Tailwind v4 và chạy lệnh build kiểm thử trước khi bàn giao. |

### C. Kế Hoạch Tối Ưu & Dọn Dẹp Mã Nguồn (Refactoring)
1. **Nâng cấp Package:** Cập nhật `next` lên phiên bản `16.4.2` và `eslint-config-next` đồng bộ.
2. **Dọn dẹp mã nguồn thừa:**
   * Loại bỏ các cơ chế chống container lạnh chắp vá trong `lib/game-store.ts` và `/app/play/page.tsx`.
   * Gỡ bỏ các file tạm, mock sound, và các tệp đính kèm không cần thiết.
   * Chuẩn hóa cấu trúc thư mục và bảo đảm toàn bộ mã nguồn tuân thủ TypeScript nghiêm ngặt.

---

## 4. Kiến Trúc Kỹ Thuật & Sơ Đồ Hệ Thống

```
┌────────────────────────────────────────────────────────────────────────┐
│                        KIẾN TRÚC HỆ THỐNG MỚI                          │
└────────────────────────────────────────────────────────────────────────┘

    [ QUẢN TRÒ (/host) ]                   [ SINH VIÊN (/play) ]
    ┌──────────────────────┐               ┌──────────────────────┐
    │ 1. Bấm Tạo phòng     │               │ 1. Nhập PIN 6 số     │
    │ 2. Nhận PIN: 849201  │               │ 2. Nhập Tên / Nhóm   │
    │ 3. Điều khiển Vòng   │               │ 3. Kéo Cán cân 100đ  │
    └──────────┬───────────┘               └──────────┬───────────┘
               │                                      │
               │ real-time onSnapshot                 │ real-time onSnapshot
               │ & setDoc / updateDoc                 │ & setDoc / updateDoc
               ▼                                      ▼
    ┌─────────────────────────────────────────────────────────────┐
    │                  FIREBASE FIRESTORE CLOUD                   │
    │                                                             │
    │  Collection: "rooms"                                        │
    │  Document: {pin} (ví dụ: "849201")                          │
    │  ├── code: "849201"                                         │
    │  ├── status: "LOBBY" | "ROUND_1" | "TWIST_1" | ...          │
    │  ├── timerRemaining: 60                                     │
    │  ├── timerEndsAt: 1742080000000                             │
    │  ├── totalRational: 450, totalEmotional: 550                │
    │  └── Subcollection: "players"                               │
    │      ├── {playerId_1}: { name, rational: 60, ... }          │
    │      └── {playerId_2}: { name, rational: 40, ... }          │
    └─────────────────────────────────────────────────────────────┘
```

---

## 5. Các Bước Triển Khai Chi Tiết Sau Khi Bạn Phê Duyệt

1. **Bước 1 (Thiết lập Firebase):**
   * Mở giao diện `set_up_firebase` để bạn xác nhận kích hoạt dịch vụ Firestore.
   * Khởi tạo cấu hình `firebase-applet-config.json`, tạo `firebase-blueprint.json` và triển khai `firestore.rules` bảo mật ABAC.
2. **Bước 2 (Nâng cấp Next.js 16 & Dọn dẹp phụ thuộc):**
   * Cập nhật `package.json` lên `next@16.4.2` và `eslint-config-next@16.4.2`.
   * Cài đặt `firebase` client SDK.
3. **Bước 3 (Xây dựng Game Service mới với Firestore):**
   * Viết module đồng bộ phòng chơi thời gian thực qua Firestore (`lib/firebase-game.ts`).
   * Hỗ trợ hàm `createRoom()`, `joinRoom(pin, player)`, `submitVote(pin, playerId, rational)`, `advanceRound(pin)`.
4. **Bước 4 (Cập nhật Giao diện Quản trò & Người chơi):**
   * Giao diện `/host`: Nút tạo phòng, hiển thị mã PIN to đẹp mắt, liên kết mời nhanh.
   * Giao diện `/play`: Ô nhập mã PIN (hoặc tự nhận diện từ `?pin=...`), hiển thị trạng thái kết nối tức thì.
5. **Bước 5 (Kiểm thử, Build & Xác thực):**
   * Kiểm thử `compile_applet` và chạy build production Next.js 16 đảm bảo 0 lỗi.
   * Cập nhật nhật ký vào `changelog.txt`.
