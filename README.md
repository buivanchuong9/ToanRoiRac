# 🌳 Thuật Toán Kruskal - Trực Quan Hóa MST

**Hệ thống trực quan hóa Thuật Toán Kruskal tìm Cây Khung Nhỏ Nhất (Minimum Spanning Tree)**

🎓 **Môn học**: Toán Rời Rạc - Chủ Đề 7  
👨‍💻 **Sinh viên**: Bùi Văn Chương  
📅 **Ngày**: November 15, 2025

---

## 🚀 Chạy Nhanh (1 Lệnh Duy Nhất)

```bash
npm run dev
```

**Truy cập**: http://localhost:3000

✅ Backend (Python FastAPI) tự động khởi động trên port 8000  
✅ Frontend (Next.js) tự động khởi động trên port 3000

---

## 📦 Cài Đặt Lần Đầu

### 1. Cài Node.js Dependencies

```bash
npm install
# hoặc
pnpm install
```

### 2. Cài Python Dependencies

```bash
cd backend
pip3 install -r requirements.txt
```

**Thư viện Python cần thiết**:
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `websockets` - WebSocket support
- `openpyxl` - Đọc file Excel

### 3. Kiểm Tra

```bash
# Kiểm tra Node.js
node --version  # Cần >= 18.x

# Kiểm tra Python
python3 --version  # Cần >= 3.8

# Kiểm tra pip packages
pip3 list | grep fastapi
```

**👉 Hướng dẫn cài đặt chi tiết**: Xem file **[CAI-DAT.md](./CAI-DAT.md)**

---

## 🎯 Tính Năng Chính

### ✨ Giao Diện Tiếng Việt 100%
- Tất cả text, button, tooltip đều tiếng Việt
- Thiết kế cho giáo viên dùng giảng dạy

### 📊 Load Dữ Liệu Nhanh
- **✨ Demo**: 9 cạnh mẫu (đơn giản)
- **📊 Chủ Đề 7**: 100 cạnh từ file Excel (dữ liệu thật)
- **⚡ Paste**: Nhập nhiều cạnh cùng lúc

### 🎨 Trực Quan Hóa Đồ Thị
- 🟢 **Xanh lá**: Cạnh được chấp nhận vào MST
- 🔴 **Đỏ**: Cạnh bị loại (có chữ "⚠️ TẠO CHU TRÌNH")
- ⚪ **Xám**: Cạnh chưa xét
- Zoom/Pan/Drag nodes

### 👩‍🏫 Panel Hướng Dẫn Giảng Dạy
- Giải thích MST là gì (ngôn ngữ đơn giản)
- 5 bước thuật toán Kruskal
- Tiến độ real-time
- Mẹo sử dụng khi giảng

### 💻 Xem Code Python Thực Thi
- Highlight dòng code đang chạy
- Cập nhật real-time
- Hiển thị Union-Find operations

### ⚡ So Sánh Độ Phức Tạp
- Kruskal vs Prim vs Dijkstra
- Số phép toán cụ thể (không chỉ Big-O)
- Gợi ý thuật toán tối ưu

### 🔬 Phân Tích Lý Thuyết Đồ Thị
- Phát hiện chu trình
- Phân loại đồ thị (Dense/Sparse)
- Phân tích kết nối
- Tính số chu trình

### 📥 Xuất Báo Cáo
- Download file .txt với kết quả đầy đủ
- Danh sách cạnh đã sắp xếp
- Thống kê MST

---

## 📖 Hướng Dẫn Sử Dụng

### Cách 1: Demo Nhanh

```
1. Click "✨ Demo"
2. Chọn tốc độ (Chậm/Trung bình/Nhanh)
3. Click "▶ Start"
4. Xem animation từng bước
```

### Cách 2: Dữ Liệu Thật (Chủ Đề 7)

```
1. Click "📊 Chủ Đề 7"
   → Tự động load 100 cạnh, 49 đỉnh từ file Excel
2. Click "▶ Start"
3. Xem kết quả
4. Click "📥 Xuất Báo Cáo"
```

### Cách 3: Nhập Thủ Công

**Cú pháp**:
```
A-B-5    (Điểm A đến B, trọng số 5)
```

**Paste nhiều dòng**:
```
A-B-5
B-C-3
C-D-7
A-C-10
```

Sau đó click "⚡ Paste" → tự động thêm tất cả

---

## 🛠️ Cấu Trúc Thư Mục

```
ToanRoiRac/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Trang chính
│   └── layout.tsx         # Layout wrapper
│
├── components/            # React Components
│   ├── graph-visualization.tsx        # Đồ thị D3.js
│   ├── kruskal-controls.tsx           # Điều khiển
│   ├── manual-input-panel.tsx         # Nhập liệu (CÓ NÚT CHỦ ĐỀ 7)
│   ├── teacher-guide.tsx              # Hướng dẫn giảng dạy
│   ├── code-viewer.tsx                # Xem code
│   ├── algorithm-comparator.tsx       # So sánh thuật toán
│   └── graph-theory-inspector.tsx     # Phân tích lý thuyết
│
├── backend/               # Python FastAPI
│   ├── main.py           # Server chính
│   ├── kruskal.py        # Thuật toán
│   └── requirements.txt  # Python dependencies
│
├── chủ đề 7.xlsx         # Dữ liệu Excel (100 cạnh)
│
├── CAI-DAT.md            # Hướng dẫn cài đặt chi tiết
├── HUONG-DAN-GIAO-VIEN.md  # Hướng dẫn cho giáo viên
└── README.md             # File này
```

---

## 🎬 Demo Cho Giáo Viên

