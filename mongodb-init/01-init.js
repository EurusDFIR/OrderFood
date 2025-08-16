// MongoDB initialization script for Lena Food
db = db.getSiblingDB('orderfood');

// Create admin user
db.createUser({
  user: 'hung',
  pwd: 'hung123',
  roles: [
    {
      role: 'admin',
      db: 'orderfood'
    }
  ]
});

// Create collections
db.createCollection('users');
db.createCollection('products');
db.createCollection('orders');
db.createCollection('carts');

// Insert sample admin user
db.users.insertOne({
  name: 'Admin',
  email: 'hung@gmail.com',
  password: '$2b$10$rOm5ZJ9mHvTCElLbVKfKj.RK.CnJnNqF1nU2uDJfxGfJXJjU2g2PS', // hung123
  phone: '0935416414',
  role: 'admin',
  isActive: true,
  shipperInfo: {
    isAvailable: true,
    deliveryRadius: 10
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

// Insert sample products
db.products.insertMany([
  {
    name: 'Phở Bò Tái',
    description: 'Phở bò tái truyền thống với nước dùng đậm đà',
    price: 45000,
    category: 'pho',
    images: ['https://example.com/pho-bo-tai.jpg'],
    isAvailable: true,
    stock: 50,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Bánh Mì Thịt Nướng',
    description: 'Bánh mì với thịt nướng thơm ngon',
    price: 25000,
    category: 'banh-mi',
    images: ['https://example.com/banh-mi.jpg'],
    isAvailable: true,
    stock: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Cơm Tấm Sườn',
    description: 'Cơm tấm sườn nướng đặc biệt',
    price: 35000,
    category: 'com',
    images: ['https://example.com/com-tam.jpg'],
    isAvailable: true,
    stock: 40,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('✅ Database initialized successfully with sample data!');
