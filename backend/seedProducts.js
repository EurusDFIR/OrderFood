const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./src/models/Product');
const User = require('./src/models/User');

// Load environment variables
dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Sample products data
const sampleProducts = [
  {
    name: 'Cơm Gà Hải Nam',
    description: 'Cơm gà Hải Nam truyền thống với thịt gà mềm, cơm thơm và nước chấm đặc biệt',
    price: 45000,
    category: 'com',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300',
    preparationTime: 20,
    ingredients: ['Gà', 'Gạo', 'Nước mắm', 'Gừng', 'Hành lá'],
    nutritionInfo: {
      calories: 450,
      protein: 35,
      carbs: 40,
      fat: 12
    },
    tags: ['gà', 'cơm', 'hải nam', 'truyền thống'],
    isPopular: true
  },
  {
    name: 'Phở Bò Tái',
    description: 'Phở bò tái với nước dùng trong, thịt bò tái mềm và bánh phở tươi',
    price: 55000,
    category: 'pho',
    image: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=300',
    preparationTime: 15,
    ingredients: ['Bánh phở', 'Thịt bò', 'Nước dùng', 'Hành tây', 'Ngò gai'],
    nutritionInfo: {
      calories: 380,
      protein: 25,
      carbs: 45,
      fat: 8
    },
    tags: ['phở', 'bò', 'tái', 'nước dùng'],
    isPopular: true
  },
  {
    name: 'Bún Bò Huế',
    description: 'Bún bò Huế cay nồng với giò heo, chả cua và rau thơm',
    price: 50000,
    category: 'bun',
    image: 'https://images.unsplash.com/photo-1559314809-0f31657da224?w=300',
    preparationTime: 25,
    ingredients: ['Bún', 'Thịt bò', 'Giò heo', 'Chả cua', 'Sả', 'Ớt'],
    nutritionInfo: {
      calories: 420,
      protein: 28,
      carbs: 48,
      fat: 10
    },
    tags: ['bún', 'bò', 'huế', 'cay', 'sả'],
    isPopular: true
  },
  {
    name: 'Bánh Mì Thịt Nướng',
    description: 'Bánh mì Việt Nam với thịt nướng thơm lừng, pate và rau củ tươi',
    price: 25000,
    category: 'banh-mi',
    image: 'https://images.unsplash.com/photo-1601050214634-8452e36658e6?w=300',
    preparationTime: 10,
    ingredients: ['Bánh mì', 'Thịt nướng', 'Pate', 'Cà rót', 'Dưa leo', 'Ngò'],
    nutritionInfo: {
      calories: 320,
      protein: 18,
      carbs: 35,
      fat: 12
    },
    tags: ['bánh mì', 'thịt nướng', 'pate', 'vietnamese']
  },
  {
    name: 'Trà Sữa Trân Châu',
    description: 'Trà sữa trân châu đường đen thơm ngon, mát lạnh',
    price: 35000,
    category: 'do-uong',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300',
    preparationTime: 5,
    ingredients: ['Trà', 'Sữa', 'Trân châu', 'Đường đen', 'Đá'],
    nutritionInfo: {
      calories: 250,
      protein: 3,
      carbs: 45,
      fat: 8
    },
    tags: ['trà sữa', 'trân châu', 'đường đen', 'mát lạnh']
  },
  {
    name: 'Chè Ba Màu',
    description: 'Chè ba màu truyền thống với đậu xanh, đậu đỏ và thạch',
    price: 20000,
    category: 'trang-mieng',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300',
    preparationTime: 8,
    ingredients: ['Đậu xanh', 'Đậu đỏ', 'Thạch', 'Nước cốt dừa', 'Đường'],
    nutritionInfo: {
      calories: 180,
      protein: 5,
      carbs: 35,
      fat: 3
    },
    tags: ['chè', 'ba màu', 'tráng miệng', 'ngọt']
  },
  {
    name: 'Cơm Chay Củ Sen',
    description: 'Cơm chay với củ sen, nấm và rau củ thanh đạm',
    price: 40000,
    category: 'mon-chay',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300',
    preparationTime: 18,
    ingredients: ['Cơm', 'Củ sen', 'Nấm', 'Đậu hũ', 'Rau củ'],
    nutritionInfo: {
      calories: 300,
      protein: 12,
      carbs: 50,
      fat: 5
    },
    tags: ['chay', 'củ sen', 'nấm', 'healthy']
  },
  {
    name: 'Lẩu Thái Hải Sản',
    description: 'Lẩu Thái chua cay với hải sản tươi ngon và rau lẩu',
    price: 250000,
    category: 'lau',
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=300',
    preparationTime: 30,
    ingredients: ['Hải sản', 'Nước lẩu Thái', 'Cà chua', 'Nấm', 'Rau lẩu'],
    nutritionInfo: {
      calories: 400,
      protein: 45,
      carbs: 25,
      fat: 15
    },
    tags: ['lẩu', 'thái', 'hải sản', 'chua cay'],
    isPopular: true
  },
  {
    name: 'Gà Nướng Mật Ong',
    description: 'Gà nướng với mật ong thơm ngon, da giòn thịt mềm',
    price: 180000,
    category: 'nuong',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=300',
    preparationTime: 45,
    ingredients: ['Gà', 'Mật ong', 'Tỏi', 'Gừng', 'Ngũ vị hương'],
    nutritionInfo: {
      calories: 520,
      protein: 40,
      carbs: 15,
      fat: 25
    },
    tags: ['gà', 'nướng', 'mật ong', 'thơm ngon']
  },
  {
    name: 'Sinh Tố Bơ',
    description: 'Sinh tố bơ béo ngậy, mát lạnh và bổ dưỡng',
    price: 30000,
    category: 'do-uong',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300',
    preparationTime: 5,
    ingredients: ['Bơ', 'Sữa đặc', 'Đường', 'Đá'],
    nutritionInfo: {
      calories: 280,
      protein: 4,
      carbs: 25,
      fat: 18
    },
    tags: ['sinh tố', 'bơ', 'béo ngậy', 'bổ dưỡng']
  }
];

// Seed function
const seedProducts = async () => {
  try {
    await connectDB();

    // Find or create admin user
    let adminUser = await User.findOne({ email: 'admin@orderfood.com' });
    
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin',
        email: 'admin@orderfood.com',
        password: 'Admin123456',
        role: 'admin'
      });
      console.log('Admin user created');
    }

    // Clear existing products
    await Product.deleteMany({});
    console.log('Existing products cleared');

    // Add createdBy to all products
    const productsWithCreator = sampleProducts.map(product => ({
      ...product,
      createdBy: adminUser._id
    }));

    // Insert sample products
    const createdProducts = await Product.insertMany(productsWithCreator);
    console.log(`${createdProducts.length} products seeded successfully`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

// Run seed
if (require.main === module) {
  seedProducts();
}

module.exports = { seedProducts, sampleProducts };
