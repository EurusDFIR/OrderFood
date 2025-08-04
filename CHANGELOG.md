# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-08-04

### Added
- **User Authentication System**
  - User registration with validation
  - User login with JWT authentication
  - User profile management
  - Password change functionality
  - Role-based access control (user/admin)

- **Product Management System**
  - Complete CRUD operations for products
  - Product categorization (10 categories)
  - Product search functionality
  - Popular products endpoint
  - Advanced filtering and pagination
  - Product image management
  - Nutrition information tracking
  - Discount system with date ranges
  - Product ratings system
  - Tags system for better searchability

- **Database Models**
  - User model with full validation
  - Product model with comprehensive fields
  - MongoDB integration with Mongoose ODM
  - Database indexing for performance
  - Data seeding script with sample products

- **API Architecture**
  - RESTful API design
  - Input validation middleware
  - Error handling middleware
  - CORS configuration
  - JWT authentication middleware
  - Role-based authorization

- **Development Tools**
  - Docker Compose for MongoDB
  - Environment configuration
  - Database seeding script
  - Comprehensive API documentation
  - Git ignore configuration

### Technical Details
- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcryptjs hashing
- **Validation**: express-validator
- **Containerization**: Docker & Docker Compose

### Security Features
- Password hashing with bcryptjs (cost: 12)
- JWT token-based authentication
- Input validation and sanitization
- CORS protection
- Role-based access control

### API Endpoints
#### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `PUT /api/users/change-password` - Change password

#### Products
- `GET /api/products` - Get all products with filtering/pagination
- `GET /api/products/popular` - Get popular products
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/search/:query` - Search products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

#### System
- `GET /api/health` - Health check endpoint

### Database
- 10 sample products across different categories
- Admin user account for testing
- Proper indexing for search performance
- Virtual fields for calculated values

### Documentation
- Complete API documentation
- Setup and installation guide
- Docker deployment instructions
- Postman testing guide
- Contributing guidelines

## [Unreleased]

### Planned Features
- [ ] Order Management System
- [ ] Shopping Cart functionality
- [ ] Payment Integration
- [ ] Email Notifications
- [ ] File Upload for product images
- [ ] Review & Rating System
- [ ] Admin Dashboard
- [ ] Frontend React application
