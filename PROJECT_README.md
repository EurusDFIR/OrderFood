# OrderFood - Ứng Dụng Đặt Món Ăn

## 📖 Giới thiệu

OrderFood là một ứng dụng web full-stack cho phép người dùng xem thực đơn, đặt món ăn và quản lý đơn hàng. Ứng dụng được xây dựng theo kiến trúc Monolith với backend Node.js/Express và frontend ReactJS.

## 🚀 Công nghệ sử dụng

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM cho MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **ReactJS** - UI library
- **CSS3** - Styling

### DevOps & Tools
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Git** - Version control

## 📁 Cấu trúc dự án

```
OrderFood/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── config/         # Configuration files
│   │   └── app.js          # Express app entry point
│   ├── package.json
│   ├── .env
│   └── seedProducts.js     # Database seeding
├── frontend/               # Frontend React app
├── docker-compose.yml      # Docker services
├── docker-compose.mongodb.yml  # MongoDB service
└── README.md
```

## 🛠️ Cài đặt và Chạy

### Yêu cầu hệ thống
- Node.js >= 16.x
- Docker & Docker Compose
- Git

### 1. Clone repository
```bash
git clone <repository-url>
cd OrderFood
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

### 3. Cấu hình môi trường

Tạo file `.env` trong thư mục `backend/`:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://admin:password123@localhost:27017/orderfood?authSource=admin

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### 4. Khởi động MongoDB bằng Docker

```bash
# Từ thư mục root
docker-compose -f docker-compose.mongodb.yml up -d
```

### 5. Seed dữ liệu mẫu

```bash
cd backend
npm run seed
```

### 6. Khởi động Backend

```bash
npm start
# hoặc development mode
npm run dev
```

Backend sẽ chạy tại: `http://localhost:5000`

## 🌐 API Endpoints

### Authentication APIs
```
POST /api/users/register    # Đăng ký user
POST /api/users/login       # Đăng nhập
GET  /api/users/me          # Lấy thông tin user (cần auth)
PUT  /api/users/me          # Cập nhật thông tin (cần auth)
PUT  /api/users/change-password  # Đổi mật khẩu (cần auth)
```

### Product APIs
```
GET    /api/products                    # Lấy tất cả sản phẩm
GET    /api/products/popular            # Sản phẩm phổ biến
GET    /api/products/category/:category # Sản phẩm theo danh mục
GET    /api/products/search/:query      # Tìm kiếm sản phẩm
GET    /api/products/:id                # Chi tiết sản phẩm
POST   /api/products                    # Tạo sản phẩm (Admin)
PUT    /api/products/:id                # Cập nhật sản phẩm (Admin)
DELETE /api/products/:id                # Xóa sản phẩm (Admin)
```

### Health Check
```
GET /api/health    # Kiểm tra trạng thái server
```

## 📊 Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: String,
  role: String (user/admin),
  isActive: Boolean,
  timestamps: true
}
```

### Product Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String (enum),
  image: String,
  images: [String],
  isAvailable: Boolean,
  preparationTime: Number,
  ingredients: [String],
  nutritionInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  ratings: {
    average: Number,
    count: Number
  },
  tags: [String],
  isPopular: Boolean,
  discount: {
    percentage: Number,
    startDate: Date,
    endDate: Date
  },
  createdBy: ObjectId (ref: User),
  timestamps: true
}
```

## 🧪 Testing với Postman

### Tạo Collection trong Postman
1. **Collection Name**: OrderFood API
2. **Base URL**: `http://localhost:5000/api`

### Test Cases mẫu

#### 1. Health Check
```
GET {{baseUrl}}/health
```

#### 2. Đăng ký User
```
POST {{baseUrl}}/users/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test123456",
  "phone": "0123456789",
  "address": "123 Test Street"
}
```

#### 3. Đăng nhập
```
POST {{baseUrl}}/users/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123456"
}
```

#### 4. Lấy danh sách sản phẩm
```
GET {{baseUrl}}/products?page=1&limit=10
```

#### 5. Lấy sản phẩm theo danh mục
```
GET {{baseUrl}}/products/category/com
```

#### 6. Tìm kiếm sản phẩm
```
GET {{baseUrl}}/products/search/pho
```

#### 7. Tạo sản phẩm mới (Admin)
```
POST {{baseUrl}}/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Cơm Tấm Sườn",
  "description": "Cơm tấm sườn nướng thơm ngon",
  "price": 45000,
  "category": "com",
  "preparationTime": 20,
  "ingredients": ["Cơm tấm", "Sườn nướng", "Chả trứng"],
  "tags": ["cơm tấm", "sườn nướng"]
}
```

## 🐳 Docker Commands

```bash
# Khởi động MongoDB
docker-compose -f docker-compose.mongodb.yml up -d

# Xem logs MongoDB
docker logs orderfood-mongodb

# Dừng MongoDB
docker-compose -f docker-compose.mongodb.yml down

# Xem các container đang chạy
docker ps

# Kết nối MongoDB shell
docker exec -it orderfood-mongodb mongosh -u admin -p password123 --authenticationDatabase admin
```

## 📝 Scripts có sẵn

### Backend
```bash
npm start        # Khởi động production server
npm run dev      # Khởi động development server với nodemon
npm run seed     # Seed dữ liệu mẫu vào database
```

## 🔧 Danh mục sản phẩm

- `com` - Cơm
- `pho` - Phở
- `bun` - Bún
- `banh-mi` - Bánh mì
- `do-uong` - Đồ uống
- `trang-mieng` - Tráng miệng
- `mon-chay` - Món chay
- `lau` - Lẩu
- `nuong` - Nướng
- `khac` - Khác

## 🔐 Authentication

API sử dụng JWT (JSON Web Tokens) cho authentication:
- Token có thời hạn 7 ngày
- Gửi token trong header: `Authorization: Bearer <token>`
- Admin APIs yêu cầu role admin

## 🛡️ Security Features

- Password hashing với bcryptjs (cost: 12)
- JWT authentication
- Input validation với express-validator
- CORS configuration
- Request rate limiting (có thể thêm)

## 📈 Tính năng sắp tới

- [ ] Order Management System
- [ ] Payment Integration
- [ ] Email Notifications
- [ ] File Upload cho hình ảnh
- [ ] Review & Rating System
- [ ] Shopping Cart
- [ ] Admin Dashboard

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License.

## 👥 Contact

Your Name - email@example.com
Project Link: [https://github.com/yourusername/OrderFood](https://github.com/yourusername/OrderFood)
