import db from './src/models/index.js';

const categories = {
  Snacks: 1,
  'Tea & Coffee': 2,
  Gifts: 3,
  'Fashion & Accessories': 4,
  'Natural Skincare': 5,
  'Woven Products': 6,
  'Farm Products': 7,
  'Spices & Seasonings': 8,
};

const lists = {
  'Snacks': [
    'Angkor Rice Crackers',
    'Coconut Crispy Rolls',
    'Palm Sugar Candy',
    'Banana Chips',
    'Jackfruit Chips',
    'Taro Chips',
    'Dried Mango Slices',
    'Cashew Nut Roasted',
    'Tamarind Candy',
    'Sticky Rice Crackers',
  ],
  'Tea & Coffee': [
    'Mondulkiri Arabica Coffee',
    'Ratanakiri Robusta Coffee',
    'Kampot Pepper Tea',
    'Lemongrass Tea',
    'Butterfly Pea Tea',
    'Roselle Tea',
    'Moringa Tea',
    'Lotus Tea',
    'Ginger Tea',
    'Turmeric Herbal Tea',
  ],
  'Gifts': [
    'Palm Sugar Gift Set',
    'Kampot Pepper Gift Box',
    'Cambodian Spice Collection',
    'Traditional Krama Gift Set',
    'Handmade Bamboo Basket Set',
    'Artisan Soap Gift Box',
    'Cambodian Coffee Sampler',
    'Cambodian Tea Collection',
    'Khmer Ceramic Tea Set',
    'Handmade Coconut Bowl Set',
  ],
  'Fashion & Accessories': [
    'Traditional Kroma Scarf',
    'Silk Kroma',
    'Handmade Silk Scarf',
    'Cambodian Silk Tie',
    'Palm Leaf Handbag',
    'Rattan Handbag',
    'Woven Bamboo Hat',
    'Silver Khmer Bracelet',
    'Handmade Cotton Tote Bag',
    'Silk Wallet',
  ],
  'Natural Skincare': [
    'Coconut Oil',
    'Lemongrass Essential Oil',
    'Turmeric Soap',
    'Rice Milk Soap',
    'Activated Charcoal Soap',
    'Palm Oil Soap',
    'Aloe Vera Gel',
    'Herbal Body Scrub',
    'Lip Balm',
    'Coffee Scrub',
  ],
  'Woven Products': [
    'Bamboo Basket',
    'Rattan Basket',
    'Palm Leaf Basket',
    'Water Hyacinth Storage Basket',
    'Bamboo Tray',
    'Bamboo Fruit Basket',
    'Woven Picnic Basket',
    'Palm Leaf Placemat',
    'Bamboo Laundry Basket',
    'Handwoven Storage Box',
  ],
  'Farm Products': [
    'Kampot Black Pepper',
    'Kampot White Pepper',
    'Kampot Red Pepper',
    'Kampong Speu Palm Sugar',
    'Organic Jasmine Rice',
    'Organic Red Rice',
    'Cashew Nuts',
    'Dried Turmeric',
    'Raw Wild Honey',
    'Coconut Sugar',
  ],
  'Spices & Seasonings': [
    'Kampot Black Pepper (Spice)',
    'Kampot White Pepper (Spice)',
    'Kampot Red Pepper (Spice)',
    'Prahok',
    'Kroeung (Yellow Curry Paste)',
    'Red Curry Paste',
    'Green Curry Paste',
    'Tamarind Paste',
    'Dried Chili Powder',
    'Palm Sugar Syrup',
  ],
};

const randPrice = () => {
  const p = Math.random() * (50 - 3) + 3;
  return Number(p.toFixed(2));
};

const randQty = () => Math.floor(Math.random() * (100 - 2 + 1)) + 2;

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const genDescription = (name, category) => {
  return `${name} is a ${category.toLowerCase()} product from Cambodia, made using traditional methods and quality ingredients. Ideal for everyday use or gifting.`;
};

const run = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Connected to DB');

    let created = 0;

    for (const [categoryName, items] of Object.entries(lists)) {
      const categoryId = categories[categoryName];
      for (const name of items) {
        const exists = await db.Product.findOne({ where: { productName: name } });
        if (exists) continue;

        const product = await db.Product.create({
          productName: name,
          productDescription: genDescription(name, categoryName),
          productPrice: randPrice(),
          categoryId,
          slug: slugify(name),
          isFeatured: false,
          isBestSeller: false,
          isNewArrival: false,
          salesCount: 0,
          createAt: new Date(),
          imageUrl: null,
          publicId: null,
          quantity: randQty(),
        });

        created++;
        console.log('Created:', product.productName);
      }
    }

    console.log(`Done — created ${created} products`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding products:', err.message || err);
    process.exit(1);
  }
};

run();
