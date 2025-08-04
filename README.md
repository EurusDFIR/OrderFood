### **Sơ Lược Dự Án: Ứng Dụng Đặt Món Ăn**

#### **1. Giới thiệu chung**

Đây là một ứng dụng web cho phép người dùng xem thực đơn, đặt món ăn và quản lý đơn hàng của mình. Ứng dụng được xây dựng theo kiến trúc Monolith để tối ưu hóa thời gian phát triển và đảm bảo sự đơn giản trong quản lý.

#### **2. Công nghệ sử dụng**

| Thành phần   | Công nghệ                  | Chi tiết                                                                                                                                              |
| :----------- | :------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Backend**  | **Node.js, Express**       | Sử dụng Node.js làm nền tảng, với ExpressJS để xây dựng các API (Application Programming Interface) cho ứng dụng.                                     |
| **Database** | **MongoDB, Mongoose**      | Sử dụng MongoDB làm cơ sở dữ liệu NoSQL để lưu trữ tất cả thông tin. Mongoose là thư viện giúp tương tác với MongoDB một cách dễ dàng và có cấu trúc. |
| **Frontend** | **ReactJS**                | Sử dụng thư viện ReactJS để xây dựng giao diện người dùng (UI) tương tác, kết nối với Backend để lấy và gửi dữ liệu.                                  |
| **Đóng gói** | **Docker, Docker Compose** | Sử dụng Docker để đóng gói toàn bộ ứng dụng (Backend, Frontend, Database) thành các container, đảm bảo môi trường phát triển nhất quán.               |

#### **3. Các chức năng chính**

Ứng dụng sẽ bao gồm các chức năng cốt lõi được chia thành các mô-đun chính như sau:

- **Mô-đun Người dùng (User)**

  - **Đăng ký (Register):** Người dùng có thể tạo một tài khoản mới bằng cách cung cấp các thông tin cơ bản.
  - **Đăng nhập (Login):** Người dùng có thể đăng nhập vào tài khoản của mình để truy cập các chức năng đặt món.
  - **Thông tin:** Hệ thống lưu trữ các thông tin cơ bản của người dùng như tên, email, mật khẩu (đã được mã hóa).

- **Mô-đun Sản phẩm (Product/Food)**

  - **Xem danh sách món ăn:** Người dùng có thể xem toàn bộ menu với thông tin chi tiết về từng món ăn.
  - **Xem chi tiết món ăn:** Người dùng có thể xem thông tin chi tiết hơn về một món ăn cụ thể (tên, giá, mô tả).
  - **Quản lý món ăn:** (Dành cho Admin - có thể mở rộng sau này) Hệ thống cho phép thêm, sửa, xóa các món ăn trong menu.

- **Mô-đun Đơn hàng (Order)**

  - **Đặt món ăn:** Người dùng có thể thêm các món ăn vào giỏ hàng và tạo một đơn hàng mới.
  - **Lịch sử đơn hàng:** Người dùng có thể xem lại lịch sử các đơn hàng đã đặt của mình.
  - **Chi tiết đơn hàng:** Hệ thống lưu trữ các thông tin chi tiết của đơn hàng như các món đã chọn, số lượng, địa điểm nhận hàng, và tổng số tiền.

- **Mô-đun Thanh toán (Payment)**

  - **Tính toán tổng tiền:** Hệ thống tự động tính toán tổng số tiền của đơn hàng.
  - **Áp dụng mã giảm giá:** Hỗ trợ nhập và xử lý mã giảm giá.
  - **Thanh toán:** Tích hợp quy trình thanh toán (đơn giản).

- **Mô-đun Liên hệ (Contact)**
  - **Giao diện liên hệ:** Cung cấp một giao diện tĩnh hoặc form đơn giản để người dùng có thể gửi câu hỏi hoặc phản hồi.

#### **4. Cấu trúc ứng dụng**

Dự án được tổ chức thành hai phần chính, độc lập nhưng liên kết với nhau:

- **Backend:** Chứa toàn bộ logic nghiệp vụ và API, sử dụng kiến trúc Express/Node.js, được đóng gói trong một thư mục `backend/`.
- **Frontend:** Chứa giao diện người dùng, được xây dựng bằng ReactJS và nằm trong thư mục `frontend/`.

Cả hai thành phần này sẽ được khởi động và quản lý bởi Docker Compose.

Bản sơ lược này sẽ là tài liệu tham khảo chính cho bạn và bạn của bạn trong suốt quá trình phát triển dự án.
