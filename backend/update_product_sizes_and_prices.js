import db from './src/models/index.js';

const sizeMap = {
  // Snacks
  'Angkor Rice Crackers': 'Small',
  'Coconut Crispy Rolls': 'Small',
  'Palm Sugar Candy': 'Small',
  'Banana Chips': 'Small',
  'Jackfruit Chips': 'Small',
  'Taro Chips': 'Small',
  'Dried Mango Slices': 'Small',
  'Cashew Nut Roasted': 'Small',
  'Tamarind Candy': 'Small',
  'Sticky Rice Crackers': 'Small',

  // Tea & Coffee
  'Mondulkiri Arabica Coffee': 'Medium',
  'Ratanakiri Robusta Coffee': 'Medium',
  'Kampot Pepper Tea': 'Small',
  'Lemongrass Tea': 'Small',
  'Butterfly Pea Tea': 'Small',
  'Roselle Tea': 'Small',
  'Moringa Tea': 'Small',
  'Lotus Tea': 'Small',
  'Ginger Tea': 'Small',
  'Turmeric Herbal Tea': 'Small',

  // Gifts
  'Palm Sugar Gift Set': 'Medium',
  'Kampot Pepper Gift Box': 'Medium',
  'Cambodian Spice Collection': 'Medium',
  'Traditional Krama Gift Set': 'Medium',
  'Handmade Bamboo Basket Set': 'Large',
  'Artisan Soap Gift Box': 'Small',
  'Cambodian Coffee Sampler': 'Small',
  'Cambodian Tea Collection': 'Small',
  'Khmer Ceramic Tea Set': 'Large',
  'Handmade Coconut Bowl Set': 'Medium',

  // Fashion & Accessories
  'Traditional Kroma Scarf': 'Small',
  'Silk Kroma': 'Small',
  'Handmade Silk Scarf': 'Small',
  'Cambodian Silk Tie': 'Small',
  'Palm Leaf Handbag': 'Medium',
  'Rattan Handbag': 'Medium',
  'Woven Bamboo Hat': 'Small',
  'Silver Khmer Bracelet': 'Small',
  'Handmade Cotton Tote Bag': 'Medium',
  'Silk Wallet': 'Small',

  // Natural Skincare
  'Coconut Oil': 'Small',
  'Lemongrass Essential Oil': 'Small',
  'Turmeric Soap': 'Small',
  'Rice Milk Soap': 'Small',
  'Activated Charcoal Soap': 'Small',
  'Palm Oil Soap': 'Small',
  'Aloe Vera Gel': 'Small',
  'Herbal Body Scrub': 'Small',
  'Lip Balm': 'Small',
  'Coffee Scrub': 'Small',

  // Woven Products
  'Bamboo Basket': 'Medium',
  'Rattan Basket': 'Medium',
  'Palm Leaf Basket': 'Medium',
  'Water Hyacinth Storage Basket': 'Medium',
  'Bamboo Tray': 'Small',
  'Bamboo Fruit Basket': 'Medium',
  'Woven Picnic Basket': 'Large',
  'Palm Leaf Placemat': 'Small',
  'Bamboo Laundry Basket': 'Large',
  'Handwoven Storage Box': 'Medium',

  // Farm Products
  'Kampot Black Pepper': 'Small',
  'Kampot White Pepper': 'Small',
  'Kampot Red Pepper': 'Small',
  'Kampong Speu Palm Sugar': 'Small',
  'Organic Jasmine Rice': 'Large',
  'Organic Red Rice': 'Large',
  'Cashew Nuts': 'Small',
  'Dried Turmeric': 'Small',
  'Raw Wild Honey': 'Small',
  'Coconut Sugar': 'Small',

  // Spices & Seasonings
  'Kampot Black Pepper (Spice)': 'Small',
  'Kampot White Pepper (Spice)': 'Small',
  'Kampot Red Pepper (Spice)': 'Small',
  'Prahok': 'Small',
  'Kroeung (Yellow Curry Paste)': 'Small',
  'Red Curry Paste': 'Small',
  'Green Curry Paste': 'Small',
  'Tamarind Paste': 'Small',
  'Dried Chili Powder': 'Small',
  'Palm Sugar Syrup': 'Small',
};

const priceRanges = {
  Small: [3, 12],
  Medium: [12, 30],
  Large: [30, 50],
};

const randInRange = (min, max) => {
  const v = Math.random() * (max - min) + min;
  return Number(v.toFixed(2));
};

const run = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Connected to DB');

    let updated = 0;

    for (const [name, size] of Object.entries(sizeMap)) {
      const product = await db.Product.findOne({ where: { productName: name } });
      if (!product) {
        console.warn('Not found:', name);
        continue;
      }

      const [min, max] = priceRanges[size] || priceRanges.Medium;
      const newPrice = randInRange(min, max);

      const newDesc = `${product.productDescription} Size: ${size}. ${size === 'Small' ? 'Affordable and convenient for everyday use.' : size === 'Medium' ? 'Great value for regular use.' : 'Premium size for gifts and larger needs.'}`;

      await product.update({ productDescription: newDesc, productPrice: newPrice });
      console.log('Updated:', name, '-> Size:', size, 'Price:', newPrice);
      updated++;
    }

    console.log(`Done — updated ${updated} products`);
    process.exit(0);
  } catch (err) {
    console.error('Error updating products:', err.message || err);
    process.exit(1);
  }
};

run();
