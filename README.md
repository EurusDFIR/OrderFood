# 🍽️ Lena Food - Order Management System

> Hệ thống quản lý đặt món ăn trực tuyến với giao diện hiện đại và theme emerald green

## 🚀 Quick Start (Chạy ngay với Docker)

### Yêu cầu hệ thống

- Docker Desktop (Windows/Mac) hoặc Docker Engine (Linux)
- Git

### Cài đặt và chạy

```bash
# 1. Clone repository
git clone https://github.com/EurusDFIR/OrderFood.git
cd OrderFood

# 2. Chạy toàn bộ ứng dụng với Docker
docker-compose up -d

# 3. Đợi 2-3 phút để services khởi động xong, sau đó truy cập:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:5000
# - MongoDB: localhost:27017
```

### Tài khoản mặc định

- **Email**: hung@gmail.com
- **Password**: hung123
- **Role**: Admin

## 📂 Cấu trúc dự án

```
OrderFood/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/           # Pages (Homepage, Products, Admin...)
│   │   ├── context/         # React Context (Auth, Cart, Products...)
│   │   └── utils/           # Utilities
│   ├── Dockerfile
│   └── package.json
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   └── middleware/      # Auth, validation middleware
│   ├── Dockerfile
│   └── package.json
├── mongodb-init/            # Database initialization
├── docker-compose.yml       # Docker services configuration
└── README.md
```

## 🎨 Features

### ✨ Giao diện người dùng

- **Modern UI**: Theme emerald green hiện đại
- **Responsive**: Tối ưu cho mobile và desktop
- **Banner**: Auto-sliding với hình ảnh thật
- **Product Grid**: Hiển thị sản phẩm với filter và search
- **Shopping Cart**: Quản lý giỏ hàng realtime

### 🔐 Authentication & Authorization

- **JWT Authentication**: Đăng nhập bảo mật
- **Role-based Access**: Admin/User roles
- **Protected Routes**: Bảo vệ admin pages

### 📦 Quản lý sản phẩm

- **CRUD Operations**: Tạo, đọc, cập nhật, xóa sản phẩm
- **Categories**: Phân loại món ăn (phở, bánh mì, cơm...)
- **Image Handling**: Upload và hiển thị hình ảnh
- **Stock Management**: Quản lý tồn kho

### 🛒 Đặt hàng & Thanh toán

- **Order Management**: Quản lý đơn hàng
- **Payment Methods**: Tiền mặt, chuyển khoản
- **Order Tracking**: Theo dõi trạng thái đơn hàng
- **Delivery Info**: Thông tin giao hàng

### 👨‍💼 Admin Dashboard

- **Statistics**: Thống kê doanh thu, đơn hàng
- **Order Management**: Quản lý tất cả đơn hàng
- **User Management**: Quản lý người dùng
- **Product Management**: Quản lý sản phẩm

## 🛠️ Development

### Chạy trong Development Mode

```bash
# Chạy từng service riêng biệt (cho development)

# Terminal 1: Database
docker run --name lena-mongo -p 27017:27017 -d mongo:6.0

# Terminal 2: Backend
cd backend
npm install
npm run dev

# Terminal 3: Frontend
cd frontend
npm install
npm start
```

### Environment Variables

#### Backend (.env)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/orderfood
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🐳 Docker Commands

```bash
# Khởi động tất cả services
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng tất cả services
docker-compose down

# Rebuild images
docker-compose build --no-cache

# Xóa volumes (reset database)
docker-compose down -v
```

## 🌐 API Endpoints

### Authentication

- `POST /api/users/register` - Đăng ký
- `POST /api/users/login` - Đăng nhập
- `GET /api/users/profile` - Thông tin user

### Products

- `GET /api/products` - Danh sách sản phẩm
- `GET /api/products/:id` - Chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm (admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (admin)

### Orders

- `GET /api/orders/my` - Đơn hàng của user
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/admin/orders` - Tất cả đơn hàng (admin)

### Cart

- `GET /api/cart` - Giỏ hàng hiện tại
- `POST /api/cart/add` - Thêm vào giỏ hàng
- `DELETE /api/cart/remove/:productId` - Xóa khỏi giỏ hàng

## 🎯 Tech Stack

### Frontend

- **React 18** với TypeScript
- **Tailwind CSS** cho styling
- **Framer Motion** cho animations
- **React Router** cho navigation
- **Context API** cho state management

### Backend

- **Node.js** với Express.js
- **MongoDB** với Mongoose ODM
- **JWT** cho authentication
- **bcrypt** cho password hashing
- **multer** cho file uploads

### DevOps

- **Docker** & Docker Compose
- **Multi-stage builds**
- **Health checks**
- **Volume persistence**

## 🔧 Troubleshooting

### Port đã được sử dụng

```bash
# Kiểm tra ports đang sử dụng
netstat -tulpn | grep :3000
netstat -tulpn | grep :5000

# Hoặc thay đổi ports trong docker-compose.yml
```

### Database connection issues

```bash
# Reset database
docker-compose down -v
docker-compose up -d mongodb
# Đợi 30 giây rồi chạy lại backend và frontend
```

### Frontend không kết nối được Backend

- Kiểm tra `REACT_APP_API_URL` trong frontend/.env
- Đảm bảo backend đang chạy trên đúng port

## 📱 Screenshots

### Homepage với Modern Banner

- Auto-sliding banner với real food images
- Search bar với gợi ý
- Popular products grid

### Product Details

- High-quality product images
- Detailed descriptions
- Add to cart functionality

### Admin Dashboard

- Sales statistics
- Order management
- Product CRUD operations

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Author

**EurusDFIR**

- GitHub: [@EurusDFIR](https://github.com/EurusDFIR)

---

<div align="center">
  <h3>🍽️ Lena Food - Bringing delicious food to your doorstep</h3>
  <p>Made with ❤️ and emerald green theme</p>
</div>
