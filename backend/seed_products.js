import db from './src/models/index.js';

const catalog = {
  Snacks: 'Angkor Rice Crackers|Coconut Crispy Rolls (Banh Krob)|Palm Sugar Candy|Banana Chips (Kampong Cham)|Jackfruit Chips|Taro Chips|Dried Mango Slices|Cashew Nut Roasted with Kampot Pepper|Tamarind Candy|Sticky Rice Crackers',
  'Tea & Coffee': 'Mondulkiri Arabica Coffee|Ratanakiri Robusta Coffee|Kampot Pepper Tea|Lemongrass Tea|Butterfly Pea Tea|Roselle (Hibiscus) Tea|Moringa Tea|Lotus Tea|Ginger Tea|Turmeric Herbal Tea',
  Gifts: 'Palm Sugar Gift Set|Kampot Pepper Gift Box|Cambodian Spice Collection|Traditional Krama Gift Set|Handmade Bamboo Basket Set|Artisan Soap Gift Box|Cambodian Coffee Sampler|Cambodian Tea Collection|Khmer Ceramic Tea Set|Handmade Coconut Bowl Set',
  'Fashion & Accessories': 'Traditional Krama Scarf|Silk Krama|Handmade Silk Scarf|Cambodian Silk Tie|Palm Leaf Handbag|Rattan Handbag|Woven Bamboo Hat|Silver Khmer Bracelet|Handmade Cotton Tote Bag|Silk Wallet',
  'Natural Skincare': 'Coconut Oil|Lemongrass Essential Oil|Turmeric Soap|Rice Milk Soap|Activated Charcoal Soap|Palm Oil Soap|Aloe Vera Gel|Herbal Body Scrub|Beeswax Lip Balm|Natural Mosquito Repellent Spray',
  'Woven Products': 'Bamboo Basket|Rattan Basket|Palm Leaf Basket|Water Hyacinth Storage Basket|Bamboo Tray|Bamboo Fruit Basket|Woven Picnic Basket|Palm Leaf Placemat|Bamboo Laundry Basket|Handwoven Storage Box',
  'Farm Products': 'Kampot Black Pepper|Kampot White Pepper|Kampot Red Pepper|Kampong Speu Palm Sugar|Organic Jasmine Rice|Organic Red Rice|Cashew Nuts|Dried Turmeric|Raw Wild Honey|Coconut Sugar',
  'Spices & Seasonings': 'Kampot Black Pepper|Kampot White Pepper|Kampot Red Pepper|Prahok|Kroeung (Yellow Curry Paste)|Red Curry Paste|Green Curry Paste|Tamarind Paste|Dried Chili Powder|Palm Sugar Syrup',
};

const sources = ['Phnom Penh', 'Kampot', 'Mondulkiri', 'Ratanakiri', 'Kampong Cham', 'Kampong Speu', 'Siem Reap', 'Battambang'];
const weights = {
  Snacks: ['80 g', '120 g', '200 g'], 'Tea & Coffee': ['50 g', '100 g', '250 g'], Gifts: ['Large gift set', '1.2 kg set', '1.8 kg set'],
  'Fashion & Accessories': ['One size', 'Medium', 'Large'], 'Natural Skincare': ['50 ml', '100 ml', '150 g'], 'Woven Products': ['Medium', 'Large', '40 cm'],
  'Farm Products': ['250 g', '500 g', '1 kg'], 'Spices & Seasonings': ['100 g', '200 g', '250 ml'],
};
const featuredProducts = [
  ['Snacks', 'Angkor Rice Crackers'], ['Tea & Coffee', 'Mondulkiri Arabica Coffee'],
  ['Fashion & Accessories', 'Traditional Krama Scarf'], ['Natural Skincare', 'Coconut Oil'],
];
const bestSellerProducts = [
  ['Gifts', 'Palm Sugar Gift Set'], ['Woven Products', 'Bamboo Basket'],
  ['Farm Products', 'Organic Jasmine Rice'], ['Spices & Seasonings', 'Prahok'],
];
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const random = (min, max) => Number((Math.random() * (max - min) + min).toFixed(2));

async function run() {
  try {
    await db.sequelize.authenticate();
    let created = 0;
    const categoryIds = {};
    for (const [categoryName, values] of Object.entries(catalog)) {
      const [category] = await db.Category.findOrCreate({ where: { categoryName }, defaults: { categoryStatus: 'Active' } });
      categoryIds[categoryName] = category.categoryId;
      for (const [index, productName] of values.split('|').entries()) {
        const existing = await db.Product.findOne({ where: { productName, categoryId: category.categoryId } });
        if (existing) continue;
        const size = weights[categoryName][index % weights[categoryName].length];
        const source = sources[(index + category.categoryId) % sources.length];
        const product = await db.Product.create({
          productName,
          productDescription: `About: Authentic ${categoryName.toLowerCase()} product.\nSize / Weight: ${size}\nSource: ${source}, Cambodia\nMade in Cambodia`,
          productPrice: categoryName === 'Gifts' ? random(30, 40) : random(2, 40),
          categoryId: category.categoryId,
          slug: `${slugify(categoryName)}-${slugify(productName)}`,
          isFeatured: false, isBestSeller: false, isNewArrival: true, salesCount: 0, createAt: new Date(),
        });
        await db.Inventory.create({ productId: product.productId, stockQuantity: index % 7 === 0 ? 0 : Math.floor(Math.random() * 51), lastUpdated: new Date() });
        created += 1;
      }
    }
    await db.Product.update({ isFeatured: false, isBestSeller: false, isNewArrival: false }, { where: {} });
    for (const [categoryName, productName] of featuredProducts) {
      await db.Product.update({ isFeatured: true }, { where: { categoryId: categoryIds[categoryName], productName } });
    }
    for (const [categoryName, productName] of bestSellerProducts) {
      await db.Product.update({ isBestSeller: true }, { where: { categoryId: categoryIds[categoryName], productName } });
    }
    console.log(`Seed complete: ${created} products created.`);
  } catch (error) { console.error('Seed failed:', error.message || error); process.exitCode = 1; }
  finally { await db.sequelize.close(); }
}
run();
