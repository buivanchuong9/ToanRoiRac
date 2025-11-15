# 📦 Hướng Dẫn Cài Đặt Chi Tiết

## 🔧 Yêu Cầu Hệ Thống

### Phần Mềm Cần Thiết

1. **Node.js** (>= 18.0)
   ```bash
   # Kiểm tra version
   node --version
   
   # Nếu chưa có, download tại:
   # https://nodejs.org/
   ```

2. **Python 3** (>= 3.8)
   ```bash
   # Kiểm tra version
   python3 --version
   
   # Nếu chưa có, download tại:
   # https://www.python.org/downloads/
   ```

3. **pip** (Python package manager)
   ```bash
   # Kiểm tra
   pip3 --version
   
   # Nếu chưa có:
   # macOS/Linux
   curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
   python3 get-pip.py
   ```

4. **npm** hoặc **pnpm** (đã có kèm Node.js)
   ```bash
   # Kiểm tra npm
   npm --version
   
   # (Tùy chọn) Cài pnpm nếu muốn
   npm install -g pnpm
   ```

---

## 📥 Cài Đặt Từng Bước

### Bước 1: Clone/Download Project

```bash
# Nếu dùng Git
git clone <repository-url>
cd ToanRoiRac

# Hoặc download ZIP và giải nén
cd /path/to/ToanRoiRac
```

### Bước 2: Cài Node.js Dependencies

```bash
# Dùng npm (khuyến nghị)
npm install

# Hoặc dùng pnpm (nhanh hơn)
pnpm install
```

**Thời gian**: ~2-3 phút

**Packages sẽ được cài**:
- `next` - React framework
- `react`, `react-dom` - UI library
- `d3` - Visualization library
- `tailwindcss` - CSS framework
- `shadcn/ui` - UI components
- Và nhiều dependencies khác...

### Bước 3: Cài Python Dependencies

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài packages
pip3 install -r requirements.txt
```

**Thời gian**: ~1-2 phút

**Packages sẽ được cài**:
```
fastapi==0.104.1      # Web framework
uvicorn==0.24.0       # ASGI server
websockets==12.0      # WebSocket support
openpyxl==3.1.2       # Đọc Excel files
```

### Bước 4: Kiểm Tra Cài Đặt

```bash
# Quay về thư mục gốc
cd ..

# Kiểm tra Node packages
npm list --depth=0

# Kiểm tra Python packages
pip3 list | grep -E "fastapi|uvicorn|websockets|openpyxl"
```

**Kết quả mong đợi**:
```
fastapi                  0.104.1
uvicorn                  0.24.0
websockets               12.0
openpyxl                 3.1.2
```

---

## 🚀 Chạy Lần Đầu

### Cách 1: Chạy Tự Động (Khuyến Nghị)

```bash
npm run dev
```

Script sẽ:
1. ✅ Khởi động Backend (Python) trên port 8000
2. ✅ Khởi động Frontend (Next.js) trên port 3000
3. ✅ Tự động mở browser

### Cách 2: Chạy Thủ Công (Nếu Cách 1 Lỗi)

**Terminal 1** - Backend:
```bash
cd backend
python3 -m uvicorn main:app --reload --port 8000
```

**Terminal 2** - Frontend:
```bash
npm run dev
# hoặc
npx next dev
```

### Truy Cập Ứng Dụng

- **Frontend**: http://localhost:3000
- **Backend API Docs**: http://localhost:8000/docs
- **WebSocket**: ws://localhost:8000/ws

---

## 🧪 Test Chức Năng

### 1. Test Frontend

```bash
# Mở browser: http://localhost:3000
# Kiểm tra:
✓ Trang web load thành công
✓ Thấy tiêu đề "Thuật Toán Kruskal"
✓ Thấy các button tiếng Việt
```

### 2. Test Backend API

```bash
# Mở browser: http://localhost:8000/docs
# Kiểm tra:
✓ Thấy Swagger UI
✓ Thấy endpoint /kruskal-stream
✓ Test endpoint bằng "Try it out"
```

### 3. Test Demo

```bash
1. Click nút "✨ Demo"
   → Thấy message "Đã tải 9 cạnh demo"
   
2. Click "▶ Start"
   → Thấy đồ thị bắt đầu chạy
   → Cạnh chuyển màu xanh/đỏ
   
