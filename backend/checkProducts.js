require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User'); // Import User model first
const Product = require('./src/models/Product');

async function checkProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/orderfood');
    console.log('📦 Checking products in database...');
    
    const products = await Product.find({}, null, { skipPopulate: true });
    console.log(`Found ${products.length} products`);
    
    if (products.length > 0) {
      console.log('Sample product:', JSON.stringify(products[0], null, 2));
    } else {
      console.log('No products found - creating sample products...');
      const sampleProducts = [
        {
          name: 'Bánh mì thịt nướng',
          price: 25000,
          category: 'Bánh mì',
          description: 'Bánh mì thịt nướng thơm ngon',
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300',
          isAvailable: true,
          isPopular: true,
          tags: ['ngon', 'rẻ', 'nổi tiếng']
        },
        {
          name: 'Phở bò',
          price: 45000,
          category: 'Phở',
          description: 'Phở bò truyền thống',
          image: 'https://images.unsplash.com/photo-1525755662312-b2e9ddd2eace?w=300',
          isAvailable: true,
          isPopular: false,
          tags: ['truyền thống', 'nóng hổi']
        },
        {
          name: 'Cơm tấm',
          price: 35000,
          category: 'Cơm',
          description: 'Cơm tấm sườn nướng',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300',
          isAvailable: true,
          isPopular: true,
          tags: ['cơm', 'sườn nướng']
        }
      ];
      
      await Product.insertMany(sampleProducts);
      console.log('✅ Sample products created!');
    }
    
    // Also check unique categories
    const categories = await Product.distinct('category');
    console.log('Available categories:', categories);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkProducts();
