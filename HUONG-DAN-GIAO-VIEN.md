# 📚 HƯỚNG DẪN SỬ DỤNG CHO GIÁO VIÊN

## 🎯 Giới Thiệu

Đây là hệ thống trực quan hóa Thuật Toán Kruskal - tìm Cây Khung Nhỏ Nhất (Minimum Spanning Tree) được thiết kế **ĐẶC BIỆT CHO GIẢNG DẠY** với giao diện **TIẾNG VIỆT**, rõ ràng, dễ hiểu.

---

## 🚀 Khởi Động Nhanh

### Bước 1: Mở Terminal
```bash
cd /Users/chuong/Desktop/Toan/btl/ToanRoiRac
npm run dev
```

### Bước 2: Truy Cập
- Mở trình duyệt: **http://localhost:3000**
- Backend API: **http://localhost:8000/docs** (tự động khởi động)

**Chỉ 1 lệnh - Tất cả tự động chạy!** ✅

---

## 📊 Giao Diện Chính

### 1. **Panel Bên Trái** (Nhập Dữ Liệu)
```
┌────────────────────────────────┐
│ 📝 Nhập Dữ Liệu                │
│ ┌──────────┐  ┌──────────┐    │
│ │ Điểm Đầu │  │ Điểm Cuối│    │
│ └──────────┘  └──────────┘    │
│ ┌──────────────────────────┐  │
│ │ Trọng Số                 │  │
│ └──────────────────────────┘  │
│ [➕ Thêm]  [⚡ Paste]          │
│ [✨ Demo]  [📊 Chủ Đề 7]       │
└────────────────────────────────┘
```

**2 Nút Quan Trọng:**
- **✨ Demo**: Load 9 cạnh mẫu (6 đỉnh) - Đơn giản, dễ giải thích
- **📊 Chủ Đề 7**: Load 100 cạnh (49 đỉnh) từ file Excel - Dữ liệu thật

### 2. **Khu Vực Trực Quan Hóa** (Giữa Màn Hình)
```
┌─────────────────────────────────────┐
│  🎨 Đồ Thị Tương Tác                │
│                                     │
│    ⚫ ─── ⚫     [Zoom/Pan]         │
│    │       │                       │
│    ⚫ ─── ⚫                         │
│                                     │
│  🟢 = Được chọn (MST)               │
│  🔴 = Bị loại (tạo chu trình)       │
│  ⚪ = Chưa xét                      │
└─────────────────────────────────────┘
```

**Màu Sắc:**
- **Xanh lá (🟢)**: Cạnh được chấp nhận vào MST
- **Đỏ (🔴)**: Cạnh bị loại vì tạo chu trình - có chữ "⚠️ TẠO CHU TRÌNH"
- **Xám (⚪)**: Cạnh chưa được xét

### 3. **Panel Hướng Dẫn Giảng Dạy** 👩‍🏫
```
┌──────────────────────────────────┐
│ 👩‍🏫 Hướng Dẫn Giảng Dạy           │
│ ─────────────────────────────────│
│ ✅ Hoàn Thành! 100%              │
│ ████████████████████████         │
│ 48 / 48 cạnh đã chọn             │
│                                  │
│ 🟢 Được Chọn: 48                 │
│ 🔴 Bị Loại: 52                   │
│                                  │
│ 📚 Cây Khung Nhỏ Nhất là gì?     │
│ • Kết nối TẤT CẢ đỉnh            │
│ • KHÔNG CÓ chu trình              │
│ • Tổng trọng số NHỎ NHẤT          │
│                                  │
│ ⚙️ Thuật Toán Hoạt Động:         │
│ 1. Sắp xếp cạnh từ nhỏ đến lớn   │
│ 2. Xét từng cạnh theo thứ tự     │
│ 3. ✓ Không tạo chu trình → Chọn  │
│ 4. ✗ Tạo chu trình → Loại        │
│ 5. Lặp cho đến đủ V-1 cạnh       │
└──────────────────────────────────┘
```

