import db from './src/models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const cleanupSampleData = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Connected to database');

    // Delete test products by exact name
    const testProductNames = [
      'Cart Test Product',
      'Clear Cart Product',
      'Cart service test product',
      'Cart clear test product'
    ];
    const deletedTestProducts = await db.Product.destroy({
      where: { productName: testProductNames }
    });
    console.log(`✓ Deleted ${deletedTestProducts} test products`);

    // Delete the specific test categories by exact name
    const testCategoryNames = [
      'Clear Category 1784138447130',
      'Cart Category 1784138445651'
    ];
    const deletedTestCategories = await db.Category.destroy({
      where: { categoryName: testCategoryNames }
    });
    console.log(`✓ Deleted ${deletedTestCategories} test categories`);

    // Your REAL categories to keep
    const realCategoryNames = [
      'Fashion & Accessories',
      'Natural Skincare',
      'Gifts',
      'Woven Products',
      'Farm Products',
      'Spices & Seasonings',
      'Snacks',
      'Tea, Coffee & Drinks',
      'Tea & Coffee' // in case it's stored as this
    ];

    // Delete ALL categories that are NOT in the real list
    const allCategories = await db.Category.findAll({
      attributes: ['categoryId', 'categoryName']
    });

    const categoriesToDelete = allCategories.filter(
      cat => !realCategoryNames.includes(cat.categoryName)
    );

    console.log(`\nFound ${categoriesToDelete.length} categories to delete:`);
    categoriesToDelete.forEach(cat => {
      console.log(`  - ${cat.categoryName} (ID: ${cat.categoryId})`);
    });

    // Delete products in those categories
    if (categoriesToDelete.length > 0) {
      const deleteProductIds = categoriesToDelete.map(cat => cat.categoryId);
      const deletedProducts = await db.Product.destroy({
        where: { categoryId: deleteProductIds }
      });
      console.log(`✓ Deleted ${deletedProducts} products from unwanted categories`);

      // Delete the categories
      const deletedCategories = await db.Category.destroy({
        where: { categoryId: deleteProductIds }
      });
      console.log(`✓ Deleted ${deletedCategories} unwanted categories`);
    }

    // Show final result
    const finalCategories = await db.Category.findAll({
      attributes: ['categoryId', 'categoryName'],
      order: [['categoryName', 'ASC']]
    });

    console.log('\n✓ Your final clean categories:');
    finalCategories.forEach(cat => {
      console.log(`  - ${cat.categoryName}`);
    });

    console.log('\n✓ Cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Cleanup error:', error.message);
    process.exit(1);
  }
};

cleanupSampleData();
