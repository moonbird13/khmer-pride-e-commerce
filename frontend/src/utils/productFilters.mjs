function normalizeString(value = '') {
  return String(value).trim().toLowerCase();
}

function matchesPriceRange(price, priceRange) {
  const numericPrice = Number(price) || 0;

  if (!priceRange || priceRange === 'all') {
    return true;
  }

  if (priceRange === 'under-25') {
    return numericPrice < 25;
  }

  if (priceRange === '25-40') {
    return numericPrice >= 25 && numericPrice <= 40;
  }

  if (priceRange === '40-plus') {
    return numericPrice > 40;
  }

  return true;
}

export function filterProducts(products = [], filters = {}) {
  const {
    search = '',
    selectedCategory = 'all',
    location = 'all',
    priceRange = 'all',
    brand = 'all',
    sortBy = 'newest',
  } = filters;

  const normalizedSearch = normalizeString(search);
  let nextProducts = [...products].filter((product) => {
    const searchMatch = !normalizedSearch
      || normalizeString(product.name).includes(normalizedSearch)
      || normalizeString(product.description).includes(normalizedSearch)
      || normalizeString(product.category).includes(normalizedSearch);

    const categoryMatch = selectedCategory === 'all' || Number(product.categoryId) === Number(selectedCategory);
    const locationMatch = location === 'all' || product.location === location;
    const brandMatch = brand === 'all' || product.brand === brand;
    const priceMatch = matchesPriceRange(product.price, priceRange);

    return searchMatch && categoryMatch && locationMatch && brandMatch && priceMatch;
  });

  if (sortBy === 'price-low') {
    nextProducts = nextProducts.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortBy === 'price-high') {
    nextProducts = nextProducts.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sortBy === 'name') {
    nextProducts = nextProducts.sort((a, b) => String(a.name).localeCompare(String(b.name)));
  }

  return nextProducts;
}

export function getFilterOptions(products = []) {
  const locations = [...new Set((products || []).map((product) => product.location).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const brands = [...new Set((products || []).map((product) => product.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const maxPrice = Math.max(...(products || []).map((product) => Number(product.price) || 0), 0);
  const priceRanges = [
    { value: 'all', label: 'Any price' },
    { value: 'under-25', label: 'Under $25' },
  ];

  if (maxPrice > 25) {
    priceRanges.push({ value: '25-40', label: '$25 - $40' });
  }

  if (maxPrice > 40) {
    priceRanges.push({ value: '40-plus', label: '$40+' });
  } else {
    priceRanges.push({ value: '40-plus', label: '$40+' });
  }

  return {
    locations,
    brands,
    priceRanges,
  };
}