**Panel này giải thích:**
- ✅ Tiến độ thực hiện (%)
- 🟢 Số cạnh được chọn / bị loại
- 📚 MST là gì? (ngôn ngữ đơn giản)
- ⚙️ Thuật toán hoạt động như thế nào (5 bước)
- 💰 Kết quả hiện tại (tổng chi phí)
- 💡 Mẹo sử dụng khi giảng

### 4. **Thực Thi Code Trực Tiếp** (Bên Trái Dưới)
```python
1  def kruskal(edges, nodes):
2      # Sắp xếp edges theo trọng số
3  ▶   sorted_edges = sort(edges, key=weight)  ◀ Đang thực thi
4  
5      # Khởi tạo Union-Find
6      uf = UnionFind(nodes)
```

- Highlight **màu xanh** dòng code đang chạy
- Hiển thị: "Phần Hiện Tại: Khởi Tạo & Sắp Xếp"
- Cập nhật real-time theo từng bước

### 5. **So Sánh Độ Phức Tạp** (Bên Phải Dưới)
```
⚡ So Sánh Độ Phức Tạp Thuật Toán
─────────────────────────────────
Số Đỉnh (V): 49    Số Cạnh (E): 100
Mật Độ: 8.5%

🏆 Kruskal (Đang Dùng)
├─ Sắp xếp cạnh: 664 phép toán
├─ Union-Find: 561 phép toán
└─ Tổng: 1226 phép toán ████░░

Thuật Toán Prim
├─ Đồ thị dày: 2401 phép toán ██████
└─ Đồ thị thưa: 837 phép toán ███░░░

💡 Gợi Ý: Cho đồ thị này (V=49, E=100),
          Kruskal/Prim-Heap là tối ưu
```

**Giải thích cho sinh viên:**
- So sánh 3 thuật toán: Kruskal, Prim, Dijkstra
- Số phép toán cụ thể (không chỉ Big-O)
- Gợi ý thuật toán nào tốt nhất

### 6. **Phân Tích Lý Thuyết Đồ Thị**
```
🔬 Phân Tích Lý Thuyết Đồ Thị
─────────────────────────────
🟢 Phát Hiện Chu Trình
Edge 23→12 an toàn (không tạo chu trình)

📊 Phân Loại Đồ Thị
├─ Loại: Sparse (Thưa)
├─ Mật độ: 8.5%
└─ 100 / 1176 cạnh có thể

🔗 Phân Tích Kết Nối
├─ Thành phần liên thông: 1
├─ ✓ Liên thông
└─ Tiến độ MST: 48/48

♻️ Phân Tích Chu Trình
├─ Có chu trình: CÓ
└─ Số chu trình tối thiểu: ≥ 52
```

---

## 🎬 KỊCH BẢN DEMO CHO LỚP HỌC

### Demo 1: Đồ Thị Nhỏ (10 phút)

**Mục tiêu**: Giải thích cơ bản thuật toán

```
1. Click "✨ Demo"
   → "5 cạnh sẽ được CHẤP NHẬN, 4 cạnh sẽ bị LOẠI"

2. Giải thích cho sinh viên:
   - Có 6 đỉnh: A, B, C, D, E, F
   - Có 9 cạnh với trọng số từ 1 đến 9
   - MST cần 5 cạnh (6-1=5)
   - 4 cạnh sẽ bị loại

3. Điều chỉnh tốc độ = Chậm (slider trái)

4. Click "▶ Start"
   
5. Pause và giải thích từng bước:
   
   ✓ Bước 1: B→C (w=1) - CHẤP NHẬN
   "Hai đỉnh B và C chưa kết nối → OK"
   
   ✓ Bước 2: D→E (w=2) - CHẤP NHẬN
   "D và E chưa kết nối → OK"
   
   ✗ Bước 6: B→E (w=6) - BỊ LOẠI
   "⚠️ TẠO CHU TRÌNH - B và E đã kết nối qua
    chuỗi B→C→...→E rồi!"
   
6. Chỉ vào màn hình:
   - Cạnh xanh: "Đây là MST"
   - Cạnh đỏ: "Đây là những cạnh bị loại"
   - Chữ "⚠️ TẠO CHU TRÌNH": "Lý do bị loại"
```