Xem file **[HUONG-DAN-GIAO-VIEN.md](./HUONG-DAN-GIAO-VIEN.md)** để biết:

- 3 kịch bản demo (10/20/15 phút)
- Cách giải thích "Tại sao bị loại?"
- Mẹo giảng dạy Union-Find
- Giải đáp thắc mắc sinh viên

---

## 🐛 Khắc Phục Lỗi

### Lỗi: Port 3000 đã được sử dụng

```bash
# Tìm process đang dùng port 3000
lsof -ti:3000 | xargs kill -9

# Chạy lại
npm run dev
```

### Lỗi: Port 8000 đã được sử dụng

```bash
# Tìm process đang dùng port 8000
lsof -ti:8000 | xargs kill -9

# Chạy lại
npm run dev
```

### Lỗi: Module not found

```bash
# Cài lại dependencies
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: Python module not found

```bash
cd backend
pip3 install -r requirements.txt
```

### Backend không tự động khởi động

```bash
# Chạy manual backend
cd backend
python3 -m uvicorn main:app --reload --port 8000

# Terminal khác chạy frontend
npm run dev
```

**👉 Khắc phục lỗi chi tiết**: Xem file **[CAI-DAT.md](./CAI-DAT.md)**

---

## 📝 Ghi Chú Kỹ Thuật

### WebSocket Real-time
- Backend gửi từng bước qua WebSocket
- Frontend nhận và cập nhật UI ngay lập tức
- Hỗ trợ pause/resume/reset

### D3.js Force Simulation
- Tự động bố trí đồ thị đẹp mắt
- Hỗ trợ drag nodes
- Zoom/Pan mượt mà

### Union-Find Optimized
- Path compression
- Union by rank
- O(α(n)) amortized time

---

## 🎓 Học Tập

### Thuật Toán Kruskal

1. **Sắp xếp** cạnh từ nhỏ đến lớn theo trọng số
2. **Xét từng cạnh** theo thứ tự:
   - ✅ Không tạo chu trình → Chấp nhận
   - ❌ Tạo chu trình → Loại bỏ
3. **Dừng** khi đủ V-1 cạnh

### Độ Phức Tạp

- **Sắp xếp**: O(E log E)
- **Union-Find**: O(E α(V))
- **Tổng**: O(E log E)

Với E = số cạnh, V = số đỉnh, α = inverse Ackermann function

---

## 📧 Liên Hệ

**Sinh viên**: Bùi Văn Chương  
**Môn**: Toán Rời Rạc  
**Chủ đề**: 7 - Cây Khung Nhỏ Nhất

---

## 📜 License

Dự án học tập - Toán Rời Rạc 2025

---

## 🧠 Thuật Toán Chi Tiết

### Union-Find Optimization
```python
# Path Compression - O(α(n)) amortized
def find(x):
    if parent[x] != x:
        parent[x] = find(parent[x])
    return parent[x]

# Union by Rank
def union(x, y):
    root_x, root_y = find(x), find(y)
    if rank[root_x] < rank[root_y]:
        parent[root_x] = root_y
    else:
        parent[root_y] = root_x
        if rank[root_x] == rank[root_y]:
            rank[root_x] += 1
```

### Complexity Analysis
- **Sorting**: O(E log E)
- **Union-Find**: O(E α(V)) where α = inverse Ackermann
- **Total**: **O(E log E)** - Optimal for sparse graphs

---

# Cách 1: Script tự động (Dễ nhất!)
./quick-start.sh

# Cách 2: NPM command
npm run dev
```

**Lưu ý**: Lần đầu chạy sẽ mất 1-2 phút để setup Python venv và install dependencies.

### ⚠️ Nếu gặp lỗi WebSocket

```bash
# Kill processes cũ
lsof -ti :8000 | xargs kill -9 2>/dev/null
lsof -ti :3000 | xargs kill -9 2>/dev/null

# Setup backend (lần đầu)
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Chạy lại
npm run dev
```

👉 **Chi tiết**: Xem [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

### 🌐 Truy cập

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000  
- **API Docs**: http://localhost:8000/docs

---

## 📦 Yêu cầu

- Python 3.8+
- Node.js 18+
- pnpm (hoặc npm)

---

## 📖 Sử dụng

1. **Nhập dữ liệu**: Nhập thủ công hoặc upload file Excel
2. **Chạy thuật toán**: Nhấn "Chạy Kruskal" hoặc "Từng Bước"
3. **Điều chỉnh tốc độ**: Sử dụng slider
4. **Xem kết quả**: Graph, logs, statistics real-time

---

## 🎨 Demo

Nhập ví dụ:
```
A B 7
A D 5
B C 8
B D 9
B E 7
C E 5
D E 15
D F 6
E F 8
E G 9
F G 11
```

**Kết quả**: MST cost = 39

---

## 🏗️ Kiến trúc

```
Frontend (Next.js) ←→ WebSocket ←→ Backend (FastAPI/Python)
                   ←→ REST API ←→
```

---

## 🛠️ Development Scripts

```bash
npm run dev              # Chạy cả backend + frontend  
npm run dev:backend      # Chỉ backend
npm run dev:frontend     # Chỉ frontend
npm run backend:test     # Test Python algorithm
npm run build            # Production build
```

---

## 📝 Chi tiết

Xem thêm:
- [QUICKSTART.md](QUICKSTART.md) - Hướng dẫn nhanh
- [README_SETUP.md](README_SETUP.md) - Setup chi tiết
- [backend/README.md](backend/README.md) - Backend docs

---

## 📄 License

MIT

---

**Made with ❤️ by Bùi Văn Chương**