3. Click "📊 Chủ Đề 7"
   → Thấy message "Đã tải 100 cạnh"
```

---

## 🔧 Cấu Hình Nâng Cao

### Thay Đổi Port

**Backend** - Sửa `backend/main.py`:
```python
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)  # Đổi port ở đây
```

**Frontend** - Chạy với port khác:
```bash
npm run dev -- -p 3001  # Chạy trên port 3001
```

### Environment Variables

Tạo file `.env.local`:
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

---

## 🐛 Xử Lý Lỗi Thường Gặp

### Lỗi 1: `npm: command not found`

**Nguyên nhân**: Chưa cài Node.js

**Giải pháp**:
```bash
# macOS - dùng Homebrew
brew install node

# Hoặc download tại: https://nodejs.org/
```

### Lỗi 2: `pip3: command not found`

**Nguyên nhân**: Chưa cài pip

**Giải pháp**:
```bash
# macOS
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python3 get-pip.py
```

### Lỗi 3: `Error: EADDRINUSE: address already in use :::3000`

**Nguyên nhân**: Port 3000 đang được dùng

**Giải pháp**:
```bash
# Tìm và kill process
lsof -ti:3000 | xargs kill -9

# Hoặc dùng port khác
npm run dev -- -p 3001
```

### Lỗi 4: `ModuleNotFoundError: No module named 'fastapi'`

**Nguyên nhân**: Chưa cài Python dependencies

**Giải pháp**:
```bash
cd backend
pip3 install -r requirements.txt
```

### Lỗi 5: `Error: Cannot find module 'next'`

**Nguyên nhân**: Chưa cài Node dependencies

**Giải pháp**:
```bash
# Xóa và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Lỗi 6: Permission denied khi cài packages

**Giải pháp**:
```bash
# macOS/Linux - dùng sudo (KHÔNG khuyến nghị cho npm)
sudo pip3 install -r backend/requirements.txt

# Tốt hơn: dùng virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
```

### Lỗi 7: Backend không tự động khởi động

**Giải pháp**: Chạy manual 2 terminal

**Terminal 1**:
```bash
cd backend
python3 -m uvicorn main:app --reload --port 8000
```

**Terminal 2**:
```bash
npm run dev
```

---

## 🧹 Dọn Dẹp & Reset

### Xóa Node Modules

```bash
rm -rf node_modules package-lock.json
npm install
```

### Xóa Next.js Cache

```bash
rm -rf .next
npm run dev
```

### Reset Toàn Bộ

```bash
# Xóa tất cả cache
rm -rf node_modules package-lock.json .next

# Cài lại
npm install

# Chạy
npm run dev
```

---

## 📋 Checklist Cài Đặt

Đánh dấu ✅ khi hoàn thành:

- [ ] Cài Node.js (>= 18.0)
- [ ] Cài Python 3 (>= 3.8)
- [ ] Cài pip3
- [ ] Clone/Download project
- [ ] `npm install` thành công
- [ ] `pip3 install -r backend/requirements.txt` thành công
- [ ] `npm run dev` chạy được
- [ ] Mở http://localhost:3000 thấy giao diện
- [ ] Click "✨ Demo" thấy load 9 cạnh
- [ ] Click "▶ Start" thấy animation chạy
- [ ] Click "📊 Chủ Đề 7" load 100 cạnh từ Excel

**Nếu tất cả đều ✅ → Cài đặt thành công!**

---

## 🆘 Hỗ Trợ

Nếu vẫn gặp lỗi:

1. **Kiểm tra lại version**:
   ```bash
   node --version  # >= 18.0
   python3 --version  # >= 3.8
   pip3 --version
   ```

2. **Đọc log lỗi kỹ càng**:
   - Thường log sẽ nói thiếu package nào
   - Copy lỗi search Google

3. **Restart máy tính**:
   - Đôi khi giúp giải quyết lỗi lạ

4. **Cài lại từ đầu**:
   ```bash
   rm -rf node_modules .next
   npm install
   cd backend && pip3 install -r requirements.txt
   ```

---

## ✅ Kết Luận

Sau khi cài đặt xong:

- **Chạy ứng dụng**: `npm run dev`
- **Đọc hướng dẫn sử dụng**: `README.md`
- **Hướng dẫn giảng dạy**: `HUONG-DAN-GIAO-VIEN.md`

**Chúc bạn cài đặt thành công! 🎉**