### Demo 2: Dữ Liệu Thật Từ Excel (20 phút)

**Mục tiêu**: Áp dụng vào bài toán thực tế

```
1. Click "📊 Chủ Đề 7"
   → "Đã tải 100 cạnh, 49 đỉnh từ file Excel"

2. Giải thích:
   "Đây là dữ liệu thật từ file Excel của môn học
    49 đỉnh (từ 0-49), 100 cạnh
    Đồ thị lớn hơn nhiều!"

3. Tốc độ = Trung bình

4. Click "▶ Start"

5. Trong khi chạy, chỉ vào:
   
   👉 "Phần Hướng Dẫn Giảng Dạy":
   - Theo dõi tiến độ: "48/48 cạnh"
   - Thấy 52 cạnh bị loại
   
   👉 "So Sánh Độ Phức Tạp":
   - "Kruskal: 1226 phép toán"
   - "Prim dày đặc: 2401 phép toán"
   - "→ Kruskal nhanh hơn!"
   
   👉 "Phân Tích Lý Thuyết":
   - "Đồ thị thưa (8.5% mật độ)"
   - "1 thành phần liên thông"
   - "52 chu trình tối thiểu"

6. Sau khi hoàn thành:
   - Click "📥 Xuất Báo Cáo"
   - Mở file .txt đã download
   - "Các em có thể lưu kết quả này!"
```

### Demo 3: Tương Tác (15 phút)

**Mục tiêu**: Cho sinh viên tự nhập

```
1. Clear data (reload page)

2. Hướng dẫn sinh viên nhập:
   "Giờ các em tự tạo đồ thị!"
   
   Cú pháp nhanh:
   A-B-5    (Điểm A đến B, trọng số 5)
   B-C-3
   C-D-7
   
   Hoặc paste nhiều dòng:
   A-B-5
   B-C-3
   C-D-7
   A-C-10
   
3. Click "⚡ Paste" → Tự động thêm tất cả

4. Click "▶ Start" → Xem kết quả

5. Thảo luận:
   - Cạnh nào được chọn?
   - Cạnh nào bị loại? Tại sao?
   - Tổng chi phí là bao nhiêu?
```

---

## 💡 MẸO GIẢNG DẠY

### 1. Giải Thích "Tại Sao Bị Loại?"

Khi thấy cạnh đỏ với "⚠️ TẠO CHU TRÌNH":

```
❌ SAI: "Cạnh này bị loại vì nó tạo vòng lặp"
       (Quá mơ hồ)

✓ ĐÚNG: "Nhìn vào đồ thị, đỉnh A và đỉnh C 
        đã được kết nối rồi qua chuỗi:
        A → B → C
        
        Nếu thêm cạnh A-C nữa, sẽ tạo thành
        vòng tròn: A → B → C → A
        
        → Đó là CHU TRÌNH!
        → Cây không được có chu trình!
        → BỊ LOẠI!"
```

### 2. Giải Thích Union-Find

Dùng phần "Cơ Sở Quyết Định" trong "Thực Thi Code":

```
"Mỗi đỉnh ban đầu là 1 tập riêng biệt.
 
 Khi thêm cạnh A-B:
 ├─ find(A) = nhóm của A
 ├─ find(B) = nhóm của B
 └─ Nếu khác nhóm → Hợp nhất (union)
    Nếu cùng nhóm → Đã kết nối → Bỏ qua
```

### 3. Giải Thích Tại Sao MST = V-1 Cạnh

Dùng phần "Hướng Dẫn Giảng Dạy":

