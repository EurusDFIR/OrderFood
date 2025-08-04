# OrderFood Backend API

## Cài đặt và Chạy

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình môi trường

Đảm bảo file `.env` có các biến sau:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/orderfood
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### 3. Chạy server

```bash
# Development mode (với nodemon)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Base URL: `http://localhost:5000/api`

### 1. Health Check

- **GET** `/health`
- Kiểm tra trạng thái server

### 2. User Authentication

#### Đăng ký

- **POST** `/users/register`
- **Body**:

```json
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "Password123",
  "phone": "0123456789",
  "address": "123 ABC Street, Ho Chi Minh City"
}
```

#### Đăng nhập

- **POST** `/users/login`
- **Body**:

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

### 3. User Profile (Cần Authentication)

#### Lấy thông tin user hiện tại

- **GET** `/users/me`
- **Headers**: `Authorization: Bearer <token>`

#### Cập nhật thông tin user

- **PUT** `/users/me`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```json
{
  "name": "Tên mới",
  "phone": "0987654321",
  "address": "Địa chỉ mới"
}
```

#### Đổi mật khẩu

- **PUT** `/users/change-password`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:

```json
{
  "currentPassword": "Password123",
  "newPassword": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```

## Kiểm thử với Postman

### 1. Tạo Collection mới

- Tên: "OrderFood API"
- Base URL: `http://localhost:5000/api`

### 2. Test Cases

#### Test 1: Health Check

- Method: GET
- URL: `{{baseUrl}}/health`

#### Test 2: Đăng ký User

- Method: POST
- URL: `{{baseUrl}}/users/register`
- Body (JSON):

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test123456",
  "phone": "0123456789",
  "address": "123 Test Street"
}
```

#### Test 3: Đăng nhập

- Method: POST
- URL: `{{baseUrl}}/users/login`
- Body (JSON):

```json
{
  "email": "test@example.com",
  "password": "Test123456"
}
```

- **Lưu token từ response để sử dụng cho các test khác**

#### Test 4: Lấy thông tin User

- Method: GET
- URL: `{{baseUrl}}/users/me`
- Headers: `Authorization: Bearer <token_from_login>`

#### Test 5: Cập nhật thông tin

- Method: PUT
- URL: `{{baseUrl}}/users/me`
- Headers: `Authorization: Bearer <token_from_login>`
- Body (JSON):

```json
{
  "name": "Updated Name",
  "phone": "0987654321"
}
```

#### Test 6: Đổi mật khẩu

- Method: PUT
- URL: `{{baseUrl}}/users/change-password`
- Headers: `Authorization: Bearer <token_from_login>`
- Body (JSON):

```json
{
  "currentPassword": "Test123456",
  "newPassword": "NewTest123456",
  "confirmPassword": "NewTest123456"
}
```

## Response Format

### Success Response

```json
{
  "status": "success",
  "token": "jwt_token_here", // Chỉ có trong login/register
  "data": {
    "user": {
      "_id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "phone": "0123456789",
      "address": "User Address",
      "role": "user",
      "isActive": true,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Error message",
  "errors": [
    // Chỉ có khi validation error
    {
      "field": "email",
      "message": "Email không hợp lệ"
    }
  ]
}
```

## Lưu ý

1. **MongoDB**: Đảm bảo MongoDB đang chạy trên port 27017
2. **JWT Token**: Token có thời hạn 7 ngày, cần đăng nhập lại khi hết hạn
3. **Validation**: API có validation nghiêm ngặt cho tất cả input
4. **Security**: Password được hash bằng bcrypt với cost 12
5. **CORS**: Đã cấu hình CORS cho frontend chạy trên port 3000
