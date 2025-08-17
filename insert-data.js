// MongoDB insertion script
use lenaFoodDB

// Insert sample admin user (for login)
db.users.insertOne({
  name: 'Admin User',
  email: 'hung@gmail.com',
  password: '$2a$12$9I8G2Nv7z/FYJNsaZpl/WuXbEsi8N4s3wbuN45z0qok67L.T1RQUO', // hung123 (correct hash)
  role: 'admin',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Insert sample products
db.products.insertMany([
  {
    name: 'Phở Bò Tái',
    description: 'Phở bò truyền thống với thịt bò tái tươi ngon',
    price: 85000,
    category: 'main-dish',
    image: '/images/pho-bo-tai.jpg',
    isAvailable: true,
    preparationTime: 15,
    ingredients: ['Bánh phở', 'Thịt bò tái', 'Hành lá', 'Ngò rí', 'Hành tây'],
    nutrition: {
      calories: 450,
      protein: 25,
      carbs: 60,
      fat: 12
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Bánh Mì Thịt Nướng',
    description: 'Bánh mì giòn với thịt nướng thơm lừng',
    price: 35000,
    category: 'snack',
    image: '/images/banh-mi-thit-nuong.jpg',
    isAvailable: true,
    preparationTime: 10,
    ingredients: ['Bánh mì', 'Thịt nướng', 'Rau cải', 'Đồ chua', 'Tương ớt'],
    nutrition: {
      calories: 320,
      protein: 18,
      carbs: 35,
      fat: 12
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Cơm Gà Xối Mỡ',
    description: 'Cơm gà Hải Nam truyền thống với gà xối mỡ',
    price: 75000,
    category: 'main-dish',
    image: '/images/com-ga-xoi-mo.jpg',
    isAvailable: true,
    preparationTime: 20,
    ingredients: ['Cơm gạo thơm', 'Gà ta', 'Mỡ gà', 'Hành lá', 'Nước mắm'],
    nutrition: {
      calories: 520,
      protein: 30,
      carbs: 45,
      fat: 22
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Bún Chả Hà Nội',
    description: 'Bún chả Hà Nội đậm đà với chả nướng thơm',
    price: 65000,
    category: 'main-dish',
    image: '/images/bun-cha-ha-noi.jpg',
    isAvailable: true,
    preparationTime: 18,
    ingredients: ['Bún tươi', 'Chả nướng', 'Thịt nướng', 'Nước mắm', 'Rau sống'],
    nutrition: {
      calories: 420,
      protein: 22,
      carbs: 55,
      fat: 10
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Chè Ba Màu',
    description: 'Chè ba màu mát lạnh với đậu xanh, đậu đỏ',
    price: 25000,
    category: 'dessert',
    image: '/images/che-ba-mau.jpg',
    isAvailable: true,
    preparationTime: 5,
    ingredients: ['Đậu xanh', 'Đậu đỏ', 'Thạch rau câu', 'Nước cốt dừa', 'Đá bào'],
    nutrition: {
      calories: 180,
      protein: 5,
      carbs: 35,
      fat: 3
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Cà Phê Sữa Đá',
    description: 'Cà phê Việt Nam truyền thống với sữa đặc',
    price: 20000,
    category: 'beverage',
    image: '/images/ca-phe-sua-da.jpg',
    isAvailable: true,
    preparationTime: 3,
    ingredients: ['Cà phê phin', 'Sữa đặc', 'Đá'],
    nutrition: {
      calories: 150,
      protein: 3,
      carbs: 20,
      fat: 6
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Bánh Xèo Miền Tây',
    description: 'Bánh xèo giòn rụm với tôm thịt đậm đà',
    price: 55000,
    category: 'main-dish',
    image: '/images/banh-xeo-mien-tay.jpg',
    isAvailable: true,
    preparationTime: 15,
    ingredients: ['Bột bánh xèo', 'Tôm tươi', 'Thịt ba chỉ', 'Giá đỗ', 'Rau sống'],
    nutrition: {
      calories: 380,
      protein: 20,
      carbs: 40,
      fat: 15
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Gỏi Cuốn Tôm Thịt',
    description: 'Gỏi cuốn tươi mát với tôm và thịt luộc',
    price: 45000,
    category: 'appetizer',
    image: '/images/goi-cuon-tom-thit.jpg',
    isAvailable: true,
    preparationTime: 12,
    ingredients: ['Bánh tráng', 'Tôm luộc', 'Thịt luộc', 'Bún tươi', 'Rau thơm'],
    nutrition: {
      calories: 220,
      protein: 15,
      carbs: 25,
      fat: 6
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Nem Nướng Nha Trang',
    description: 'Nem nướng Nha Trang thơm ngon với bánh tráng',
    price: 70000,
    category: 'main-dish',
    image: '/images/nem-nuong-nha-trang.jpg',
    isAvailable: true,
    preparationTime: 20,
    ingredients: ['Nem nướng', 'Bánh tráng', 'Bún', 'Rau sống', 'Tương ớt'],
    nutrition: {
      calories: 410,
      protein: 25,
      carbs: 42,
      fat: 14
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Trà Sữa Trân Châu',
    description: 'Trà sữa trân châu đường đen thơm ngon',
    price: 30000,
    category: 'beverage',
    image: '/images/tra-sua-tran-chau.jpg',
    isAvailable: true,
    preparationTime: 8,
    ingredients: ['Trà đen', 'Sữa tươi', 'Trân châu', 'Đường đen'],
    nutrition: {
      calories: 280,
      protein: 5,
      carbs: 45,
      fat: 8
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Bánh Tráng Nướng',
    description: 'Bánh tráng nướng Đà Lạt với trứng và hành lá',
    price: 15000,
    category: 'snack',
    image: '/images/banh-trang-nuong.jpg',
    isAvailable: true,
    preparationTime: 5,
    ingredients: ['Bánh tráng', 'Trứng', 'Hành lá', 'Tương ớt', 'Mayonnaise'],
    nutrition: {
      calories: 160,
      protein: 8,
      carbs: 18,
      fat: 6
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Chả Cá Lã Vọng',
    description: 'Chả cá Lã Vọng truyền thống với nghệ và thì là',
    price: 95000,
    category: 'main-dish',
    image: '/images/cha-ca-la-vong.jpg',
    isAvailable: true,
    preparationTime: 25,
    ingredients: ['Cá tra', 'Nghệ', 'Thì là', 'Bún', 'Đậu phộng rang'],
    nutrition: {
      calories: 480,
      protein: 28,
      carbs: 35,
      fat: 22
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Insert categories
db.categories.insertMany([
  {
    name: 'main-dish',
    displayName: 'Món Chính',
    description: 'Các món ăn chính trong bữa cơm',
    icon: '🍲',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'appetizer',
    displayName: 'Khai Vị',
    description: 'Món khai vị nhẹ nhàng',
    icon: '🥗',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'snack',
    displayName: 'Ăn Vặt',
    description: 'Các món ăn nhẹ, ăn vặt',
    icon: '🥪',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'beverage',
    displayName: 'Đồ Uống',
    description: 'Thức uống giải khát',
    icon: '🥤',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'dessert',
    displayName: 'Tráng Miệng',
    description: 'Món tráng miệng ngọt ngào',
    icon: '🍮',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('✅ Data inserted successfully!');
print(`📊 Products: ${db.products.countDocuments()}`);
print(`👤 Users: ${db.users.countDocuments()}`);
print(`📂 Categories: ${db.categories.countDocuments()}`);