```
"Cây với V đỉnh luôn có V-1 cạnh.

Ví dụ: 49 đỉnh → cần 48 cạnh
       6 đỉnh → cần 5 cạnh

Tại sao?
- 1 cạnh nối 2 đỉnh
- Bắt đầu từ 49 đỉnh rời rạc
- Mỗi cạnh giảm 1 thành phần liên thông
- 49 thành phần → 1 thành phần = cần 48 cạnh"
```

### 4. So Sánh Kruskal vs Prim

Dùng phần "So Sánh Độ Phức Tạp":

```
"Kruskal: Bắt đầu từ CẠC NHHỎ NHẤT
         → Phù hợp đồ thị thưa
         
Prim:    Bắt đầu từ 1 ĐỈNH
         → Phù hợp đồ thị dày đặc
         
Với đồ thị này (8.5% mật độ):
→ Kruskal nhanh hơn!
→ 1226 vs 2401 phép toán"
```

---

## 📥 XUẤT BÁO CÁO

Click nút "📥 Xuất Báo Cáo" sẽ download file .txt:

```
╔═══════════════════════════════════════════╗
║   BÁO CÁO THUẬT TOÁN KRUSKAL - MST        ║
║   Bùi Văn Chương - Toán Rời Rạc          ║
╚═══════════════════════════════════════════╝

📊 THỐNG KÊ ĐỒ THỊ
├─ Số đỉnh (V): 49
├─ Số cạnh (E): 100
├─ Cạnh MST: 48
├─ Cạnh bị loại: 52
└─ Tổng chi phí MST: 1234

📋 DANH SÁCH CẠNH ĐÃ SẮP XẾP
  1. [✓] Đỉnh 30 → Đỉnh 48 | Trọng số: 10
  2. [✓] Đỉnh  2 → Đỉnh 26 | Trọng số: 12
  ...
 51. [✗] Đỉnh 23 → Đỉnh 49 | Trọng số: 97
```

**Sử dụng:**
- In ra cho sinh viên
- Upload lên LMS
- Lưu trữ kết quả

---

## ❓ GIẢI ĐÁP THẮC MẮC

### Q1: "Tại sao cạnh có trọng số nhỏ vẫn bị loại?"

**A:** "Tốt lắm! Câu hỏi hay đấy. Thuật toán Kruskal XÉT cạnh từ nhỏ đến lớn, nhưng không có nghĩa là TẤT CẢ cạnh nhỏ đều được chọn. Quan trọng là cạnh đó có TẠO CHU TRÌNH không. Nếu hai đỉnh đã kết nối rồi, dù trọng số nhỏ thế nào cũng bị loại!"

### Q2: "Nếu 2 cạnh có cùng trọng số thì sao?"

**A:** "Hệ thống sẽ xét theo thứ tự xuất hiện trong danh sách. Kết quả MST vẫn đúng, chỉ khác về cạnh nào được chọn. Tổng chi phí luôn giống nhau."

### Q3: "Tại sao đồ thị này dùng Kruskal tốt hơn Prim?"

**A:** "Nhìn vào 'Mật độ: 8.5%' - đây là đồ thị THƯA (ít cạnh so với tối đa). Kruskal làm việc với CẠNH, nên tốt cho đồ thị thưa. Prim làm việc với ĐỈNH, tốt cho đồ thị dày đặc."

---

## 🎓 KẾT LUẬN

Hệ thống này được thiết kế để:

✅ **Dễ sử dụng**: Chỉ 1 lệnh khởi động
✅ **Tiếng Việt**: Tất cả giải thích bằng tiếng Việt
✅ **Trực quan**: Màu sắc rõ ràng, animation mượt
✅ **Đầy đủ**: Từ cơ bản đến nâng cao
✅ **Tương tác**: Sinh viên có thể tự nhập dữ liệu
✅ **Chính xác**: Dữ liệu từ file Excel thật

**Mục tiêu cuối cùng**: 
Giúp sinh viên HIỂU thuật toán, không chỉ nhớ công thức!

---

📧 Hỗ trợ: Bùi Văn Chương
📅 Ngày: November 15, 2025
🎓 Môn: Toán Rời Rạc - Chủ Đề 7
